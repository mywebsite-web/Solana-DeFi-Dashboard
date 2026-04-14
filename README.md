# Solana DeFi Dashboard

A modern Web3 DeFi application for swapping tokens and providing liquidity on Solana Devnet, powered by **Jupiter Aggregator** and **Meteora Protocol**.

![Solana DeFi Dashboard](https://via.placeholder.com/1200x630/04060d/00d4aa?text=Solana+DeFi+Dashboard)

## Features

- 🔌 **Wallet Connection** — Phantom Wallet integration with auto-connect
- 💱 **Token Swap** — Jupiter Aggregator v6 API for best swap routes
- 💧 **Liquidity Provision** — Meteora DLMM pools with APR display
- 🌐 **Devnet** — All transactions on Solana Devnet for safe testing
- 🎨 **Modern UI** — Dark glass-style Web3 interface with animations

## Tech Stack

- **Next.js 14** (Pages Router)
- **React 18** + TypeScript
- **@solana/web3.js** — Blockchain interactions
- **@solana/wallet-adapter** — Wallet connection
- **Jupiter Aggregator v6 API** — Token swaps
- **Meteora DLMM SDK** — Liquidity pools
- **CSS Modules** — Scoped styling with custom design system

## Project Structure

```
solana-defi-dashboard/
├── components/
│   ├── Header/           # App header with wallet button
│   ├── WalletButton/     # Wallet connect/disconnect UI
│   ├── SwapPanel/        # Jupiter swap interface
│   ├── TokenSelector/    # Token dropdown selector
│   ├── LiquidityPanel/   # Meteora liquidity interface
│   ├── PoolCard/         # Individual pool display card
│   ├── StatsBar/         # Network stats bar
│   └── TransactionStatus/ # Tx pending/success/error
├── hooks/
│   ├── useWalletBalance.ts  # SOL balance fetching
│   ├── useSwap.ts           # Swap quote & execution state
│   └── useLiquidity.ts      # Pool data & add liquidity state
├── services/
│   ├── jupiterService.ts    # Jupiter API calls
│   └── meteoraService.ts    # Meteora pool interactions
├── utils/
│   ├── constants.ts         # Token list, RPC endpoints
│   └── format.ts            # Number/address formatting
├── types/
│   └── index.ts             # TypeScript interfaces
├── pages/
│   ├── _app.tsx             # Wallet providers setup
│   ├── _document.tsx        # HTML document
│   └── index.tsx            # Main dashboard page
└── styles/
    ├── globals.css          # Design system CSS variables
    └── Home.module.css      # Page layout styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- Phantom Wallet browser extension
- Devnet SOL (get from [Solana Faucet](https://faucet.solana.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd solana-defi-dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting Devnet SOL

1. Open Phantom Wallet → Switch network to **Devnet**
2. Visit [https://faucet.solana.com](https://faucet.solana.com)
3. Enter your wallet address and request SOL

## Deployment on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo on vercel.com for automatic deployments
```

### Environment Variables for Vercel

Set these in your Vercel project settings:
- `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` — Your RPC endpoint (optional)
- `NEXT_PUBLIC_SOLANA_NETWORK` — `devnet` or `mainnet-beta`

## Usage

### Swapping Tokens

1. Connect your Phantom wallet (make sure it's on **Devnet**)
2. Select input token (e.g., SOL) and output token (e.g., USDC)
3. Enter the amount to swap
4. Review the quote, exchange rate, and price impact
5. Click **Swap** and approve in Phantom

### Adding Liquidity

1. Connect your Phantom wallet
2. Browse available pools in the **Liquidity** section
3. Click a pool to select it
4. Enter amounts for both tokens
5. Click **Add Liquidity** and approve in Phantom

## Notes

- All transactions run on **Solana Devnet** — no real funds at risk
- Jupiter swap quotes are fetched from mainnet API but executed on devnet
- Meteora liquidity on devnet is simulated (limited real pools on devnet)
- Slippage tolerance is configurable (0.1% – 2%)

## License

MIT
