"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                LEGAL DOCUMENT
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              PRIVACY <span className="text-primary text-glow-sm">POLICY</span>
            </h1>
            
            <p className="text-gray-400">
              Last Updated: January 14, 2026
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
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">1. INFORMATION WE COLLECT</h2>
                <p className="text-gray-400 leading-relaxed">
                  The GOAT Initiative (&quot;TGI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects information you provide directly to us, such as when you make a donation, sign up for our newsletter, contact us, or otherwise communicate with us. This may include your name, email address, mailing address, phone number, and payment information.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">2. HOW WE USE YOUR INFORMATION</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Process donations and send tax receipts</li>
                  <li>Send you updates about our mission and operations</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">3. INFORMATION SHARING</h2>
                <p className="text-gray-400 leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website, processing donations, or conducting our operations, subject to confidentiality agreements.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">4. DATA SECURITY</h2>
                <p className="text-gray-400 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">5. COOKIES AND TRACKING</h2>
                <p className="text-gray-400 leading-relaxed">
                  Our website may use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings. We may also collect analytics data to improve our website and services.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">6. YOUR RIGHTS</h2>
                <p className="text-gray-400 leading-relaxed">
                  You have the right to access, correct, or delete your personal information. You may also opt out of receiving communications from us at any time by clicking the unsubscribe link in our emails or contacting us directly.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">7. CONTACT US</h2>
                <p className="text-gray-400 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our{" "}
                  <a href="/contact" className="text-primary hover:underline">Contact Page</a>.
                </p>
              </div>

              <div className="text-center pt-8 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  The GOAT Initiative is a 501(c)(3) nonprofit organization. EIN: 99-3753614
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
