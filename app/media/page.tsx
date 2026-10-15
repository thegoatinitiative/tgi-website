"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { videos, watchUrl } from "@/lib/videos";

// Video Card Component
function VideoCard({ video, index }: { video: (typeof videos)[number]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-dark-100/80 border border-gray-800 rounded-sm overflow-hidden
                      hover:border-primary/60 transition-all duration-500
                      hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]">
        
        {/* Video Thumbnail / Embed */}
        <div className="relative aspect-video overflow-hidden">
          {showVideo ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Thumbnail */}
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Scanline overlay on hover */}
              <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.03) 2px, rgba(0,212,255,0.03) 4px)',
                    animation: 'scanlines 0.5s linear infinite',
                  }}
                />
              </div>
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/30 transition-colors" />
              
              {/* Source badge */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 px-2 py-1 bg-accent/80 backdrop-blur-sm rounded-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  <span className="font-heading text-[10px] text-white tracking-widest">
                    {video.source}
                  </span>
                </div>
              </div>
              
              {/* Play Button */}
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                aria-label={`Play ${video.title}`}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center
                             shadow-[0_0_30px_rgba(0,212,255,0.5)] group-hover:shadow-[0_0_50px_rgba(0,212,255,0.7)]
                             transition-shadow duration-300"
                >
                  <svg className="w-6 h-6 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </button>
              
              {/* Duration / Category badge */}
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-1 bg-dark/80 backdrop-blur-sm font-mono text-[10px] text-primary tracking-wider rounded-sm">
                  {video.category}
                </span>
              </div>
            </>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-heading text-lg text-gray-100 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {video.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {video.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gray-600">{video.source} · {video.date}</span>
            </div>
            
            <a
              href={watchUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-[10px] text-primary tracking-wider hover:text-glow-sm transition-all"
            >
              WATCH ON YOUTUBE
            </a>
          </div>
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300" />
      </div>
    </motion.div>
  );
}

export default function MediaPage() {
  return (
    <div className="min-h-screen py-12">
      {/* Hero Header */}
      <section className="py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #00d4ff 1px, transparent 1px),
                              radial-gradient(circle at 80% 50%, #ff2a6d 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Classification Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 border border-accent/30 rounded-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-heading text-sm text-accent tracking-[0.3em]">
                PUBLIC BRIEFINGS
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </motion.div>
            
            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              Video Briefings{" "}
              <span className="text-primary text-glow-sm">&</span>{" "}
              <br className="hidden md:block" />
              Field Reports
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              Footage and interviews on child trafficking, human trafficking, border crossings, and what the team finds in the field.
            </p>
            
            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: videos.length.toString(), label: "BRIEFINGS" },
                { value: "HD", label: "QUALITY" },
                { value: "24/7", label: "ACCESS" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="font-heading text-2xl text-primary text-glow-sm">{stat.value}</p>
                  <p className="font-mono text-xs text-gray-500 tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Video Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter/Sort Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-800"
          >
            <div className="flex items-center gap-4">
              <span className="font-heading text-sm text-gray-400 tracking-wider">
                SHOWING {videos.length} BRIEFINGS
              </span>
            </div>
            

          </motion.div>
          
          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
          
          {/* Load More / Coming Soon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 border border-dashed border-gray-700 rounded-sm">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="font-mono text-sm text-gray-500 tracking-wider">
                MORE BRIEFINGS ARE ADDED AS THEY ARE PUBLISHED.
              </span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* YouTube Channel CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative hud-panel p-10 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              
              <h3 className="font-heading text-2xl text-gray-100 tracking-wider mb-3">
                SUBSCRIBE FOR <span className="text-primary">INTEL UPDATES</span>
              </h3>
              
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                New briefings are posted on the YouTube channel.
              </p>
              
              <a
                href="https://www.youtube.com/@TheGoatInitiative"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-heading text-sm tracking-wider transition-colors rounded-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                SUBSCRIBE TO CHANNEL
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
