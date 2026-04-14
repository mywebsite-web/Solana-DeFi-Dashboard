// components/TokenSelector/TokenSelector.tsx
import { useState, useRef, useEffect } from "react";
import { Token } from "@/types";
import { DEVNET_TOKENS } from "@/utils/constants";
import styles from "./TokenSelector.module.css";

interface TokenSelectorProps {
  selected: Token;
  onSelect: (token: Token) => void;
  exclude?: string;
  label?: string;
}

export function TokenSelector({
  selected,
  onSelect,
  exclude,
  label,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const tokens = DEVNET_TOKENS.filter((t) => t.mint !== exclude);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      {label && <span className={styles.label}>{label}</span>}
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        <TokenIcon token={selected} />
        <span className={styles.symbol}>{selected.symbol}</span>
        <span className={styles.chevron} style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>Select Token</div>
          {tokens.map((token) => (
            <button
              key={token.mint}
              className={`${styles.tokenOption} ${selected.mint === token.mint ? styles.selected : ""}`}
              onClick={() => {
                onSelect(token);
                setOpen(false);
              }}
            >
              <TokenIcon token={token} />
              <div className={styles.tokenInfo}>
                <span className={styles.tokenSymbol}>{token.symbol}</span>
                <span className={styles.tokenName}>{token.name}</span>
              </div>
              {selected.mint === token.mint && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TokenIcon({ token }: { token: Token }) {
  const [imgError, setImgError] = useState(false);
  const colors = ["#00d4aa", "#7c5cfc", "#f5a623", "#ff4d6d", "#00b4ff"];
  const colorIndex =
    token.symbol.charCodeAt(0) % colors.length;

  if (token.logoURI && !imgError) {
    return (
      <img
        src={token.logoURI}
        alt={token.symbol}
        width={24}
        height={24}
        className={styles.tokenLogo}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={styles.tokenLogoFallback}
      style={{ background: colors[colorIndex] }}
    >
      {token.symbol[0]}
    </div>
  );
}
