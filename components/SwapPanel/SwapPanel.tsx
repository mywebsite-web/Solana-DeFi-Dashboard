// components/SwapPanel/SwapPanel.tsx
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenSelector } from "@/components/TokenSelector/TokenSelector";
import { TransactionStatus } from "@/components/TransactionStatus/TransactionStatus";
import { useSwap } from "@/hooks/useSwap";
import { DEVNET_TOKENS, SLIPPAGE_OPTIONS } from "@/utils/constants";
import { formatTokenAmount, formatPercent, formatPriceImpact } from "@/utils/format";
import styles from "./SwapPanel.module.css";

export function SwapPanel() {
  const { connected } = useWallet();
  const [inputToken, setInputToken] = useState(DEVNET_TOKENS[0]); // SOL
  const [outputToken, setOutputToken] = useState(DEVNET_TOKENS[1]); // USDC
  const [inputAmount, setInputAmount] = useState("");
  const [showSlippage, setShowSlippage] = useState(false);

  const {
    quote,
    quoteLoading,
    quoteError,
    txState,
    slippage,
    setSlippage,
    fetchQuote,
    executeSwapTx,
    resetTx,
  } = useSwap();

  // Fetch quote whenever input changes
  useEffect(() => {
    fetchQuote(inputToken, outputToken, inputAmount);
  }, [inputToken, outputToken, inputAmount]);

  const handleSwapTokens = () => {
    const prev = inputToken;
    setInputToken(outputToken);
    setOutputToken(prev);
    setInputAmount("");
  };

  const outputAmount =
    quote && outputToken
      ? formatTokenAmount(quote.outAmount, outputToken.decimals)
      : "";

  const exchangeRate =
    quote && inputAmount && parseFloat(inputAmount) > 0
      ? (
          parseInt(quote.outAmount) /
          Math.pow(10, outputToken.decimals) /
          parseFloat(inputAmount)
        ).toFixed(6)
      : null;

  const priceImpact = quote ? formatPriceImpact(quote.priceImpactPct) : null;

  const canSwap =
    connected &&
    !!quote &&
    !!inputAmount &&
    parseFloat(inputAmount) > 0 &&
    txState.status === "idle";

  return (
    <div className={styles.panel} id="swap">
      {/* Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.jupiterBadge}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#00d4aa" strokeWidth="1.5"/>
              <path d="M4 7h6M7 4l3 3-3 3" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Jupiter
          </div>
          <h2 className={styles.panelTitle}>Swap</h2>
        </div>
        <button
          className={styles.slippageBtn}
          onClick={() => setShowSlippage(!showSlippage)}
          title="Slippage settings"
        >
          ⚙ {slippage}%
        </button>
      </div>

      {/* Slippage settings */}
      {showSlippage && (
        <div className={styles.slippagePanel}>
          <span className={styles.slippageLabel}>Slippage Tolerance</span>
          <div className={styles.slippageOptions}>
            {SLIPPAGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                className={`${styles.slippageOpt} ${slippage === opt ? styles.slippageOptActive : ""}`}
                onClick={() => { setSlippage(opt); setShowSlippage(false); }}
              >
                {opt}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input token */}
      <div className={styles.tokenBox}>
        <div className={styles.tokenBoxHeader}>
          <span className={styles.tokenBoxLabel}>You pay</span>
          <span className={styles.tokenBoxBalance}>Balance: —</span>
        </div>
        <div className={styles.tokenBoxRow}>
          <input
            className={styles.amountInput}
            type="number"
            placeholder="0.00"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            min="0"
          />
          <TokenSelector
            selected={inputToken}
            onSelect={setInputToken}
            exclude={outputToken.mint}
          />
        </div>
        {inputAmount && (
          <div className={styles.usdHint}>
            ≈ ${(parseFloat(inputAmount) * (inputToken.symbol === "SOL" ? 180 : 1)).toFixed(2)}
          </div>
        )}
      </div>

      {/* Swap button (arrow) */}
      <div className={styles.swapArrowWrapper}>
        <button className={styles.swapArrow} onClick={handleSwapTokens} title="Switch tokens">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M4 10l4 4 4-4M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Output token */}
      <div className={`${styles.tokenBox} ${styles.tokenBoxOutput}`}>
        <div className={styles.tokenBoxHeader}>
          <span className={styles.tokenBoxLabel}>You receive</span>
          {quoteLoading && (
            <span className={styles.fetchingHint}>
              <span className={styles.loadingDot} /> Fetching quote...
            </span>
          )}
        </div>
        <div className={styles.tokenBoxRow}>
          <div className={styles.outputAmount}>
            {quoteLoading ? (
              <div className={`skeleton ${styles.outputSkeleton}`} />
            ) : (
              <span className={outputAmount ? styles.outputValue : styles.outputPlaceholder}>
                {outputAmount || "0.00"}
              </span>
            )}
          </div>
          <TokenSelector
            selected={outputToken}
            onSelect={setOutputToken}
            exclude={inputToken.mint}
          />
        </div>
      </div>

      {/* Quote details */}
      {quote && !quoteLoading && (
        <div className={styles.quoteDetails}>
          {exchangeRate && (
            <div className={styles.quoteRow}>
              <span className={styles.quoteLabel}>Exchange Rate</span>
              <span className={styles.quoteValue}>
                1 {inputToken.symbol} ≈ {exchangeRate} {outputToken.symbol}
              </span>
            </div>
          )}
          {priceImpact && (
            <div className={styles.quoteRow}>
              <span className={styles.quoteLabel}>Price Impact</span>
              <span
                className={`${styles.quoteValue} ${
                  priceImpact.level === "high"
                    ? styles.impactHigh
                    : priceImpact.level === "medium"
                    ? styles.impactMedium
                    : styles.impactLow
                }`}
              >
                {priceImpact.value}
              </span>
            </div>
          )}
          <div className={styles.quoteRow}>
            <span className={styles.quoteLabel}>Slippage</span>
            <span className={styles.quoteValue}>{slippage}%</span>
          </div>
          {quote.routePlan.length > 0 && (
            <div className={styles.quoteRow}>
              <span className={styles.quoteLabel}>Route</span>
              <span className={styles.quoteValue}>
                {quote.routePlan
                  .map((r) => r.swapInfo.label || "Unknown")
                  .join(" → ")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {quoteError && (
        <div className={styles.errorBox}>
          <span>⚠</span> {quoteError}
        </div>
      )}

      {/* Swap CTA */}
      <button
        className={`${styles.swapCta} ${!canSwap ? styles.swapCtaDisabled : ""}`}
        onClick={executeSwapTx}
        disabled={!canSwap}
      >
        {txState.status === "pending" ? (
          <>
            <span className={styles.ctaSpinner} />
            Swapping...
          </>
        ) : !connected ? (
          "Connect Wallet to Swap"
        ) : !inputAmount || parseFloat(inputAmount) <= 0 ? (
          "Enter an Amount"
        ) : quoteLoading ? (
          "Fetching Quote..."
        ) : !quote ? (
          "No Route Found"
        ) : (
          `Swap ${inputToken.symbol} → ${outputToken.symbol}`
        )}
      </button>

      {/* Transaction status */}
      <TransactionStatus state={txState} onDismiss={resetTx} />
    </div>
  );
}
