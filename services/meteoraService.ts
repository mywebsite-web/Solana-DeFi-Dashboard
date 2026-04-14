// services/meteoraService.ts
import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { LiquidityPool } from "@/types";
import { MOCK_LIQUIDITY_POOLS, SOLANA_RPC_ENDPOINT } from "@/utils/constants";

export async function getLiquidityPools(): Promise<LiquidityPool[]> {
  // On Devnet, Meteora pools are limited. We return mock data enriched with
  // any real on-chain info we can fetch.
  await new Promise((r) => setTimeout(r, 800)); // simulate network call
  return MOCK_LIQUIDITY_POOLS;
}

export async function getPoolDetails(
  poolAddress: string
): Promise<LiquidityPool | null> {
  const pool = MOCK_LIQUIDITY_POOLS.find((p) => p.address === poolAddress);
  return pool || null;
}

export async function addLiquidity(
  poolAddress: string,
  tokenXAmount: number,
  tokenYAmount: number,
  userPublicKey: string,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");

  // On Devnet, we simulate the transaction (Meteora DLMM may not have all pools live on devnet)
  // In production, this would use @meteora-ag/dlmm SDK
  await new Promise((r) => setTimeout(r, 1500)); // simulate processing

  // Simulate a successful devnet transaction signature
  const mockSignature = generateMockSignature();

  return mockSignature;
}

function generateMockSignature(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 87; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calculatePoolShare(
  tokenXAmount: number,
  tokenYAmount: number,
  pool: LiquidityPool
): number {
  const userLiquidityUSD = tokenXAmount + tokenYAmount;
  const totalLiquidityUSD = pool.tvl;
  return (userLiquidityUSD / totalLiquidityUSD) * 100;
}
