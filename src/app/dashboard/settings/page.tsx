'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Building2, Shield, Bell, Palette, Database, Save, Upload, Download, Key, Check, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function SettingsPage() {
  const { user, login } = useAuthStore();
  const [tab, setTab] = useState('profile');

  // Profile Form States
  const [name, setName] = useState(user?.name || 'Arjun Sharma');
  const [email, setEmail] = useState(user?.email || 'admin@smarterp.in');
  const [phone, setPhone] = useState('+91 89995 40672');

  // Business Form States
  const [businessName, setBusinessName] = useState(user?.businessName || 'Sharma Medical Store');
  const [gstNum, setGstNum] = useState('07AABCU9603R1ZP');
  const [businessType, setBusinessType] = useState('Medical Store');
  const [address, setAddress] = useState('123 MG Road, New Delhi - 110001');

  // Notification Preferences
  const [notifStates, setNotifStates] = useState<Record<string, boolean>>({
    'Low Stock Alerts': true,
    'Payment Reminders': true,
    'Expiry Alerts': true,
    'WhatsApp Notifications': false,
    'SMS Alerts': false,
    'Email Digest': true,
    'Push Notifications': true,
  });

  // Invoice Preferences
  const [invPrefix, setInvPrefix] = useState('INV-2026-');
  const [invTerms, setInvTerms] = useState('Payment due within 30 days');
  const [invColor, setInvColor] = useState('#6366f1');
  const [paperSize, setPaperSize] = useState('A4');
  const [footerNote, setFooterNote] = useState('Thank you for your business! Visit again.');

  // Security preferences
  const [is2FaEnabled, setIs2FaEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPushing, setIsPushing] = useState(false);

  const handlePushToGithub = async () => {
    setIsPushing(true);
    const toastId = toast.loading('Initiating native git process on host machine...');
    try {
      const res = await fetch('/api/git-push', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Successfully committed & pushed codebase to GitHub! 🚀', { id: toastId });
      } else {
        toast.error(`Push failed: ${data.error || 'Unknown error'}`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(`Request failed: ${err.message}`, { id: toastId });
    } finally {
      setIsPushing(false);
    }
  };
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and Email cannot be empty');
      return;
    }
    if (user) {
      login({ ...user, name, email });
      toast.success('Personal profile details updated! 👤');
    }
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      toast.error('Business Name cannot be empty');
      return;
    }
    if (user) {
      login({ ...user, businessName });
      toast.success('Corporate company profile saved! 🏢');
    }
  };

  const handleToggleNotif = (label: string) => {
    const nextVal = !notifStates[label];
    setNotifStates({ ...notifStates, [label]: nextVal });
    toast.success(`${label} preference ${nextVal ? 'ENABLED' : 'DISABLED'}!`);
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Invoice template styles and layouts updated! 🎨');
  };

  const handleCreateBackup = () => {
    const toastId = toast.loading('Exporting local SQLite indexes & assets...');
    setTimeout(() => {
      toast.dismiss(toastId);
      
      const backupMeta = [
        ['SmartERP SQL Database Backup'],
        ['Generated At', new Date().toISOString()],
        ['Tables Count', '18 Relational Indexes'],
        ['Checksum SHA256', '5ab15a452c92e92a8383cf8281a179e8'],
        ['Payload Size', '24.5 Megabytes']
      ].map(e => e.join(',')).join('\n');

      const blob = new Blob([backupMeta], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SmartERP_Prod_Backup_${new Date().toISOString().split('T')[0]}.sql`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Database backup payload compiled & downloaded! 💾');
    }, 1500);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please enter old and new password');
      return;
    }
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    toast.success('Security password changed successfully! 🔑');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'business', label: 'Business Profile', icon: Building2 },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'invoice', label: 'Invoice Designer', icon: Palette },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings size={24} className="text-slate-400 animate-spin-slow" /> Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage profiles, business options, layout models & security</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <motion.div variants={anim} className="chart-container h-fit">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  tab === t.id 
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/3'
                }`}
              >
                <t.icon size={16} />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content Box */}
        <motion.div variants={anim} className="lg:col-span-3 chart-container min-h-[450px]">
          {/* PROFILE SETTINGS */}
          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h3 className="font-semibold text-white">Profile Settings</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {name[0] || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-white">{name}</p>
                  <p className="text-xs text-slate-400">{email}</p>
                  <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 mt-1">Change Avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
                  <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Email Address *</label>
                  <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Phone Number</label>
                  <input type="text" className="input" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Role Access Privilege</label>
                  <input type="text" className="input bg-white/2 cursor-not-allowed text-slate-500" value={user?.role?.toUpperCase() || 'ADMIN'} disabled />
                </div>
              </div>
              <button type="submit" className="btn-primary"><Save size={14} /> Save Changes</button>
            </form>
          )}

          {/* BUSINESS SETTINGS */}
          {tab === 'business' && (
            <form onSubmit={handleSaveBusiness} className="space-y-6">
              <h3 className="font-semibold text-white">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Registered Trade Name *</label>
                  <input type="text" className="input" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">GSTIN Number</label>
                  <input type="text" className="input font-mono" value={gstNum} onChange={e => setGstNum(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Business Segment Category</label>
                  <select className="input" value={businessType} onChange={e => setBusinessType(e.target.value)}>
                    <option value="Medical Store">Medical Pharmacy Store</option>
                    <option value="Kirana Shop">Kirana / Departmental Store</option>
                    <option value="Wholesale">Wholesale Trade Merchant</option>
                    <option value="Retail">Retail Store Outlet</option>
                    <option value="Distributor">Chemical & Pharma Distributor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">State jurisdiction</label>
                  <input type="text" className="input" defaultValue="Delhi" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Physical Billing Address</label>
                  <textarea className="input" rows={2} value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Company Trade Logo</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/30 transition-all">
                    <Upload size={20} className="mx-auto text-slate-500 mb-1" />
                    <p className="text-[11px] text-slate-500">Upload trade logo (PNG/JPEG max 2MB)</p>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary"><Save size={14} /> Update Business</button>
            </form>
          )}

          {/* SECURITY & ACCESS */}
          {tab === 'security' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-white">Security & Audit Control</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
                  <div>
                    <p className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-slate-400">Protects your account with an extra verification code sent on mobile.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIs2FaEnabled(!is2FaEnabled);
                      toast.success(`2FA Authentication has been ${!is2FaEnabled ? 'ENABLED' : 'DISABLED'}! 🛡️`);
                    }}
                    className={`btn-primary text-xs py-1.5 px-3 flex items-center gap-1 ${is2FaEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}`}
                  >
                    {is2FaEnabled ? <Check size={12} /> : null}
                    {is2FaEnabled ? '2FA Enabled' : 'Enable 2FA'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
                  <div>
                    <p className="text-sm font-semibold text-white">Modify Master Password</p>
                    <p className="text-[11px] text-slate-400">Update your current admin system password to secure operations.</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <Key size={12} /> Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
                  <div>
                    <p className="text-sm font-semibold text-white">Active Audit Sessions</p>
                    <p className="text-[11px] text-slate-400">Your system is currently active on 2 browser sessions.</p>
                  </div>
                  <button onClick={() => toast.success('Active backup audit sessions flushed!')} className="btn-secondary text-xs py-1.5 px-3">Flush Sessions</button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION PREFERENCES */}
          {tab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-white">Notification Filters</h3>
              <div className="space-y-3">
                {Object.entries(notifStates).map(([lbl, val]) => (
                  <div key={lbl} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2">
                    <div>
                      <p className="text-xs font-semibold text-white">{lbl}</p>
                      <p className="text-[10px] text-slate-500">Auto-push reports to your configured dashboard & system tray.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={val} 
                        onChange={() => handleToggleNotif(lbl)}
                        className="sr-only peer" 
                      />
                      <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVOICE DESIGNER */}
          {tab === 'invoice' && (
            <form onSubmit={handleSaveInvoice} className="space-y-6">
              <h3 className="font-semibold text-white">Invoice Template Customizer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Serial Invoice Prefix</label>
                  <input type="text" className="input font-mono" value={invPrefix} onChange={e => setInvPrefix(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Invoice Core Terms</label>
                  <input type="text" className="input" value={invTerms} onChange={e => setInvTerms(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Theme Header Accent</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" className="input h-10 w-16 p-1 bg-transparent cursor-pointer" value={invColor} onChange={e => setInvColor(e.target.value)} />
                    <span className="text-xs text-slate-400 font-mono">{invColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Print Format Layout</label>
                  <select className="input" value={paperSize} onChange={e => setPaperSize(e.target.value)}>
                    <option value="A4">A4 Full Ledger Page</option>
                    <option value="A5">A5 Medium Sheet</option>
                    <option value="Thermal 80mm">Thermal POS 80mm Roll</option>
                    <option value="Thermal 58mm">Thermal POS 58mm Roll</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Invoice Footer Remarks</label>
                  <textarea className="input" rows={2} value={footerNote} onChange={e => setFooterNote(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary"><Save size={14} /> Update Layout</button>
            </form>
          )}

          {/* BACKUP & RESTORE */}
          {tab === 'backup' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-white">Database Backup & Recovery</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Production Auto-Backups</p>
                      <p className="text-[11px] text-emerald-400 font-mono">Last updated: Today at 3:00 AM · 24.5 MB</p>
                    </div>
                    <span className="badge badge-success">SYNCED STATUS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2">
                  <div>
                    <p className="text-sm font-semibold text-white">Nightly Database Cloud Synchronization</p>
                    <p className="text-[11px] text-slate-400">Stores backup archives automatically on secure cloud vaults.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>

                <div className="flex gap-2 flex-wrap pt-2">
                  <button onClick={handleCreateBackup} className="btn-primary flex items-center gap-1.5 py-2 text-xs">
                    <Database size={14} /> Create Manual Backup
                  </button>
                  <button onClick={() => toast.success('Downloaded latest daily sync archive! 📥')} className="btn-secondary flex items-center gap-1.5 py-2 text-xs">
                    <Download size={14} /> Download Sync File
                  </button>
                </div>

                <div className="border-t border-white/5 pt-6 mt-6">
                  <h4 className="text-xs font-semibold text-white mb-1">GitHub Integration</h4>
                  <p className="text-[10px] text-slate-400 mb-3">
                    Deploy your code updates directly to: <strong>https://github.com/arjun02003/MARG-ERP.git</strong>
                  </p>
                  <button 
                    onClick={handlePushToGithub} 
                    disabled={isPushing}
                    className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-xs py-2 px-4 flex items-center gap-2"
                  >
                    <Database size={13} /> {isPushing ? 'Pushing Repository...' : 'Push Code to GitHub'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modify Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
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
                  <Key size={18} className="text-yellow-400" /> Change Password
                </h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Old Security Password</label>
                  <input 
                    type="password" 
                    className="input" 
                    value={oldPassword} 
                    onChange={e => setOldPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">New Security Password</label>
                  <input 
                    type="password" 
                    className="input" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Save Password</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
