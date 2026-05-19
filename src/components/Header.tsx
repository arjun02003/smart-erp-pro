'use client';

import { useAuthStore } from '@/lib/store';
import { Bell, Search, LogOut, ChevronDown, Moon, Sun, Maximize, User } from 'lucide-react';
import { useState } from 'react';
import { mockNotifications } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout, sidebarCollapsed } = useAuthStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header
      className="fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/5"
      style={{
        left: sidebarCollapsed ? 72 : 260,
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        transition: 'left 0.3s ease',
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products, invoices, customers..."
            className="input pl-10 py-2 text-sm bg-white/3"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="global-search"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Quick stats */}
        <div className="hidden lg:flex items-center gap-4 mr-4 text-xs">
          <div className="text-center">
            <p className="text-slate-500">Today&apos;s Sales</p>
            <p className="font-bold text-emerald-400">₹38,900</p>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="text-center">
            <p className="text-slate-500">Pending</p>
            <p className="font-bold text-amber-400">₹1,38,600</p>
          </div>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
            id="notification-bell">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-white/8 overflow-hidden shadow-2xl"
              style={{ background: '#111118' }}>
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <span className="badge badge-primary">{unreadCount} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map(n => (
                  <div key={n.id} className={`p-3 border-b border-white/3 hover:bg-white/3 cursor-pointer transition-all ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                    <div className="flex items-start gap-2">
                      {!n.read && <div className="notif-dot mt-1.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-white/5">
                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
            id="profile-menu">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500">{user?.role || 'admin'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/8 overflow-hidden shadow-2xl"
              style={{ background: '#111118' }}>
              <div className="p-4 border-b border-white/5">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <span className="badge badge-primary mt-2">{user?.plan?.toUpperCase()} Plan</span>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 flex items-center gap-2">
                  <User size={14} /> My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 flex items-center gap-2"
                  onClick={() => router.push('/dashboard/settings')}>
                  <Moon size={14} /> Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  onClick={() => { logout(); router.push('/login'); }}
                  id="logout-btn"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
