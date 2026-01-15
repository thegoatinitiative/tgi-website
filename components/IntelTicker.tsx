"use client";

import { motion } from "framer-motion";

// Fake intel log entries for the ticker
const intelLogs = [
  { id: 1, text: "SIA DETECTED – ORIGIN ██████ – RISK LEVEL HIGH", type: "alert" },
  { id: 2, text: "PATTERN MATCH – CELL ACTIVITY ████████ SECTOR – MONITORING", type: "warning" },
  { id: 3, text: "BORDER BREACH – COORDINATES ██.████ / ███.████ – RESPONSE DEPLOYED", type: "alert" },
  { id: 4, text: "INTEL UPDATE – WATCHLIST ID ████-███ – STATUS CONFIRMED", type: "info" },
  { id: 5, text: "SURVEILLANCE – SUSPECT ████████ – MOVEMENT TRACKED", type: "warning" },
  { id: 6, text: "THREAT ASSESSMENT – LEVEL ████ – ASSETS ALERTED", type: "alert" },
  { id: 7, text: "DATA INTERCEPT – SOURCE ██████████ – ANALYSIS PENDING", type: "info" },
  { id: 8, text: "OPERATIVE REPORT – SECTOR ██ – ANOMALY DETECTED", type: "warning" },
];

export function IntelTicker() {
  // Duplicate for seamless loop
  const duplicatedLogs = [...intelLogs, ...intelLogs];

  return (
    <div 
      className="relative overflow-hidden bg-dark-100/80 border-t border-primary/10 py-2"
      role="marquee"
      aria-label="Intelligence ticker with simulated security updates"
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-100 to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling content */}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -50 * intelLogs.length * 10],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          },
        }}
      >
        {duplicatedLogs.map((log, index) => (
          <div
            key={`${log.id}-${index}`}
            className="flex items-center gap-3 mx-8"
          >
            {/* Status indicator */}
            <span 
              className={`relative flex h-1.5 w-1.5 ${
                log.type === "alert" 
                  ? "text-accent" 
                  : log.type === "warning" 
                  ? "text-yellow-400" 
                  : "text-primary"
              }`}
              aria-hidden="true"
            >
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                log.type === "alert" 
                  ? "bg-accent" 
                  : log.type === "warning" 
                  ? "bg-yellow-400" 
                  : "bg-primary"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                log.type === "alert" 
                  ? "bg-accent" 
                  : log.type === "warning" 
                  ? "bg-yellow-400" 
                  : "bg-primary"
              }`}></span>
            </span>
            
            {/* Log text */}
            <span 
              className={`font-mono text-[10px] tracking-wider ${
                log.type === "alert" 
                  ? "text-accent/80" 
                  : log.type === "warning" 
                  ? "text-yellow-400/80" 
                  : "text-primary/80"
              }`}
            >
              {log.text}
            </span>
            
            {/* Separator */}
            <span className="text-gray-700 text-xs" aria-hidden="true">│</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
