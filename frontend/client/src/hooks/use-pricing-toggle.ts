import { useState } from "react";

interface PricingInfo {
  period: "monthly" | "annual";
  prices: {
    free: number;
    premium: number;
    professional: number;
  };
  discount: number;
}

export function usePricingToggle() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricing: PricingInfo = {
    period: isAnnual ? "annual" : "monthly",
    prices: {
      free: 0,
      premium: isAnnual ? 15 : 19,
      professional: isAnnual ? 29 : 39,
    },
    discount: 20, // 20% discount
  };

  const toggle = (value: boolean) => {
    setIsAnnual(value);
  };

  return { pricing, isAnnual, toggle };
}
