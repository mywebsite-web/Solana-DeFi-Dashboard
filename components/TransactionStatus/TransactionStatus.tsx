// components/TransactionStatus/TransactionStatus.tsx
import { TransactionState } from "@/types";
import { formatAddress } from "@/utils/format";
import styles from "./TransactionStatus.module.css";

interface TransactionStatusProps {
  state: TransactionState;
  onDismiss: () => void;
  network?: string;
}

export function TransactionStatus({
  state,
  onDismiss,
  network = "devnet",
}: TransactionStatusProps) {
  if (state.status === "idle") return null;

  const explorerUrl = state.signature
    ? `https://explorer.solana.com/tx/${state.signature}?cluster=${network}`
    : null;

  return (
    <div className={`${styles.container} ${styles[state.status]}`}>
      <div className={styles.iconWrapper}>
        {state.status === "pending" && (
          <div className={styles.spinner} />
        )}
        {state.status === "success" && <span className={styles.icon}>✓</span>}
        {state.status === "error" && <span className={styles.icon}>✕</span>}
      </div>

      <div className={styles.content}>
        {state.status === "pending" && (
          <>
            <span className={styles.title}>Transaction Pending</span>
            <span className={styles.subtitle}>Awaiting confirmation...</span>
          </>
        )}
        {state.status === "success" && (
          <>
            <span className={styles.title}>Transaction Confirmed!</span>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                View on Explorer ↗
              </a>
            )}
          </>
        )}
        {state.status === "error" && (
          <>
            <span className={styles.title}>Transaction Failed</span>
            <span className={styles.subtitle}>
              {state.error || "An unknown error occurred"}
            </span>
          </>
        )}
      </div>

      {state.status !== "pending" && (
        <button className={styles.dismissBtn} onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
}
