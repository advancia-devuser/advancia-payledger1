"use client";

import React from "react";
import {
  Wallet,
  Globe,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Zap,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { VaultBalance } from "../lib/types";

const MOCK_BALANCES: VaultBalance[] = [
  {
    network: "Solana",
    balance: 1420.5,
    valueUSD: 234382.5,
    change24h: 4.2,
    address: "Advn...9xZ2",
  },
  {
    network: "Ethereum",
    balance: 42.8,
    valueUSD: 154080.0,
    change24h: -1.5,
    address: "0xAd...42e9",
  },
  {
    network: "Base",
    balance: 85000,
    valueUSD: 85000.0,
    change24h: 0.0,
    address: "0xBa...f8a1",
  },
  {
    network: "Stripe Ledger",
    balance: 0,
    valueUSD: 924500.0,
    change24h: 12.4,
    address: "Acct_1P...882",
  },
];

const Vault: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
            Global Vault
          </h1>
          <p className="text-slate-500 font-medium mt-3">
            Aggregated liquidity across 4 blockchain networks & Stripe.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
            Connect Wallet
          </button>
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            Sweep Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {MOCK_BALANCES.map((vault, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500`}
            >
              {vault.network === "Stripe Ledger" ? (
                <CreditCard size={80} />
              ) : (
                <Globe size={80} />
              )}
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {vault.network}
                </p>
                <span
                  className={`text-[10px] font-black ${vault.change24h >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {vault.change24h > 0 ? "+" : ""}
                  {vault.change24h}%
                </span>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
                  ${vault.valueUSD.toLocaleString()}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-2">
                  {vault.balance.toLocaleString()} {vault.network.split(" ")[0]}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <code className="text-[10px] font-black text-slate-300 uppercase">
                  {vault.address}
                </code>
                <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <Zap className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                <ShieldCheck size={14} /> Bridge Protocol Active
              </div>
              <h3 className="text-4xl font-black tracking-tighter italic leading-tight uppercase">
                Advancia Multi-Chain <br />
                Settlement Engine
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed max-w-md">
                Automatic conversion of patient crypto payments to USD.
                Settlements are finalized every 60 seconds on the Base network.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="text-center bg-white/5 p-4 rounded-2xl border border-white/10 flex-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Avg gas fee
                  </p>
                  <p className="text-xl font-black italic">~$0.02</p>
                </div>
                <div className="text-center bg-white/5 p-4 rounded-2xl border border-white/10 flex-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Settlement
                  </p>
                  <p className="text-xl font-black italic">60s</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
              <Globe
                className="text-indigo-400 mb-4 animate-spin-slow"
                size={48}
              />
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
                Node Connectivity
              </p>
              <p className="text-2xl font-black text-emerald-400 italic">
                EXCELLENT
              </p>
              <div className="w-full h-px bg-white/10 my-6"></div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                View Transaction Explorer <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Recent Settlements
            </h3>
            <div className="space-y-4">
              {[
                {
                  tx: "SETTLE_8291",
                  amt: "+$14,200",
                  net: "Solana → USD",
                  time: "12m ago",
                },
                {
                  tx: "SETTLE_8290",
                  amt: "+$8,500",
                  net: "ETH → USD",
                  time: "45m ago",
                },
                {
                  tx: "SETTLE_8289",
                  amt: "+$3,200",
                  net: "Base → USD",
                  time: "1h ago",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900">{s.tx}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {s.net}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">
                      {s.amt}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold">
                      {s.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full py-4 mt-8 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">
            Full Settlement History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vault;
