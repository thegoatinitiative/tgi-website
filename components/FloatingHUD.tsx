"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function FloatingHUD() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const hudItems = [
    { label: "THREAT LEVEL", value: "ELEVATED", color: "text-accent" },
    { label: "SIA ALERTS", value: "ACTIVE", color: "text-success" },
    { label: "HOMELAND RISK", value: "MONITORING", color: "text-yellow-400" },
    { label: "LAST SYNC", value: currentTime || "00:00:00", color: "text-primary" },
  ];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50 hidden md:block"
      role="complementary"
      aria-label="System status panel showing threat level and alerts"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-3 -left-3 w-6 h-6 bg-dark-100 border border-primary/30 rounded-full flex items-center justify-center text-primary hover:border-primary transition-colors z-10"
        aria-label={isExpanded ? "Collapse HUD" : "Expand HUD"}
      >
        <svg
          className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 212, 255, 0.1)",
            "0 0 30px rgba(0, 212, 255, 0.2)",
            "0 0 20px rgba(0, 212, 255, 0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hud-panel overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-2 bg-primary/5 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-heading text-xs text-primary tracking-widest">
              SYSTEM STATUS
            </span>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-3">
            {hudItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  {item.label}
                </span>
                <span className={`font-heading text-xs ${item.color} tracking-wider`}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-dark-200/50 border-t border-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600 tracking-wide">
                TGI-HUD v2.1.4
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
