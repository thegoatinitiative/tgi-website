"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const operatives = [
  {
    id: "OP-001",
    name: "Cory Gautereaux",
    role: "Founder & President",
    clearance: "ALPHA",
    bio: "Army veteran with extensive experience in border operations and intelligence analysis. Leads strategic direction and field operations for The GOAT Initiative.",
    specializations: ["Strategic Intelligence", "Field Operations", "Threat Analysis"],
    experience: "Military service & operational leadership",
    status: "ACTIVE",
    classified: false,
  },
  {
    id: "OP-002",
    name: "Dan Conchas",
    role: "Vice President",
    clearance: "ALPHA",
    bio: "Expert in cross-border threat assessment and pattern recognition systems. Provides executive leadership and oversees intelligence analysis operations.",
    specializations: ["Threat Analysis", "Executive Leadership", "Strategic Planning"],
    experience: "Strategic operations",
    status: "ACTIVE",
    classified: false,
  },
  {
    id: "OP-003",
    name: "Gary Wyer",
    role: "Treasurer",
    clearance: "ALPHA",
    bio: "Manages financial operations and resource allocation for The GOAT Initiative. Ensures fiscal responsibility and operational funding for field missions.",
    specializations: ["Financial Operations", "Resource Management", "Compliance"],
    experience: "12+ years operations",
    status: "ACTIVE",
    classified: false,
  },
  // CLASSIFIED OPERATIVES - Identity Protected
  {
    id: "OP-004",
    name: "[CLASSIFIED]",
    role: "Senior Intelligence Analyst",
    clearance: "SIGMA",
    bio: "Former federal agency intelligence analyst with expertise in counterterrorism and transnational threat networks. Provides critical analysis support from an undisclosed location.",
    specializations: ["Counterterrorism", "Signal Intelligence", "Network Analysis"],
    experience: "12+ years federal service",
    status: "ACTIVE",
    classified: true,
    codename: "PHANTOM",
    branch: "Federal Agency",
  },
  {
    id: "OP-005",
    name: "[CLASSIFIED]",
    role: "Intelligence Analyst",
    clearance: "SIGMA",
    bio: "Active federal analyst specializing in border threat assessment and human trafficking networks. Identity protected due to ongoing agency operations.",
    specializations: ["Human Trafficking Intel", "Border Analysis", "Pattern Recognition"],
    experience: "8+ years federal service",
    status: "ACTIVE",
    classified: true,
    codename: "SPECTRE",
    branch: "Federal Agency",
  },
  {
    id: "OP-006",
    name: "[CLASSIFIED]",
    role: "Field Operations Specialist",
    clearance: "DELTA",
    bio: "Former U.S. Army Ranger with multiple deployments. Provides tactical expertise and field reconnaissance capabilities for high-risk operations.",
    specializations: ["Tactical Operations", "Reconnaissance", "Direct Action"],
    experience: "10+ years military",
    status: "ACTIVE",
    classified: true,
    codename: "REAPER",
    branch: "U.S. Army – 75th Ranger Regiment",
  },
  {
    id: "OP-007",
    name: "[CLASSIFIED]",
    role: "Special Operations Advisor",
    clearance: "DELTA",
    bio: "Former U.S. Army Special Forces (Green Beret) with extensive unconventional warfare experience. Advises on strategic operations and threat mitigation.",
    specializations: ["Unconventional Warfare", "Foreign Internal Defense", "Strategic Advisory"],
    experience: "14+ years SOF",
    status: "ACTIVE",
    classified: true,
    codename: "VIPER",
    branch: "U.S. Army – Special Forces",
  },
  {
    id: "OP-008",
    name: "[CLASSIFIED]",
    role: "Maritime Operations Specialist",
    clearance: "DELTA",
    bio: "Former Marine Corps Forces Special Operations Command (MARSOC) operator. Specializes in coastal surveillance and maritime interdiction intelligence.",
    specializations: ["Maritime Operations", "Coastal Surveillance", "Direct Action"],
    experience: "11+ years USMC/MARSOC",
    status: "ACTIVE",
    classified: true,
    codename: "TRITON",
    branch: "USMC – MARSOC",
  },
];

export default function OperativesPage() {
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm mb-8"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                PERSONNEL DOSSIERS
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              OUR <span className="text-primary text-glow-sm">OPERATIVES</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Elite analysts and field operatives driving intelligence operations on the front lines.
              Some identities remain classified for operational security.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Operatives Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {operatives.map((operative, index) => (
              <motion.div
                key={operative.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className={`relative bg-dark-100/80 border rounded-sm overflow-hidden
                               transition-all duration-500
                               ${operative.classified 
                                 ? 'border-accent/30 hover:border-accent/60 hover:shadow-[0_0_40px_rgba(255,42,109,0.15)]' 
                                 : 'border-gray-800 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]'}`}>
                  
                  {/* Top accent */}
                  <div className={`h-1 opacity-50 group-hover:opacity-100 transition-opacity ${
                    operative.classified 
                      ? 'bg-gradient-to-r from-accent via-yellow-500 to-accent' 
                      : 'bg-gradient-to-r from-primary via-success to-primary'
                  }`} />
                  
                  <div className="p-5 sm:p-8">
                    {/* Classified Banner */}
                    {operative.classified && (
                      <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-accent/10 border border-accent/20 rounded-sm">
                        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-heading text-[10px] text-accent tracking-[0.2em]">IDENTITY PROTECTED</span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          {operative.classified ? (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-dark border-2 border-accent/30 rounded-full flex items-center justify-center group-hover:border-accent transition-colors overflow-hidden">
                              {/* Glitch/static effect for classified */}
                              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50" />
                              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-accent/60 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-dark border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-dark border-2 rounded-full flex items-center justify-center ${
                            operative.classified ? 'border-accent' : 'border-success'
                          }`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${
                              operative.classified ? 'bg-accent' : 'bg-success'
                            }`} />
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-mono text-[10px] text-gray-600 tracking-wider">{operative.id}</span>
                          {operative.classified ? (
                            <>
                              <h3 className="font-heading text-lg sm:text-xl text-accent group-hover:text-accent transition-colors">
                                {operative.codename ? `"${operative.codename}"` : operative.name}
                              </h3>
                              <p className="text-sm text-gray-500 tracking-wide">{operative.role}</p>
                              <p className="text-[10px] text-accent/60 font-mono mt-1">{operative.branch}</p>
                            </>
                          ) : (
                            <>
                              <h3 className="font-heading text-lg sm:text-xl text-gray-100 group-hover:text-primary transition-colors">
                                {operative.name}
                              </h3>
                              <p className="text-sm text-primary tracking-wide">{operative.role}</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Clearance Badge */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm self-start ${
                        operative.classified 
                          ? 'bg-accent/10 border border-accent/40' 
                          : 'bg-success/10 border border-success/40'
                      }`}>
                        <svg className={`w-3 h-3 ${operative.classified ? 'text-accent' : 'text-success'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className={`font-heading text-[10px] tracking-widest ${
                          operative.classified ? 'text-accent' : 'text-success'
                        }`}>
                          {operative.clearance}
                        </span>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {operative.bio}
                    </p>
                    
                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {operative.specializations.map((spec, i) => (
                        <span key={i} className={`px-2 py-1 text-xs font-mono tracking-wide rounded-sm ${
                          operative.classified 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {spec}
                        </span>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-gray-500">{operative.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          operative.classified ? 'bg-accent' : 'bg-success'
                        }`} />
                        <span className={`font-mono text-[10px] tracking-wider ${
                          operative.classified ? 'text-accent' : 'text-success'
                        }`}>{operative.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
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
              We&apos;re always looking for dedicated individuals with relevant experience in 
              military, law enforcement, or intelligence fields.
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
