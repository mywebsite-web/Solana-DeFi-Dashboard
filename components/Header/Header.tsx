// components/Header/Header.tsx
import dynamic from "next/dynamic";
import styles from "./Header.module.css";

const WalletButton = dynamic(
  () => import("@/components/WalletButton/WalletButton").then(mod => ({ default: mod.WalletButton })),
  { ssr: false, loading: () => <div style={{ width: 120, height: 40 }} /> }
);

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00d4aa" />
                  <stop offset="100%" stopColor="#7c5cfc" />
                </linearGradient>
              </defs>
              <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="url(#logoGrad)" strokeWidth="2"/>
              <polygon points="16,8 24,13 24,19 16,24 8,19 8,13" fill="url(#logoGrad)" opacity="0.3"/>
              <circle cx="16" cy="16" r="4" fill="url(#logoGrad)"/>
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Solana DeFi</span>
            <span className={styles.brandTagline}>Dashboard</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <a href="#swap" className={styles.navLink}>Swap</a>
          <a href="#liquidity" className={styles.navLink}>Liquidity</a>
          <span className={styles.networkBadge}>
            <span className={styles.networkDot} />
            Devnet
          </span>
        </nav>

        <WalletButton />
      </div>
    </header>
  );
}
