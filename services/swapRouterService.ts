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
  
  // Try Jupiter first
  try {
    const jupiterUrl = new URL(`${appUrl}/api/jupiter/quote`);
    jupiterUrl.searchParams.set("inputMint", inputMint);
    jupiterUrl.searchParams.set("outputMint", outputMint);
    jupiterUrl.searchParams.set("amount", amount.toString());
    jupiterUrl.searchParams.set("slippageBps", slippageBps.toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(jupiterUrl.toString(), { signal: controller.signal });

      if (response.ok) {
        const data = await response.json();
        console.log("✓ Got quote from Jupiter");
        return data;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.warn("Jupiter quote failed, trying Orca...", error);
  }

  // Fallback to Orca
  try {
    const orcaUrl = new URL(`${appUrl}/api/orca/quote`);
    orcaUrl.searchParams.set("inputMint", inputMint);
    orcaUrl.searchParams.set("outputMint", outputMint);
    orcaUrl.searchParams.set("amount", amount.toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(orcaUrl.toString(), { signal: controller.signal });

      if (response.ok) {
        const data = await response.json();
        console.log("✓ Got quote from Orca (fallback)");
        return data;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.warn("Orca quote failed", error);
  }

  // If both fail, throw error
  throw new Error(
    "Unable to fetch swap quote from Jupiter or Orca. Please check your internet connection and try again."
  );
}

export async function buildSwapTransaction(
  quoteResponse: SwapQuote,
  userPublicKey: string
): Promise<VersionedTransaction> {
  const appUrl = getAppUrl();

  try {
    const controller = new AbortController();
    // Swap building takes longer than quoting - increase timeout to 30 seconds
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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

      if (response.ok) {
        const { swapTransaction } = await response.json();
        const transactionBuf = Buffer.from(swapTransaction, "base64");
        console.log("✓ Swap transaction built via Jupiter");
        return VersionedTransaction.deserialize(transactionBuf);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Jupiter swap build failed:", error);
  }

  // If Jupiter swap fails, throw error (Orca swap building is more complex)
  throw new Error(
    "Unable to build swap transaction. Please try again or use a different token pair."
  );
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
