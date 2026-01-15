"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export function FloatingDonate() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show button after scrolling down a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const donorboxUrl = "https://donorbox.org/the-goat-initiative";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Expanded Quick Donate Panel */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-3 bg-dark-100 border border-primary/30 rounded-lg p-4 shadow-[0_0_30px_rgba(0,212,255,0.2)] min-w-[280px]"
              >
                <div className="text-center mb-4">
                  <p className="font-heading text-sm text-primary tracking-wider mb-1">QUICK DONATE</p>
                  <p className="text-xs text-gray-500">Support the mission today</p>
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[25, 50, 100].map((amount) => (
                    <a
                      key={amount}
                      href={`${donorboxUrl}?amount=${amount}&default_interval=o`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 text-center border border-primary/50 text-primary hover:bg-primary hover:text-dark transition-all font-heading text-sm rounded"
                    >
                      ${amount}
                    </a>
                  ))}
                </div>
                
                {/* Monthly Option */}
                <a
                  href={`${donorboxUrl}?amount=25&default_interval=m`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 mb-3 text-center bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-dark transition-all font-heading text-sm rounded"
                >
                  $25/MONTH
                </a>
                
                {/* Custom Amount Link */}
                <Link
                  href="/support"
                  className="block text-center text-xs text-gray-500 hover:text-primary transition-colors"
                >
                  Choose custom amount →
                </Link>
                
                {/* 501c3 Badge */}
                <div className="mt-4 pt-3 border-t border-gray-800 text-center">
                  <p className="text-[10px] text-gray-600">
                    501(c)(3) Tax Deductible • EIN: 99-3753614
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Floating Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            {/* Glow ring */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(0, 212, 255, 0.4)",
                  "0 0 0 12px rgba(0, 212, 255, 0)",
                  "0 0 0 0 rgba(0, 212, 255, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full"
            />
            
            {/* Button */}
            <div className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-sm tracking-wider rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="hidden sm:inline">DONATE</span>
              
              {/* Expand indicator */}
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="w-4 h-4 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </motion.svg>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
