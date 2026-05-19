'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Check, Star, Shield, Zap, BarChart3,
  Package, Receipt, Users, Globe, Smartphone, Brain, ChevronRight,
  Play, Crown, IndianRupee, Clock, HeadphonesIcon, Building2
} from 'lucide-react';

const features = [
  { icon: Receipt, title: 'GST Billing', desc: 'Auto GST calculation, e-invoicing, thermal print, QR code & barcode billing', color: '#6366f1' },
  { icon: Package, title: 'Inventory Management', desc: 'Real-time stock, batch/expiry tracking, auto reorder, barcode scanning', color: '#06b6d4' },
  { icon: BarChart3, title: 'Smart Reports', desc: 'AI-powered analytics, P&L, GSTR reports, PDF & Excel export', color: '#10b981' },
  { icon: IndianRupee, title: 'Accounting', desc: 'Ledger, cash book, bank book, auto entries, outstanding management', color: '#f59e0b' },
  { icon: Users, title: 'Customer & Supplier', desc: 'CRM, loyalty points, outstanding tracking, purchase management', color: '#ec4899' },
  { icon: Brain, title: 'AI Analytics', desc: 'Sales prediction, smart stock suggestions, OCR scanner, business insights', color: '#8b5cf6' },
  { icon: Shield, title: 'Security & Backup', desc: 'Cloud backup, audit logs, 2FA, data encryption, device management', color: '#ef4444' },
  { icon: Smartphone, title: 'Mobile Access', desc: 'Full mobile app, push notifications, remote stock check, staff tracking', color: '#14b8a6' },
  { icon: Building2, title: 'Multi-Branch', desc: 'Centralized management, branch transfers, consolidated reporting', color: '#f97316' },
];

const plans = [
  {
    name: 'Free Trial', price: '₹0', period: '7 Days', popular: false,
    features: ['Limited Billing', '50 Products Max', 'Basic Reports', 'Single User', 'Email Support'],
    cta: 'Start Free Trial', color: '#64748b'
  },
  {
    name: 'Basic', price: '₹499', period: '/month', popular: false,
    features: ['GST Billing', 'Inventory Management', '500 Products', '1 User', 'Basic Reports', 'Email Support'],
    cta: 'Get Started', color: '#06b6d4'
  },
  {
    name: 'Pro', price: '₹1,499', period: '/month', popular: true,
    features: ['Everything in Basic', 'Multi User Access', 'WhatsApp Invoice', 'Cloud Backup', 'Advanced Reports', 'Mobile App Access', 'Priority Support'],
    cta: 'Upgrade to Pro', color: '#6366f1'
  },
  {
    name: 'Enterprise', price: '₹4,999', period: '/month', popular: false,
    features: ['Everything in Pro', 'Multi Branch', 'AI Reports & Analytics', 'Unlimited Users', 'API Access', 'Custom Branding', 'White Label', 'Dedicated Support'],
    cta: 'Contact Sales', color: '#f59e0b'
  },
];

const testimonials = [
  { name: 'Dr. Rajiv Mehta', business: 'Mehta Medical Store, Delhi', text: 'SmartERP transformed our billing. GST compliance is now automatic and we saved 4 hours daily.', rating: 5 },
  { name: 'Sunita Agarwal', business: 'Agarwal Kirana, Jaipur', text: 'Best inventory management! Auto reorder alerts saved us from stockouts during festival season.', rating: 5 },
  { name: 'Vikash Wholesale', business: 'VK Distributors, Mumbai', text: 'Multi-branch feature is incredible. We manage 5 stores from one dashboard. Revenue up 35%.', rating: 5 },
];

const stats2 = [
  { number: '10,000+', label: 'Businesses Trust Us' },
  { number: '₹500Cr+', label: 'Billing Processed' },
  { number: '99.9%', label: 'Uptime Guarantee' },
  { number: '24/7', label: 'Customer Support' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Navbar */}
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight">SmartERP Pro</h1>
              <p className="text-[9px] text-indigo-400 font-semibold tracking-widest">CLOUD EDITION</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white px-4 py-2 transition-colors">Login</Link>
            <Link href="/login" className="btn-primary text-sm py-2.5 px-5">
              Start Free Trial <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="hero-bg grid-bg relative pt-32 pb-24 px-6">
        {/* Floating elements */}
        <div className="absolute top-40 left-10 w-64 h-64 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(50px)', animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)'
            }}>
              <Crown size={14} className="text-yellow-400" />
              <span className="text-xs text-indigo-300 font-medium">#1 Cloud ERP for Indian Businesses</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
            The <span className="gradient-text">Smartest ERP</span>
            <br />for Your Business
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            GST Billing, Inventory, Accounting & AI Analytics — all in one premium cloud platform.
            Built for Medical Stores, Kirana Shops, Wholesale & Retail.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-primary text-base py-4 px-8 rounded-2xl">
              Start 7-Day Free Trial <ArrowRight size={18} />
            </Link>
            <button className="btn-secondary text-base py-4 px-8 rounded-2xl flex items-center gap-2">
              <Play size={18} className="text-indigo-400" /> Watch Demo
            </button>
          </motion.div>

          {/* Trust bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats2.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-black gradient-text">{s.number}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-primary mb-4">POWERFUL FEATURES</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything Your Business Needs</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Premium modules designed for Indian businesses — from a small kirana shop to a multi-branch enterprise.</p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -6 }}
                className="p-6 rounded-2xl transition-all cursor-pointer group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.03), transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-primary mb-4">PRICING PLANS</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Choose Your Plan</h2>
            <p className="text-slate-400">Start free, scale as you grow. No hidden charges.</p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} variants={item}
                className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-bold text-white rounded-t-3xl"
                    style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div className={plan.popular ? 'pt-6' : ''}>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-3 mb-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-sm text-slate-500">{plan.period}</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={15} style={{ color: plan.color }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/login">
                    <button className="w-full mt-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                      style={{
                        background: plan.popular ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                        color: 'white',
                        border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.08)'
                      }}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="badge badge-primary mb-4">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Loved by 10,000+ Businesses</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex gap-1 mb-3">
                  {Array(t.rating).fill(0).map((_, si) => <Star key={si} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="absolute top-0 left-0 w-full h-full opacity-20"
            style={{ background: 'radial-gradient(circle at 30% 50%, #6366f1, transparent 50%), radial-gradient(circle at 70% 50%, #8b5cf6, transparent 50%)' }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">Join 10,000+ Indian businesses already using SmartERP Pro Cloud. Start your free 7-day trial today.</p>
            <Link href="/login" className="btn-primary text-base py-4 px-10 rounded-2xl inline-flex">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            <span className="font-bold text-white">SmartERP Pro Cloud</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 SmartERP Pro. All rights reserved. Made with ❤️ in India</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
