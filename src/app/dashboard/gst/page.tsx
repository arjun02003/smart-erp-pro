'use client';
import { motion } from 'framer-motion';
import { ClipboardList, FileText, Download, Calculator, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const anim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const initialGstSummary = [
  { label: 'Total Taxable Sales', value: 485000 },
  { label: 'CGST Collected', value: 29100 },
  { label: 'SGST Collected', value: 29100 },
  { label: 'IGST Collected', value: 0 },
  { label: 'Input Tax Credit', value: 18500 },
  { label: 'Net GST Payable', value: 39700 },
];

const initialHsnSummary = [
  { hsn: '30049099', desc: 'Medicaments', taxable: 245000, cgst: 14700, sgst: 14700, total: 29400, rate: '12%' },
  { hsn: '34011100', desc: 'Healthcare Products', taxable: 85000, cgst: 7650, sgst: 7650, total: 15300, rate: '18%' },
  { hsn: '21069099', desc: 'Food Supplements', taxable: 95000, cgst: 8550, sgst: 8550, total: 17100, rate: '18%' },
  { hsn: '63079090', desc: 'Safety Products', taxable: 35000, cgst: 875, sgst: 875, total: 1750, rate: '5%' },
  { hsn: '90251990', desc: 'Medical Devices', taxable: 25000, cgst: 1500, sgst: 1500, total: 3000, rate: '12%' },
];

const initialGstrReports = [
  { id: '1', name: 'GSTR-1', desc: 'Outward Supplies', period: 'May 2026', status: 'pending', dueDate: '2026-06-11' },
  { id: '2', name: 'GSTR-3B', desc: 'Summary Return', period: 'May 2026', status: 'pending', dueDate: '2026-06-20' },
  { id: '3', name: 'GSTR-1', desc: 'Outward Supplies', period: 'Apr 2026', status: 'filed', dueDate: '2026-05-11' },
  { id: '4', name: 'GSTR-3B', desc: 'Summary Return', period: 'Apr 2026', status: 'filed', dueDate: '2026-05-20' },
];

export default function GSTPage() {
  const [reports, setReports] = useState(initialGstrReports);
  const [loadingReportId, setLoadingReportId] = useState<string | null>(null);

  const handleGenerateReport = (id: string, name: string) => {
    setLoadingReportId(id);
    const toastId = toast.loading(`Compiling GST data for ${name}...`);
    
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'filed' } : r));
      setLoadingReportId(null);
      toast.success(`${name} compiled and marked as Filed! 🎉`, { id: toastId });
    }, 2000);
  };

  const handleExportGstr = () => {
    const toastId = toast.loading('Preparing GST Excel export...');
    setTimeout(() => {
      // Mock CSV generation and download
      const headers = 'HSN Code,Description,Taxable Value,CGST,SGST,Total Tax,Rate\n';
      const rows = initialHsnSummary.map(h => 
        `"${h.hsn}","${h.desc}",${h.taxable},${h.cgst},${h.sgst},${h.total},"${h.rate}"`
      ).join('\n');
      
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GSTR_Summary_May_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('GSTR-1 & 3B CSV downloaded successfully!', { id: toastId });
    }, 1500);
  };

  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
      <motion.div variants={anim} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList size={24} className="text-red-400" /> GST & Tax Module
          </h1>
          <p className="text-sm text-slate-400 mt-1">GST calculation, HSN codes, GSTR reports & tax filing</p>
        </div>
        <button onClick={handleExportGstr} className="btn-primary text-sm flex items-center gap-1.5">
          <Download size={14} /> Export GSTR Excel
        </button>
      </motion.div>

      {/* GST Summary Cards */}
      <motion.div variants={anim} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {initialGstSummary.map((g, i) => (
          <div key={i} className="stat-card primary p-4">
            <p className="text-[10px] text-slate-400 mb-1">{g.label}</p>
            <p className={`text-lg font-bold ${i === 5 ? 'text-amber-400' : 'text-white'}`}>{formatCurrency(g.value)}</p>
          </div>
        ))}
      </motion.div>

      {/* GSTR Filing Status */}
      <motion.div variants={anim} className="chart-container">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={16} className="text-indigo-400" /> GSTR Filing Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="p-4 rounded-xl relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{r.name}</span>
                <span className={`badge ${r.status === 'filed' ? 'badge-success' : 'badge-warning'}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{r.desc}</p>
              <p className="text-[10px] text-slate-500 mt-1">Period: {r.period} · Due: {r.dueDate}</p>
              {r.status === 'pending' ? (
                <button 
                  disabled={loadingReportId !== null}
                  onClick={() => handleGenerateReport(r.id, r.name)}
                  className="btn-primary text-[10px] py-1.5 px-3 mt-3 w-full justify-center disabled:opacity-50"
                >
                  {loadingReportId === r.id ? 'Filing...' : 'File GSTR Return'}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-4 justify-center font-medium bg-emerald-500/10 py-1.5 rounded-lg">
                  <CheckCircle2 size={12} /> Return Filed
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* HSN Summary */}
      <motion.div variants={anim} className="chart-container">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator size={16} className="text-cyan-400" /> HSN-wise Tax Summary
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>HSN Code</th>
                <th>Description</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total Tax</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {initialHsnSummary.map((h, i) => (
                <tr key={i}>
                  <td className="text-xs font-mono text-indigo-400">{h.hsn}</td>
                  <td className="text-xs">{h.desc}</td>
                  <td className="text-xs font-semibold">{formatCurrency(h.taxable)}</td>
                  <td className="text-xs text-cyan-400">{formatCurrency(h.cgst)}</td>
                  <td className="text-xs text-cyan-400">{formatCurrency(h.sgst)}</td>
                  <td className="text-xs font-semibold text-amber-400">{formatCurrency(h.total)}</td>
                  <td><span className="badge badge-primary text-[9px]">{h.rate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
