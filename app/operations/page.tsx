"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const operations = [
  {
    name: "Border Intelligence",
    description:
      "The team documents crossings, suspicious activity, and what it sees along the border, then writes that up for law enforcement.",
    objectives: ["Watch high-traffic crossing points", "Document SIA encounters", "Record smuggling patterns"],
  },
  {
    name: "SIA Tracking",
    description:
      "Identify Special Interest Aliens from high-risk regions and prepare a written record for law enforcement partners.",
    objectives: ["Identify SIAs at the border", "Write up what was observed", "Share the record with agencies"],
  },
  {
    name: "Sharing with Law Enforcement",
    description:
      "Written findings go to federal, state, and local law enforcement. Enforcement stays with the agencies that have that authority.",
    objectives: ["Collect field reporting", "Review what was found", "Send it to partners"],
  },
  {
    name: "Evidence Documentation",
    description:
      "Photograph and catalog discarded documents and materials found at crossing points.",
    objectives: ["Photograph what is found", "Catalog the findings", "Keep a record of the evidence"],
  },
  {
    name: "Vulnerability Mapping",
    description:
      "Map unguarded sectors and routes used by smugglers and traffickers, and report those gaps to authorities.",
    objectives: ["Map vulnerable sectors", "Identify smuggling routes", "Report the gaps"],
  },
  {
    name: "Public Briefings",
    description:
      "Video and written reports for the public and for lawmakers about what the team is seeing at the border.",
    objectives: ["Publish video briefings", "Publish written reports", "Talk with the press"],
  },
  {
    name: "Child Trafficking Reports",
    description:
      "Identify, document, and report suspected child trafficking at the border to law enforcement, including HSI and the FBI.",
    objectives: ["Identify trafficking indicators", "Document suspected cases", "Report them to HSI and the FBI"],
  },
];

export default function OperationsPage() {
  return (
    <div className="min-h-screen py-12">
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-heading text-xs text-primary tracking-widest mb-8">
              THE WORK
            </p>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              WHAT THE TEAM <span className="text-primary text-glow-sm">DOES</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Field reporting along the southern border, written up and sent to law enforcement.
              The organization does not arrest, detain, or take custody.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            {operations.map((op, index) => (
              <motion.div
                key={op.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-dark-100/80 border border-gray-800 rounded-sm p-6 hover:border-primary/50 transition-colors"
              >
                <h2 className="font-heading text-xl text-gray-100 mb-3">
                  {op.name}
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {op.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {op.objectives.map((objective) => (
                    <span key={objective} className="px-2 py-1 bg-primary/10 text-xs text-primary font-mono tracking-wide rounded-sm">
                      {objective}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hud-panel p-12"
          >
            <h2 className="font-heading text-2xl md:text-3xl text-gray-100 tracking-wider mb-4">
              SUPPORT THE <span className="text-primary">WORK</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Gifts pay for field work, equipment, and the reporting that gets written up for law enforcement.
            </p>
            <Link href="/donate" className="cyber-button">
              Fund the Work
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
