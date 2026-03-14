import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-cream pt-24 pb-20">
    <div className="bg-sage/10 py-16 text-center mb-12">
      <h1 className="text-4xl font-light text-slate tracking-widest uppercase mb-3">Privacy Policy</h1>
      <p className="text-slate/50 text-sm">Last Updated: March 2026</p>
    </div>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-sage/20 shadow-sm p-10 space-y-8 text-sm font-light text-slate/80 leading-relaxed">
        {[
          {
            title: '1. Information We Collect',
            body: 'We collect information you provide directly: name, email address, shipping address, and payment information when you place an order or create an account. We also automatically collect certain data when you visit our website, including your IP address, browser type, pages visited, and referring URL, to improve our services.',
          },
          {
            title: '2. How We Use Your Information',
            body: 'We use your information to process and fulfil orders, send transactional emails (order confirmations, shipping updates), communicate promotional offers (with your consent), improve our website and product offerings, and comply with legal obligations.',
          },
          {
            title: '3. Information Sharing',
            body: 'We do not sell or rent your personal data. We share information only with trusted service providers (e.g., payment processors, shipping carriers) who assist in operating our business and are bound by confidentiality agreements. We may disclose data if required by law.',
          },
          {
            title: '4. Cookies',
            body: 'We use cookies to remember your cart, maintain your session, and analyse traffic using Google Analytics. You can control cookie settings in your browser, but disabling cookies may affect site functionality.',
          },
          {
            title: '5. Data Security',
            body: 'We use industry-standard SSL encryption and secure servers to protect your data. Payment information is processed through PCI-compliant third-party providers and is never stored on our servers.',
          },
          {
            title: '6. Your Rights',
            body: 'You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at privacy@ethereal.com. Residents of the EU/UK may also lodge a complaint with their local data protection authority.',
          },
          {
            title: '7. Contact',
            body: 'Questions about this policy? Email us at privacy@ethereal.com. Ethereal Skincare · 123 Botanical Way · New York, NY 10001',
          },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="text-base font-medium text-slate uppercase tracking-wider mb-3">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
