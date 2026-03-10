import { format, parseISO, isValid } from "date-fns";

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string, fmt: string = "MMM dd, yyyy"): string {
  if (!dateStr) return "—";
  const date = parseISO(dateStr);
  if (!isValid(date)) return "—";
  return format(date, fmt);
}

export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, "MMM dd");
}

export function formatRelativeDate(dateStr: string): string {
  return formatDate(dateStr, "MMM dd, yyyy 'at' HH:mm");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatPercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function formatPerHead(netProfit: number, teamSize: number): number {
  if (teamSize === 0) return 0;
  return Math.round(netProfit / teamSize);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
