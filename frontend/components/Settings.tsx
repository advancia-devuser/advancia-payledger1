
import React from 'react';
// Added CheckCircle2 to imports to fix missing component errors on lines 73, 77, and 81
import { Shield, Lock, Terminal, Activity, Server, Database, Globe, Bell, CheckCircle2 } from 'lucide-react';
import { SecurityLog } from '../types';

const MOCK_LOGS: SecurityLog[] = [
  { id: 'log_1', timestamp: '2024-05-18 14:32:01', event: 'Enterprise API Auth Success', user: 'System (DigitalOcean)', status: 'Success' },
  { id: 'log_2', timestamp: '2024-05-18 13:15:42', event: 'Database Backup Completed', user: 'PostgreSQL Admin', status: 'Success' },
  { id: 'log_3', timestamp: '2024-05-18 11:02:15', event: 'Unauthorized Access Attempt', user: 'IP: 192.168.1.45', status: 'Alert' },
  { id: 'log_4', timestamp: '2024-05-17 23:55:00', event: 'Monthly Ledger Finalized', user: 'Jane Doe (CFO)', status: 'Success' },
  { id: 'log_5', timestamp: '2024-05-17 09:20:10', event: 'Encryption Key Rotation', user: 'Shield Agent #4', status: 'Success' },
];

const Settings: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Administration</h1>
        <p className="text-slate-500 font-medium mt-2">Enterprise-level configuration and security oversight.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10">
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="text-indigo-600" size={24} />
              <h3 className="text-xl font-black text-slate-900 uppercase">System Security Logs</h3>
            </div>
            
            <div className="space-y-4">
              {MOCK_LOGS.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{log.event}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.timestamp} • {log.user}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    log.status === 'Success' ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-10">
            <div className="flex items-center gap-3 mb-8">
              <Database className="text-indigo-600" size={24} />
              <h3 className="text-xl font-black text-slate-900 uppercase">Facility Management</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['San Francisco HQ', 'London Branch', 'New York Office', 'Tokyo Data Center'].map(branch => (
                <div key={branch} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <p className="font-black text-slate-800">{branch}</p>
                  <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <Lock size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight relative z-10">HIPAA Hardware</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-400">AES-256 Storage</p>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-400">SSL Termination</p>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-400">SOC2 Compliance</p>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="w-full h-px bg-white/10 my-6"></div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-900/50">
                Regenerate API Keys
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10">
            <Bell className="text-indigo-600 mb-6" size={32} />
            <h4 className="text-lg font-black text-slate-900 mb-2 uppercase">Notifications</h4>
            <p className="text-sm text-slate-500 font-medium mb-8">Manage how you receive security alerts and financial snapshots.</p>
            <div className="space-y-4">
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                 <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Email Alerts</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                 <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Push Notifications</span>
               </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
