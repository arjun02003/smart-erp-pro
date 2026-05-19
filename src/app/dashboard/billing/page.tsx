'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Plus, Search, Printer, Download, QrCode, Send, Trash2,
  ShoppingCart, IndianRupee, Receipt, Barcode, Mic, CreditCard
} from 'lucide-react';
import { mockProducts, mockCustomers, mockInvoices } from '@/lib/mockData';
import { formatCurrency, calculateGST, generateInvoiceId } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  gst: number;
  hsn: string;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function BillingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [tab, setTab] = useState<'new' | 'history'>('new');

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search)
  );

  const addToCart = (product: typeof mockProducts[0]) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.mrp, qty: 1, gst: product.gst, hsn: product.hsn }]);
    }
    toast.success(`${product.name} added`);
  };

  const removeFromCart = (id: string) => setCart(cart.filter(c => c.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(c => c.id === id ? { ...c, qty } : c));
  };

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalGST = cart.reduce((s, c) => s + (c.price * c.qty * c.gst) / 100, 0);
  const discountAmt = (subtotal * discount) / 100;
  const grandTotal = subtotal + totalGST - discountAmt;

  const handlePrint = () => {
    toast.success('Invoice sent to printer! 🖨️');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt size={24} className="text-emerald-400" /> Billing
          </h1>
          <p className="text-sm text-slate-400 mt-1">Create GST invoices, POS billing & barcode scanning</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('new')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'new' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}>
            New Invoice
          </button>
          <button onClick={() => setTab('history')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'history' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}>
            Invoice History
          </button>
        </div>
      </motion.div>

      {tab === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search */}
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            {/* Customer & Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Customer</label>
                <select className="input" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} id="bill-customer">
                  <option value="">Walk-in Customer</option>
                  {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium">Search Product / Scan Barcode</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input className="input pl-10 pr-20" placeholder="Type name or scan barcode..."
                    value={search} onChange={e => setSearch(e.target.value)} id="product-search" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" title="Barcode">
                      <Barcode size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Voice">
                      <Mic size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map(p => (
                <motion.div key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(p)}
                  className="p-3 rounded-xl cursor-pointer transition-all group"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`badge text-[9px] ${p.stock <= p.minStock ? 'badge-danger' : 'badge-success'}`}>
                      {p.stock} in stock
                    </span>
                    <span className="text-[10px] text-slate-500">{p.gst}% GST</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{p.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">HSN: {p.hsn}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-base font-bold text-emerald-400">{formatCurrency(p.mrp)}</p>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Plus size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cart / Invoice */}
          <motion.div variants={item} className="chart-container sticky top-20">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ShoppingCart size={16} className="text-indigo-400" />
              Current Invoice
              <span className="badge badge-primary ml-auto">{cart.length} items</span>
            </h3>

            {/* Cart Items */}
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                  Add products to start billing
                </div>
              ) : (
                cart.map(c => (
                  <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-500">{formatCurrency(c.price)} × {c.qty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(c.id, c.qty - 1)}
                        className="w-6 h-6 rounded-md bg-white/5 text-white text-xs flex items-center justify-center hover:bg-red-500/20 transition-all">-</button>
                      <span className="w-6 text-center text-xs font-semibold text-white">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, c.qty + 1)}
                        className="w-6 h-6 rounded-md bg-white/5 text-white text-xs flex items-center justify-center hover:bg-emerald-500/20 transition-all">+</button>
                    </div>
                    <p className="text-xs font-semibold text-white w-16 text-right">{formatCurrency(c.price * c.qty)}</p>
                    <button onClick={() => removeFromCart(c.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Discount & Payment */}
            <div className="space-y-3 border-t border-white/5 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Discount %</label>
                  <input type="number" className="input py-1.5 text-xs" value={discount}
                    onChange={e => setDiscount(Number(e.target.value))} id="discount-input" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Payment Mode</label>
                  <select className="input py-1.5 text-xs" value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)} id="payment-mode">
                    <option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option><option>Credit</option>
                  </select>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-slate-400"><span>GST</span><span className="text-cyan-400">+{formatCurrency(totalGST)}</span></div>
                {discount > 0 && <div className="flex justify-between text-slate-400"><span>Discount ({discount}%)</span><span className="text-red-400">-{formatCurrency(discountAmt)}</span></div>}
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/5">
                  <span>Grand Total</span>
                  <span className="text-emerald-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handlePrint} className="btn-primary justify-center text-xs py-2.5" id="print-invoice">
                  <Printer size={14} /> Print
                </button>
                <button className="btn-secondary justify-center text-xs py-2.5 flex items-center gap-1">
                  <Send size={14} /> WhatsApp
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="btn-secondary justify-center text-[10px] py-2 flex items-center gap-1">
                  <QrCode size={12} /> QR
                </button>
                <button className="btn-secondary justify-center text-[10px] py-2 flex items-center gap-1">
                  <Download size={12} /> PDF
                </button>
                <button className="btn-secondary justify-center text-[10px] py-2 flex items-center gap-1">
                  <CreditCard size={12} /> UPI
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Invoice History */
        <motion.div variants={item} className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Invoice History</h3>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"><Download size={13} /> Export</button>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th><th>Customer</th><th>Date</th><th>Items</th><th>Amount</th><th>GST</th><th>Total</th><th>Payment</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="text-xs font-mono text-indigo-400">{inv.id}</td>
                    <td className="text-xs">{inv.customer}</td>
                    <td className="text-xs text-slate-400">{inv.date}</td>
                    <td className="text-xs text-center">{inv.items}</td>
                    <td className="text-xs">{formatCurrency(inv.amount)}</td>
                    <td className="text-xs text-cyan-400">{formatCurrency(inv.gst)}</td>
                    <td className="text-xs font-semibold">{formatCurrency(inv.total)}</td>
                    <td><span className="badge badge-secondary text-[9px]">{inv.paymentMode}</span></td>
                    <td><span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'pending' ? 'badge-warning' : inv.status === 'partial' ? 'badge-primary' : 'badge-danger'}`}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
