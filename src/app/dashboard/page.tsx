'use client';

import { motion } from 'framer-motion';
import {
  IndianRupee, TrendingUp, ShoppingCart, Users, Package, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Eye, Brain, Zap, Clock
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { mockSalesData, mockDailySales, mockProducts, mockInvoices, mockNotifications } from '@/lib/mockData';
import { useAuthStore } from '@/lib/store';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const stats = [
  { label: "Today's Sales", value: 38900, change: '+12.5%', up: true, icon: IndianRupee, color: 'primary', accent: '#6366f1' },
  { label: 'Monthly Revenue', value: 485000, change: '+8.3%', up: true, icon: TrendingUp, color: 'success', accent: '#10b981' },
  { label: 'Pending Payments', value: 138600, change: '-5.2%', up: false, icon: Clock, color: 'warning', accent: '#f59e0b' },
  { label: 'Total Customers', value: 1247, change: '+15.8%', up: true, icon: Users, color: 'secondary', accent: '#06b6d4' },
];

const topProducts = [
  { name: 'Paracetamol 500mg', sold: 1240, revenue: 31000, trend: '+18%' },
  { name: 'ORS Sachet', sold: 890, revenue: 10680, trend: '+12%' },
  { name: 'Cetrizine 10mg', sold: 780, revenue: 11700, trend: '+8%' },
  { name: 'Amoxicillin 250mg', sold: 450, revenue: 38250, trend: '+22%' },
  { name: 'N95 Mask Pack', sold: 340, revenue: 51000, trend: '+5%' },
];

const categoryData = [
  { name: 'Medicine', value: 45, color: '#6366f1' },
  { name: 'Healthcare', value: 20, color: '#06b6d4' },
  { name: 'Supplement', value: 15, color: '#10b981' },
  { name: 'Devices', value: 12, color: '#f59e0b' },
  { name: 'Safety', value: 8, color: '#ef4444' },
];

const aiInsights = [
  { icon: Brain, title: 'Sales Prediction', desc: 'Expected 12% increase next week based on seasonal trends', type: 'positive' },
  { icon: AlertTriangle, title: 'Stock Warning', desc: '3 products will run out within 7 days at current sell rate', type: 'warning' },
  { icon: Zap, title: 'Revenue Opportunity', desc: 'Bundle Paracetamol + ORS can increase avg. order by ₹45', type: 'positive' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function DashboardPage() {
  const { user } = useAuthStore();
  const lowStock = mockProducts.filter(p => p.stock <= p.minStock);
  const recentInvoices = mockInvoices.slice(0, 5);
  const unread = mockNotifications.filter(n => !n.read);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Admin'}</span> 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {user?.businessName || 'Sharma Medical Store'} · Here&apos;s your business overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="badge badge-success">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Live
          </div>
          <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -4, scale: 1.01 }}
            className={`stat-card ${s.color}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${s.accent}15` }}>
                <s.icon size={20} style={{ color: s.accent }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(s.value)}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2 chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Revenue Overview</h3>
            <div className="flex gap-2">
              {['Sales', 'Profit', 'Expenses'].map((l, i) => (
                <span key={l} className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: ['#6366f1', '#10b981', '#ef4444'][i] }} />{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockSalesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₹${(v/1000)}K`} />
              <Tooltip
                contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
              />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#salesGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#profitGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div variants={item} className="chart-container">
          <h3 className="font-semibold text-white mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-300">{c.name}</span>
                </span>
                <span className="font-semibold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sales Bar */}
        <motion.div variants={item} className="chart-container">
          <h3 className="font-semibold text-white mb-4">Daily Sales (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockDailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} tickFormatter={v => `₹${(v/1000)}K`} />
              <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div variants={item} className="chart-container">
          <h3 className="font-semibold text-white mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center"
                  style={{ background: `${['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i]}20`,
                    color: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i] }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500">{p.sold} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{formatCurrency(p.revenue)}</p>
                  <p className="text-[10px] text-emerald-400">{p.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={item} className="chart-container relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-violet-400" />
              <h3 className="font-semibold text-white">AI Insights</h3>
              <span className="badge badge-primary text-[9px]">PRO</span>
            </div>
            
            <div className="relative min-h-[180px]">
              {/* If plan is basic or undefined, blur/frosted lock overlay */}
              {(user?.plan === 'basic' || !user?.plan) && (
                <div className="absolute inset-0 bg-[#111118]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-white/5">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
                    <Brain size={20} className="animate-pulse" />
                  </span>
                  <p className="text-xs font-bold text-white mb-1">AI Copilot Locked</p>
                  <p className="text-[10px] text-slate-400 mb-3">Upgrade to Pro or Enterprise to access ML-based sales forecasts.</p>
                  <button 
                    onClick={() => window.location.href = '/dashboard/subscription'}
                    className="btn-primary py-1.5 px-3 text-[10px]"
                  >
                    Unlock Now
                  </button>
                </div>
              )}

              <div className={`space-y-3 ${(user?.plan === 'basic' || !user?.plan) ? 'select-none pointer-events-none blur-[1px]' : ''}`}>
                {aiInsights.map((ins, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start gap-2">
                      <ins.icon size={16} className={ins.type === 'positive' ? 'text-emerald-400' : 'text-amber-400'} />
                      <div>
                        <p className="text-xs font-semibold text-white">{ins.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ins.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <motion.div variants={item} className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Invoices</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All →</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="text-xs font-mono text-indigo-400">{inv.id}</td>
                    <td className="text-xs">{inv.customer}</td>
                    <td className="text-xs font-semibold">{formatCurrency(inv.total)}</td>
                    <td><span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'pending' ? 'badge-warning' : inv.status === 'partial' ? 'badge-primary' : 'badge-danger'}`}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock + Alerts */}
        <motion.div variants={item} className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" /> Low Stock Alerts
            </h3>
            <span className="badge badge-danger">{lowStock.length} items</span>
          </div>
          <div className="space-y-3">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: p.stock <= 10 ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                  border: `1px solid ${p.stock <= 10 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}` }}>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-[11px] text-slate-400">Min: {p.minStock} · Batch: {p.batch}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${p.stock <= 10 ? 'text-red-400' : 'text-amber-400'}`}>{p.stock}</p>
                  <p className="text-[10px] text-slate-500">in stock</p>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">All products are well stocked! ✅</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
