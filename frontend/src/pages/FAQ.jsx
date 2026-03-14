import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'We process orders within 1–2 business days. Standard shipping takes 5–7 business days. Express shipping (2–3 business days) is available at checkout for an additional fee.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes! We offer FREE standard shipping on all orders over $50 within the US. International shipping rates vary by destination.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with your purchase for any reason, contact us at support@ethereal.com and we\'ll arrange a full refund or exchange — no questions asked.',
  },
  {
    q: 'Are your products vegan and cruelty-free?',
    a: 'Absolutely. Every single Ethereal Skincare product is 100% vegan and cruelty-free. We never test on animals and our formulations contain no animal-derived ingredients.',
  },
  {
    q: 'Are your products suitable for sensitive skin?',
    a: 'Yes! All our formulas are dermatologist-tested and free from parabens, sulfates, synthetic fragrances, and harsh chemicals. We recommend patch testing any new product on a small area of skin first.',
  },
  {
    q: 'Can I use a discount code at checkout?',
    a: 'Yes! Enter your discount code in the cart drawer before proceeding to checkout. Codes like ETHEREAL10 (10% off first order) can be applied there. Only one code can be used per order.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you\'ll receive an email with a tracking number. You can use this to track your shipment on the carrier\'s website. Allow 24 hours for tracking to activate.',
  },
  {
    q: 'Can I cancel or modify my order?',
    a: 'Orders can be modified or cancelled within 2 hours of placement. After that, they enter our fulfillment process and can no longer be changed. Please contact us immediately at support@ethereal.com if you need to make changes.',
  },
  {
    q: 'Are your packaging materials sustainable?',
    a: 'We are committed to sustainability. Our packaging uses recyclable glass bottles, FSC-certified paper, and soy-based inks. We are continuously working to reduce our environmental footprint.',
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sage/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center py-5 px-1 text-slate hover:text-primary transition-colors"
      >
        <span className="font-medium tracking-wide pr-4">{q}</span>
        {open ? <ChevronUp size={18} className="flex-shrink-0 text-primary" /> : <ChevronDown size={18} className="flex-shrink-0 text-slate/40" />}
      </button>
      {open && (
        <div className="pb-5 px-1 text-slate/70 font-light leading-relaxed text-sm">
          {a}
        </div>
      )}
    </div>
  );
};

const FAQ = () => (
  <div className="min-h-screen bg-cream pt-24 pb-20">
    <div className="bg-sage/10 py-16 text-center mb-12">
      <h1 className="text-4xl font-light text-slate tracking-widest uppercase mb-3">FAQ</h1>
      <p className="text-slate/60 font-light">Everything you need to know about Ethereal Skincare.</p>
    </div>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm border border-sage/20 px-6 md:px-10">
        {FAQS.map((faq, i) => (
          <FAQItem key={i} {...faq} />
        ))}
      </div>
      <div className="mt-12 text-center bg-sage/10 border border-sage/20 p-8">
        <h3 className="text-lg font-light text-slate mb-2">Still have questions?</h3>
        <p className="text-slate/60 text-sm mb-4 font-light">Our skincare experts are happy to help.</p>
        <a href="/contact" className="inline-block bg-slate text-cream px-6 py-3 text-sm uppercase tracking-widest hover:bg-primary transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </div>
);

export default FAQ;
