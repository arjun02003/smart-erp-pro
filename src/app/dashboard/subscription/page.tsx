'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CreditCard, Check, Crown, Zap, Star, ArrowRight, Shield, Clock, Receipt, Download, Wallet, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const plansList = [
  { id: 'basic', name: 'Basic', price: 499, yearly: 4999, color: '#06b6d4', features: ['GST Billing Ledger', 'Inventory (500 Products)', '1 User Access', 'Basic Reports', 'Email Support'] },
  { id: 'pro', name: 'Pro', price: 1499, yearly: 14999, color: '#6366f1', popular: true, features: ['Everything in Basic', 'Multi User Access', 'WhatsApp Invoices', 'Automatic Cloud Backup', 'Advanced Reports', 'Android/iOS App', '24/7 Priority Support'] },
  { id: 'enterprise', name: 'Enterprise', price: 4999, yearly: 49999, color: '#f59e0b', features: ['Everything in Pro', 'Multi Branch Syncing', 'AI Sales Forecasting', 'Unlimited Users', 'REST API Access', 'White Label Domain', 'Dedicated Account Manager', 'Custom ERP Modules'] },
];

const initialHistory = [
  { id: 'PAY-001', date: '2026-05-01', plan: 'Pro', amount: 1499, status: 'Paid', method: 'Razorpay Auto-UPI' },
  { id: 'PAY-002', date: '2026-04-01', plan: 'Pro', amount: 1499, status: 'Paid', method: 'Razorpay Auto-UPI' },
  { id: 'PAY-003', date: '2026-03-01', plan: 'Pro', amount: 1499, status: 'Paid', method: 'Razorpay Auto-UPI' },
  { id: 'PAY-004', date: '2026-02-01', plan: 'Basic', amount: 499, status: 'Paid', method: 'Razorpay UPI' },
];

export default function SubscriptionPage() {
  const { user, upgradePlan } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [history, setHistory] = useState(initialHistory);
  const [upiId, setUpiId] = useState('8999540672@ybl');
  const [pendingUpgradePlan, setPendingUpgradePlan] = useState<any>(null);

  const currentPlan = user?.plan || 'pro';

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g., username@bank)');
      return;
    }
    toast.success(`UPI Auto-Debit method updated to: ${upiId} 💳`);
  };

  const handleConfirmPay = () => {
    if (!pendingUpgradePlan) return;
    
    const planPrice = billingCycle === 'monthly' ? pendingUpgradePlan.price : pendingUpgradePlan.yearly;
    
    upgradePlan(pendingUpgradePlan.id as any);
    
    // Add transaction to history list
    const newPay = {
      id: `PAY-0${history.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      plan: pendingUpgradePlan.name,
      amount: planPrice,
      status: 'Paid',
      method: `UPI Auto-Debit (${upiId})`
    };
    
    setHistory([newPay, ...history]);
    setPendingUpgradePlan(null);
    toast.success(`Activated SmartERP ${pendingUpgradePlan.name} Plan! Auto-debited from ${upiId} 👑`);
  };

  const handleDownloadInvoice = (id: string, planName: string, amount: number) => {
    const csvContent = [
      ['Invoice Details', 'SmartERP Pro Billing Receipt'],
      ['Invoice ID', id],
      ['Transaction Date', new Date().toISOString().split('T')[0]],
      ['Subscription Plan', planName],
      ['Paid Amount (INR)', amount],
      ['Payment Method', `UPI (${upiId})`],
      ['Billing Country', 'India'],
      ['GST Reg Type', 'SEZ / B2C Output'],
      ['Payment Status', 'SUCCESS / PAID']
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Receipt_${id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Invoice receipt downloaded for ${id}! 📥`);
  };

  const handleDownloadAll = () => {
    const csvContent = [
      ['Payment ID', 'Date Paid', 'Billing Plan', 'Transaction Value (INR)', 'Method Used', 'Status'],
      ...history.map(h => [h.id, h.date, h.plan, h.amount, h.method, h.status])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartERP_Full_Billing_Statement.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Full subscription ledger statement downloaded! 🧾');
  };

  // Get current active plan details dynamically
  const activePlanDetails = plansList.find(p => p.id === currentPlan) || plansList[1];
  const activePrice = billingCycle === 'monthly' ? activePlanDetails.price : activePlanDetails.yearly;

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard size={24} className="text-amber-400" /> Subscription Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage plans, billing intervals & payment receipts</p>
        </div>

        {/* Monthly/Yearly toggle */}
        <div className="flex items-center gap-2 bg-white/3 border border-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'monthly' 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'yearly' 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yearly (Save 17%)
          </button>
        </div>
      </motion.div>

      {/* Active Subscription Banner */}
      <motion.div 
        variants={anim} 
        className="p-6 rounded-2xl relative overflow-hidden" 
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-yellow-400 fill-yellow-400 animate-pulse" />
              <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">{currentPlan} Plan Active</span>
            </div>
            <p className="text-2xl font-black text-white">
              {formatCurrency(activePrice)}
              <span className="text-xs text-slate-400 font-normal">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </p>
            <p className="text-xs text-slate-400">
              Next renewal: {billingCycle === 'monthly' ? 'June 1, 2026' : 'May 1, 2027'} · Auto-charge ON
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-white/3 border border-white/5">
              <p className="text-lg font-bold text-white">247</p>
              <p className="text-[10px] text-slate-500">Days Unlocked</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white/3 border border-white/5">
              <p className="text-lg font-bold text-emerald-400">
                {formatCurrency(history.reduce((s, h) => s + h.amount, 0))}
              </p>
              <p className="text-[10px] text-slate-500">Total Spent</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* UPI Auto-Debit Settings */}
      <motion.div variants={anim} className="card p-5">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Wallet size={16} className="text-indigo-400 animate-bounce" /> UPI Auto-Debit Settings
        </h3>
        <form onSubmit={handleSaveUpi} className="flex flex-col sm:flex-row gap-3 items-end max-w-lg">
          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 block mb-1.5">Preferred UPI ID for subscription renewal</label>
            <input 
              type="text" 
              className="input text-sm py-2" 
              value={upiId} 
              onChange={e => setUpiId(e.target.value)} 
              placeholder="e.g. 8999540672@ybl"
              required
            />
          </div>
          <button 
            type="submit"
            className="btn-primary py-2 text-xs px-4"
          >
            Save payment method
          </button>
        </form>
      </motion.div>

      {/* Pricing Cards Grid */}
      <motion.div variants={anim} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansList.map((plan, i) => {
          const isCurrent = currentPlan === plan.id;
          const planPrice = billingCycle === 'monthly' ? plan.price : plan.yearly;
          
          return (
            <motion.div 
              key={i} 
              whileHover={{ y: -6 }}
              className={`pricing-card relative overflow-hidden ${plan.popular ? 'featured' : ''}`}
            >
              {plan.popular && (
                <div 
                  className="absolute top-0 left-0 right-0 py-1 text-center text-[10px] tracking-wider font-bold text-white" 
                  style={{ background: `linear-gradient(90deg, ${plan.color}, #8b5cf6)` }}
                >
                  ⭐ POPULAR CHOICE
                </div>
              )}
              <div className={`space-y-4 ${plan.popular ? 'pt-4' : ''}`}>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name} Plan</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-white">{formatCurrency(planPrice)}</span>
                    <span className="text-xs text-slate-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'monthly' && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      ₹{plan.yearly.toLocaleString('en-IN')}/year (Save ₹{(plan.price * 12 - plan.yearly).toLocaleString('en-IN')})
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check size={13} style={{ color: plan.color }} className="flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setPendingUpgradePlan(plan)}
                  disabled={isCurrent}
                  className="w-full mt-4 py-2.5 rounded-xl font-semibold transition-all text-xs"
                  style={{
                    background: isCurrent ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                    color: isCurrent ? '#94a3b8' : 'white', 
                    border: isCurrent ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    cursor: isCurrent ? 'default' : 'pointer'
                  }}
                >
                  {isCurrent ? 'Plan Active' : `Subscribe ${plan.name}`}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {pendingUpgradePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setPendingUpgradePlan(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-2xl p-6 border border-white/8 shadow-2xl z-10"
              style={{ background: '#111118' }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CreditCard size={18} className="text-yellow-400" /> Confirm Purchase
                </h3>
                <button onClick={() => setPendingUpgradePlan(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-xs space-y-2">
                  <div className="flex justify-between text-slate-400"><span>Plan selected:</span><span className="text-white font-bold">{pendingUpgradePlan.name} ({billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})</span></div>
                  <div className="flex justify-between text-slate-400"><span>Total Due today:</span><span className="text-emerald-400 font-bold">{formatCurrency(billingCycle === 'monthly' ? pendingUpgradePlan.price : pendingUpgradePlan.yearly)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Payment Method:</span><span className="text-indigo-300 font-mono">{upiId}</span></div>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  Funds will be auto-debited via UPI Auto-Mandate configured for <strong>{upiId}</strong>.
                </p>

                <div className="pt-2 flex gap-2">
                  <button onClick={() => setPendingUpgradePlan(null)} className="btn-secondary w-1/2 py-2 text-xs">Cancel</button>
                  <button onClick={handleConfirmPay} className="btn-primary w-1/2 py-2 text-xs">Pay & Activate Plan</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment History Table */}
      <motion.div variants={anim} className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Receipt size={16} className="text-indigo-400" /> Subscription Billing History
          </h3>
          <button 
            onClick={handleDownloadAll}
            className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"
            disabled={history.length === 0}
          >
            <Download size={12} /> Download Statement
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment Reference</th>
                <th>Date Paid</th>
                <th>Purchased Plan</th>
                <th>Transaction Amount</th>
                <th>Gateway Channel</th>
                <th>Fulfillment Status</th>
                <th>Tax Invoice</th>
              </tr>
            </thead>
            <tbody>
              {history.map(p => (
                <tr key={p.id}>
                  <td className="text-xs font-mono text-indigo-400">{p.id}</td>
                  <td className="text-xs text-slate-400">{p.date}</td>
                  <td>
                    <span className="badge badge-secondary text-[9px] uppercase tracking-wider">
                      {p.plan}
                    </span>
                  </td>
                  <td className="text-xs font-bold text-white">{formatCurrency(p.amount)}</td>
                  <td className="text-xs text-slate-400">{p.method}</td>
                  <td>
                    <span className="badge badge-success text-[9px]">
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDownloadInvoice(p.id, p.plan, p.amount)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <Download size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
