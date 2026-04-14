// hooks/useLiquidity.ts
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LiquidityPool, TransactionState } from "@/types";
import {
  getLiquidityPools,
  addLiquidity,
  calculatePoolShare,
} from "@/services/meteoraService";
import { Transaction } from "@solana/web3.js";

export function useLiquidity() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | null>(null);
  const [tokenXAmount, setTokenXAmount] = useState("");
  const [tokenYAmount, setTokenYAmount] = useState("");
  const [txState, setTxState] = useState<TransactionState>({ status: "idle" });

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    setPoolsLoading(true);
    try {
      const data = await getLiquidityPools();
      setPools(data);
    } catch (err) {
      console.error("Failed to load pools:", err);
    } finally {
      setPoolsLoading(false);
    }
  };

  const handleAddLiquidity = useCallback(async () => {
    if (
      !selectedPool ||
      !publicKey ||
      !signTransaction ||
      !connected ||
      !tokenXAmount ||
      !tokenYAmount
    )
      return;

    setTxState({ status: "pending" });
    try {
      const signature = await addLiquidity(
        selectedPool.address,
        parseFloat(tokenXAmount),
        parseFloat(tokenYAmount),
        publicKey.toBase58(),
        signTransaction as (tx: Transaction) => Promise<Transaction>
      );
      setTxState({ status: "success", signature });
      setTokenXAmount("");
      setTokenYAmount("");
    } catch (err: any) {
      setTxState({
        status: "error",
        error: err.message || "Failed to add liquidity",
      });
    }
  }, [
    selectedPool,
    publicKey,
    signTransaction,
    connected,
    tokenXAmount,
    tokenYAmount,
  ]);

  const getPoolShare = useCallback(() => {
    if (!selectedPool || !tokenXAmount || !tokenYAmount) return 0;
    return calculatePoolShare(
      parseFloat(tokenXAmount),
      parseFloat(tokenYAmount),
      selectedPool
    );
  }, [selectedPool, tokenXAmount, tokenYAmount]);

  const resetTx = useCallback(() => {
    setTxState({ status: "idle" });
  }, []);

  return {
    pools,
    poolsLoading,
    selectedPool,
    setSelectedPool,
    tokenXAmount,
    setTokenXAmount,
    tokenYAmount,
    setTokenYAmount,
    txState,
    handleAddLiquidity,
    getPoolShare,
    resetTx,
    refreshPools: loadPools,
  };
}
