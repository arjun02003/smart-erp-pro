'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Plus, Search, Star, Eye, Trash2, Download, X, Mail, Phone, FileText, MapPin, User } from 'lucide-react';
import { mockSuppliers } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Form states for new supplier
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGst, setNewGst] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newOutstanding, setNewOutstanding] = useState('');
  const [newRating, setNewRating] = useState('4.5');

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newContact || !newPhone) {
      toast.error('Please fill in name, contact person, and phone number');
      return;
    }

    const newSup = {
      id: `S${String(suppliers.length + 1).padStart(3, '0')}`,
      name: newName,
      contact: newContact,
      phone: newPhone,
      email: newEmail || 'orders@vendor.com',
      gst: newGst || 'Unregistered',
      address: newAddress || 'India',
      outstanding: Number(newOutstanding) || 0,
      totalPurchase: 0,
      rating: Number(newRating) || 4.5,
    };

    setSuppliers([newSup, ...suppliers]);
    setIsAddOpen(false);
    toast.success(`${newName} added to vendor database! 🚚`);

    // Reset Form
    setNewName('');
    setNewContact('');
    setNewPhone('');
    setNewEmail('');
    setNewGst('');
    setNewAddress('');
    setNewOutstanding('');
    setNewRating('4.5');
  };

  const handleDeleteSupplier = (id: string, name: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.success(`${name} removed from vendor database.`);
  };

  const handleExport = () => {
    const csvContent = [
      ['Supplier ID', 'Supplier Name', 'Contact Person', 'Phone', 'Email', 'GSTIN', 'Address', 'Outstanding Payable (INR)', 'Total Purchases Value', 'Rating (1-5)'],
      ...suppliers.map(s => [
        s.id, s.name, s.contact, s.phone, s.email, s.gst, s.address, s.outstanding, s.totalPurchase, s.rating
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Suppliers_Vendor_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Vendor directory exported as CSV! 📥');
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = suppliers.reduce((s, sup) => s + sup.outstanding, 0);
  const avgRating = (suppliers.reduce((s, sup) => s + sup.rating, 0) / suppliers.length).toFixed(1);

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck size={24} className="text-teal-400" /> Suppliers
          </h1>
          <p className="text-sm text-slate-400 mt-1">Vendor management, purchase tracking & payments</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="btn-primary text-sm flex items-center gap-1.5 py-2"
            id="add-supplier-btn"
          >
            <Plus size={14} /> Add Supplier
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={anim} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length, c: 'primary' },
          { label: 'Outstanding Payable', value: formatCurrency(totalOutstanding), c: 'warning' },
          { label: 'Vendor Directory Rating', value: `${avgRating} ★`, c: 'success' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.c}`}>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search Input */}
      <motion.div variants={anim} className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          className="input pl-10 text-sm" 
          placeholder="Search suppliers by name or contact person..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </motion.div>

      {/* Suppliers Table */}
      <motion.div variants={anim} className="table-container">
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>GSTIN</th>
              <th>Total Purchases</th>
              <th>Outstanding</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-[10px] text-slate-500">{s.address}</p>
                </td>
                <td className="text-xs font-medium text-white">{s.contact}</td>
                <td className="text-xs text-slate-400 font-mono">{s.phone}</td>
                <td className="text-[10px] font-mono text-slate-400">{s.gst}</td>
                <td className="text-xs font-semibold">{formatCurrency(s.totalPurchase)}</td>
                <td className={`text-xs font-semibold ${s.outstanding > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatCurrency(s.outstanding)}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-white">{s.rating}</span>
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSelectedSupplier(s)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <Eye size={13} />
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(s.id, s.name)}
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

      {/* Modal: Add Supplier */}
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
                  <Truck size={18} className="text-teal-400" /> Add New Supplier
                </h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Supplier Company Name *</label>
                  <input type="text" className="input" placeholder="e.g. Cipla Ltd" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Contact Person *</label>
                    <input type="text" className="input" placeholder="e.g. Rajesh Shah" value={newContact} onChange={e => setNewContact(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Phone Number *</label>
                    <input type="text" className="input" placeholder="e.g. 9811122233" value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email ID</label>
                    <input type="email" className="input" placeholder="sales@cipla.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">GSTIN</label>
                    <input type="text" className="input" placeholder="27AAAAA0000A1Z5" value={newGst} onChange={e => setNewGst(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Warehouse/Office Address</label>
                  <input type="text" className="input" placeholder="e.g. Andheri East, Mumbai" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Outstanding Payable (₹)</label>
                    <input type="number" className="input" placeholder="₹ Payable" value={newOutstanding} onChange={e => setNewOutstanding(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Vendor Rating (1.0 - 5.0)</label>
                    <input type="number" step="0.1" min="1" max="5" className="input" placeholder="4.5" value={newRating} onChange={e => setNewRating(e.target.value)} />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Save Supplier</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View Supplier Profile */}
      <AnimatePresence>
        {selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSupplier(null)}
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
                <h3 className="font-semibold text-white">Vendor CRM Profile</h3>
                <button onClick={() => setSelectedSupplier(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-2" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                  {selectedSupplier.name[0]}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedSupplier.name}</h4>
                  <p className="text-xs text-teal-400 capitalize">Partner Vendor · ID: {selectedSupplier.id}</p>
                </div>
                
                <div className="w-full space-y-2.5 text-xs text-left pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><User size={11} /> Contact</span><span className="text-white">{selectedSupplier.contact}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Phone size={11} /> Phone</span><span className="text-white font-mono">{selectedSupplier.phone}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><Mail size={11} /> Email</span><span className="text-white">{selectedSupplier.email}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><FileText size={11} /> GSTIN</span><span className="text-white font-mono">{selectedSupplier.gst}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500 flex items-center gap-1"><MapPin size={11} /> Address</span><span className="text-white">{selectedSupplier.address}</span></div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5"><span className="text-slate-500">Total Purchased</span><span className="text-white font-semibold">{formatCurrency(selectedSupplier.totalPurchase)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Outstanding Payable</span><span className={`font-semibold ${selectedSupplier.outstanding > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(selectedSupplier.outstanding)}</span></div>
                </div>

                <div className="w-full pt-4">
                  <button onClick={() => setSelectedSupplier(null)} className="btn-secondary w-full justify-center text-xs py-2">Close Profile</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
