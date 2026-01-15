"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-heading text-xs text-primary tracking-widest">
                LEGAL DOCUMENT
              </span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-gray-100 tracking-wider mb-6">
              TERMS OF <span className="text-primary text-glow-sm">SERVICE</span>
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
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">1. ACCEPTANCE OF TERMS</h2>
                <p className="text-gray-400 leading-relaxed">
                  By accessing or using the website of The GOAT Initiative (&quot;TGI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">2. USE OF WEBSITE</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the website. Prohibited behavior includes:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Harassing or causing distress to any person</li>
                  <li>Transmitting obscene or offensive content</li>
                  <li>Disrupting the normal flow of dialogue within our website</li>
                  <li>Attempting to gain unauthorized access to any systems</li>
                </ul>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">3. INTELLECTUAL PROPERTY</h2>
                <p className="text-gray-400 leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property of The GOAT Initiative or its content suppliers and is protected by United States and international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">4. DONATIONS</h2>
                <p className="text-gray-400 leading-relaxed">
                  All donations made through our website are final and non-refundable unless otherwise required by law. Donations are tax-deductible to the extent permitted by law. You will receive a receipt for your records.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">5. DISCLAIMER OF WARRANTIES</h2>
                <p className="text-gray-400 leading-relaxed">
                  This website is provided &quot;as is&quot; without any representations or warranties, express or implied. TGI makes no representations or warranties regarding the accuracy, completeness, or reliability of any content on this website.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">6. LIMITATION OF LIABILITY</h2>
                <p className="text-gray-400 leading-relaxed">
                  In no event shall The GOAT Initiative be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">7. EXTERNAL LINKS</h2>
                <p className="text-gray-400 leading-relaxed">
                  Our website may contain links to external websites. We are not responsible for the content, privacy practices, or availability of these external sites.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">8. MODIFICATIONS</h2>
                <p className="text-gray-400 leading-relaxed">
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website constitutes acceptance of any modifications.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">9. GOVERNING LAW</h2>
                <p className="text-gray-400 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
              </div>

              <div className="hud-panel p-6">
                <h2 className="font-heading text-xl text-primary tracking-wider mb-4">10. CONTACT</h2>
                <p className="text-gray-400 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through our{" "}
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
