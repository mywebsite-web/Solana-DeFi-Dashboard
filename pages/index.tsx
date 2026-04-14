// pages/index.tsx
import Head from "next/head";
import { Header } from "@/components/Header/Header";
import { StatsBar } from "@/components/StatsBar/StatsBar";
import { SwapPanel } from "@/components/SwapPanel/SwapPanel";
import { LiquidityPanel } from "@/components/LiquidityPanel/LiquidityPanel";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Solana DeFi Dashboard</title>
        <meta
          name="description"
          content="Swap tokens and provide liquidity on Solana Devnet using Jupiter Aggregator and Meteora Protocol"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.page}>
        {/* Background effects */}
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
        <div className={styles.bgGrid} />

        <Header />
        <StatsBar />

        <main className={styles.main}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              DeFi on <span className={styles.highlight}>Solana</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Swap tokens and provide liquidity with the best rates — powered by Jupiter & Meteora on Devnet
            </p>
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.swapColumn}>
              <SwapPanel />
            </div>
            <div className={styles.liquidityColumn}>
              <LiquidityPanel />
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <span className={styles.footerText}>
            Running on <span className={styles.footerAccent}>Solana Devnet</span> · Built with Jupiter & Meteora
          </span>
          <div className={styles.footerLinks}>
            <a href="https://jup.ag" target="_blank" rel="noopener noreferrer">Jupiter ↗</a>
            <a href="https://meteora.ag" target="_blank" rel="noopener noreferrer">Meteora ↗</a>
            <a href="https://explorer.solana.com?cluster=devnet" target="_blank" rel="noopener noreferrer">Explorer ↗</a>
          </div>
        </footer>
      </div>
    </>
  );
}
