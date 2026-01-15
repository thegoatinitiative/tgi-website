"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Email is encoded to prevent scraping
const getEmail = () => {
  const parts = ["cory", "thegoatinitiative", "org"];
  return `${parts[0]}@${parts[1]}.${parts[2]}`;
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open email client with pre-filled info
    const mailtoLink = `mailto:${getEmail()}?subject=${encodeURIComponent(formData.subject || "TGI Website Inquiry")}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12">
      {/* Header */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                SECURE COMMUNICATIONS
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              CONTACT <span className="text-primary text-glow-sm">US</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Have questions about our mission or want to get involved? Reach out to our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl text-gray-100 tracking-wider mb-6">
                  GET IN <span className="text-primary">TOUCH</span>
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Whether you have intel to share, want to support our mission, or have questions about our operations, we&apos;re here to help.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = `mailto:${getEmail()}`}
                  className="w-full flex items-center gap-4 p-4 bg-dark-100/80 border border-gray-800 rounded-sm hover:border-primary/50 transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading text-sm text-primary tracking-wider">SECURE EMAIL</p>
                    <p className="text-gray-400">Click to send encrypted message</p>
                  </div>
                </button>

                <a 
                  href="https://www.youtube.com/@TheGoatInitiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-dark-100/80 border border-gray-800 rounded-sm hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading text-sm text-primary tracking-wider">YOUTUBE</p>
                    <p className="text-gray-400">@TheGoatInitiative</p>
                  </div>
                </a>

                <a 
                  href="https://x.com/GoatInitiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-dark-100/80 border border-gray-800 rounded-sm hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading text-sm text-primary tracking-wider">X (TWITTER)</p>
                    <p className="text-gray-400">@GoatInitiative</p>
                  </div>
                </a>

                <a 
                  href="https://instagram.com/thegoatinitiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-dark-100/80 border border-gray-800 rounded-sm hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading text-sm text-primary tracking-wider">INSTAGRAM</p>
                    <p className="text-gray-400">@thegoatinitiative</p>
                  </div>
                </a>
              </div>

              {/* Response Time */}
              <div className="p-4 bg-success/5 border border-success/20 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  <span className="font-heading text-xs text-success tracking-wider">RESPONSE TIME</span>
                </div>
                <p className="text-sm text-gray-400">
                  We typically respond within 24-48 hours during active operations.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 bg-dark-100/80 border border-success/30 rounded-sm">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl text-gray-100 mb-2">MESSAGE READY</h3>
                    <p className="text-gray-400">Your email client should have opened. Send the email to complete your message.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="hud-panel p-6">
                    <h3 className="font-heading text-lg text-primary tracking-wider mb-6">SEND MESSAGE</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block font-mono text-xs text-gray-500 mb-2 tracking-wider">
                          YOUR NAME
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-dark border border-gray-800 rounded-sm text-gray-100 placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block font-mono text-xs text-gray-500 mb-2 tracking-wider">
                          YOUR EMAIL
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-dark border border-gray-800 rounded-sm text-gray-100 placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block font-mono text-xs text-gray-500 mb-2 tracking-wider">
                          SUBJECT
                        </label>
                        <input
                          type="text"
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-dark border border-gray-800 rounded-sm text-gray-100 placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                          placeholder="What is this regarding?"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block font-mono text-xs text-gray-500 mb-2 tracking-wider">
                          MESSAGE
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-dark border border-gray-800 rounded-sm text-gray-100 placeholder-gray-600 focus:border-primary focus:outline-none transition-colors resize-none"
                          placeholder="Enter your message..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 py-4 bg-primary text-dark font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors"
                    >
                      SEND SECURE MESSAGE
                    </button>

                    <p className="text-xs text-gray-600 text-center mt-4">
                      This will open your email client to send the message.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
