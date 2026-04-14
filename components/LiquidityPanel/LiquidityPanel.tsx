// components/LiquidityPanel/LiquidityPanel.tsx
import { useWallet } from "@solana/wallet-adapter-react";
import { PoolCard } from "@/components/PoolCard/PoolCard";
import { TransactionStatus } from "@/components/TransactionStatus/TransactionStatus";
import { useLiquidity } from "@/hooks/useLiquidity";
import { formatNumber, formatPercent } from "@/utils/format";
import styles from "./LiquidityPanel.module.css";

export function LiquidityPanel() {
  const { connected } = useWallet();
  const {
    pools,
    poolsLoading,
    selectedPool,
    setSelectedPool,
    tokenXAmount,
    setTokenXAmount,
    tokenYAmount,
    setTokenYAmount,
    txState,
    handleAddLiquidity,
    getPoolShare,
    resetTx,
    refreshPools,
  } = useLiquidity();

  const canAdd =
    connected &&
    !!selectedPool &&
    !!tokenXAmount &&
    parseFloat(tokenXAmount) > 0 &&
    !!tokenYAmount &&
    parseFloat(tokenYAmount) > 0 &&
    txState.status === "idle";

  const poolShare = getPoolShare();

  return (
    <div className={styles.panel} id="liquidity">
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.meteoraBadge}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#7c5cfc" strokeWidth="1.5"/>
              <path d="M4 10L7 4l3 6" stroke="#7c5cfc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Meteora
          </div>
          <h2 className={styles.panelTitle}>Liquidity</h2>
        </div>
        <button className={styles.refreshBtn} onClick={refreshPools} title="Refresh pools">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={poolsLoading ? styles.spinning : ""}>
            <path d="M12 7A5 5 0 1 1 7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 2l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Pools list */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Available Pools</span>
          <span className={styles.poolCount}>{pools.length} pools</span>
        </div>

        {poolsLoading ? (
          <div className={styles.skeletonList}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`skeleton ${styles.poolSkeleton}`} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <div className={styles.poolList}>
            {pools.map((pool) => (
              <PoolCard
                key={pool.address}
                pool={pool}
                selected={selectedPool?.address === pool.address}
                onSelect={() =>
                  setSelectedPool(
                    selectedPool?.address === pool.address ? null : pool
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Add liquidity form */}
      {selectedPool && (
        <div className={styles.addLiquiditySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Add Liquidity</span>
            <span className={styles.selectedPoolName}>{selectedPool.name}</span>
          </div>

          {/* APR banner */}
          <div className={styles.aprBanner}>
            <div className={styles.aprItem}>
              <span className={styles.aprLabel}>Current APR</span>
              <span className={styles.aprValue}>{formatPercent(selectedPool.apr)}</span>
            </div>
            <div className={styles.aprDivider} />
            <div className={styles.aprItem}>
              <span className={styles.aprLabel}>Total TVL</span>
              <span className={styles.aprValue}>${formatNumber(selectedPool.tvl, 0, true)}</span>
            </div>
            <div className={styles.aprDivider} />
            <div className={styles.aprItem}>
              <span className={styles.aprLabel}>Fee Rate</span>
              <span className={styles.aprValue}>{selectedPool.fee}%</span>
            </div>
          </div>

          {/* Token inputs */}
          <div className={styles.inputPair}>
            <div className={styles.liquidityInput}>
              <div className={styles.liquidityInputHeader}>
                <div className={styles.liquidityTokenTag}>
                  <span className={styles.liquidityTokenSymbol}>
                    {selectedPool.tokenX.symbol}
                  </span>
                </div>
                <span className={styles.inputLabel}>Amount</span>
              </div>
              <input
                type="number"
                className={styles.liquidityAmountInput}
                placeholder="0.00"
                value={tokenXAmount}
                onChange={(e) => setTokenXAmount(e.target.value)}
                min="0"
              />
            </div>

            <div className={styles.plusIcon}>+</div>

            <div className={styles.liquidityInput}>
              <div className={styles.liquidityInputHeader}>
                <div className={`${styles.liquidityTokenTag} ${styles.liquidityTokenTagY}`}>
                  <span className={styles.liquidityTokenSymbol}>
                    {selectedPool.tokenY.symbol}
                  </span>
                </div>
                <span className={styles.inputLabel}>Amount</span>
              </div>
              <input
                type="number"
                className={styles.liquidityAmountInput}
                placeholder="0.00"
                value={tokenYAmount}
                onChange={(e) => setTokenYAmount(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Pool share preview */}
          {(tokenXAmount || tokenYAmount) && poolShare > 0 && (
            <div className={styles.sharePreview}>
              <div className={styles.shareRow}>
                <span className={styles.shareLabel}>Estimated Pool Share</span>
                <span className={styles.shareValue}>
                  {poolShare < 0.01 ? "< 0.01%" : formatPercent(poolShare, 4)}
                </span>
              </div>
              <div className={styles.shareBar}>
                <div
                  className={styles.shareBarFill}
                  style={{ width: `${Math.min(poolShare, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Add liquidity CTA */}
          <button
            className={`${styles.addCta} ${!canAdd ? styles.addCtaDisabled : ""}`}
            onClick={handleAddLiquidity}
            disabled={!canAdd}
          >
            {txState.status === "pending" ? (
              <>
                <span className={styles.ctaSpinner} />
                Adding Liquidity...
              </>
            ) : !connected ? (
              "Connect Wallet"
            ) : !tokenXAmount || !tokenYAmount ? (
              "Enter Amounts"
            ) : (
              `Add ${selectedPool.tokenX.symbol} + ${selectedPool.tokenY.symbol} Liquidity`
            )}
          </button>

          {/* Transaction status */}
          <TransactionStatus state={txState} onDismiss={resetTx} />
        </div>
      )}

      {/* Empty state when no pool selected */}
      {!selectedPool && !poolsLoading && pools.length > 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◈</div>
          <span className={styles.emptyText}>
            Select a pool above to add liquidity
          </span>
        </div>
      )}
    </div>
  );
}
