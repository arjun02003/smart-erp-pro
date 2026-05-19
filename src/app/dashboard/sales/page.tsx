'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { IndianRupee, Download, Eye, Plus, Search, Trash2, X, AlertCircle } from 'lucide-react';
import { mockInvoices, mockSalesData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function SalesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Form states for new invoice
  const [customerName, setCustomerName] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [items, setItems] = useState('1');
  const [paymentMode, setPaymentMode] = useState('UPI');

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !subtotal || Number(subtotal) <= 0) {
      toast.error('Please enter customer name and valid sales amount');
      return;
    }

    const sub = Number(subtotal);
    const calculatedGst = Math.round(sub * 0.12);
    const calculatedTotal = sub + calculatedGst;

    const newInv = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: customerName,
      date: new Date().toISOString().split('T')[0],
      amount: sub,
      gst: calculatedGst,
      total: calculatedTotal,
      status: paymentStatus,
      items: Number(items) || 1,
      paymentMode: paymentStatus === 'pending' ? 'Credit' : paymentMode,
    };

    setInvoices([newInv, ...invoices]);
    setIsAddOpen(false);
    toast.success(`Sales invoice ${newInv.id} created! 🧾`);

    // Reset Form
    setCustomerName('');
    setSubtotal('');
    setPaymentStatus('paid');
    setItems('1');
    setPaymentMode('UPI');
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
    toast.success(`Invoice ${id} has been removed.`);
  };

  const toggleStatus = (id: string) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        const nextStatus = inv.status === 'paid' ? 'pending' : 'paid';
        toast.success(`Invoice ${id} updated to ${nextStatus.toUpperCase()}`);
        return {
          ...inv,
          status: nextStatus,
          paymentMode: nextStatus === 'paid' ? 'UPI' : 'Credit'
        };
      }
      return inv;
    }));
  };

  const handleExport = () => {
    const csvContent = [
      ['Invoice ID', 'Customer Name', 'Date', 'Amount (Subtotal)', 'GST', 'Total (INR)', 'Payment Status', 'Items Count', 'Payment Mode'],
      ...invoices.map(i => [
        i.id, i.customer, i.date, i.amount, i.gst, i.total, i.status, i.items, i.paymentMode
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Sales ledger exported as CSV! 📥');
  };

  const filtered = invoices.filter(inv => {
    const matchesSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) || 
                          inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = invoices.reduce((s, i) => s + i.total, 0);
  const paidSales = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const pending = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0);

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <IndianRupee size={24} className="text-amber-400" /> Sales Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Track orders, payments, and customer analytics</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="btn-primary text-sm flex items-center gap-1.5 py-2"
            id="add-invoice-btn"
          >
            <Plus size={14} /> Create Sales Order
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sales Ledger', value: formatCurrency(totalSales), c: 'primary' },
          { label: 'Collected Amount', value: formatCurrency(paidSales), c: 'success' },
          { label: 'Outstanding Payments', value: formatCurrency(pending), c: 'warning' },
          { label: 'Invoices Issued', value: invoices.length, c: 'secondary' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.c}`}>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Monthly Sales Trend Chart */}
      <motion.div variants={anim} className="chart-container">
        <h3 className="font-semibold text-white mb-4">Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockSalesData}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₹${(v/1000)}K`} />
            <Tooltip 
              contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
              formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']}
            />
            <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fill="url(#sg)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={anim} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            className="input pl-10 text-sm" 
            placeholder="Search invoice number or customer name..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'paid', 'pending', 'partial', 'overdue'].map(f => (
            <button 
              key={f} 
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === f 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 bg-white/3 hover:bg-white/5 border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Sales Orders Table */}
      <motion.div variants={anim} className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td className="text-xs font-mono text-indigo-400">{inv.id}</td>
                <td className="text-xs font-semibold">{inv.customer}</td>
                <td className="text-xs text-slate-400">{inv.date}</td>
                <td className="text-xs text-center">{inv.items}</td>
                <td className="text-xs font-semibold">{formatCurrency(inv.total)}</td>
                <td>
                  <span className="badge badge-secondary text-[9px]">
                    {inv.paymentMode}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => toggleStatus(inv.id)}
                    className={`badge text-[9px] cursor-pointer hover:opacity-80 transition-all ${
                      inv.status === 'paid' 
                        ? 'badge-success' 
                        : inv.status === 'pending' 
                        ? 'badge-warning' 
                        : inv.status === 'partial'
                        ? 'badge-primary'
                        : 'badge-danger'
                    }`}
                  >
                    {inv.status}
                  </button>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <Eye size={13} />
                    </button>
                    <button 
                      onClick={() => handleDeleteInvoice(inv.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal: Create Invoice */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
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
                  <IndianRupee size={18} className="text-amber-400" /> Create Sales Order
                </h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddInvoice} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Customer Name *</label>
                  <input type="text" className="input" placeholder="e.g. Ramesh Patel" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Sales Amount (Subtotal) *</label>
                    <input type="number" className="input" placeholder="₹ Subtotal" value={subtotal} onChange={e => setSubtotal(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Number of Items</label>
                    <input type="number" className="input" placeholder="e.g. 5" value={items} onChange={e => setItems(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Payment Status</label>
                    <select className="input" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Payment Mode</label>
                    <select className="input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)} disabled={paymentStatus === 'pending'}>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Estimated GST (12%):</span><span className="text-white font-semibold">₹{subtotal ? Math.round(Number(subtotal) * 0.12).toLocaleString('en-IN') : '0'}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Total Sales Value (MRP):</span><span className="text-emerald-400 font-bold">₹{subtotal ? Math.round(Number(subtotal) * 1.12).toLocaleString('en-IN') : '0'}</span></div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Generate Sales Order</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View Sales Order Profile */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
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
                  <IndianRupee size={18} className="text-amber-400" /> Sales Invoice Details
                </h3>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedInvoice.customer}</h4>
                    <p className="text-xs text-indigo-400 mt-0.5">Invoice: {selectedInvoice.id}</p>
                  </div>
                  <span className={`badge text-xs uppercase ${
                    selectedInvoice.status === 'paid' 
                      ? 'badge-success' 
                      : selectedInvoice.status === 'pending' 
                      ? 'badge-warning' 
                      : selectedInvoice.status === 'partial'
                      ? 'badge-primary'
                      : 'badge-danger'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>

                <div className="w-full space-y-2.5 text-xs pt-4 border-t border-white/5">
                  <div className="flex justify-between"><span className="text-slate-500">Sales Date</span><span className="text-white font-medium">{selectedInvoice.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Items Purchased</span><span className="text-white font-medium">{selectedInvoice.items} Items</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment Mode</span><span className="text-white font-medium">{selectedInvoice.paymentMode}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal Amount</span><span className="text-white font-semibold">{formatCurrency(selectedInvoice.amount)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Estimated GST (12%)</span><span className="text-white font-semibold">{formatCurrency(selectedInvoice.gst)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-white/5"><span className="text-slate-300 font-medium">Grand Total</span><span className="text-emerald-400 font-bold text-sm">{formatCurrency(selectedInvoice.total)}</span></div>
                </div>

                <div className="pt-4">
                  <button onClick={() => setSelectedInvoice(null)} className="btn-secondary w-full justify-center text-xs py-2">Close Details</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
