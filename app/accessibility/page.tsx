"use client";

import { motion } from "framer-motion";

export default function AccessibilityPage() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                ACCESSIBILITY
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              ACCESSIBILITY <span className="text-primary text-glow-sm">STATEMENT</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our commitment to making this website accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert max-w-none"
          >
            <div className="space-y-8">
              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">OUR COMMITMENT</h2>
                <p className="text-gray-400 leading-relaxed">
                  The GOAT Initiative is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">CONFORMANCE STATUS</h2>
                <p className="text-gray-400 leading-relaxed">
                  We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">ACCESSIBILITY FEATURES</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Our website includes the following accessibility features:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Keyboard navigation support for all interactive elements</li>
                  <li>ARIA labels and landmarks for screen reader compatibility</li>
                  <li>Sufficient color contrast ratios for text readability</li>
                  <li>Focus indicators for keyboard users</li>
                  <li>Reduced motion options for users who prefer less animation</li>
                  <li>Descriptive alt text for images</li>
                  <li>Semantic HTML structure</li>
                  <li>Responsive design for various screen sizes and devices</li>
                </ul>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">KNOWN LIMITATIONS</h2>
                <p className="text-gray-400 leading-relaxed">
                  While we strive to adhere to accessibility guidelines, some content may not yet be fully accessible. We are actively working to identify and address any barriers. If you encounter any issues, please let us know.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">THIRD-PARTY CONTENT</h2>
                <p className="text-gray-400 leading-relaxed">
                  Our website may include third-party content or links to external websites that we do not control. We cannot guarantee the accessibility of third-party content, but we encourage our partners to prioritize accessibility.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">FEEDBACK</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Visit our <a href="/contact" className="text-primary hover:underline">Contact Page</a></li>
                  <li>Describe the problem you encountered</li>
                  <li>Include the page URL where you experienced the issue</li>
                </ul>
                <p className="text-gray-400 leading-relaxed mt-4">
                  We will make every effort to respond to your feedback within 5 business days.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">ASSISTIVE TECHNOLOGY</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Our website is designed to be compatible with the following assistive technologies:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
                  <li>Screen magnification software</li>
                  <li>Speech recognition software</li>
                  <li>Keyboard-only navigation</li>
                </ul>
              </div>

              <div className="text-center pt-8 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  This statement was last updated on January 14, 2026.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
