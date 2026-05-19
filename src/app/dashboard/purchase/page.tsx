'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Truck, Plus, Eye, Download, Search, Trash2, X } from 'lucide-react';
import { mockPurchaseOrders, mockSuppliers } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function PurchasePage() {
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);

  // Form states for new PO
  const [supplierName, setSupplierName] = useState(mockSuppliers[0]?.name || 'Sun Pharma Ltd');
  const [poAmount, setPoAmount] = useState('');
  const [poItems, setPoItems] = useState('5');
  const [poStatus, setPoStatus] = useState('pending');

  const handleAddPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poAmount || Number(poAmount) <= 0) {
      toast.error('Please enter a valid purchase order amount');
      return;
    }

    const newPO = {
      id: `PO-2026-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplier: supplierName,
      date: new Date().toISOString().split('T')[0],
      amount: Number(poAmount),
      status: poStatus,
      items: Number(poItems) || 1,
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsAddOpen(false);
    toast.success(`Purchase Order ${newPO.id} created successfully! 📦`);

    // Reset Form
    setSupplierName(mockSuppliers[0]?.name || 'Sun Pharma Ltd');
    setPoAmount('');
    setPoItems('5');
    setPoStatus('pending');
  };

  const handleDeletePO = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
    toast.success(`Purchase Order ${id} has been removed.`);
  };

  const advanceStatus = (id: string) => {
    setPurchaseOrders(purchaseOrders.map(po => {
      if (po.id === id) {
        let nextStatus = 'pending';
        if (po.status === 'pending') nextStatus = 'shipped';
        else if (po.status === 'shipped') nextStatus = 'received';
        else if (po.status === 'received') nextStatus = 'cancelled';
        else nextStatus = 'pending';

        toast.success(`PO ${id} status updated to ${nextStatus.toUpperCase()}!`);
        return { ...po, status: nextStatus };
      }
      return po;
    }));
  };

  const handleExport = () => {
    const csvContent = [
      ['PO Number', 'Supplier Name', 'Order Date', 'Items Quantity', 'Total Amount (INR)', 'Order Status'],
      ...purchaseOrders.map(p => [
        p.id, p.supplier, p.date, p.items, p.amount, p.status
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Purchase_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Purchase ledger exported as CSV! 📥');
  };

  const filtered = purchaseOrders.filter(po => {
    const matchesSearch = po.supplier.toLowerCase().includes(search.toLowerCase()) || 
                          po.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPurchase = purchaseOrders.reduce((s, p) => s + p.amount, 0);
  const pendingPO = purchaseOrders.filter(p => p.status === 'pending' || p.status === 'shipped');
  const receivedPO = purchaseOrders.filter(p => p.status === 'received');

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck size={24} className="text-violet-400" /> Purchase Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Purchase orders, GRN & vendor payments</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="btn-primary text-sm flex items-center gap-1.5 py-2"
            id="add-po-btn"
          >
            <Plus size={14} /> New Purchase Order
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Purchase Orders', value: purchaseOrders.length, c: 'primary' },
          { label: 'Total Procurement Value', value: formatCurrency(totalPurchase), c: 'success' },
          { label: 'Pending Shipments', value: pendingPO.length, c: 'warning' },
          { label: 'Orders Received', value: receivedPO.length, c: 'secondary' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.c}`}>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={anim} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            className="input pl-10 text-sm" 
            placeholder="Search PO number or supplier name..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'received', 'shipped', 'pending', 'cancelled'].map(f => (
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

      {/* Purchase Orders Table */}
      <motion.div variants={anim} className="table-container">
        <table>
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(po => (
              <tr key={po.id}>
                <td className="text-xs font-mono text-indigo-400">{po.id}</td>
                <td className="text-xs font-semibold">{po.supplier}</td>
                <td className="text-xs text-slate-400">{po.date}</td>
                <td className="text-xs text-center">{po.items}</td>
                <td className="text-xs font-semibold">{formatCurrency(po.amount)}</td>
                <td>
                  <button 
                    onClick={() => advanceStatus(po.id)}
                    className={`badge text-[9px] cursor-pointer hover:opacity-80 transition-all ${
                      po.status === 'received' 
                        ? 'badge-success' 
                        : po.status === 'shipped' 
                        ? 'badge-secondary' 
                        : po.status === 'pending'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {po.status}
                  </button>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSelectedPO(po)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <Eye size={13} />
                    </button>
                    <button 
                      onClick={() => handleDeletePO(po.id)}
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

      {/* Modal: Create PO */}
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
                  <Truck size={18} className="text-violet-400" /> New Purchase Order
                </h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddPO} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Select Supplier *</label>
                  <select className="input" value={supplierName} onChange={e => setSupplierName(e.target.value)}>
                    {mockSuppliers.map(sup => (
                      <option key={sup.id} value={sup.name}>{sup.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Order Amount *</label>
                    <input type="number" className="input" placeholder="₹ Amount" value={poAmount} onChange={e => setPoAmount(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Number of Items</label>
                    <input type="number" className="input" placeholder="e.g. 10" value={poItems} onChange={e => setPoItems(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Initial Status</label>
                  <select className="input" value={poStatus} onChange={e => setPoStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="received">Received</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Generate Purchase Order</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View PO Profile */}
      <AnimatePresence>
        {selectedPO && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPO(null)}
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
                  <Truck size={18} className="text-violet-400" /> Purchase Order Details
                </h3>
                <button onClick={() => setSelectedPO(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedPO.supplier}</h4>
                    <p className="text-xs text-indigo-400 mt-0.5">PO Number: {selectedPO.id}</p>
                  </div>
                  <span className={`badge text-xs uppercase ${
                    selectedPO.status === 'received' 
                      ? 'badge-success' 
                      : selectedPO.status === 'shipped' 
                      ? 'badge-secondary' 
                      : selectedPO.status === 'pending'
                      ? 'badge-warning'
                      : 'badge-danger'
                  }`}>
                    {selectedPO.status}
                  </span>
                </div>

                <div className="w-full space-y-2.5 text-xs pt-4 border-t border-white/5">
                  <div className="flex justify-between"><span className="text-slate-500">Order Date</span><span className="text-white font-medium">{selectedPO.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Procured Items</span><span className="text-white font-medium">{selectedPO.items} Products</span></div>
                  <div className="flex justify-between pt-2 border-t border-white/5"><span className="text-slate-300 font-medium">Grand Total</span><span className="text-emerald-400 font-bold text-sm">{formatCurrency(selectedPO.amount)}</span></div>
                </div>

                <div className="pt-4">
                  <button onClick={() => setSelectedPO(null)} className="btn-secondary w-full justify-center text-xs py-2">Close Details</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
