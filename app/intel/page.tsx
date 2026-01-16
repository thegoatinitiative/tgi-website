"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const SUBSTACK_URL = "https://substack.com/@thecorygoat";

export default function IntelPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Header */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm mb-8"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                CLASSIFIED INTEL BRIEFINGS
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              INTEL <span className="text-primary text-glow-sm">UPDATES</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Subscribe to receive classified intelligence briefings, field reports, 
              and exclusive updates from TGI operations directly to your inbox.
            </p>

            {/* Classification Banner */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-dark-100 border border-primary/30 rounded-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="font-mono text-xs text-success">LIVE FEED</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="font-mono text-xs text-gray-500">CLEARANCE: PUBLIC</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Subscribe CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-dark-100/80 border border-primary/20 rounded-sm overflow-hidden h-full">
                {/* Header stripe */}
                <div className="h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary" />
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-gray-100">SUBSCRIBE TO INTEL</h3>
                      <p className="text-xs text-gray-500">Direct to your secure inbox</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Get exclusive access to intelligence briefings, operation updates, 
                    and behind-the-scenes content from the field. Join our network of 
                    informed supporters.
                  </p>
                  
                  <h4 className="font-heading text-sm text-primary tracking-wider mb-4">WHAT YOU&apos;LL RECEIVE:</h4>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Weekly intelligence briefings",
                      "Field operation reports",
                      "Exclusive video content",
                      "Early access to announcements",
                      "Behind-the-scenes updates",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.a
                    href={SUBSTACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-sm tracking-wider rounded-sm hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                    SUBSCRIBE ON SUBSTACK
                  </motion.a>
                  
                  <p className="text-center text-xs text-gray-600 mt-4">
                    Free subscription • Unsubscribe anytime
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Recent Intel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-dark-100/80 border border-gray-800 rounded-sm overflow-hidden h-full">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg text-gray-100 tracking-wider">LATEST BRIEFINGS</h3>
                    <span className="font-mono text-[10px] text-gray-600">SUBSTACK FEED</span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Substack embed iframe */}
                  <iframe 
                    src="https://thecorygoat.substack.com/embed" 
                    width="100%" 
                    height="400" 
                    style={{ border: 'none', background: 'transparent' }}
                    frameBorder="0" 
                    scrolling="no"
                  />
                  
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <a
                      href={SUBSTACK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 border border-primary/50 text-primary hover:bg-primary/10 transition-all font-heading text-sm tracking-wider rounded-sm"
                    >
                      VIEW ALL INTEL BRIEFINGS
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 bg-dark-100/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-gray-100 tracking-wider mb-4">
              INTEL <span className="text-primary">CATEGORIES</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Stay informed on all aspects of our mission and operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                title: "Field Reports",
                description: "On-the-ground updates from border operations and intelligence gathering missions.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Threat Analysis",
                description: "Deep dives into border security threats, SIA tracking, and pattern analysis.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Video Briefings",
                description: "Exclusive video content and documentary-style coverage of TGI operations.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-dark-100/50 border border-gray-800 rounded-sm hover:border-primary/30 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/30 rounded-full mb-4 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-heading text-lg text-gray-100 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-panel p-12"
          >
            <h2 className="font-heading text-2xl md:text-3xl text-gray-100 tracking-wider mb-4">
              STAY <span className="text-primary">INFORMED</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Don&apos;t miss critical intelligence updates. Subscribe now and join 
              our network of informed patriots.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-dark font-heading text-sm uppercase tracking-widest hover:bg-primary/90 transition-all duration-300"
              >
                Subscribe Now
              </a>
              <Link
                href="/support"
                className="px-6 py-3 font-heading text-sm uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all duration-300"
              >
                Support Mission
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
