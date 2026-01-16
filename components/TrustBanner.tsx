"use client";

import { motion } from "framer-motion";

export function TrustBanner() {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-100/95 backdrop-blur-sm border-b border-primary/20"
      role="banner"
      aria-label="Official government-style trust indicator showing secure connection"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm">
          {/* Lock Icon */}
          <svg
            className="w-3.5 h-3.5 text-success flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

          <span className="text-gray-400 whitespace-nowrap">
            An official portal of{" "}
            <span className="text-primary font-semibold">The GOAT Initiative</span>
          </span>

          <span className="hidden sm:inline text-gray-600">|</span>

          <span className="hidden sm:flex items-center gap-1.5 text-gray-400 whitespace-nowrap">
            <span className="text-success">Secure</span>
            <span className="text-gray-600">•</span>
            <span className="text-success">HTTPS Encrypted</span>
          </span>

          <span className="hidden md:inline text-gray-600">|</span>

          <span className="hidden md:inline text-accent font-heading text-xs tracking-wider whitespace-nowrap">
            EYES ONLY
          </span>
        </div>
      </div>
    </motion.div>
  );
}
