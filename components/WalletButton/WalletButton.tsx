// components/WalletButton/WalletButton.tsx
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { formatAddress, formatNumber } from "@/utils/format";
import styles from "./WalletButton.module.css";

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { balance, loading } = useWalletBalance();

  if (!connected) {
    return (
      <div className={styles.connectWrapper}>
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <div className={styles.connectedWrapper}>
      <div className={styles.balancePill}>
        <span className={styles.dot} />
        <span className={styles.balanceText}>
          {loading ? (
            <span className={styles.balanceLoading}>...</span>
          ) : balance !== null ? (
            `${formatNumber(balance, 3)} SOL`
          ) : (
            "—"
          )}
        </span>
      </div>
      <button className={styles.addressButton} onClick={disconnect} title="Click to disconnect">
        <span className={styles.addressIcon}>◈</span>
        <span className={styles.addressText}>
          {formatAddress(publicKey!.toBase58())}
        </span>
        <span className={styles.disconnectHint}>Disconnect</span>
      </button>
    </div>
  );
}
