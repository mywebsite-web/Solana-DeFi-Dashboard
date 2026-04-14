// hooks/useSwap.ts
import { useState, useCallback, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { Token, SwapQuote, TransactionState } from "@/types";
import { getSwapQuote, executeSwap } from "@/services/jupiterService";
import { parseTokenAmount } from "@/utils/format";
import { DEFAULT_SLIPPAGE } from "@/utils/constants";

export function useSwap() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [txState, setTxState] = useState<TransactionState>({ status: "idle" });
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const fetchQuote = useCallback(
    async (inputToken: Token, outputToken: Token, amount: string) => {
      if (!amount || parseFloat(amount) <= 0) {
        setQuote(null);
        setQuoteError(null);
        return;
      }

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        setQuoteLoading(true);
        setQuoteError(null);
        try {
          const amountInSmallestUnit = parseTokenAmount(
            amount,
            inputToken.decimals
          );
          const slippageBps = Math.floor(slippage * 100);
          const result = await getSwapQuote(
            inputToken.mint,
            outputToken.mint,
            amountInSmallestUnit,
            slippageBps
          );
          setQuote(result);
        } catch (err: any) {
          setQuoteError(err.message || "Failed to fetch quote");
          setQuote(null);
        } finally {
          setQuoteLoading(false);
        }
      }, 600);
    },
    [slippage]
  );

  const executeSwapTx = useCallback(async () => {
    if (!quote || !publicKey || !signTransaction || !connected) return;

    setTxState({ status: "pending" });
    try {
      const signature = await executeSwap(
        quote,
        publicKey.toBase58(),
        signTransaction as (tx: VersionedTransaction) => Promise<VersionedTransaction>
      );
      setTxState({ status: "success", signature });
    } catch (err: any) {
      setTxState({
        status: "error",
        error: err.message || "Transaction failed",
      });
    }
  }, [quote, publicKey, signTransaction, connected]);

  const resetTx = useCallback(() => {
    setTxState({ status: "idle" });
  }, []);

  return {
    quote,
    quoteLoading,
    quoteError,
    txState,
    slippage,
    setSlippage,
    fetchQuote,
    executeSwapTx,
    resetTx,
  };
}
