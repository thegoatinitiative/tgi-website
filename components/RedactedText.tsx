"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RedactedTextProps {
  /** The actual text to reveal on hover */
  revealed: string;
  /** Optional custom redacted text (defaults to █ blocks matching revealed length) */
  redacted?: string;
  /** Color variant for revealed text */
  variant?: "primary" | "accent" | "success" | "warning";
  /** Whether to show a tooltip hint */
  showHint?: boolean;
  /** Custom class names */
  className?: string;
}

/**
 * RedactedText - A reusable component that shows redacted blocks
 * and reveals the actual text on hover/focus for accessibility
 */
export function RedactedText({
  revealed,
  redacted,
  variant = "primary",
  showHint = false,
  className = "",
}: RedactedTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure consistent rendering between server and client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate redacted blocks if not provided
  const redactedText = redacted || "█".repeat(Math.max(revealed.length, 6));

  // Variant colors
  const variantColors = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-yellow-400",
  };

  // Handle touch/click for mobile devices
  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  // Static render for SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <span className={`relative inline-block ${className}`}>
        <span className="text-gray-400 select-none">{redactedText}</span>
      </span>
    );
  }

  return (
    <span
      className={`relative inline-block cursor-pointer group ${className}`}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      onFocus={() => setIsRevealed(true)}
      onBlur={() => setIsRevealed(false)}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      tabIndex={0}
      role="button"
      aria-label={`Redacted text. Tap or hover to reveal.`}
    >
      {/* Redacted text */}
      <motion.span
        initial={false}
        animate={{ 
          opacity: isRevealed ? 0 : 1,
          filter: isRevealed ? "blur(4px)" : "blur(0px)"
        }}
        transition={{ duration: 0.3 }}
        className="text-gray-400 select-none"
      >
        {redactedText}
      </motion.span>

      {/* Revealed text */}
      <motion.span
        initial={false}
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          filter: isRevealed ? "blur(0px)" : "blur(4px)"
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 ${variantColors[variant]} font-medium whitespace-nowrap`}
      >
        {revealed}
      </motion.span>

      {/* Glitch effect on hover */}
      <motion.span
        initial={false}
        animate={{ opacity: isRevealed ? [0, 0.5, 0] : 0 }}
        transition={{ duration: 0.2 }}
        className={`absolute inset-0 ${variantColors[variant]} blur-[2px] pointer-events-none`}
        aria-hidden="true"
      >
        {revealed}
      </motion.span>

      {/* Optional hint tooltip */}
      {showHint && (
        <span className={`absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-dark-100 border border-primary/20 rounded text-[9px] text-gray-500 whitespace-nowrap transition-opacity pointer-events-none ${isRevealed ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          tap to reveal
        </span>
      )}
    </span>
  );
}

/**
 * RedactedBlock - A larger block variant for paragraphs or sections
 */
export function RedactedBlock({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle touch/click for mobile devices
  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  // Static render for SSR
  if (!isMounted) {
    return (
      <div className={`relative ${className}`}>
        <div style={{ filter: "blur(8px)", opacity: 0.5 }}>{children}</div>
        <div className="absolute inset-0 bg-dark-100/80 flex items-center justify-center pointer-events-none">
          <span className="font-heading text-xs text-accent tracking-widest">[REDACTED]</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      onFocus={() => setIsRevealed(true)}
      onBlur={() => setIsRevealed(false)}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      tabIndex={0}
      role="button"
      aria-label="Redacted content block. Tap or hover to reveal."
    >
      <motion.div
        initial={false}
        animate={{
          filter: isRevealed ? "blur(0px)" : "blur(8px)",
          opacity: isRevealed ? 1 : 0.5,
        }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>

      {/* Redaction overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-dark-100/80 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-heading text-xs text-accent tracking-widest">
          [REDACTED]
        </span>
      </motion.div>
    </div>
  );
}
