import React from 'react';

const TermsOfService = () => (
  <div className="min-h-screen bg-cream pt-24 pb-20">
    <div className="bg-sage/10 py-16 text-center mb-12">
      <h1 className="text-4xl font-light text-slate tracking-widest uppercase mb-3">Terms of Service</h1>
      <p className="text-slate/50 text-sm">Last Updated: March 2026</p>
    </div>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-sage/20 shadow-sm p-10 space-y-8 text-sm font-light text-slate/80 leading-relaxed">
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using the Ethereal Skincare website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not access or use our website.',
          },
          {
            title: '2. Products & Ordering',
            body: 'All products are subject to availability. We reserve the right to limit quantities, discontinue products, or modify product descriptions at any time. By placing an order, you are making an offer to purchase the described product at the listed price, which we may accept or decline.',
          },
          {
            title: '3. Pricing & Payment',
            body: 'All prices are in USD and exclude applicable taxes and shipping costs unless stated otherwise. We reserve the right to change prices at any time without notice. Payment must be made in full at the time of ordering through our secure payment processor.',
          },
          {
            title: '4. Intellectual Property',
            body: 'All content on this site — including text, images, logos, graphics, product descriptions, and design — is the property of Ethereal Skincare and protected by intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.',
          },
          {
            title: '5. Disclaimer of Warranties',
            body: 'Products are sold "as is" without any express or implied warranty beyond our stated satisfaction guarantee. Ethereal Skincare does not guarantee specific skincare results, as individual results vary based on skin type, lifestyle, and consistent usage.',
          },
          {
            title: '6. Limitation of Liability',
            body: 'To the fullest extent permitted by law, Ethereal Skincare shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the product in question.',
          },
          {
            title: '7. Governing Law',
            body: 'These terms are governed by the laws of the State of New York, USA. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts located in New York County.',
          },
          {
            title: '8. Contact',
            body: 'Questions about these Terms? Contact us at legal@ethereal.com. Ethereal Skincare · 123 Botanical Way · New York, NY 10001',
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

export default TermsOfService;
