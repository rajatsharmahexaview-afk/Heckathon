import React from "react";
import { useApp } from "@/contexts/AppContext";
import { FX_RATE_USD_TO_INR } from "@/config/constants";
import type { Currency } from "@/types/gift";

export function formatCurrency(amount: number, currency: Currency, targetCurrency?: Currency): string {
  const target = targetCurrency || currency;
  let value = amount;

  if (currency !== target) {
    value = target === "INR" ? amount * FX_RATE_USD_TO_INR : amount / FX_RATE_USD_TO_INR;
  }

  if (target === "INR") {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export const CurrencyDisplay: React.FC<{ amount: number; originalCurrency: Currency; className?: string }> = ({
  amount,
  originalCurrency,
  className = "",
}) => {
  const { currency } = useApp();
  return <span className={className}>{formatCurrency(amount, originalCurrency, currency)}</span>;
};
