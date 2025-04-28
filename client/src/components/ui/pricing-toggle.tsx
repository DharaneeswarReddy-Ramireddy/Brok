import * as React from "react";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
  onToggle: (isAnnual: boolean) => void;
  defaultChecked?: boolean;
}

export function PricingToggle({
  onToggle,
  defaultChecked = false,
}: PricingToggleProps) {
  const [isChecked, setIsChecked] = React.useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onToggle(newValue);
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <span className="text-gray-700 mr-3">Monthly</span>
      <div className="relative inline-block w-12 mr-3 align-middle">
        <input
          type="checkbox"
          id="pricing-toggle"
          className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div
          className={cn(
            "block overflow-hidden h-6 rounded-full cursor-pointer transition",
            isChecked ? "bg-primary" : "bg-gray-300"
          )}
        >
          <span
            className={cn(
              "absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 transform transition-transform duration-200 ease-in",
              isChecked ? "translate-x-full" : ""
            )}
          />
        </div>
      </div>
      <span className="text-gray-700">
        Annual <span className="text-green-500 font-medium">(Save 20%)</span>
      </span>
    </div>
  );
}
