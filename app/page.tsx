"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { RedactedText } from "@/components/RedactedText";

// TGI Emblem SVG Component
function TGIEmblem() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-72 h-72 md:w-96 md:h-96 mx-auto"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10 drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]"
      >
        {/* Outer Shield Circle */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="url(#shieldGradient)"
          strokeWidth="3"
          className="drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]"
        />
        
        {/* Inner Shield Ring */}
        <circle
          cx="200"
          cy="200"
          r="165"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          strokeDasharray="8 4"
          opacity="0.5"
        />
        
        {/* Orbiting Hexagons - Pre-computed positions to avoid hydration mismatch */}
        <g className="animate-spin" style={{ transformOrigin: "200px 200px", animationDuration: "30s" }}>
          {/* 0°: x=375, y=200 */}
          <polygon points="375,192 382,196 382,204 375,208 368,204 368,196" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          {/* 60°: x=287.5, y=351.6 */}
          <polygon points="287.5,343.6 294.5,347.6 294.5,355.6 287.5,359.6 280.5,355.6 280.5,347.6" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          {/* 120°: x=112.5, y=351.6 */}
          <polygon points="112.5,343.6 119.5,347.6 119.5,355.6 112.5,359.6 105.5,355.6 105.5,347.6" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          {/* 180°: x=25, y=200 */}
          <polygon points="25,192 32,196 32,204 25,208 18,204 18,196" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          {/* 240°: x=112.5, y=48.4 */}
          <polygon points="112.5,40.4 119.5,44.4 119.5,52.4 112.5,56.4 105.5,52.4 105.5,44.4" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          {/* 300°: x=287.5, y=48.4 */}
          <polygon points="287.5,40.4 294.5,44.4 294.5,52.4 287.5,56.4 280.5,52.4 280.5,44.4" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        </g>
        
        {/* Counter-rotating hexagons - Pre-computed positions */}
        <g className="animate-spin" style={{ transformOrigin: "200px 200px", animationDuration: "20s", animationDirection: "reverse" }}>
          {/* 30°: x=334.2, y=277.5 */}
          <polygon points="334.2,271.5 339.2,274.5 339.2,280.5 334.2,283.5 329.2,280.5 329.2,274.5" fill="#00d4ff" opacity="0.3" />
          {/* 90°: x=200, y=355 */}
          <polygon points="200,349 205,352 205,358 200,361 195,358 195,352" fill="#00d4ff" opacity="0.3" />
          {/* 150°: x=65.8, y=277.5 */}
          <polygon points="65.8,271.5 70.8,274.5 70.8,280.5 65.8,283.5 60.8,280.5 60.8,274.5" fill="#00d4ff" opacity="0.3" />
          {/* 210°: x=65.8, y=122.5 */}
          <polygon points="65.8,116.5 70.8,119.5 70.8,125.5 65.8,128.5 60.8,125.5 60.8,119.5" fill="#00d4ff" opacity="0.3" />
          {/* 270°: x=200, y=45 */}
          <polygon points="200,39 205,42 205,48 200,51 195,48 195,42" fill="#00d4ff" opacity="0.3" />
          {/* 330°: x=334.2, y=122.5 */}
          <polygon points="334.2,116.5 339.2,119.5 339.2,125.5 334.2,128.5 329.2,125.5 329.2,119.5" fill="#00d4ff" opacity="0.3" />
        </g>
        
        {/* Stylized Goat Head - Abstract cyber lines */}
        <g stroke="#00d4ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Horn - Data wave style */}
          <path d="M120 140 Q100 100 95 60 Q100 80 110 95 Q115 75 130 55" className="drop-shadow-[0_0_5px_rgba(0,212,255,0.8)]">
            <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="2s" fill="freeze" />
          </path>
          <path d="M130 55 Q140 45 155 50" opacity="0.7">
            <animate attributeName="stroke-dasharray" values="0,50;50,0" dur="1.5s" begin="0.5s" fill="freeze" />
          </path>
          {/* Horn data waves */}
          <path d="M105 85 L95 80 M115 70 L105 65 M125 58 L118 52" strokeWidth="1" opacity="0.5" />
          
          {/* Right Horn - Data wave style */}
          <path d="M280 140 Q300 100 305 60 Q300 80 290 95 Q285 75 270 55" className="drop-shadow-[0_0_5px_rgba(0,212,255,0.8)]">
            <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="2s" fill="freeze" />
          </path>
          <path d="M270 55 Q260 45 245 50" opacity="0.7">
            <animate attributeName="stroke-dasharray" values="0,50;50,0" dur="1.5s" begin="0.5s" fill="freeze" />
          </path>
          {/* Horn data waves */}
          <path d="M295 85 L305 80 M285 70 L295 65 M275 58 L282 52" strokeWidth="1" opacity="0.5" />
          
          {/* Head outline - angular cyber style */}
          <path d="M120 140 L140 160 L160 175 L200 185 L240 175 L260 160 L280 140" strokeWidth="2.5">
            <animate attributeName="stroke-dasharray" values="0,300;300,0" dur="2s" begin="0.3s" fill="freeze" />
          </path>
          
          {/* Face structure */}
          <path d="M160 175 L170 210 L185 235 L200 245 L215 235 L230 210 L240 175" strokeWidth="2">
            <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="1.8s" begin="0.5s" fill="freeze" />
          </path>
          
          {/* Eyes - hexagonal */}
          <polygon points="155,185 165,180 175,185 175,195 165,200 155,195" strokeWidth="1.5" fill="rgba(0,212,255,0.1)">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze" />
          </polygon>
          <polygon points="225,185 235,180 245,185 245,195 235,200 225,195" strokeWidth="1.5" fill="rgba(0,212,255,0.1)">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze" />
          </polygon>
          {/* Eye glow dots */}
          <circle cx="165" cy="190" r="3" fill="#00d4ff">
            <animate attributeName="opacity" values="0;1;0.5;1" dur="2s" begin="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="235" cy="190" r="3" fill="#00d4ff">
            <animate attributeName="opacity" values="0;1;0.5;1" dur="2s" begin="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Nose bridge / data line */}
          <path d="M200 190 L200 220" strokeWidth="1" opacity="0.6" />
          <path d="M190 225 L200 235 L210 225" strokeWidth="1.5" />
          
          {/* Chin / beard lines */}
          <path d="M185 245 L200 270 L215 245" strokeWidth="1" opacity="0.5" />
          <path d="M195 255 L200 280 L205 255" strokeWidth="1" opacity="0.3" />
        </g>
        
        {/* Circuit patterns around head */}
        <g stroke="#00d4ff" strokeWidth="0.5" opacity="0.4">
          <path d="M130 180 L110 180 L110 200 L95 200" />
          <path d="M270 180 L290 180 L290 200 L305 200" />
          <circle cx="95" cy="200" r="2" fill="#00d4ff" />
          <circle cx="305" cy="200" r="2" fill="#00d4ff" />
        </g>
        
        {/* "TGI" Text at Top */}
        <text
          x="200"
          y="55"
          textAnchor="middle"
          className="font-heading"
          fill="#00d4ff"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="8"
        >
          TGI
        </text>
        
        {/* "GOAT INITIATIVE" Text at Bottom */}
        <text
          x="200"
          y="340"
          textAnchor="middle"
          className="font-heading"
          fill="#00d4ff"
          fontSize="13"
          fontWeight="500"
          letterSpacing="3"
        >
          GOAT INITIATIVE
        </text>
        
        {/* Decorative bottom arc */}
        <path
          d="M90 320 Q200 355 310 320"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Shield segments */}
        <path d="M200 25 L200 35" stroke="#00d4ff" strokeWidth="2" />
        <path d="M200 365 L200 375" stroke="#00d4ff" strokeWidth="2" />
        <path d="M25 200 L35 200" stroke="#00d4ff" strokeWidth="2" />
        <path d="M365 200 L375 200" stroke="#00d4ff" strokeWidth="2" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#00ff9f" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}

// Connecting Dots Background Animation
function ConnectingDotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.5)";
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}


export default function Home() {
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const handlePortalClick = () => {
    setShowAccessDenied(true);
  };

  return (
    <>
      {/* Access Denied Modal */}
      <AnimatePresence>
        {showAccessDenied && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/90 backdrop-blur-sm"
            onClick={() => setShowAccessDenied(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-md w-full bg-dark-100 border-2 border-accent rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning stripe */}
              <div className="h-2 bg-gradient-to-r from-accent via-yellow-500 to-accent" />
              
              {/* Content */}
              <div className="p-8 text-center">
                {/* Icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 border-2 border-accent rounded-full mb-6"
                >
                  <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </motion.div>
                
                {/* Title */}
                <h3 className="font-heading text-2xl text-accent tracking-wider mb-2">
                  ACCESS DENIED
                </h3>
                
                {/* Error code */}
                <p className="font-mono text-xs text-gray-500 mb-4">
                  ERROR CODE: TGI-401-UNAUTHORIZED
                </p>
                
                {/* Message */}
                <p className="text-gray-400 mb-6">
                  This portal requires authorized credentials. Please contact TGI administration for access permissions.
                </p>
                
                {/* Contact info */}
                <div className="bg-dark/50 border border-gray-800 rounded-sm p-4 mb-6">
                  <p className="font-mono text-xs text-gray-500 mb-2">REQUEST ACCESS:</p>
                  <Link 
                    href="/contact" 
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setShowAccessDenied(false)}
                  >
                    Contact TGI Administration →
                  </Link>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setShowAccessDenied(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all font-heading text-sm tracking-wider"
                >
                  DISMISS
                </button>
              </div>
              
              {/* Bottom stripe */}
              <div className="h-1 bg-accent/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
        {/* Connecting Dots Background */}
        <ConnectingDotsBackground />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* TGI Emblem */}
          <TGIEmblem />
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.2em] mt-8 mb-6"
          >
            <span className="text-gray-100">THE </span>
            <span className="gradient-text">GOAT</span>
            <span className="text-gray-100"> INITIATIVE</span>
          </motion.h1>
          
          {/* Typing Animation Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="h-16 md:h-12 flex items-center justify-center mb-8"
          >
            <TypeAnimation
              sequence={[
                "SECURE THE BORDER.",
                2000,
                "GATHER THE INTEL.",
                2000,
                "DEFEND THE HOMELAND.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="font-heading text-lg md:text-xl text-primary tracking-widest text-glow-sm"
            />
          </motion.div>
          
          {/* Mission Paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <p className="text-gray-400 leading-relaxed text-base md:text-lg">
              Our mission is to safeguard national security along the U.S./Mexico border 
              through comprehensive intelligence gathering — identifying Special Interest 
              Aliens (SIAs), known and unknown terrorist risks, suspicious patterns, and 
              potential homeland attack vectors — and delivering actionable insights to 
              local, state, and federal law enforcement partners.
            </p>
          </motion.div>
          
          {/* Redacted Text Example */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mb-10 p-4 bg-dark-100/50 border border-primary/20 rounded-sm inline-block"
          >
            <p className="text-sm text-gray-500 font-mono">
              <span className="text-accent text-xs tracking-wider mr-2">[INTEL BRIEF]</span>
              Intelligence on{" "}
              <RedactedText 
                revealed="migration" 
                redacted="██████████" 
              />{" "}
              patterns reveals{" "}
              <RedactedText 
                revealed="emerging threat" 
                redacted="████████████████" 
              />{" "}
              risks.
              <span className="text-gray-600 text-xs ml-2">(tap to reveal)</span>
            </p>
          </motion.div>
          
          {/* Enter Secure Portal Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <motion.button
              onClick={handlePortalClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative group px-8 py-4 font-heading text-sm uppercase tracking-[0.3em] bg-primary/10 border-2 border-primary text-primary overflow-hidden"
              style={{
                clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              }}
            >
              {/* Glow effect */}
              <span className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500" />
              
              {/* Animated border glow */}
              <motion.span
                className="absolute inset-0 border-2 border-primary opacity-50"
                animate={{
                  boxShadow: [
                    "0 0 10px #00d4ff, inset 0 0 10px rgba(0,212,255,0.1)",
                    "0 0 25px #00d4ff, inset 0 0 25px rgba(0,212,255,0.2)",
                    "0 0 10px #00d4ff, inset 0 0 10px rgba(0,212,255,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                }}
              />
              
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                ENTER SECURE PORTAL
              </span>
            </motion.button>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-primary/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Threat Intelligence Operations Section */}
      <section id="operations-section" className="py-24 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #00d4ff 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #ff2a6d 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-heading text-xs text-accent tracking-widest">
                THREAT INTELLIGENCE OPERATIONS
              </span>
            </motion.div>
            
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-gray-100 tracking-wider mb-4">
              Connecting the Dots –{" "}
              <span className="text-primary text-glow-sm">Preempting Homeland Threats</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Advanced intelligence fusion to identify, track, and neutralize emerging threats before they materialize.
            </p>
          </motion.div>

          {/* Global Intel Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="relative bg-dark-100/60 border border-primary/20 rounded-sm p-4 md:p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-heading text-xs md:text-sm text-primary tracking-widest">GLOBAL INTELLIGENCE NETWORK</span>
                </div>
                <span className="font-mono text-[10px] md:text-xs text-gray-500">35 COUNTRIES DOCUMENTED</span>
              </div>
              
              {/* World Map Container */}
              <div className="relative aspect-[2/1] w-full rounded overflow-hidden bg-dark-100">
                {/* Real world map image */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
                  alt="World Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                  style={{ filter: 'invert(1) sepia(100%) saturate(300%) hue-rotate(160deg) brightness(0.7)' }}
                />
                
                {/* Overlay for color adjustment */}
                <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark/50" />
                
                {/* SVG overlay for markers */}
                <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity="1" />
                      <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Country markers - using standard map coordinates (longitude/latitude converted) */}
                  {/* x = (longitude + 180) * (1000/360), y = (90 - latitude) * (500/180) */}
                  {[
                    // Americas
                    { x: 305, y: 185, name: "Mexico" },          // -102, 23
                    { x: 320, y: 210, name: "Honduras" },        // -87, 15
                    { x: 315, y: 220, name: "Nicaragua" },       // -85, 13
                    { x: 360, y: 295, name: "Peru" },            // -76, -10
                    // Europe
                    { x: 498, y: 125, name: "United Kingdom" },  // -1, 54
                    { x: 485, y: 130, name: "Northern Ireland" },// -7, 55
                    { x: 525, y: 130, name: "Lithuania" },       // 24, 55
                    { x: 515, y: 155, name: "Italy" },           // 12, 42
                    { x: 520, y: 165, name: "Malta" },           // 14, 36
                    // Africa
                    { x: 465, y: 200, name: "Sahrawi Arab" },    // -13, 25
                    { x: 475, y: 195, name: "Mauritania" },      // -10, 20
                    { x: 455, y: 210, name: "Senegal" },         // -17, 14
                    { x: 520, y: 175, name: "Tunisia" },         // 9, 34
                    { x: 465, y: 230, name: "Togo" },            // 1, 8
                    { x: 475, y: 225, name: "Nigeria" },         // 8, 10
                    { x: 455, y: 235, name: "Liberia" },         // -10, 6
                    { x: 545, y: 210, name: "Sudan" },           // 30, 15
                    // Middle East
                    { x: 545, y: 160, name: "Turkey" },          // 35, 39
                    { x: 555, y: 175, name: "Syria" },           // 38, 35
                    { x: 555, y: 185, name: "Jordan" },          // 36, 31
                    { x: 565, y: 200, name: "Saudi Arabia" },    // 45, 24
                    { x: 580, y: 195, name: "UAE" },             // 54, 24
                    // South/Central Asia
                    { x: 605, y: 175, name: "Uzbekistan" },      // 64, 41
                    { x: 615, y: 185, name: "Pakistan" },        // 70, 30
                    { x: 640, y: 180, name: "Nepal" },           // 84, 28
                    { x: 640, y: 205, name: "India" },           // 78, 22
                    { x: 640, y: 235, name: "Sri Lanka" },       // 81, 7
                    // East/Southeast Asia
                    { x: 730, y: 165, name: "Japan" },           // 138, 36
                    { x: 690, y: 215, name: "Vietnam" },         // 108, 16
                  ].map((country, i) => (
                    <g key={i} filter="url(#glow)">
                      {/* Outer pulse ring */}
                      <circle cx={country.x} cy={country.y} r="15" fill="none" stroke="#00d4ff" strokeWidth="1.5">
                        <animate attributeName="r" values="6;18;6" dur="3s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                      </circle>
                      {/* Glow circle */}
                      <circle cx={country.x} cy={country.y} r="10" fill="url(#markerGlow)" />
                      {/* Main dot */}
                      <circle cx={country.x} cy={country.y} r="5" fill="#00d4ff" />
                      {/* Center highlight */}
                      <circle cx={country.x} cy={country.y} r="2" fill="#ffffff" />
                    </g>
                  ))}
                  
                  {/* Connection lines showing intel flow */}
                  <g stroke="#00d4ff" strokeWidth="1" opacity="0.3" fill="none">
                    {/* Americas to Africa */}
                    <path d="M305,185 Q400,150 465,200" strokeDasharray="8 4">
                      <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
                    </path>
                    {/* Africa to Middle East */}
                    <path d="M520,175 Q540,170 545,160" strokeDasharray="8 4">
                      <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
                    </path>
                    {/* Middle East to South Asia */}
                    <path d="M580,195 Q600,185 615,185" strokeDasharray="8 4">
                      <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
                    </path>
                    {/* South Asia to East Asia */}
                    <path d="M640,205 Q680,200 690,215" strokeDasharray="8 4">
                      <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
                    </path>
                  </g>
                </svg>
                
                {/* Scanline overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)',
                  }}
                />
                
                {/* Legend */}
                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 flex flex-wrap items-center gap-3 md:gap-6 bg-dark/70 backdrop-blur-sm px-3 py-2 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="font-mono text-[8px] md:text-[10px] text-gray-300">DOCUMENTED ORIGIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                    <span className="font-mono text-[8px] md:text-[10px] text-gray-300">INTEL PATHWAY</span>
                  </div>
                </div>
                
                {/* Stats overlay */}
                <div className="absolute top-2 md:top-4 right-2 md:right-4 text-right bg-dark/70 backdrop-blur-sm px-3 py-2 rounded">
                  <p className="font-heading text-xl md:text-2xl text-primary text-glow-sm">35</p>
                  <p className="font-mono text-[8px] md:text-[10px] text-gray-300">COUNTRIES</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Threat Intel Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                id: "TI-001",
                title: "SIA & Watchlist Monitoring",
                description: "Tracking Special Interest Aliens and flagged individuals from high-risk regions crossing the border.",
                redactedPrefix: "Potential connections to",
                redactedRevealed: "extremist cells",
                redactedSuffix: "flagged for review.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                stats: "2,400+ PROFILES MONITORED",
              },
              {
                id: "TI-002",
                title: "Pattern & Puzzle Analysis",
                description: "Piecing together disparate intel to uncover emerging terror cells, travel anomalies, and potential attack plans.",
                redactedPrefix: "Network analysis reveals",
                redactedRevealed: "coordinated movements",
                redactedSuffix: "across sectors.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                ),
                stats: "847 PATTERNS IDENTIFIED",
              },
              {
                id: "TI-003",
                title: "Real-Time Fusion & Sharing",
                description: "Delivering actionable, time-sensitive intelligence to law enforcement partners to neutralize threats.",
                redactedPrefix: "Priority alerts on",
                redactedRevealed: "imminent threats",
                redactedSuffix: "distributed.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                stats: "< 15 MIN RESPONSE TIME",
              },
              {
                id: "TI-004",
                title: "Border Vulnerability Mapping",
                description: "Identifying unguarded sectors and smuggling vectors exploited by adversaries.",
                redactedPrefix: "Critical gaps in",
                redactedRevealed: "surveillance coverage",
                redactedSuffix: "documented.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                stats: "1,954 MILES ANALYZED",
              },
            ].map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card with glowing border on hover */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-dark-100/80 backdrop-blur-sm border border-gray-800 rounded-sm p-6 lg:p-8 h-full
                             hover:border-primary/60 transition-all duration-500
                             hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]"
                >
                  {/* Pulse animation overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      boxShadow: [
                        "inset 0 0 20px rgba(0,212,255,0)",
                        "inset 0 0 40px rgba(0,212,255,0.1)",
                        "inset 0 0 20px rgba(0,212,255,0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-primary group-hover:text-glow transition-all duration-300">
                        {card.icon}
                      </div>
                      <span className="font-mono text-xs text-gray-600 tracking-wider">
                        {card.id}
                      </span>
                    </div>
                    
                    {/* THREAT VECTOR Badge */}
                    <motion.div
                      animate={{
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 border border-accent/40 rounded-sm"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                      </span>
                      <span className="font-heading text-[10px] text-accent tracking-widest">
                        THREAT VECTOR
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-heading text-xl text-gray-100 mb-3 group-hover:text-primary transition-colors duration-300 tracking-wide">
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {card.description}
                  </p>
                  
                  {/* Redacted Intel Line */}
                  <p className="text-xs text-gray-500 font-mono leading-relaxed mb-6 p-2 bg-dark/50 border border-gray-800 rounded-sm">
                    <span className="text-accent text-[10px] mr-1">[INTEL]</span>
                    {card.redactedPrefix}{" "}
                    <RedactedText 
                      revealed={card.redactedRevealed} 
                      variant="accent"
                    />{" "}
                    {card.redactedSuffix}
                  </p>
                  
                  {/* Stats Footer */}
                  <div className="pt-4 border-t border-gray-800 group-hover:border-primary/30 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-500 tracking-wide">
                        {card.stats}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-success rounded-full animate-pulse"></span>
                        <span className="w-1 h-1 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1 h-1 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        <span className="font-mono text-[10px] text-success ml-1">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 group-hover:border-primary transition-colors duration-300" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 group-hover:border-primary transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 group-hover:border-primary transition-colors duration-300" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 group-hover:border-primary transition-colors duration-300" />
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex items-center justify-center gap-4"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="flex items-center gap-2 px-4 py-2 border border-primary/20 rounded-sm">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-mono text-xs text-gray-400">
                INTELLIGENCE OPERATIONS CENTER • ACTIVE 24/7
              </span>
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>
        </div>
      </section>

      {/* Leadership Operatives Section */}
      <section className="py-24 bg-dark-100/50 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#00d4ff 1px, transparent 1px),
                              linear-gradient(90deg, #00d4ff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm mb-6"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                LEADERSHIP OPERATIVES
              </span>
            </motion.div>
            
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-gray-100 tracking-wider mb-4">
              Elite Analysts &{" "}
              <span className="text-primary text-glow-sm">Field Operatives</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              The tactical minds and field experts driving intelligence operations on the front lines.
            </p>
          </motion.div>

          {/* Operatives Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: "OP-001",
                name: "Cory Gautereaux",
                role: "Founder & President",
                clearance: "ALPHA",
                bio: "Army veteran leading border intel collection and threat pattern analysis.",
                specialization: "Strategic Intelligence",
                redactedDetail: "█████ Operations Experience",
                status: "ACTIVE",
              },
              {
                id: "OP-002",
                name: "Dan Conchas",
                role: "Vice President",
                clearance: "ALPHA",
                bio: "Expert in cross-border threat assessment and executive leadership.",
                specialization: "Executive Leadership",
                redactedDetail: "███ Intel Reports Authored",
                status: "ACTIVE",
              },
              {
                id: "OP-003",
                name: "Gary Wyer",
                role: "Treasurer",
                clearance: "ALPHA",
                bio: "Manages financial operations and resource allocation for field missions.",
                specialization: "Financial Operations",
                redactedDetail: "████ Resources Managed",
                status: "ACTIVE",
              },
            ].map((operative, index) => (
              <motion.div
                key={operative.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-dark/90 backdrop-blur-sm border border-gray-800 rounded-sm overflow-hidden h-full
                             hover:border-primary/60 transition-all duration-500
                             hover:shadow-[0_0_40px_rgba(0,212,255,0.2)]"
                >
                  {/* Top accent line */}
                  <div className="h-1 bg-gradient-to-r from-primary via-success to-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Avatar Section */}
                  <div className="relative p-6 pb-4">
                    {/* Avatar placeholder */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
                      <div className="relative w-full h-full bg-dark-100 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                        <svg className="w-10 h-10 text-primary/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      {/* Status indicator */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-dark border-2 border-success rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Operative ID */}
                    <div className="text-center mb-2">
                      <span className="font-mono text-[10px] text-gray-600 tracking-wider">{operative.id}</span>
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-heading text-lg text-gray-100 text-center mb-1 group-hover:text-primary transition-colors">
                      {operative.name}
                    </h3>
                    
                    {/* Role */}
                    <p className="text-xs text-primary text-center tracking-wider mb-3">
                      {operative.role}
                    </p>
                    
                    {/* Clearance Badge */}
                    <div className="flex justify-center mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/40 rounded-sm">
                        <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-heading text-[10px] text-success tracking-widest">
                          CLEARANCE: {operative.clearance}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio Section */}
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-400 text-center leading-relaxed mb-3">
                      {operative.bio}
                    </p>
                    
                    {/* Specialization tag */}
                    <div className="flex justify-center mb-3">
                      <span className="px-2 py-1 bg-primary/10 text-[10px] text-primary font-mono tracking-wider rounded-sm">
                        {operative.specialization}
                      </span>
                    </div>
                    
                    {/* Redacted detail */}
                    <div className="text-center">
                      <span className="font-mono text-xs text-gray-600 tracking-wide group-hover:text-gray-500 transition-colors">
                        {operative.redactedDetail}
                      </span>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-6 py-3 bg-dark-100/50 border-t border-gray-800 group-hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        <span className="font-mono text-[10px] text-success tracking-wider">
                          {operative.status}
                        </span>
                      </div>
                      <Link 
                        href="/operatives"
                        className="font-mono text-[10px] text-gray-500 hover:text-primary tracking-wider transition-colors"
                      >
                        VIEW DOSSIER →
                      </Link>
                    </div>
                  </div>
                  
                  {/* CLEARANCE VERIFIED Stamp - appears on hover */}
                  <motion.div
                    initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
                    whileHover={{ opacity: 1, rotate: -12, scale: 1 }}
                    className="absolute top-16 right-2 pointer-events-none"
                  >
                    <div className="px-2 py-1 border-2 border-success/60 rounded-sm bg-dark/80">
                      <span className="font-heading text-[8px] text-success tracking-widest">
                        CLEARANCE VERIFIED
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/operatives"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 font-heading text-sm tracking-wider"
            >
              <span>VIEW ALL OPERATIVES</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Current Operations Section */}
      <section className="py-20 bg-dark-100/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-gray-100 tracking-wider mb-4">
              CURRENT <span className="text-primary">OPERATIONS</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Active missions and ongoing initiatives. Classification level varies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                code: "OP-ALPHA",
                title: "Border Intelligence",
                status: "ACTIVE",
                statusColor: "text-success",
                description: "Real-time intelligence gathering and threat assessment along critical border sectors.",
              },
              {
                code: "OP-BRAVO",
                title: "SIA Tracking",
                status: "IN PROGRESS",
                statusColor: "text-yellow-400",
                description: "Identification and monitoring of Special Interest Aliens and potential security threats.",
              },
              {
                code: "OP-CHARLIE",
                title: "Intel Sharing",
                status: "ACTIVE",
                statusColor: "text-success",
                description: "Coordinated intelligence dissemination to federal, state, and local law enforcement partners.",
              },
            ].map((op, index) => (
              <motion.div
                key={op.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="hud-panel p-6 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-xs text-primary tracking-widest">
                    {op.code}
                  </span>
                  <span className={`font-heading text-xs ${op.statusColor} tracking-wider`}>
                    {op.status}
                  </span>
                </div>
                <h3 className="font-heading text-lg text-gray-100 mb-2 group-hover:text-primary transition-colors">
                  {op.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {op.description}
                </p>
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <Link
                    href="/operations"
                    className="text-xs text-primary hover:text-primary/80 tracking-wider font-medium"
                  >
                    VIEW DETAILS →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-primary/10">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "24/7", label: "MONITORING" },
              { value: "100+", label: "INTEL REPORTS" },
              { value: "50+", label: "AGENCY PARTNERS" },
              { value: "REAL-TIME", label: "THREAT UPDATES" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-2xl md:text-3xl text-primary text-glow-sm">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 tracking-wider mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Donation Call to Action */}
      <section className="py-20 bg-gradient-to-b from-dark to-dark-100/50 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-sm mb-8"
            >
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="font-heading text-xs text-success tracking-widest">
                501(c)(3) TAX DEDUCTIBLE
              </span>
            </motion.div>
            
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-gray-100 tracking-wider mb-4">
              FUND THE <span className="text-primary text-glow-sm">MISSION</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
              Your donation directly funds field operations, equipment, and intelligence 
              gathering that protects our homeland and children.
            </p>
            
            {/* Quick Donate Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { amount: 25, label: "$25" },
                { amount: 50, label: "$50", popular: true },
                { amount: 100, label: "$100" },
                { amount: 250, label: "$250" },
              ].map((tier) => (
                <motion.a
                  key={tier.amount}
                  href={`https://donorbox.org/the-goat-initiative?amount=${tier.amount}&default_interval=o`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-8 py-4 font-heading text-lg tracking-wider transition-all duration-300 rounded-sm
                    ${tier.popular 
                      ? 'bg-gradient-to-r from-primary to-cyan-400 text-dark shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)]' 
                      : 'border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary'
                    }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-success text-dark text-[10px] font-heading tracking-wider rounded-sm">
                      POPULAR
                    </span>
                  )}
                  {tier.label}
                </motion.a>
              ))}
            </div>
            
            {/* Monthly option */}
            <motion.a
              href="https://donorbox.org/the-goat-initiative?default_interval=m"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-dark-100 border border-primary/30 text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300 rounded-sm mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-heading text-sm tracking-wider">BECOME A MONTHLY SUPPORTER</span>
            </motion.a>
            
            {/* Additional info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>EIN: 99-3753614</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>100% Goes to Operations</span>
              </div>
            </div>
            
            {/* Link to full support page */}
            <div className="mt-10">
              <Link
                href="/support"
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                View all donation options and supporter tiers →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
