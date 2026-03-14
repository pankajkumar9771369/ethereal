import React from 'react';
import { Truck, RefreshCw, RotateCcw, HelpCircle } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white border border-sage/20 shadow-sm p-8 mb-6">
    <div className="flex items-center gap-4 mb-5 pb-4 border-b border-sage/20">
      <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-medium text-slate uppercase tracking-widest">{title}</h2>
    </div>
    {children}
  </div>
);

const ShippingReturns = () => (
  <div className="min-h-screen bg-cream pt-24 pb-20">
    <div className="bg-sage/10 py-16 text-center mb-12">
      <h1 className="text-4xl font-light text-slate tracking-widest uppercase mb-3">Shipping & Returns</h1>
      <p className="text-slate/60 font-light">Everything you need to know about orders, delivery, and returns.</p>
    </div>

    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Section icon={Truck} title="Shipping Information">
        <div className="space-y-4 text-sm font-light text-slate/80 leading-relaxed">
          <div className="flex justify-between py-3 border-b border-sage/10">
            <span className="font-medium text-slate">Processing Time</span>
            <span>1–2 Business Days</span>
          </div>
          <div className="flex justify-between py-3 border-b border-sage/10">
            <span className="font-medium text-slate">Standard Shipping (US)</span>
            <span>5–7 Business Days · Free over $50</span>
          </div>
          <div className="flex justify-between py-3 border-b border-sage/10">
            <span className="font-medium text-slate">Express Shipping (US)</span>
            <span>2–3 Business Days · $12.99</span>
          </div>
          <div className="flex justify-between py-3 border-b border-sage/10">
            <span className="font-medium text-slate">International</span>
            <span>10–18 Business Days · From $18.99</span>
          </div>
          <p className="pt-2 text-slate/60">
            Orders placed before <span className="font-medium">2 PM EST on weekdays</span> are typically dispatched same-day. You'll receive a tracking number by email once your order ships.
          </p>
        </div>
      </Section>

      <Section icon={RefreshCw} title="Return Policy">
        <div className="space-y-4 text-sm font-light text-slate/80 leading-relaxed">
          <div className="bg-sage/5 border border-sage/20 rounded p-4 mb-4">
            <p className="font-medium text-slate">30-Day Satisfaction Guarantee</p>
            <p className="mt-1">We stand fully behind the quality of our products. If you're not completely satisfied, we'll make it right.</p>
          </div>
          <ul className="space-y-2 list-none">
            {[
              'Items must be returned within 30 days of delivery',
              'Products must be in original condition (at least 75% remaining)',
              'Include your order number in the return package',
              'Return shipping is free for US domestic orders',
              'Refunds are processed within 5–7 business days of receipt',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section icon={RotateCcw} title="Exchange Process">
        <div className="text-sm font-light text-slate/80 leading-relaxed space-y-3">
          <p>Want a different product? Exchanges are simple:</p>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Email us at <span className="font-medium text-primary">support@ethereal.com</span> with your order number and exchange request</li>
            <li>We'll send a prepaid return label within 24 hours</li>
            <li>Drop off your return at any postal location</li>
            <li>Your exchange order will ship within 2 business days of receiving the return</li>
          </ol>
        </div>
      </Section>

      <Section icon={HelpCircle} title="Damaged or Incorrect Items">
        <div className="text-sm font-light text-slate/80 leading-relaxed">
          <p>If you received a damaged or incorrect item, please contact us at <span className="font-medium text-primary">support@ethereal.com</span> within 48 hours of delivery with photos of the issue. We'll send a replacement or full refund at no additional cost to you — immediately, no need to return the damaged item.</p>
        </div>
      </Section>
    </div>
  </div>
);

export default ShippingReturns;
