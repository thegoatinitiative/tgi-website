"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Mission" },
  { href: "/operations", label: "Operations" },
  { href: "/operatives", label: "Leadership" },
  { href: "/media", label: "Video Intel" },
  { href: "/intel", label: "Intel Updates" },
  { href: "/articles", label: "Articles" },
];

function AccountLink({ onClick, className }: { onClick?: () => void; className: string }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { signedIn?: boolean }) => {
        if (!cancelled && data.signedIn) setSignedIn(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <a href="https://goatintel.com/" onClick={onClick} className={className}>
        Sign in
      </a>
      {signedIn ? (
        <Link href="/account" onClick={onClick} className={className}>
          Account
        </Link>
      ) : null}
    </>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-dark/80 backdrop-blur-md border-b border-primary/10"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded flex items-center justify-center group-hover:border-primary/60 transition-colors">
                <span className="font-heading font-bold text-primary text-lg">TGI</span>
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden xl:block">
              <p className="font-heading text-sm text-gray-100 tracking-wider">
                THE GOAT INITIATIVE
              </p>
              <p className="text-xs text-gray-500 tracking-wide">
                501(c)(3) NONPROFIT
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-0 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap px-2 py-2 text-sm text-gray-400 hover:text-primary transition-colors font-medium tracking-wide relative group xl:px-3.5"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <AccountLink className="px-4 py-2.5 text-base text-gray-300 hover:text-primary transition-colors font-medium tracking-wide" />
            <Link
              href="/donate"
              className="px-5 py-3 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-sm tracking-wider rounded-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300 flex items-center gap-2 xl:px-7 xl:py-3.5 xl:text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              DONATE
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <a
              href="https://goatintel.com/"
              className="px-4 py-2.5 text-base text-gray-300 hover:text-primary transition-colors font-medium tracking-wide"
            >
              Sign in
            </a>
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
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <AccountLink
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors rounded-sm font-medium tracking-wide"
                />
              </motion.div>

              {/* Mobile Donate Button */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navLinks.length + 1) * 0.1 }}
                className="pt-2"
              >
                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-5 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-base tracking-wider text-center rounded-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    DONATE NOW
                  </span>
                </Link>
              </motion.div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
