import React from "react";
import { useApp } from "@/contexts/AppContext";
import { FX_RATE_USD_TO_INR } from "@/config/constants";

const CurrencyToggle: React.FC = () => {
  const { currency, toggleCurrency } = useApp();

  return (
    <button
      onClick={toggleCurrency}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-bold hover:bg-secondary/80 transition-colors"
      aria-label="Toggle currency"
      title={`1 USD = ${FX_RATE_USD_TO_INR} INR`}
    >
      <span className={currency === "USD" ? "text-primary" : "text-muted-foreground"}>$</span>
      <span className="text-muted-foreground">/</span>
      <span className={currency === "INR" ? "text-primary" : "text-muted-foreground"}>₹</span>
    </button>
  );
};

export default CurrencyToggle;
