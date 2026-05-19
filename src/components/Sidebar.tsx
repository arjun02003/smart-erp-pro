'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Package, BarChart3, Users, Truck,
  UserCog, CreditCard, Settings, Shield, Bell, Building2,
  Receipt, Calculator, LogOut, ChevronLeft, ChevronRight,
  Sparkles, Crown, IndianRupee, Boxes, ClipboardList
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', color: '#6366f1' },
  { label: 'Billing', icon: Receipt, href: '/dashboard/billing', color: '#10b981' },
  { label: 'Inventory', icon: Package, href: '/dashboard/inventory', color: '#06b6d4' },
  { label: 'Sales', icon: IndianRupee, href: '/dashboard/sales', color: '#f59e0b' },
  { label: 'Purchase', icon: Truck, href: '/dashboard/purchase', color: '#8b5cf6' },
  { label: 'Customers', icon: Users, href: '/dashboard/customers', color: '#ec4899' },
  { label: 'Suppliers', icon: Boxes, href: '/dashboard/suppliers', color: '#14b8a6' },
  { label: 'Accounting', icon: Calculator, href: '/dashboard/accounting', color: '#f97316' },
  { label: 'GST & Tax', icon: ClipboardList, href: '/dashboard/gst', color: '#ef4444' },
  { label: 'Reports', icon: BarChart3, href: '/dashboard/reports', color: '#06b6d4' },
  { label: 'Employees', icon: UserCog, href: '/dashboard/employees', color: '#a855f7' },
  { label: 'Notifications', icon: Bell, href: '/dashboard/notifications', color: '#eab308' },
  { label: 'Subscription', icon: CreditCard, href: '/dashboard/subscription', color: '#f59e0b' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings', color: '#64748b' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, sidebarCollapsed, toggleSidebar, logout } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0c0c14 0%, #0a0a0f 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
              <p className="font-bold text-sm text-white tracking-tight">SmartERP Pro</p>
              <p className="text-[10px] text-indigo-400 font-medium">CLOUD EDITION</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`sidebar-item ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}>
                <item.icon size={19} style={{ color: isActive ? item.color : undefined, flexShrink: 0 }} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Plan badge */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl" style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={14} className="text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400 uppercase">{user?.plan || 'Pro'} Plan</span>
            </div>
            <p className="text-[10px] text-slate-400">Upgrade for AI & Multi-Branch</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User section */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {user?.name?.[0] || 'A'}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@smarterp.in'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse btn */}
      <button onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#16161f] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all z-50">
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
