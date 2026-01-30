
import React from 'react';
import { Target, Users, TrendingUp, DollarSign, Rocket, MousePointer2, Briefcase, BarChart } from 'lucide-react';

const Marketing: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Acquisition Suite</h1>
          <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest text-xs">MARKETING ENGINE & GROWTH METRICS</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-indigo-200 flex items-center gap-3">
            <Rocket size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Scale to 100 Facilities</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Acquisition (CAC)', value: '$1,240', change: '-12%', positive: true, icon: <MousePointer2 className="text-indigo-600" /> },
          { label: 'Customer Lifetime (LTV)', value: '$82,000', change: '+24%', positive: true, icon: <TrendingUp className="text-emerald-600" /> },
          { label: 'Onboarding Pipeline', value: '42 Facilities', change: '8.4x Cover', positive: true, icon: <Users className="text-blue-600" /> },
          { label: 'Marketing ROI', value: '6.2x', change: '+1.5x', positive: true, icon: <BarChart className="text-amber-600" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.positive ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <Target className="text-indigo-600" size={32} />
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Facility Growth Funnel</h3>
          </div>
          <div className="space-y-12">
            {[
              { stage: 'MQL (Marketing Qualified)', count: 184, conversion: '12%', color: 'bg-indigo-600' },
              { stage: 'SQL (Sales Qualified)', count: 52, conversion: '45%', color: 'bg-indigo-500' },
              { stage: 'Contract Negotiation', count: 18, conversion: '82%', color: 'bg-indigo-400' },
              { stage: 'Final Onboarding', count: 6, conversion: 'DONE', color: 'bg-emerald-500' }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{step.stage}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{step.count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Conv. Rate</p>
                    <p className="text-lg font-black text-indigo-600 italic leading-none">{step.conversion}</p>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className={`${step.color} h-full rounded-full transition-all duration-1000`} 
                    style={{ width: `${100 - (i * 20)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <Briefcase className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />
            <h3 className="text-xl font-black mb-8 uppercase tracking-tight italic relative z-10">Enterprise Leads</h3>
            <div className="space-y-6 relative z-10">
              {[
                { name: 'Mayo Clinic Expansion', size: 'Huge', status: 'Warm' },
                { name: 'St. Jude Regional', size: 'Medium', status: 'Nurturing' },
                { name: 'Cleveland Health', size: 'High', status: 'Contract' }
              ].map((lead, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tight">{lead.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{lead.size} Probability</p>
                  </div>
                  <span className="text-[8px] font-black px-2 py-1 bg-indigo-600 rounded-md uppercase tracking-widest">{lead.status}</span>
                </div>
              ))}
              <button className="w-full mt-6 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">Launch Onboarding Script</button>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-10 flex flex-col justify-center">
            <DollarSign className="text-indigo-600 mb-6" size={48} />
            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Budget Efficiency</h4>
            <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">Currently spending 14% of gross revenue on acquisition. AI suggests reducing PPC spend and increasing LinkedIn outreach for 18% better ROI.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
