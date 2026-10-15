"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const leaders = [
  {
    slug: "cory-gautereaux",
    name: "Cory Gautereaux",
    role: "Founder & President",
    bio: "Army veteran with extensive experience in border operations and intelligence analysis. Leads strategic direction and field work for The GOAT Initiative.",
    specializations: ["Strategic Intelligence", "Field Operations", "Threat Analysis"],
    experience: "Military service & operational leadership",
  },
  {
    slug: "dan-conchas",
    name: "Dan Conchas",
    role: "Vice President",
    bio: "Expert in cross-border threat assessment and pattern recognition. Provides executive leadership and oversees intelligence analysis.",
    specializations: ["Threat Analysis", "Executive Leadership", "Strategic Planning"],
    experience: "Strategic operations",
  },
  {
    slug: "tayler-james",
    name: "Tayler James",
    role: "Board Secretary",
    bio: "Board Secretary for The GOAT Initiative. Keeps the corporate record, certifies board actions, and carries the organization's formal correspondence. Oversees filings, the continuity of the minutes, and the paper trail behind partnerships and written referrals.",
    specializations: ["Board Governance", "Official Records", "Formal Correspondence", "Organizational Compliance"],
    experience: "Board administration",
  },
  {
    slug: "hels-apffel",
    name: "Hels Apffel",
    role: "Director of Strategic Intelligence",
    bio: "Director of Strategic Intelligence for The GOAT Initiative. Sets what the organization watches, fuses field reporting into a single threat picture, and turns raw border observations into assessments leadership can act on. Owns the analytic line from the first report through the finished briefing.",
    specializations: ["Strategic Intelligence", "Threat Fusion", "Collection Priorities", "Finished Intelligence"],
    experience: "Intelligence direction",
  },
];

export default function OperativesPage() {
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
              LEADERSHIP
            </p>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              THE <span className="text-primary text-glow-sm">OFFICERS</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Cory Gautereaux, Dan Conchas, Tayler James, and Hels Apffel run The GOAT Initiative.
              The team documents what it finds along the border and sends that record to law enforcement.
              It does not arrest, detain, or take custody.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.slug}
                id={leader.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-dark-100/80 border border-gray-800 rounded-sm overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]">
                  <div className="h-1 bg-gradient-to-r from-primary via-success to-primary opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="p-5 sm:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-dark border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary transition-colors flex-shrink-0">
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="font-heading text-lg sm:text-xl text-gray-100 group-hover:text-primary transition-colors">
                          {leader.name}
                        </h2>
                        <p className="text-sm text-primary tracking-wide">{leader.role}</p>
                      </div>
                    </div>

                    <p className="text-gray-400 leading-relaxed mb-6">
                      {leader.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {leader.specializations.map((spec) => (
                        <span key={spec} className="px-2 py-1 text-xs font-mono tracking-wide rounded-sm bg-primary/10 text-primary">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <span className="font-mono text-xs text-gray-500">{leader.experience}</span>
                    </div>
                  </div>
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
              INTERESTED IN <span className="text-primary">JOINING</span>?
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              The organization looks for people with experience in the military, law enforcement, or intelligence work.
            </p>
            <Link
              href="/contact"
              className="px-6 py-3 font-heading text-sm uppercase tracking-widest border border-primary text-primary hover:bg-primary/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
