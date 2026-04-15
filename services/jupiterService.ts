// services/jupiterService.ts
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { SwapQuote } from "@/types";
import { SOLANA_RPC_ENDPOINT } from "@/utils/constants";

// Get the app URL - use environment variable or derive from window.location
function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<SwapQuote> {
  const appUrl = getAppUrl();
  const url = new URL(`${appUrl}/api/jupiter/quote`);
  url.searchParams.set("inputMint", inputMint);
  url.searchParams.set("outputMint", outputMint);
  url.searchParams.set("amount", amount.toString());
  url.searchParams.set("slippageBps", slippageBps.toString());

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url.toString(), { signal: controller.signal });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Quote error: ${response.status} - ${error}`);
      }

      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch swap quote:", errorMessage);
    throw new Error(`Unable to fetch swap quote. Please check your internet connection. Details: ${errorMessage}`);
  }
}

export async function buildSwapTransaction(
  quoteResponse: SwapQuote,
  userPublicKey: string
): Promise<VersionedTransaction> {
  const appUrl = getAppUrl();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${appUrl}/api/jupiter/swap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Swap build error: ${response.status} - ${error}`);
      }

      const { swapTransaction } = await response.json();
      const transactionBuf = Buffer.from(swapTransaction, "base64");
      return VersionedTransaction.deserialize(transactionBuf);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to build swap transaction:", errorMessage);
    throw new Error(`Unable to build swap transaction. Details: ${errorMessage}`);
  }
}

export async function executeSwap(
  quoteResponse: SwapQuote,
  userPublicKey: string,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
): Promise<string> {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");

    const transaction = await buildSwapTransaction(quoteResponse, userPublicKey);
    const signedTransaction = await signTransaction(transaction);

    const rawTransaction = signedTransaction.serialize();
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed"
    );

    return signature;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to execute swap:", errorMessage);
    throw new Error(`Swap execution failed. Details: ${errorMessage}`);
  }
}
