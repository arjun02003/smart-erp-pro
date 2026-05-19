'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Plus, Search, Shield, Clock, Activity, Eye, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
import { mockEmployees } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/lib/store';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function EmployeesPage() {
  const { user } = useAuthStore();
  const currentPlan = user?.plan || 'pro';

  const planLimits: Record<string, number> = {
    free: 2,
    basic: 3,
    pro: 10,
    enterprise: 100,
  };

  const currentLimit = planLimits[currentPlan] || 10;

  const [employees, setEmployees] = useState(mockEmployees);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);

  const isLimitReached = employees.length >= currentLimit;

  // Form states for new employee
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'manager' | 'employee'>('employee');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newDepartment, setNewDepartment] = useState('Sales');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone || !newSalary) {
      toast.error('Please fill in all fields');
      return;
    }

    const newEmp = {
      id: `E00${employees.length + 1}`,
      name: newName,
      role: newRole,
      email: newEmail,
      phone: newPhone,
      salary: Number(newSalary),
      department: newDepartment,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      attendance: 100,
      lastLogin: 'Never logged in',
    };

    setEmployees([...employees, newEmp]);
    setIsAddModalOpen(false);
    toast.success(`${newName} added successfully! 👤`);

    // Reset fields
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewSalary('');
    setNewDepartment('Sales');
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployees(employees.filter(e => e.id !== id));
    toast.success(`${name} has been removed.`);
  };

  const toggleStatus = (id: string) => {
    setEmployees(employees.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'active' ? 'on_leave' : 'active';
        toast.success(`${e.name} is now ${nextStatus === 'active' ? 'Active' : 'On Leave'}`);
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  const handlePaySalary = (name: string, salary: number) => {
    const toastId = toast.loading(`Processing salary of ${formatCurrency(salary)}...`);
    setTimeout(() => {
      toast.success(`Salary paid to ${name}! 💸`, { id: toastId });
    }, 1500);
  };

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      {/* Header */}
      <motion.div variants={anim} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCog size={24} className="text-purple-400" /> Employee Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Attendance, permissions, salary & activity logs</p>
        </div>
        <button 
          onClick={() => {
            if (isLimitReached) {
              toast.error(`🔒 ${currentPlan.toUpperCase()} plan limit reached (Max ${currentLimit} staff). Upgrade to add more!`);
              return;
            }
            setIsAddModalOpen(true);
          }} 
          className="btn-primary text-sm flex items-center gap-1.5 self-start sm:self-auto" 
          id="add-employee-btn"
        >
          <Plus size={14} /> Add Employee
        </button>
      </motion.div>

      {isLimitReached && (
        <motion.div variants={anim} className="p-4 rounded-xl flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertCircle size={16} />
          <span>You have reached the staff limit of <strong>{currentLimit}</strong> for the <strong>{currentPlan.toUpperCase()}</strong> plan. Upgrade your plan to add more team members.</span>
          <button onClick={() => window.location.href = '/dashboard/subscription'} className="ml-auto text-indigo-400 font-bold hover:underline">Upgrade Plan</button>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, c: 'primary' },
          { label: 'Active Today', value: employees.filter(e => e.status === 'active').length, c: 'success' },
          { label: 'On Leave', value: employees.filter(e => e.status === 'on_leave').length, c: 'warning' },
          { label: 'Total Salary', value: formatCurrency(employees.reduce((s, e) => s + e.salary, 0)), c: 'secondary' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.c}`}>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={anim} className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          className="input pl-10 text-sm" 
          placeholder="Search name or department..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </motion.div>

      {/* Grid */}
      <motion.div variants={anim} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(emp => (
          <motion.div key={emp.id} whileHover={{ y: -3 }} className="card p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                  {emp.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{emp.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`badge text-[9px] ${emp.role === 'manager' ? 'badge-primary' : 'badge-secondary'}`}>
                      {emp.role}
                    </span>
                    <button 
                      onClick={() => toggleStatus(emp.id)}
                      className={`badge text-[9px] cursor-pointer hover:opacity-80 transition-all ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}
                    >
                      {emp.status === 'active' ? 'active' : 'on leave'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => { setSelectedEmp(emp); setIsViewModalOpen(true); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                >
                  <Eye size={13} />
                </button>
                <button 
                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5"><Shield size={11} /> {emp.department}</p>
              <p className="flex items-center gap-1.5"><Clock size={11} /> Last login: {emp.lastLogin}</p>
              <p className="flex items-center gap-1.5">
                <Activity size={11} /> Attendance: 
                <span className={`font-semibold ${emp.attendance >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {emp.attendance}%
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <div>
                <p className="text-[10px] text-slate-500">Salary</p>
                <p className="text-xs font-semibold text-white">{formatCurrency(emp.salary)}/mo</p>
              </div>
              <button 
                onClick={() => handlePaySalary(emp.name, emp.salary)}
                className="btn-secondary text-[10px] py-1 px-2.5 rounded-lg border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
              >
                Pay Salary
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal: Add Employee */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
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
                  <UserCog size={18} className="text-purple-400" /> Add New Employee
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                  <input type="text" className="input" placeholder="e.g. Ramesh Kumar" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Role</label>
                    <select className="input" value={newRole} onChange={e => setNewRole(e.target.value as any)}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Department</label>
                    <select className="input" value={newDepartment} onChange={e => setNewDepartment(e.target.value)}>
                      <option>Sales</option>
                      <option>Billing</option>
                      <option>Inventory</option>
                      <option>Accounting</option>
                      <option>Delivery</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email ID</label>
                  <input type="email" className="input" placeholder="name@company.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                    <input type="text" className="input" placeholder="98765 43210" value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Salary (Monthly)</label>
                    <input type="number" className="input" placeholder="₹ Amount" value={newSalary} onChange={e => setNewSalary(e.target.value)} required />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary py-2 text-xs">Save Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View Employee */}
      <AnimatePresence>
        {isViewModalOpen && selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
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
                <h3 className="font-semibold text-white">Employee Profile</h3>
                <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-2" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                  {selectedEmp.name[0]}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedEmp.name}</h4>
                  <p className="text-xs text-indigo-400 capitalize">{selectedEmp.role} · {selectedEmp.department}</p>
                </div>
                <span className={`badge text-xs ${selectedEmp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedEmp.status === 'active' ? 'Active' : 'On Leave'}
                </span>
                
                <div className="w-full space-y-2 text-xs text-left pt-4 border-t border-white/5">
                  <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white">{selectedEmp.email}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="text-white">{selectedEmp.phone}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Monthly Salary</span><span className="text-white font-semibold">{formatCurrency(selectedEmp.salary)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Join Date</span><span className="text-white">{selectedEmp.joinDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Attendance</span><span className="text-emerald-400 font-semibold">{selectedEmp.attendance}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Last Login</span><span className="text-slate-400">{selectedEmp.lastLogin}</span></div>
                </div>

                <div className="w-full pt-4">
                  <button onClick={() => setIsViewModalOpen(false)} className="btn-secondary w-full justify-center text-xs py-2">Close Profile</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
