"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const SUBSTACK_URL = "https://substack.com/@thecorygoat";

// Add your articles here - easy to update!
const articles = [
  {
    title: "Example Article Title",
    description: "This is an example article description. Replace this with your actual articles.",
    url: "https://example.com/article",
    date: "2024-01-15",
    source: "External",
  },
  // Add more articles here as needed
  // {
  //   title: "Another Article",
  //   description: "Description here",
  //   url: "https://example.com",
  //   date: "2024-01-20",
  //   source: "External",
  // },
];

export default function ArticlesPage() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                INTELLIGENCE BRIEFINGS
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              ARTICLES & <span className="text-primary text-glow-sm">BRIEFINGS</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Stay informed with the latest intelligence briefings, analysis, and articles 
              from The Goat Initiative and trusted sources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Substack Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-dark-100/80 border border-primary/20 rounded-sm overflow-hidden">
              {/* Header stripe */}
              <div className="h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary" />
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl text-gray-100 tracking-wider">SUBSTACK BRIEFINGS</h2>
                    <p className="text-xs text-gray-500">Exclusive intelligence updates</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Subscribe to receive classified intelligence briefings, field reports, 
                  and exclusive updates from TGI operations directly to your inbox.
                </p>
                
                {/* Substack embed */}
                <div className="mb-6 bg-dark border border-gray-800 rounded-sm overflow-hidden">
                  <iframe 
                    src="https://thecorygoat.substack.com/embed" 
                    width="100%" 
                    height="400" 
                    style={{ border: 'none', background: 'transparent' }}
                    frameBorder="0" 
                    scrolling="no"
                    className="w-full"
                  />
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href={SUBSTACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-cyan-400 text-dark font-heading text-sm tracking-wider rounded-sm hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                    SUBSCRIBE ON SUBSTACK
                  </a>
                  <a
                    href={SUBSTACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-primary/50 text-primary hover:bg-primary/10 transition-all font-heading text-sm tracking-wider rounded-sm"
                  >
                    VIEW ALL ARTICLES
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Articles Section */}
      <section className="py-16 bg-dark-100/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl text-gray-100 tracking-wider mb-4">
              ADDITIONAL <span className="text-primary">ARTICLES</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Curated articles and briefings from trusted sources.
            </p>
          </motion.div>

          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <motion.a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="block bg-dark-100/80 border border-gray-800 rounded-sm overflow-hidden hover:border-primary/50 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs font-heading text-primary tracking-wider">
                        {article.source}
                      </span>
                      <span className="text-xs text-gray-600 font-mono">
                        {new Date(article.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg text-gray-100 mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-heading tracking-wider">
                      READ ARTICLE
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12 bg-dark-100/50 border border-gray-800 rounded-sm"
            >
              <p className="text-gray-500 mb-2">No additional articles yet.</p>
              <p className="text-sm text-gray-600">
                Add articles by editing the <code className="text-primary">articles</code> array in <code className="text-primary">app/articles/page.tsx</code>
              </p>
            </motion.div>
          )}
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
              Don&apos;t miss critical intelligence updates. Subscribe to our Substack 
              and join our network of informed patriots.
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
                href="/intel"
                className="px-6 py-3 font-heading text-sm uppercase tracking-widest border border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all duration-300"
              >
                Intel Updates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
