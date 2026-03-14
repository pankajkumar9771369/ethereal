import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="bg-sage/10 py-16 text-center mb-12">
        <h1 className="text-4xl font-light text-slate tracking-widest uppercase mb-3">Contact Us</h1>
        <p className="text-slate/60 font-light">We'd love to hear from you.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white border border-sage/20 p-6 shadow-sm">
              <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mb-4">
                <Mail size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-slate mb-1 uppercase tracking-wider text-sm">Email Us</h3>
              <p className="text-slate/60 text-sm font-light">support@ethereal.com</p>
            </div>
            <div className="bg-white border border-sage/20 p-6 shadow-sm">
              <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mb-4">
                <Clock size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-slate mb-1 uppercase tracking-wider text-sm">Response Time</h3>
              <p className="text-slate/60 text-sm font-light">We reply within 24–48 business hours.</p>
            </div>
            <div className="bg-white border border-sage/20 p-6 shadow-sm">
              <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-slate mb-1 uppercase tracking-wider text-sm">Live Chat</h3>
              <p className="text-slate/60 text-sm font-light">Available Mon–Fri, 9am–6pm EST</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-sage/20 p-8 shadow-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle size={48} className="text-green-500 mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-light text-slate mb-2">Message Sent!</h3>
                <p className="text-slate/60 font-light">Thank you for reaching out. We'll be in touch within 24–48 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-light text-slate mb-6 uppercase tracking-widest">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Your Name</label>
                      <input name="name" required value={form.name} onChange={handleChange} className="w-full border border-sage/30 px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors bg-cream/30" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Email Address</label>
                      <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full border border-sage/30 px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors bg-cream/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Subject</label>
                    <select name="subject" required value={form.subject} onChange={handleChange} className="w-full border border-sage/30 px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors bg-cream/30">
                      <option value="">Select a topic...</option>
                      <option>Order Issue</option>
                      <option>Product Question</option>
                      <option>Shipping Inquiry</option>
                      <option>Returns & Refunds</option>
                      <option>Partnerships</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate/60 mb-2">Message</label>
                    <textarea name="message" required rows={6} value={form.message} onChange={handleChange} className="w-full border border-sage/30 px-4 py-3 text-slate text-sm focus:outline-none focus:border-primary transition-colors bg-cream/30 resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-slate text-cream py-4 uppercase tracking-widest text-sm hover:bg-primary transition-colors">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
