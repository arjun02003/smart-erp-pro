'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, IndianRupee, AlertTriangle, Settings, CheckCheck, Trash2, Plus, Sparkles } from 'lucide-react';
import { mockNotifications } from '@/lib/mockData';
import { useState } from 'react';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const allNotifications = [
  ...mockNotifications,
  { id: 'N007', type: 'payment', title: 'Payment Overdue', message: 'Invoice INV-2026-007 from Rahul Verma is overdue by 3 days (₹8,736)', time: '8 hrs ago', read: false },
  { id: 'N008', type: 'system', title: 'Software Update', message: 'SmartERP Pro v3.2 available with new AI features', time: '1 day ago', read: true },
  { id: 'N009', type: 'stock', title: 'Auto Reorder Triggered', message: 'Purchase order auto-created for Surgical Gloves (current: 5, min: 15)', time: '1 day ago', read: true },
  { id: 'N010', type: 'order', title: 'GRN Confirmed', message: 'Goods received for PO-2026-041 from Sun Pharma (12 items)', time: '2 days ago', read: true },
];

const iconMap: Record<string, { icon: any; color: string; bg: string }> = {
  stock: { icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  payment: { icon: IndianRupee, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  expiry: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  order: { icon: Package, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  system: { icon: Settings, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(allNotifications);
  
  const unread = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all' 
    ? notifications
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All alerts marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('Cleared all alerts.');
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(notifications.map(n => {
      if (n.id === id) {
        const nextState = !n.read;
        toast.success(nextState ? 'Marked alert as read' : 'Marked alert as unread');
        return { ...n, read: nextState };
      }
      return n;
    }));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification removed.');
  };

  const simulateAlert = () => {
    const alertTemplates = [
      { type: 'stock', title: 'Critical Stock Alert', message: 'Paracetamol 500mg has fallen below safety reserves (45 units left).' },
      { type: 'payment', title: 'B2B Client Payment Credit', message: 'Received ₹45,000 from Amit Patel for INV-2026-002.' },
      { type: 'expiry', title: 'Batch Expiring Soon', message: 'Azithromycin 500mg batch B2026-11 is expiring in less than 30 days!' },
      { type: 'order', title: 'New PO Dispatched', message: 'Supplier Cipla Ltd has dispatched PO PO-2026-042.' },
      { type: 'system', title: 'Backup Successful', message: 'Database compressed & secured backup saved to Cloud storage.' },
    ];

    const randomTemplate = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const newId = `N-${Date.now()}`;
    const newAlert = {
      id: newId,
      type: randomTemplate.type,
      title: randomTemplate.title,
      message: randomTemplate.message,
      time: 'Just now',
      read: false
    };

    setNotifications([newAlert, ...notifications]);
    toast(randomTemplate.title, {
      icon: '🔔',
      style: { background: '#111118', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }
    });
  };

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell size={24} className="text-yellow-400" /> Notifications
          </h1>
          <p className="text-sm text-slate-400 mt-1">Alerts, reminders & system notifications</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto items-center">
          <button 
            onClick={simulateAlert}
            className="btn-secondary text-sm flex items-center gap-1.5 py-2"
          >
            <Sparkles size={14} className="text-yellow-400 fill-yellow-400" /> Simulate Alert
          </button>
          <button 
            onClick={markAllRead} 
            className="btn-secondary text-sm flex items-center gap-1.5 py-2"
            disabled={unread === 0}
          >
            <CheckCheck size={14} /> Mark All Read
          </button>
          <button 
            onClick={handleClearAll} 
            className="btn-secondary text-sm flex items-center gap-1.5 py-2 hover:bg-red-500/10 hover:text-red-400"
            disabled={notifications.length === 0}
          >
            <Trash2 size={14} /> Clear All
          </button>
          <span className="badge badge-danger">{unread} unread</span>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div variants={anim} className="flex gap-2 flex-wrap">
        {['all', 'unread', 'stock', 'payment', 'expiry', 'order', 'system'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              filter === f 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                : 'text-slate-400 bg-white/3 hover:bg-white/5 border border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Notifications List */}
      <motion.div variants={anim} className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.map((n, i) => {
            const cfg = iconMap[n.type] || iconMap.system;
            const Icon = cfg.icon;
            return (
              <motion.div 
                key={n.id} 
                initial={{ opacity: 0, x: -10, y: 5 }} 
                animate={{ opacity: 1, x: 0, y: 0 }} 
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => toggleReadStatus(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer hover:bg-white/3 ${!n.read ? 'border-l-2' : ''}`}
                style={{
                  background: !n.read ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${!n.read ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)'}`,
                  borderLeftColor: !n.read ? cfg.color : undefined,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                  <Icon size={18} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Bell size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No notifications found in this category.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
