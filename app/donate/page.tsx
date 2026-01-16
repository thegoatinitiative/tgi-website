"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Donorbox Campaign: https://donorbox.org/the-goat-initiative
const DONORBOX_CAMPAIGN = "the-goat-initiative";

const supportTiers = [
  {
    name: "OPERATIVE",
    amount: "$25",
    rawAmount: 25,
    period: "/month",
    description: "Support basic field operations and intelligence gathering.",
    features: [
      "Fund fuel & transportation for field operatives",
      "Provide supplies for border documentation missions",
      "Support evidence collection & preservation",
    ],
    popular: false,
  },
  {
    name: "ANALYST",
    amount: "$50",
    rawAmount: 50,
    period: "/month",
    description: "Fund advanced analysis tools and agency coordination.",
    features: [
      "All Operative impact, plus:",
      "Fund camera & surveillance equipment",
      "Support drone operations for sector mapping",
      "Enable secure communications infrastructure",
    ],
    popular: true,
  },
  {
    name: "DIRECTOR",
    amount: "$100",
    rawAmount: 100,
    period: "/month",
    description: "Enable major operations and equipment acquisition.",
    features: [
      "All Analyst impact, plus:",
      "Fund night vision & thermal imaging gear",
      "Support multi-day field deployments",
      "Added to TGI Substack for exclusive intel updates",
    ],
    popular: false,
  },
];

// Generate Donorbox URL with pre-selected amount
const getDonorboxUrl = (amount: number, recurring: boolean = true) => {
  const interval = recurring ? "m" : "o"; // m = monthly, o = one-time
  return `https://donorbox.org/${DONORBOX_CAMPAIGN}?amount=${amount}&default_interval=${interval}`;
};

export default function SupportPage() {
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-sm mb-8"
            >
              <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-heading text-xs text-success tracking-widest">
                SUPPORT THE MISSION
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              FUND THE <span className="text-primary text-glow-sm">INITIATIVE</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Your contribution directly funds field operations, equipment, and intelligence 
              gathering capabilities that protect our homeland.
            </p>

            {/* 501c3 Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-dark-100 border border-primary/30 rounded-sm">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-left">
                <p className="font-heading text-sm text-primary tracking-wider">501(c)(3) NONPROFIT</p>
                <p className="font-mono text-xs text-gray-500">EIN: 99-3753614 • Tax Deductible</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-gray-100 tracking-wider mb-4">
              CHOOSE YOUR <span className="text-primary">SUPPORT LEVEL</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Select a monthly contribution tier below. Click any option to donate securely via Donorbox.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {supportTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative group ${tier.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-dark font-heading text-xs tracking-wider rounded-sm z-10">
                    MOST POPULAR
                  </div>
                )}
                
                <a
                  href={getDonorboxUrl(tier.rawAmount)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block h-full bg-dark-100/80 border rounded-sm overflow-hidden
                               transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.15)] cursor-pointer
                               ${tier.popular ? 'border-primary' : 'border-gray-800 hover:border-primary/50'}`}
                >
                  {/* Header */}
                  <div className={`p-6 text-center border-b ${tier.popular ? 'border-primary/30 bg-primary/5' : 'border-gray-800'}`}>
                    <h3 className="font-heading text-lg text-primary tracking-widest mb-4">{tier.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-heading text-4xl text-gray-100">{tier.amount}</span>
                      <span className="text-gray-500">{tier.period}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">{tier.description}</p>
                  </div>
                  
                  {/* Features */}
                  <div className="p-6">
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    <div className={`w-full py-3 text-center font-heading text-sm tracking-wider transition-all duration-300
                                     ${tier.popular 
                                       ? 'bg-primary text-dark group-hover:bg-primary/90' 
                                       : 'border border-primary text-primary group-hover:bg-primary/10'}`}>
                      SELECT {tier.name}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
          
          {/* One-time donation option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 mb-4">Prefer a one-time contribution?</p>
            <a
              href={`https://donorbox.org/${DONORBOX_CAMPAIGN}?default_interval=o`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-sm tracking-wider rounded-sm hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              MAKE A ONE-TIME DONATION
            </a>
          </motion.div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-gray-100 tracking-wider mb-4">
              YOUR IMPACT
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              See how your contributions directly support our mission.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Field Equipment",
                description: "Cameras, drones, and surveillance equipment for documenting border activity.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                title: "Field Operations",
                description: "Transportation, supplies, and logistics for operatives in the field.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Intel Analysis",
                description: "Software, databases, and resources for analyzing and sharing intelligence.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-dark-100/50 border border-gray-800 rounded-sm"
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

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-panel p-12"
          >
            <h2 className="font-heading text-2xl md:text-3xl text-gray-100 tracking-wider mb-4">
              QUESTIONS ABOUT <span className="text-primary">DONATING</span>?
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Contact us for information about corporate sponsorships, 
              in-kind donations, or other ways to support the mission.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 font-heading text-sm uppercase tracking-widest border border-primary text-primary hover:bg-primary/10 transition-all duration-300"
              >
                Contact Us
              </Link>
              <Link
                href="/mission"
                className="px-6 py-3 font-heading text-sm uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
