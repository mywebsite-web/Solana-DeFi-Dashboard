// utils/format.ts

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatNumber(
  num: number,
  decimals = 2,
  compact = false
): string {
  if (compact && num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (compact && num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatTokenAmount(amount: string, decimals: number): string {
  const num = parseInt(amount) / Math.pow(10, decimals);
  if (num < 0.001) return "< 0.001";
  if (num < 1) return num.toFixed(6);
  if (num < 1000) return num.toFixed(4);
  return formatNumber(num, 2, true);
}

export function parseTokenAmount(amount: string, decimals: number): number {
  const num = parseFloat(amount);
  if (isNaN(num)) return 0;
  return Math.floor(num * Math.pow(10, decimals));
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatPriceImpact(impact: number): {
  value: string;
  level: "low" | "medium" | "high";
} {
  const value = Math.abs(impact * 100).toFixed(2);
  if (impact < 0.01) return { value: `${value}%`, level: "low" };
  if (impact < 0.05) return { value: `${value}%`, level: "medium" };
  return { value: `${value}%`, level: "high" };
}
