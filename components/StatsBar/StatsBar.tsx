// components/StatsBar/StatsBar.tsx
import styles from "./StatsBar.module.css";

const stats = [
  { label: "Network", value: "Devnet", accent: "warning" },
  { label: "Jupiter Version", value: "v6 API", accent: "primary" },
  { label: "Meteora Protocol", value: "DLMM", accent: "secondary" },
  { label: "Avg Block Time", value: "~400ms", accent: "primary" },
];

export function StatsBar() {
  return (
    <div className={styles.bar}>
      {stats.map((s, i) => (
        <div key={i} className={styles.stat}>
          <span className={styles.label}>{s.label}</span>
          <span className={`${styles.value} ${styles[`accent_${s.accent}`]}`}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}
