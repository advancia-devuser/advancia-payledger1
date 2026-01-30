
import React from 'react';
import { Shield, Lock, Eye, FileCheck, AlertTriangle, Terminal, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';
import { SecurityLog } from '../types';

const MOCK_LOGS: SecurityLog[] = [
  { id: 'log_1', timestamp: '2024-05-18 14:32:01', event: 'Enterprise API Auth Success', user: 'System (DigitalOcean)', status: 'Success' },
  { id: 'log_2', timestamp: '2024-05-18 13:15:42', event: 'Database Backup Completed', user: 'PostgreSQL Admin', status: 'Success' },
  { id: 'log_3', timestamp: '2024-05-18 11:02:15', event: 'Unauthorized Access Attempt', user: 'IP: 192.168.1.45', status: 'Alert' },
  { id: 'log_4', timestamp: '2024-05-17 23:55:00', event: 'Monthly Ledger Finalized', user: 'Jane Doe (CFO)', status: 'Success' },
  { id: 'log_5', timestamp: '2024-05-17 09:20:10', event: 'Encryption Key Rotation', user: 'Shield Agent #4', status: 'Success' },
];

const Security: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Security Center</h1>
          <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest text-xs">HIPAA / PCI-DSS / SOC2 COMPLIANCE OVERLAY</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <CheckCircle2 size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Active Audit Mode</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-xl">
                  <Terminal size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Encryption & Audit Trail</h3>
              </div>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Download Full Log</button>
            </div>
            
            <div className="space-y-4">
              {MOCK_LOGS.map(log => (
                <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={`w-3 h-3 rounded-full ${log.status === 'Success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{log.event}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{log.timestamp} • {log.user}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    log.status === 'Success' ? 'bg-white text-emerald-600 border border-emerald-100' : 'bg-rose-500 text-white'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <HardDrive className="absolute -bottom-6 -right-6 text-white/5" size={120} />
              <div className="relative z-10 space-y-6">
                <h4 className="text-lg font-black uppercase tracking-tight">Database Isolation</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">PostgreSQL 18</span>
                    <span className="text-xs font-black text-emerald-400">ENCRYPTED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Redis 7 (Sessions)</span>
                    <span className="text-xs font-black text-emerald-400">ENCRYPTED</span>
                  </div>
                  <div className="w-full h-px bg-white/10 my-2"></div>
                  <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-widest">AES-256-GCM hardware-level encryption active on DigitalOcean volume.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <Cpu className="absolute -bottom-6 -right-6 text-white/5" size={120} />
              <div className="relative z-10 space-y-6">
                <h4 className="text-lg font-black uppercase tracking-tight">Reasoning Safety</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-100 font-bold uppercase tracking-widest">Sonnet 4.5 Tier</span>
                    <span className="text-xs font-black text-white">ISOLATED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-100 font-bold uppercase tracking-widest">PII Filtering</span>
                    <span className="text-xs font-black text-white">ACTIVE</span>
                  </div>
                  <div className="w-full h-px bg-white/10 my-2"></div>
                  <p className="text-[10px] text-indigo-200 leading-relaxed uppercase font-bold tracking-widest">All AI queries processed via private VPC. Zero data retention for non-ledger tasks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Compliance Score</h4>
            </div>
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">98.4</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Target Score: 100</p>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'HIPAA BAA Status', value: 100 },
                  { label: 'PCI-DSS Attestation', value: 95 },
                  { label: 'SOC2 Ready', value: 92 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Initiate Recertification</button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-10">
            <FileCheck className="text-indigo-600 mb-6" size={32} />
            <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Active Policies</h4>
            <div className="space-y-3">
              {['Data Retention Policy v2.4', 'Key Management Protocol', 'Zero Trust Access Guide'].map(p => (
                <div key={p} className="flex items-center justify-between text-xs font-bold text-slate-500 p-3 bg-white border border-slate-100 rounded-xl">
                  {p}
                  <Eye size={14} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
