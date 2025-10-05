'use client'

import Link from 'next/link'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300 mb-6">
              ← BACK TO HOME
            </button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tighter mb-4">
              TERMS & CONDITIONS
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Last Updated: January 2025
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="border border-white/30 p-6 md:p-8 space-y-8 font-mono text-sm leading-relaxed">
          
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">1. ACCEPTANCE OF TERMS</h2>
            <p className="text-gray-300 mb-4">
              By accessing, using, or participating in this giveaway application ("App"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use this App.
            </p>
            <p className="text-gray-300">
              These Terms constitute a legally binding agreement between you ("User") and the App creator/operator ("We", "Us", "Our").
            </p>
          </section>

          {/* 2. App Purpose and Scope */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">2. APP PURPOSE AND SCOPE</h2>
            <p className="text-gray-300 mb-4">
              This App is designed solely for conducting giveaways and promotional activities. The giveaways may include, but are not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Event tickets</li>
              <li>Merchandise</li>
              <li>Digital assets</li>
              <li>Other promotional items</li>
            </ul>
            <p className="text-gray-300">
              The App serves as a platform for giveaway participation only and does not create, host, organize, or affiliate with any events, venues, or third-party services mentioned or promoted through the giveaways.
            </p>
          </section>

          {/* 3. Event Disclaimer */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">3. EVENT AND THIRD-PARTY DISCLAIMER</h2>
            <p className="text-gray-300 mb-4">
              <strong>IMPORTANT:</strong> All events, venues, artists, performers, and third-party services displayed, mentioned, or referenced in this App are NOT created, hosted, organized, sponsored, endorsed, or affiliated with this App or its operators.
            </p>
            <p className="text-gray-300 mb-4">
              Each event has its own separate terms, conditions, rules, policies, and requirements. We are not responsible for and do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Event occurrence, cancellation, or postponement</li>
              <li>Event quality, safety, or content</li>
              <li>Venue policies or restrictions</li>
              <li>Artist or performer availability</li>
              <li>Third-party service delivery</li>
            </ul>
          </section>

          {/* 4. User Responsibilities */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">4. USER RESPONSIBILITIES AND CONDUCT</h2>
            <p className="text-gray-300 mb-4">
              By participating in giveaways through this App, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>You are solely responsible for your actions before, during, and after any event or activity</li>
              <li>You will comply with all applicable laws, regulations, and venue policies</li>
              <li>You will not engage in fraudulent, abusive, or harmful behavior</li>
              <li>You are responsible for verifying event details, dates, and requirements independently</li>
              <li>You understand that winning a prize does not guarantee event access or satisfaction</li>
            </ul>
          </section>

          {/* 5. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">5. LIMITATION OF LIABILITY</h2>
            <p className="text-gray-300 mb-4">
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>We are NOT liable for any direct, indirect, incidental, consequential, or punitive damages</li>
              <li>We are NOT responsible for your actions, decisions, or conduct at any time</li>
              <li>We are NOT liable for event-related issues, injuries, losses, or damages</li>
              <li>We are NOT responsible for third-party services, products, or content</li>
              <li>Your use of this App is at your own risk and discretion</li>
            </ul>
            <p className="text-gray-300">
              Our total liability, if any, shall not exceed the value of the prize won, if applicable.
            </p>
          </section>

          {/* 6. Prize Terms */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">6. PRIZE TERMS AND CONDITIONS</h2>
            <p className="text-gray-300 mb-4">
              Regarding prizes awarded through this App:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Prizes are awarded "as is" without warranties of any kind</li>
              <li>Prize delivery, redemption, and usage are subject to third-party terms</li>
              <li>We are not responsible for prize defects, expiration, or unavailability</li>
              <li>No cash alternatives or substitutions unless legally required</li>
              <li>Winners are responsible for all taxes, fees, and additional costs</li>
            </ul>
          </section>

          {/* 7. Data and Privacy */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">7. DATA AND PRIVACY</h2>
            <p className="text-gray-300 mb-4">
              By using this App, you consent to the collection and use of your information as necessary for giveaway administration. We may collect:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>Wallet addresses and transaction data</li>
              <li>Email addresses for communication</li>
              <li>Participation and entry data</li>
            </ul>
            <p className="text-gray-300">
              We will not sell or share your personal information with unauthorized third parties.
            </p>
          </section>

          {/* 8. Modifications */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">8. MODIFICATIONS AND UPDATES</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify, update, or discontinue this App and these Terms at any time without prior notice. Continued use of the App after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* 9. Governing Law */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">9. GOVERNING LAW AND DISPUTES</h2>
            <p className="text-gray-300 mb-4">
              These Terms are governed by applicable laws. Any disputes shall be resolved through binding arbitration or in courts of competent jurisdiction. You waive any right to class action lawsuits.
            </p>
          </section>

          {/* 10. Severability */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">10. SEVERABILITY AND ENTIRE AGREEMENT</h2>
            <p className="text-gray-300 mb-4">
              If any provision of these Terms is found invalid or unenforceable, the remaining provisions shall remain in full force and effect. These Terms constitute the entire agreement between you and us regarding the use of this App.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-white">11. CONTACT INFORMATION</h2>
            <p className="text-gray-300">
              For questions regarding these Terms, please contact us through the App's official channels.
            </p>
          </section>

          {/* Final Acknowledgment */}
          <section className="border-t border-white/30 pt-6">
            <h2 className="text-xl font-bold mb-4 text-white">ACKNOWLEDGMENT</h2>
            <p className="text-gray-300 font-bold">
              BY USING THIS APP, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS. YOU UNDERSTAND THAT THIS APP IS FOR GIVEAWAY PURPOSES ONLY AND THAT WE ARE NOT LIABLE FOR YOUR ACTIONS OR DECISIONS AT ANY TIME.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 font-mono text-xs">
          <p>© 2025 Based Giveaways. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}