// types/index.ts

export interface Token {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
}

export interface SwapQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  priceImpactPct: number;
  routePlan: RoutePlan[];
  swapMode: string;
  slippageBps: number;
  otherAmountThreshold: string;
  contextSlot?: number;
  timeTaken?: number;
}

export interface RoutePlan {
  swapInfo: {
    ammKey: string;
    label?: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface LiquidityPool {
  address: string;
  name: string;
  tokenX: Token;
  tokenY: Token;
  tvl: number;
  apr: number;
  volume24h: number;
  fee: number;
  binStep?: number;
  isActive: boolean;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number | null;
}

export type TransactionStatus = "idle" | "pending" | "success" | "error";

export interface TransactionState {
  status: TransactionStatus;
  signature?: string;
  error?: string;
}
