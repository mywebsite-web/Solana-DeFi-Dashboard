// components/PoolCard/PoolCard.tsx
import { LiquidityPool } from "@/types";
import { formatNumber, formatPercent } from "@/utils/format";
import styles from "./PoolCard.module.css";

interface PoolCardProps {
  pool: LiquidityPool;
  selected: boolean;
  onSelect: () => void;
}

export function PoolCard({ pool, selected, onSelect }: PoolCardProps) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <div className={styles.tokenPair}>
        <div className={styles.tokenIcons}>
          <TokenCircle symbol={pool.tokenX.symbol} index={0} />
          <TokenCircle symbol={pool.tokenY.symbol} index={1} />
        </div>
        <div className={styles.pairInfo}>
          <span className={styles.pairName}>{pool.name}</span>
          <span className={styles.feeTag}>{pool.fee}% fee</span>
        </div>
      </div>

      <div className={styles.stats}>
        <Stat
          label="TVL"
          value={`$${formatNumber(pool.tvl, 0, true)}`}
          highlight={false}
        />
        <Stat
          label="APR"
          value={formatPercent(pool.apr)}
          highlight={true}
        />
        <Stat
          label="24h Vol"
          value={`$${formatNumber(pool.volume24h, 0, true)}`}
          highlight={false}
        />
      </div>

      {pool.binStep !== undefined && (
        <div className={styles.binStep}>
          <span className={styles.binStepLabel}>Bin Step</span>
          <span className={styles.binStepValue}>{pool.binStep}</span>
        </div>
      )}

      {selected && (
        <div className={styles.selectedIndicator}>
          <span>✓ Selected</span>
        </div>
      )}
    </button>
  );
}

function TokenCircle({ symbol, index }: { symbol: string; index: number }) {
  const colors = [
    ["#00d4aa", "#004d3d"],
    ["#7c5cfc", "#2d1f7a"],
    ["#f5a623", "#5c3d00"],
    ["#ff4d6d", "#5c0018"],
  ];
  const [text, bg] = colors[symbol.charCodeAt(0) % colors.length];
  return (
    <div
      className={styles.tokenCircle}
      style={{
        background: bg,
        border: `1.5px solid ${text}`,
        marginLeft: index > 0 ? "-10px" : "0",
        color: text,
      }}
    >
      {symbol[0]}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight: boolean;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span
        className={`${styles.statValue} ${highlight ? styles.statHighlight : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
