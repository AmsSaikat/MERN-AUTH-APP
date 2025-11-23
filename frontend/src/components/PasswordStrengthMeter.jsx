import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function PasswordCriteria({ password }) {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = criteria.filter((item) => item.met).length;
  const strengthPercent = (metCount / criteria.length) * 100;

  // Dynamic color based on strength
  const getColor = () => {
    if (strengthPercent < 40) return "bg-red-500";
    if (strengthPercent < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-3 space-y-2">
      {/* Criteria checklist */}
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-sm">
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={item.met ? "text-green-400" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}

      {/* Password Strength Meter */}
      <div className="mt-3">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strengthPercent}%` }}
            transition={{ duration: 0.5 }}
            className={`h-2 ${getColor()}`}
          />
        </div>
        <p className="text-xs mt-1 text-gray-400">
          Strength:{" "}
          <span className={getColor().replace("bg-", "text-")}>
            {strengthPercent < 40
              ? "Weak"
              : strengthPercent < 80
              ? "Moderate"
              : "Strong"}
          </span>
        </p>
      </div>
    </div>
  );
}
