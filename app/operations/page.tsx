"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RedactedText } from "@/components/RedactedText";

const operations = [
  {
    code: "OP-ALPHA",
    name: "Border Intelligence Network",
    status: "ACTIVE",
    statusColor: "text-success",
    priority: "HIGH",
    description: "Real-time intelligence gathering and threat assessment along critical border sectors. Coordinating field operatives and surveillance assets.",
    objectives: ["Monitor high-traffic crossing points", "Document SIA encounters", "Track smuggling patterns"],
    redactedInfo: { prefix: "Current focus:", revealed: "San Diego Sector activity", suffix: "under surveillance." },
  },
  {
    code: "OP-BRAVO",
    name: "SIA Tracking Initiative",
    status: "ACTIVE",
    statusColor: "text-success",
    priority: "CRITICAL",
    description: "Identification and monitoring of Special Interest Aliens from high-risk regions. Building comprehensive profiles for law enforcement partners.",
    objectives: ["Identify SIAs at border", "Build threat profiles", "Share intel with agencies"],
    redactedInfo: { prefix: "Tracking", revealed: "847 active subjects", suffix: "across regions." },
  },
  {
    code: "OP-CHARLIE",
    name: "Intel Fusion Center",
    status: "ACTIVE",
    statusColor: "text-success",
    priority: "HIGH",
    description: "Coordinated intelligence dissemination to federal, state, and local law enforcement partners. Real-time threat sharing protocols.",
    objectives: ["Aggregate field intel", "Analyze threat patterns", "Distribute to partners"],
    redactedInfo: { prefix: "Connected to", revealed: "23 agency partners", suffix: "nationwide." },
  },
  {
    code: "OP-DELTA",
    name: "Evidence Documentation",
    status: "IN PROGRESS",
    statusColor: "text-yellow-400",
    priority: "MEDIUM",
    description: "Systematic documentation of discarded evidence, identification documents, and materials found at border crossing points.",
    objectives: ["Photograph evidence", "Catalog findings", "Preserve chain of custody"],
    redactedInfo: { prefix: "Database contains", revealed: "2,400+ items", suffix: "catalogued." },
  },
  {
    code: "OP-ECHO",
    name: "Vulnerability Assessment",
    status: "ONGOING",
    statusColor: "text-primary",
    priority: "HIGH",
    description: "Mapping unguarded border sectors and smuggling vectors exploited by criminal organizations and potential terrorists.",
    objectives: ["Map vulnerable sectors", "Identify smuggling routes", "Report to authorities"],
    redactedInfo: { prefix: "Identified", revealed: "34 critical gaps", suffix: "in coverage." },
  },
  {
    code: "OP-FOXTROT",
    name: "Public Awareness Campaign",
    status: "ACTIVE",
    statusColor: "text-success",
    priority: "MEDIUM",
    description: "Producing video content and reports to educate the public and lawmakers about border security realities.",
    objectives: ["Create video briefings", "Publish intel reports", "Engage media"],
    redactedInfo: { prefix: "Reached", revealed: "2M+ viewers", suffix: "this quarter." },
  },
  {
    code: "OP-GUARDIAN",
    name: "Child Trafficking Interdiction",
    status: "ACTIVE",
    statusColor: "text-success",
    priority: "CRITICAL",
    description: "Dedicated operation to identify, document, and report child trafficking activity at the border. Working with law enforcement to protect the most vulnerable victims.",
    objectives: ["Identify trafficking indicators", "Document suspected cases", "Coordinate with HSI/FBI"],
    redactedInfo: { prefix: "Cases reported:", revealed: "89 children identified", suffix: "for rescue." },
  },
];

export default function OperationsPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Header */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-heading text-xs text-accent tracking-widest">
                OPERATIONS CENTER
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              ACTIVE <span className="text-primary text-glow-sm">OPERATIONS</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Current missions and ongoing initiatives. Classification levels vary by operation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Operations Status Bar */}
      <section className="py-4 bg-dark-100/50 border-y border-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: "ACTIVE OPS", value: "4", color: "text-success" },
              { label: "IN PROGRESS", value: "1", color: "text-yellow-400" },
              { label: "ONGOING", value: "1", color: "text-primary" },
              { label: "TOTAL MISSIONS", value: "6", color: "text-gray-100" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`font-heading text-2xl ${stat.color}`}>{stat.value}</p>
                <p className="font-mono text-[10px] text-gray-500 tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            {operations.map((op, index) => (
              <motion.div
                key={op.code}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-dark-100/80 border border-gray-800 rounded-sm overflow-hidden
                           hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Code & Status */}
                  <div className="lg:w-48 p-6 bg-dark/50 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4">
                    <div>
                      <span className="font-heading text-2xl text-primary">{op.code}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${op.statusColor.replace('text-', 'bg-')}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${op.statusColor.replace('text-', 'bg-')}`}></span>
                        </span>
                        <span className={`font-mono text-xs ${op.statusColor} tracking-wider`}>
                          {op.status}
                        </span>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-accent/10 border border-accent/30 rounded-sm">
                      <span className="font-mono text-[10px] text-accent tracking-wider">
                        {op.priority} PRIORITY
                      </span>
                    </div>
                  </div>
                  
                  {/* Right: Content */}
                  <div className="flex-1 p-6">
                    <h3 className="font-heading text-xl text-gray-100 mb-3 group-hover:text-primary transition-colors">
                      {op.name}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {op.description}
                    </p>
                    
                    {/* Objectives */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {op.objectives.map((obj, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-xs text-primary font-mono tracking-wide rounded-sm">
                          {obj}
                        </span>
                      ))}
                    </div>
                    
                    {/* Redacted Info */}
                    <div className="p-3 bg-dark/50 border border-gray-800 rounded-sm">
                      <p className="font-mono text-xs text-gray-500">
                        <span className="text-accent mr-1">[INTEL]</span>
                        {op.redactedInfo.prefix}{" "}
                        <RedactedText revealed={op.redactedInfo.revealed} variant="primary" />{" "}
                        {op.redactedInfo.suffix}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-panel p-12"
          >
            <h2 className="font-heading text-2xl md:text-3xl text-gray-100 tracking-wider mb-4">
              SUPPORT ACTIVE <span className="text-primary">OPERATIONS</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Your contribution directly funds field operations, equipment, and intelligence gathering capabilities.
            </p>
            <Link href="/donate" className="cyber-button">
              Fund Operations
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
