"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Mission" },
  { href: "/operations", label: "Operations" },
  { href: "/operatives", label: "Operatives" },
  { href: "/media", label: "Video Intel" },
  { href: "/intel", label: "Intel Updates" },
  { href: "/articles", label: "Articles" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-9 left-0 right-0 z-40 bg-dark/80 backdrop-blur-md border-b border-primary/10"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded flex items-center justify-center group-hover:border-primary/60 transition-colors">
                <span className="font-heading font-bold text-primary text-lg">TGI</span>
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-sm text-gray-100 tracking-wider">
                THE GOAT INITIATIVE
              </p>
              <p className="text-xs text-gray-500 tracking-wide">
                OFFICIAL PORTAL
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-0 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-400 hover:text-primary transition-colors font-medium tracking-wide relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side - Donate Button & Clearance Badge */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Donate Button */}
            <Link
              href="/donate"
              className="px-4 py-2 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-xs tracking-wider rounded-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              DONATE
            </Link>
            
            {/* Clearance Badge */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(0, 255, 159, 0.4)",
                  "0 0 0 8px rgba(0, 255, 159, 0)",
                  "0 0 0 0 rgba(0, 255, 159, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="font-heading text-xs text-success tracking-wider whitespace-nowrap">
                CLEARANCE LEVEL 5 – ACTIVE
              </span>
            </motion.div>
          </div>

          {/* Mobile Menu Button & Clearance Badge */}
          <div className="lg:hidden flex items-center gap-3">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(0, 255, 159, 0.4)",
                  "0 0 0 8px rgba(0, 255, 159, 0)",
                  "0 0 0 0 rgba(0, 255, 159, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden md:flex items-center gap-2 px-2 py-1 bg-success/10 border border-success/30 rounded-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="font-heading text-[10px] text-success tracking-wider whitespace-nowrap">
                LEVEL 5
              </span>
            </motion.div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-100/95 backdrop-blur-md border-t border-primary/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors rounded-sm font-medium tracking-wide"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Donate Button */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-2"
              >
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-4 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-sm tracking-wider text-center rounded-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    DONATE NOW
                  </span>
                </Link>
              </motion.div>
              
              {/* Mobile Clearance Badge */}
              <div className="pt-4 mt-4 border-t border-primary/10">
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  <span className="font-heading text-xs text-success tracking-wider">
                    CLEARANCE LEVEL 5 – ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
