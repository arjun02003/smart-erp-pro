'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calculator, IndianRupee, TrendingUp, TrendingDown, BookOpen, Wallet, CreditCard, Download, Plus, Trash2, X } from 'lucide-react';
import { mockExpenses, mockSalesData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const initialLedgerEntries = [
  { id: 'L001', date: '2026-05-19', particular: 'Sales - Rahul Verma', type: 'credit', amount: 3864, balance: 485000 },
  { id: 'L002', date: '2026-05-19', particular: 'Purchase - Sun Pharma', type: 'debit', amount: 12500, balance: 481136 },
  { id: 'L003', date: '2026-05-18', particular: 'Sales - Priya Singh', type: 'credit', amount: 997, balance: 493636 },
  { id: 'L004', date: '2026-05-18', particular: 'Rent Payment - May', type: 'debit', amount: 25000, balance: 492639 },
  { id: 'L005', date: '2026-05-18', particular: 'Sales - Sneha Reddy', type: 'credit', amount: 6272, balance: 517639 },
  { id: 'L006', date: '2026-05-17', particular: 'Electricity Bill', type: 'debit', amount: 4500, balance: 511367 },
  { id: 'L007', date: '2026-05-17', particular: 'Sales - Rajesh Kumar', type: 'credit', amount: 50400, balance: 515867 },
];

export default function AccountingPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [ledgers, setLedgers] = useState(initialLedgerEntries);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  // Expense form states
  const [expCategory, setExpCategory] = useState('Rent');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPayment, setExpPayment] = useState('Bank Transfer');

  // Ledger form states
  const [particular, setParticular] = useState('');
  const [ledgType, setLedgType] = useState('credit');
  const [ledgAmount, setLedgAmount] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc || !expAmount || Number(expAmount) <= 0) {
      toast.error('Please enter description and valid amount');
      return;
    }

    const amt = Number(expAmount);
    const newExp = {
      id: `EX${String(expenses.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      category: expCategory,
      description: expDesc,
      amount: amt,
      paymentMode: expPayment
    };

    // Calculate new ledger balance
    const lastBalance = ledgers.length > 0 ? ledgers[0].balance : 400000;
    const nextBalance = lastBalance - amt;

    const newLedg = {
      id: `L-EXP-${String(ledgers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      particular: `Expense: ${expDesc}`,
      type: 'debit',
      amount: amt,
      balance: nextBalance
    };

    setExpenses([newExp, ...expenses]);
    setLedgers([newLedg, ...ledgers]);
    setIsExpenseOpen(false);
    toast.success(`Expense added & posted to general ledger! 💸`);

    // Reset Form
    setExpDesc('');
    setExpAmount('');
    setExpCategory('Rent');
    setExpPayment('Bank Transfer');
  };

  const handleAddLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!particular || !ledgAmount || Number(ledgAmount) <= 0) {
      toast.error('Please fill in particulars and valid amount');
      return;
    }

    const amt = Number(ledgAmount);
    const lastBalance = ledgers.length > 0 ? ledgers[0].balance : 400000;
    const nextBalance = ledgType === 'credit' ? lastBalance + amt : lastBalance - amt;

    const newLedg = {
      id: `L0${String(ledgers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      particular,
      type: ledgType,
      amount: amt,
      balance: nextBalance
    };

    setLedgers([newLedg, ...ledgers]);
    setIsLedgerOpen(false);
    toast.success(`Ledger transaction recorded! 📖`);

    // Reset Form
    setParticular('');
    setLedgAmount('');
    setLedgType('credit');
  };

  const handleDeleteExpense = (id: string, amount: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success(`Expense record removed.`);
  };

  const handleDeleteLedger = (id: string) => {
    setLedgers(ledgers.filter(l => l.id !== id));
    toast.success(`Ledger entry removed.`);
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Particulars', 'Debit (INR)', 'Credit (INR)', 'Running Balance (INR)'],
      ...ledgers.map(l => [
        l.date, l.particular, l.type === 'debit' ? l.amount : '', l.type === 'credit' ? l.amount : '', l.balance
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `General_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('P&L ledger report exported as CSV! 📥');
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalRevenue = ledgers.filter(l => l.type === 'credit').reduce((s, l) => s + l.amount, 0) + 400000; // base revenue simulation
  const netProfit = totalRevenue - totalExpenses;
  const cashInHand = ledgers.length > 0 ? ledgers[0].balance : 125000;

  // Sync P&L chart data
  const updatedChartData = mockSalesData.slice(0, 6).map((d, index) => {
    if (d.month === 'Jun') {
      return { ...d, profit: netProfit, expenses: totalExpenses };
    }
    return d;
  });

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator size={24} className="text-orange-400" /> Accounting
          </h1>
          <p className="text-sm text-slate-400 mt-1">Ledger, cash book, P&L, balance sheet & expense tracking</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
            <Download size={14} /> Export Report
          </button>
          <button 
            onClick={() => setIsLedgerOpen(true)} 
            className="btn-secondary text-sm flex items-center gap-1.5 py-2"
          >
            <Plus size={14} /> Post Ledger
          </button>
          <button 
            onClick={() => setIsExpenseOpen(true)} 
            className="btn-primary text-sm flex items-center gap-1.5 py-2"
            id="add-expense-btn"
          >
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, c: 'success', color: '#10b981' },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: TrendingDown, c: 'danger', color: '#ef4444' },
          { label: 'Net Profit (P&L)', value: formatCurrency(netProfit), icon: IndianRupee, c: 'primary', color: '#6366f1' },
          { label: 'Cash in Hand', value: formatCurrency(cashInHand), icon: Wallet, c: 'warning', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.c}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-slate-400">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts & Expenses Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Chart */}
        <motion.div variants={anim} className="chart-container">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-400" /> Profit & Loss Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={updatedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₹${(v/1000)}K`} />
              <Tooltip 
                contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`]}
              />
              <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} name="Profit" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Expenses List */}
        <motion.div variants={anim} className="chart-container flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-red-400" /> Recent Expenses
            </h3>
            <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {expenses.map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <p className="text-sm font-medium text-white">{e.description}</p>
                    <p className="text-[10px] text-slate-500">{e.date} · {e.category} · {e.paymentMode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-red-400">-{formatCurrency(e.amount)}</p>
                    <button 
                      onClick={() => handleDeleteExpense(e.id, e.amount)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ledger Table */}
      <motion.div variants={anim} className="chart-container">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-cyan-400" /> General Ledger / Cash Book
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Particulars</th>
                <th>Debit (Dr)</th>
                <th>Credit (Cr)</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((e) => (
                <tr key={e.id}>
                  <td className="text-xs text-slate-400">{e.date}</td>
                  <td className="text-xs font-semibold text-white">{e.particular}</td>
                  <td className="text-xs text-red-400 font-semibold">{e.type === 'debit' ? formatCurrency(e.amount) : '—'}</td>
                  <td className="text-xs text-emerald-400 font-semibold">{e.type === 'credit' ? formatCurrency(e.amount) : '—'}</td>
                  <td className="text-xs font-bold text-indigo-300">{formatCurrency(e.balance)}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteLedger(e.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal: Add Expense */}
      <AnimatePresence>
        {isExpenseOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsExpenseOpen(false)}
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
                  <CreditCard size={18} className="text-red-400" /> Record Business Expense
                </h3>
                <button onClick={() => setIsExpenseOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Expense Category</label>
                    <select className="input" value={expCategory} onChange={e => setExpCategory(e.target.value)}>
                      <option value="Rent">Shop Rent</option>
                      <option value="Salary">Staff Salary</option>
                      <option value="Electricity">Electricity Bill</option>
                      <option value="Transport">Fuel & Transport</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Other">Other Miscellaneous</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Amount Spent *</label>
                    <input type="number" className="input" placeholder="₹ Amount" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description / Particulars *</label>
                  <input type="text" className="input" placeholder="e.g. AC Repair service bill" value={expDesc} onChange={e => setExpDesc(e.target.value)} required />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Payment Mode</label>
                  <select className="input" value={expPayment} onChange={e => setExpPayment(e.target.value)}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsExpenseOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Post Expense</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Post Ledger Entry */}
      <AnimatePresence>
        {isLedgerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsLedgerOpen(false)}
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
                  <BookOpen size={18} className="text-cyan-400" /> Manual Ledger Entry
                </h3>
                <button onClick={() => setIsLedgerOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddLedger} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Particulars / Details *</label>
                  <input type="text" className="input" placeholder="e.g. Received loan payout" value={particular} onChange={e => setParticular(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Entry Type</label>
                    <select className="input" value={ledgType} onChange={e => setLedgType(e.target.value)}>
                      <option value="credit">Credit (Inflow / Cr)</option>
                      <option value="debit">Debit (Outflow / Dr)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Amount *</label>
                    <input type="number" className="input" placeholder="₹ Amount" value={ledgAmount} onChange={e => setLedgAmount(e.target.value)} required />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsLedgerOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Record Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
