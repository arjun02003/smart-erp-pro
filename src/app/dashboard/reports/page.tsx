'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BarChart3, Download, FileText, Brain, TrendingUp, Package, Users, IndianRupee, Calendar, X, Star } from 'lucide-react';
import { mockSalesData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const reportTypes = [
  { id: 'daily', name: 'Daily Sales Report', icon: IndianRupee, color: '#6366f1', desc: 'Detailed day-wise sales breakdown' },
  { id: 'pl', name: 'Profit & Loss Statement', icon: TrendingUp, color: '#10b981', desc: 'Revenue vs expenses analysis' },
  { id: 'inventory', name: 'Inventory Summary', icon: Package, color: '#06b6d4', desc: 'Stock levels, batch & expiry status' },
  { id: 'customer', name: 'Customer Outstanding', icon: Users, color: '#ec4899', desc: 'Customer purchase & outstandingCRM' },
  { id: 'purchase', name: 'Purchase Report', icon: FileText, color: '#f59e0b', desc: 'Vendor-wise purchase ledger analysis' },
  { id: 'gst', name: 'GST Tax Returns (GSTR)', icon: FileText, color: '#ef4444', desc: 'GSTR-1, 3B ready compliance reports' },
  { id: 'ai_predict', name: 'AI Sales Forecast', icon: Brain, color: '#8b5cf6', desc: 'ML-based sales & stock forecasting', pro: true },
  { id: 'ai_profit', name: 'AI Profit Optimizer', icon: Brain, color: '#a855f7', desc: 'Smart tips to cut costs & lift margin', pro: true },
];

const pieData = [
  { name: 'Medicine', value: 45, color: '#6366f1' },
  { name: 'Healthcare', value: 20, color: '#06b6d4' },
  { name: 'Supplement', value: 15, color: '#10b981' },
  { name: 'Devices', value: 12, color: '#f59e0b' },
  { name: 'Safety', value: 8, color: '#ef4444' },
];

export default function ReportsPage() {
  const [range, setRange] = useState('12'); // '3', '6', '12' months
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter Sales Data based on Selected Months Range
  const filteredSalesData = mockSalesData.slice(-Number(range));

  const handleExport = (type: string) => {
    setIsExporting(true);
    const toastId = toast.loading(`Generating unified business ${type} report...`);
    
    setTimeout(() => {
      toast.dismiss(toastId);
      setIsExporting(false);

      // Trigger dummy file download
      const reportHeaders = ['Month', 'Sales', 'Purchases', 'Profit', 'Expenses'];
      const csvContent = [
        reportHeaders,
        ...filteredSalesData.map(d => [d.month, d.sales, d.purchases, d.profit, d.expenses])
      ].map(e => e.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SmartERP_Business_Report_${new Date().toISOString().split('T')[0]}.${type === 'PDF' ? 'pdf' : 'xlsx'}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${type} statement exported successfully! 📂`);
    }, 1500);
  };

  const { user } = useAuthStore();
  const currentPlan = user?.plan || 'pro';

  const openReportModal = (report: any) => {
    if (report.pro && (currentPlan === 'basic' || currentPlan === 'free')) {
      toast.error(`🔒 AI Reports are locked on Basic. Upgrade to Pro or Enterprise to access!`);
      return;
    }
    setSelectedReport(report);
    toast.success(`Loaded ${report.name} preview`);
  };

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={24} className="text-cyan-400" /> Reports & Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">AI-powered reports, PDF/Excel export, business insights</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            onClick={() => handleExport('PDF')} 
            disabled={isExporting}
            className="btn-secondary text-sm flex items-center gap-1.5 py-2"
          >
            <Download size={14} /> PDF
          </button>
          <button 
            onClick={() => handleExport('Excel')} 
            disabled={isExporting}
            className="btn-primary text-sm flex items-center gap-1.5 py-2"
          >
            <Download size={14} /> Excel
          </button>
        </div>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div variants={anim} className="flex items-center gap-2 bg-white/3 border border-white/5 p-1 rounded-xl w-fit">
        {[
          { label: 'Last 3 Months', value: '3' },
          { label: 'Last 6 Months', value: '6' },
          { label: 'Full 12 Months', value: '12' },
        ].map(btn => (
          <button 
            key={btn.value} 
            onClick={() => setRange(btn.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              range === btn.value 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </motion.div>

      {/* Report Cards Grid */}
      <motion.div variants={anim} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((r, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -3 }} 
            onClick={() => openReportModal(r)}
            className="card p-5 cursor-pointer group hover:border-indigo-500/20 transition-all"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ background: `${r.color}15` }}>
              <r.icon size={18} style={{ color: r.color }} />
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{r.name}</p>
            <p className="text-[11px] text-slate-500 mt-1">{r.desc}</p>
            {r.pro && (
              <span className="badge badge-primary text-[8px] mt-2 inline-flex items-center gap-0.5">
                <Star size={8} className="fill-indigo-300 text-indigo-300" /> PRO FEATURE
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend line */}
        <motion.div variants={anim} className="chart-container">
          <h3 className="font-semibold text-white mb-4">Revenue Trend ({range} Months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={filteredSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₹${(v/1000)}K`} />
              <Tooltip 
                contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
              />
              <Line type="monotone" dataKey="sales" name="Sales" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category breakdown pie */}
        <motion.div variants={anim} className="chart-container">
          <h3 className="font-semibold text-white mb-4">Category-wise Revenue Contribution</h3>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => `${Number(value)}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map(c => (
              <span key={c.name} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name} ({c.value}%)
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly comparison table */}
      <motion.div variants={anim} className="chart-container">
        <h3 className="font-semibold text-white mb-4">Monthly Performance Summary</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales Volume</th>
                <th>Purchases</th>
                <th>Net Profit</th>
                <th>Expenses</th>
                <th>Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesData.map((m, i) => (
                <tr key={i}>
                  <td className="text-xs font-semibold text-white">{m.month}</td>
                  <td className="text-xs font-semibold text-indigo-400">{formatCurrency(m.sales)}</td>
                  <td className="text-xs text-slate-400">{formatCurrency(m.purchases)}</td>
                  <td className="text-xs font-semibold text-emerald-400">{formatCurrency(m.profit)}</td>
                  <td className="text-xs text-red-400">{formatCurrency(m.expenses)}</td>
                  <td>
                    <span className="badge badge-success text-[9px]">
                      {((m.profit / m.sales) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal: Selected Report Details & Predictions */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl p-6 border border-white/8 shadow-2xl z-10"
              style={{ background: '#111118' }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <selectedReport.icon size={18} style={{ color: selectedReport.color }} />
                  {selectedReport.name}
                </h3>
                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4 text-xs text-slate-300">
                <p className="text-slate-400">{selectedReport.desc}</p>

                {selectedReport.id === 'daily' && (
                  <div className="space-y-2 bg-white/2 p-3 rounded-xl border border-white/5 font-mono">
                    <p className="text-[10px] text-slate-500">TODAY SUMMARY (19 MAY 2026)</p>
                    <div className="flex justify-between"><span>Total Invoices:</span><span className="text-white">8 invoices</span></div>
                    <div className="flex justify-between"><span>Gross Receipts:</span><span className="text-emerald-400">₹38,900</span></div>
                    <div className="flex justify-between"><span>Estimated Taxes:</span><span className="text-white">₹4,668</span></div>
                  </div>
                )}

                {selectedReport.id === 'pl' && (
                  <div className="space-y-2 bg-white/2 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-mono text-center">MONTH-TO-DATE P&L</p>
                    <div className="flex justify-between"><span>Operational Income:</span><span className="text-white">₹4,85,000</span></div>
                    <div className="flex justify-between"><span>Cost of Goods Sold:</span><span className="text-amber-400">₹2,50,000</span></div>
                    <div className="flex justify-between"><span>Operational Expenses:</span><span className="text-red-400">₹47,000</span></div>
                    <div className="flex justify-between pt-1 border-t border-white/5 font-bold"><span>Net profit:</span><span className="text-emerald-400">₹1,88,000</span></div>
                  </div>
                )}

                {selectedReport.id === 'inventory' && (
                  <div className="space-y-2 bg-white/2 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between"><span>Total SKU Count:</span><span className="text-white">12 Products</span></div>
                    <div className="flex justify-between"><span>Warehouse Valuation:</span><span className="text-emerald-400">₹2,38,330</span></div>
                    <div className="flex justify-between text-red-400"><span>Low Stock SKUs:</span><span>2 Items</span></div>
                  </div>
                )}

                {selectedReport.id === 'gst' && (
                  <div className="space-y-2 bg-white/2 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-mono">Q1 GSTR-1 AUTO-PREPARATION STATUS</p>
                    <div className="flex justify-between"><span>Output Tax liability:</span><span className="text-white">₹13,860</span></div>
                    <div className="flex justify-between"><span>Input Tax Credit (ITC):</span><span className="text-emerald-400">₹8,920</span></div>
                    <div className="flex justify-between font-bold"><span>Net GST Payable:</span><span className="text-red-400">₹4,940</span></div>
                  </div>
                )}

                {selectedReport.pro && (
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-300">
                      <p className="font-semibold flex items-center gap-1.5 mb-1">
                        <Brain size={14} /> Smart AI Copilot Insights
                      </p>
                      {selectedReport.id === 'ai_predict' ? (
                        <p className="text-[11px] leading-relaxed">
                          Based on historic sales data, prescription demand is forecasted to increase by 14% next month. We recommend restocking <strong>Vitamin D3</strong> and <strong>Amoxicillin</strong> by 20th May to avoid inventory stockouts.
                        </p>
                      ) : (
                        <p className="text-[11px] leading-relaxed">
                          Your rent and utility charges have risen by 8% this quarter. Consolidating your procurement orders with <strong>Cipla Ltd</strong> could save up to 4.5% on bulk delivery logistics cost.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => handleExport(selectedReport.name)}
                    className="btn-primary w-full justify-center text-xs py-2"
                  >
                    Download Detailed {selectedReport.pro ? 'AI' : ''} PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
