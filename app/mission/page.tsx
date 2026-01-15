"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RedactedText } from "@/components/RedactedText";

export default function MissionPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, #00d4ff 1px, transparent 1px),
                              radial-gradient(circle at 70% 60%, #ff2a6d 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Classification Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm mb-8"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                MISSION BRIEFING
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              OUR <span className="text-primary text-glow-sm">MISSION</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Safeguarding national security through intelligence, vigilance, and unwavering dedication to the homeland.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Primary Mission Statement */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hud-panel p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-gradient-to-b from-primary to-success" />
              <h2 className="font-heading text-2xl text-gray-100 tracking-wider">
                PRIMARY DIRECTIVE
              </h2>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Our mission is to <span className="text-primary font-semibold">safeguard national security</span> along 
              the U.S./Mexico border through comprehensive intelligence gathering — identifying Special Interest 
              Aliens (SIAs), known and unknown terrorist risks, suspicious patterns, and potential homeland 
              attack vectors — and delivering actionable insights to local, state, and federal law enforcement partners.
            </p>
            
            <div className="p-4 bg-dark/50 border border-primary/20 rounded-sm">
              <p className="text-sm text-gray-400 font-mono">
                <span className="text-accent text-xs mr-2">[CLASSIFIED]</span>
                Current operations focus on{" "}
                <RedactedText revealed="critical border sectors" variant="primary" />{" "}
                with emphasis on{" "}
                <RedactedText revealed="high-threat corridors" variant="accent" />.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="py-16 bg-dark-100/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-gray-100 tracking-wider mb-4">
              CORE <span className="text-primary">OBJECTIVES</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Strategic priorities driving our intelligence operations and homeland security initiatives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "Intelligence Gathering",
                description: "Collect and analyze actionable intelligence on border crossings, suspicious activities, and potential threats to national security.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "SIA Identification",
                description: "Track and identify Special Interest Aliens from countries with known terrorist connections entering through border vulnerabilities.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Rapid Response Intel",
                description: "Deliver time-sensitive intelligence to law enforcement partners enabling swift action against emerging threats.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Agency Collaboration",
                description: "Partner with federal, state, and local law enforcement to create a unified front against border security threats.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                title: "Vulnerability Mapping",
                description: "Identify and document unguarded border sectors exploited by smugglers, traffickers, and potential terrorists.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Public Awareness",
                description: "Educate citizens and lawmakers about the reality of border security challenges through documented evidence and reporting.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Child Trafficking Interdiction",
                description: "Identify and report child trafficking activity at the border. Protecting the most vulnerable victims is our highest moral imperative.",
                highlight: true,
              },
            ].map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-dark-100/80 border border-gray-800 rounded-sm p-6
                           hover:border-primary/50 transition-all duration-300
                           hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]"
              >
                <div className="text-primary mb-4 group-hover:text-glow-sm transition-all">
                  {objective.icon}
                </div>
                <h3 className="font-heading text-lg text-gray-100 mb-2 group-hover:text-primary transition-colors">
                  {objective.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {objective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-gray-100 tracking-wider mb-4">
              WHY THIS <span className="text-accent">MATTERS</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex gap-4 p-6 bg-accent/5 border border-accent/20 rounded-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-heading text-lg text-accent mb-2">THE THREAT IS REAL</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every day, individuals from countries with known terrorist ties cross our southern border. 
                  Without proper intelligence and tracking, these Special Interest Aliens disappear into our 
                  communities, creating potential attack vectors that threaten American lives.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-primary/5 border border-primary/20 rounded-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-heading text-lg text-primary mb-2">FILLING THE GAP</h3>
                <p className="text-gray-400 leading-relaxed">
                  The GOAT Initiative exists to fill critical intelligence gaps that government agencies 
                  alone cannot address. Our operatives work on the ground, gathering evidence and 
                  connecting dots that would otherwise go unnoticed.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-success/5 border border-success/20 rounded-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-heading text-lg text-success mb-2">PROTECTING COMMUNITIES</h3>
                <p className="text-gray-400 leading-relaxed">
                  By sharing intelligence with law enforcement at all levels, we help protect American 
                  communities from threats before they materialize. Every piece of intel gathered 
                  contributes to a safer homeland.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-panel p-12"
          >
            <h2 className="font-heading text-2xl md:text-3xl text-gray-100 tracking-wider mb-4">
              JOIN THE <span className="text-primary">MISSION</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Support our efforts to secure the border and protect the homeland. 
              Every contribution helps us gather more intel and save lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/support" className="cyber-button">
                Support Mission
              </Link>
              <Link
                href="/operations"
                className="px-6 py-3 font-heading text-sm uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all duration-300"
              >
                View Operations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
