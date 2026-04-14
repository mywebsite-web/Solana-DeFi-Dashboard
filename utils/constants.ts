// utils/constants.ts
import { Token, LiquidityPool } from "@/types";

export const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

export const JUPITER_API_BASE = "https://quote-api.jup.ag/v6";

// Devnet token mints (well-known devnet tokens)
export const DEVNET_TOKENS: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    mint: "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
  },
  {
    symbol: "mSOL",
    name: "Marinade staked SOL",
    mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
  },
];

// Mock liquidity pools for Devnet display
export const MOCK_LIQUIDITY_POOLS: LiquidityPool[] = [
  {
    address: "FoSDw2L5DmTuQTFe55gWPDXf88euaxAEKFre74CnvQbX",
    name: "SOL-USDC",
    tokenX: DEVNET_TOKENS[0],
    tokenY: DEVNET_TOKENS[1],
    tvl: 4820000,
    apr: 24.5,
    volume24h: 1230000,
    fee: 0.25,
    binStep: 10,
    isActive: true,
  },
  {
    address: "GkBnzWzCb9zNVYHVxiAM8CmCuVDaT8oEnvLpkiJMLXXj",
    name: "SOL-USDT",
    tokenX: DEVNET_TOKENS[0],
    tokenY: DEVNET_TOKENS[2],
    tvl: 2100000,
    apr: 18.2,
    volume24h: 880000,
    fee: 0.25,
    binStep: 15,
    isActive: true,
  },
  {
    address: "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJpi",
    name: "mSOL-SOL",
    tokenX: DEVNET_TOKENS[3],
    tokenY: DEVNET_TOKENS[0],
    tvl: 980000,
    apr: 12.8,
    volume24h: 320000,
    fee: 0.1,
    binStep: 1,
    isActive: true,
  },
  {
    address: "8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj",
    name: "RAY-USDC",
    tokenX: DEVNET_TOKENS[4],
    tokenY: DEVNET_TOKENS[1],
    tvl: 560000,
    apr: 31.6,
    volume24h: 240000,
    fee: 0.3,
    binStep: 20,
    isActive: true,
  },
];

export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0, 2.0];
export const DEFAULT_SLIPPAGE = 0.5;
