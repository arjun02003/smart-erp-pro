'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Package, Search, Plus, Edit3, Trash2, Download, AlertTriangle, Eye, X } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function InventoryPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Medicine');
  const [hsn, setHsn] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [gst, setGst] = useState('12');
  const [batch, setBatch] = useState('');
  const [expiry, setExpiry] = useState('');
  const [supplier, setSupplier] = useState('');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || 
     p.barcode.includes(search) || 
     p.hsn.includes(search))
  );

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock <= p.minStock);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !minStock) {
      toast.error('Please enter name, price, stock and minimum stock');
      return;
    }

    const newProd = {
      id: `P0${products.length + 1}`,
      name,
      category,
      hsn: hsn || '30049099',
      barcode: barcode || Math.floor(1000000000000 + Math.random() * 900000000000).toString(),
      price: Number(price),
      mrp: Number(mrp) || Number(price) * 1.2,
      stock: Number(stock),
      minStock: Number(minStock),
      batch: batch || `B${new Date().getFullYear()}-${String(products.length + 1).padStart(2, '0')}`,
      expiry: expiry || '2028-12-31',
      gst: Number(gst),
      supplier: supplier || 'General Supplier',
      unit: 'Piece',
      warehouse: 'Main'
    };

    setProducts([newProd, ...products]);
    setShowAdd(false);
    toast.success(`${name} added to inventory! 📦`);

    // Reset Form
    setName('');
    setCategory('Medicine');
    setHsn('');
    setBarcode('');
    setPrice('');
    setMrp('');
    setStock('');
    setMinStock('');
    setGst('12');
    setBatch('');
    setExpiry('');
    setSupplier('');
  };

  const handleDelete = (id: string, name: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success(`${name} removed from inventory.`);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Category', 'HSN', 'Barcode', 'Price', 'MRP', 'Stock', 'Min Stock', 'Batch', 'Expiry', 'GST %', 'Supplier'],
      ...products.map(p => [
        p.id, p.name, p.category, p.hsn, p.barcode, p.price, p.mrp, p.stock, p.minStock, p.batch, p.expiry, p.gst, p.supplier
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Inventory_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Inventory report exported as CSV! 📥');
  };

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={24} className="text-cyan-400" /> Inventory Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Track products, batches, expiry & warehouse stock</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)} 
            className="btn-primary text-sm flex items-center gap-1.5 py-2" 
            id="add-product-btn"
          >
            <Plus size={14} /> Add Product
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, c: 'primary' },
          { label: 'Stock Value', value: formatCurrency(totalValue), c: 'success' },
          { label: 'Low Stock Items', value: lowStock.length, c: 'warning' },
          { label: 'Categories', value: categories.length - 1, c: 'secondary' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.c}`}>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Add Product Form Drawer/Panel */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="card p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Plus size={18} className="text-cyan-400" /> Add New Inventory Item
              </h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Product Name *</label>
                  <input className="input text-sm py-2" placeholder="e.g. Vitamin C 500mg" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Category</label>
                  <select className="input text-sm py-2" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Medicine">Medicine</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Supplement">Supplement</option>
                    <option value="Device">Device</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">HSN Code</label>
                  <input className="input text-sm py-2" placeholder="e.g. 30049099" value={hsn} onChange={e => setHsn(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Barcode</label>
                  <input className="input text-sm py-2" placeholder="e.g. 8901234567" value={barcode} onChange={e => setBarcode(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Purchase Price (₹) *</label>
                  <input type="number" className="input text-sm py-2" placeholder="e.g. 150" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">MRP (₹)</label>
                  <input type="number" className="input text-sm py-2" placeholder="e.g. 200" value={mrp} onChange={e => setMrp(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Stock Quantity *</label>
                  <input type="number" className="input text-sm py-2" placeholder="e.g. 100" value={stock} onChange={e => setStock(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Min Stock Alert *</label>
                  <input type="number" className="input text-sm py-2" placeholder="e.g. 15" value={minStock} onChange={e => setMinStock(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">GST Rate (%)</label>
                  <select className="input text-sm py-2" value={gst} onChange={e => setGst(e.target.value)}>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Batch Number</label>
                  <input className="input text-sm py-2" placeholder="e.g. B2026-09" value={batch} onChange={e => setBatch(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Expiry Date</label>
                  <input type="date" className="input text-sm py-2 text-slate-300" value={expiry} onChange={e => setExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Supplier</label>
                  <input className="input text-sm py-2" placeholder="e.g. Cipla Ltd" value={supplier} onChange={e => setSupplier(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary text-sm py-2">Add Product</button>
                <button type="button" className="btn-secondary text-sm py-2" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <motion.div variants={anim} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            className="input pl-10 text-sm" 
            placeholder="Search name, barcode or HSN..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                catFilter === c 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 bg-white/3 hover:bg-white/5 border border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table List */}
      <motion.div variants={anim} className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>HSN</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Stock</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>GST</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{p.barcode}</p>
                </td>
                <td>
                  <span className="badge badge-secondary text-[9px]">{p.category}</span>
                </td>
                <td className="text-xs text-slate-400 font-mono">{p.hsn}</td>
                <td className="text-xs">{formatCurrency(p.price)}</td>
                <td className="text-xs font-semibold">{formatCurrency(p.mrp)}</td>
                <td>
                  <span className={`text-sm font-bold ${p.stock <= p.minStock ? 'text-red-400' : 'text-emerald-400'}`}>
                    {p.stock}
                  </span>
                  {p.stock <= p.minStock && (
                    <AlertTriangle size={12} className="inline ml-1 text-amber-400" />
                  )}
                </td>
                <td className="text-xs text-slate-400">{p.batch}</td>
                <td className="text-xs text-slate-400">{p.expiry}</td>
                <td className="text-xs">{p.gst}%</td>
                <td>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <Eye size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
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

      {/* Modal: View Product Profile */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
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
                  <Package size={18} className="text-cyan-400" /> Product Details
                </h3>
                <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedProduct.name}</h4>
                  <p className="text-xs text-cyan-400 mt-0.5">{selectedProduct.category} · Barcode: {selectedProduct.barcode}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1.5">
                    <p className="text-slate-500">Purchase Price</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">MRP (Retail)</p>
                    <p className="text-sm font-semibold text-white">{formatCurrency(selectedProduct.mrp)}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">Available Stock</p>
                    <p className={`text-sm font-bold ${selectedProduct.stock <= selectedProduct.minStock ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedProduct.stock} units
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">Minimum Stock Alert</p>
                    <p className="text-sm text-slate-300">{selectedProduct.minStock} units</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">Batch Code</p>
                    <p className="text-sm text-slate-300 font-mono">{selectedProduct.batch}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">Expiry Date</p>
                    <p className="text-sm text-slate-300">{selectedProduct.expiry}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">GST Rate</p>
                    <p className="text-sm text-slate-300">{selectedProduct.gst}%</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-slate-500">HSN Code</p>
                    <p className="text-sm text-slate-300 font-mono">{selectedProduct.hsn}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs">
                  <p className="text-slate-500">Preferred Supplier</p>
                  <p className="text-sm text-slate-300 font-semibold mt-0.5">{selectedProduct.supplier}</p>
                </div>

                <div className="pt-4">
                  <button onClick={() => setSelectedProduct(null)} className="btn-secondary w-full justify-center text-xs py-2">Close Details</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
