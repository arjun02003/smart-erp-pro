'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Trash2, Eye, Phone, Mail, Award, Download, MapPin, FileText, X } from 'lucide-react';
import { mockCustomers } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Form states for new customer
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGst, setNewGst] = useState('');
  const [newType, setNewType] = useState('Regular');
  const [newOutstanding, setNewOutstanding] = useState('');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      toast.error('Please enter customer name and phone number');
      return;
    }

    const newCust = {
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      name: newName,
      phone: newPhone,
      email: newEmail || 'walkin@smarterp.in',
      address: newAddress || 'General Counter Sales',
      gst: newGst || '',
      outstanding: Number(newOutstanding) || 0,
      totalPurchase: 0,
      loyaltyPoints: 0,
      lastPurchase: new Date().toISOString().split('T')[0],
      type: newType,
    };

    setCustomers([newCust, ...customers]);
    setIsAddOpen(false);
    toast.success(`${newName} added to CRM system! 👤`);

    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewGst('');
    setNewType('Regular');
    setNewOutstanding('');
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast.success(`${name} removed from CRM list.`);
  };

  const handleExport = () => {
    const csvContent = [
      ['Customer ID', 'Customer Name', 'Phone', 'Email', 'Billing Address', 'GSTIN', 'Outstanding (INR)', 'Total Purchases', 'Loyalty Points', 'Last Purchase Date', 'Customer Type'],
      ...customers.map(c => [
        c.id, c.name, c.phone, c.email, c.address, c.gst, c.outstanding, c.totalPurchase, c.loyaltyPoints, c.lastPurchase, c.type
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Customers_CRM_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Customer ledger exported as CSV! 📥');
  };

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone.includes(search) || 
                          c.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = customerFilter === 'All' || c.type === customerFilter;
    return matchesSearch && matchesFilter;
  });

  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-pink-400" /> Customers
          </h1>
          <p className="text-sm text-slate-400 mt-1">CRM, loyalty points & outstanding management</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="btn-primary text-sm flex items-center gap-1.5 py-2"
            id="add-customer-btn"
          >
            <Plus size={14} /> Add Customer
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, c: 'primary' },
          { label: 'Total Outstanding Balance', value: formatCurrency(totalOutstanding), c: 'warning' },
          { label: 'B2B Corporate Clients', value: customers.filter(c => c.type === 'B2B').length, c: 'secondary' },
          { label: 'Active This Week', value: customers.filter(c => c.lastPurchase >= '2026-05-15').length, c: 'success' },
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
            placeholder="Search by name, ID or mobile..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Regular', 'B2B', 'Walk-in'].map(f => (
            <button 
              key={f} 
              onClick={() => setCustomerFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                customerFilter === f 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 bg-white/3 hover:bg-white/5 border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid List */}
      <motion.div variants={anim} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <motion.div key={c.id} whileHover={{ y: -3 }} className="card p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <span className={`badge text-[9px] ${c.type === 'B2B' ? 'badge-primary' : c.type === 'Regular' ? 'badge-success' : 'badge-secondary'}`}>
                    {c.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setSelectedCustomer(c)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                >
                  <Eye size={13} />
                </button>
                <button 
                  onClick={() => handleDeleteCustomer(c.id, c.name)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-1.5"><Phone size={11} /> {c.phone}</p>
              <p className="flex items-center gap-1.5"><Mail size={11} /> {c.email}</p>
              <p className="flex items-center gap-1.5">
                <Award size={11} /> 
                <span className="text-amber-400 font-semibold">{c.loyaltyPoints} pts</span>
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <div>
                <p className="text-[10px] text-slate-500">Total Purchase</p>
                <p className="text-xs font-semibold text-white">{formatCurrency(c.totalPurchase)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Outstanding</p>
                <p className={`text-xs font-semibold ${c.outstanding > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatCurrency(c.outstanding)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal: Add Customer */}
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
                  <Users size={18} className="text-pink-400" /> Add New Customer
                </h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Customer Name *</label>
                  <input type="text" className="input" placeholder="e.g. Aditi Sharma" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Phone Number *</label>
                    <input type="text" className="input" placeholder="e.g. 9876543210" value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                    <input type="email" className="input" placeholder="aditi@company.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Customer Type</label>
                    <select className="input" value={newType} onChange={e => setNewType(e.target.value)}>
                      <option value="Regular">Regular</option>
                      <option value="B2B">B2B</option>
                      <option value="Walk-in">Walk-in</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">GSTIN (Optional)</label>
                    <input type="text" className="input" placeholder="07AAAAA0000A1Z5" value={newGst} onChange={e => setNewGst(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Billing Address</label>
                  <input type="text" className="input" placeholder="e.g. Sector-4, Dwarka, Delhi" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Opening Outstanding Balance (₹)</label>
                  <input type="number" className="input" placeholder="₹ Outstanding" value={newOutstanding} onChange={e => setNewOutstanding(e.target.value)} />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Save Customer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View Customer Profile */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
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
                <h3 className="font-semibold text-white">Customer CRM Profile</h3>
                <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-2" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedCustomer.name}</h4>
                  <p className="text-xs text-indigo-400 capitalize">{selectedCustomer.type} Customer · ID: {selectedCustomer.id}</p>
                </div>
                
                <div className="w-full space-y-2.5 text-xs text-left pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Phone size={11} /> Phone</span><span className="text-white">{selectedCustomer.phone}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Mail size={11} /> Email</span><span className="text-white">{selectedCustomer.email}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Award size={11} /> Loyalty Points</span><span className="text-amber-400 font-semibold">{selectedCustomer.loyaltyPoints} points</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><FileText size={11} /> GSTIN</span><span className="text-white font-mono">{selectedCustomer.gst || 'Not Provided'}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><MapPin size={11} /> Address</span><span className="text-white truncate max-w-[200px]" title={selectedCustomer.address}>{selectedCustomer.address}</span></div>
                  <div className="flex justify-between pt-2 border-t border-white/5"><span className="text-slate-500">Total Purchase</span><span className="text-white font-semibold">{formatCurrency(selectedCustomer.totalPurchase)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Outstanding Balance</span><span className={`font-semibold ${selectedCustomer.outstanding > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(selectedCustomer.outstanding)}</span></div>
                </div>

                <div className="w-full pt-4">
                  <button onClick={() => setSelectedCustomer(null)} className="btn-secondary w-full justify-center text-xs py-2">Close Profile</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
