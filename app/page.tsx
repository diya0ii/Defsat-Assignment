"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { startups as initialStartups, Startup, Decision } from "../app/startups";
import StartupCard from "../app/StartupCard";

type Filter = "All" | "Interested" | "Pass" | "Pending";

export default function Dashboard() {
  const [deals, setDeals] = useState<Startup[]>(initialStartups);
  const [filter, setFilter] = useState<Filter>("All");

  const handleDecision = (id: string, decision: Decision) => {
    setDeals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, decision } : s))
    );
  };

  const filtered = useMemo(() => {
    if (filter === "All") return deals;
    return deals.filter((d) => d.decision === filter);
  }, [deals, filter]);

  const stats = useMemo(() => ({
    total: deals.length,
    interested: deals.filter((d) => d.decision === "Interested").length,
    passed: deals.filter((d) => d.decision === "Pass").length,
    pending: deals.filter((d) => d.decision === "Pending").length,
    avgScore: (deals.reduce((sum, d) => sum + d.score, 0) / deals.length).toFixed(1),
  }), [deals]);

  const filters: Filter[] = ["All", "Interested", "Pass", "Pending"];

  return (
    <div className="min-h-screen bg-[#080d14] text-white">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M0 0h1v40H0zm40 0h-1v40h1zM0 0v1h40V0zm0 40v-1h40v1z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold">D</div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">DealFlow OS</span>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-3">Investment Pipeline</h1>
          <p className="text-slate-500 text-sm mt-1">Review, score, and manage your startup deal flow.</p>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Deals", value: stats.total, color: "text-white" },
            { label: "Interested", value: stats.interested, color: "text-emerald-400" },
            { label: "Passed", value: stats.passed, color: "text-rose-400" },
            { label: "Avg Score", value: stats.avgScore, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f1623] border border-white/[0.07] rounded-xl px-5 py-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 p-1 bg-[#0f1623] border border-white/[0.07] rounded-xl w-fit">
          {filters.map((f) => {
            const count = f === "All" ? deals.length : deals.filter((d) => d.decision === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${filter === f
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
              >
                {f}
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === f ? "bg-white/10 text-slate-300" : "bg-white/5 text-slate-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">📂</div>
            <p className="text-slate-400 font-medium">No deals in this category</p>
            <p className="text-slate-600 text-sm mt-1">Try switching to a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                onDecision={handleDecision}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/[0.05] text-center text-xs text-slate-700">
          DealFlow OS · {new Date().getFullYear()} · Prototype
        </footer>
      </div>
    </div>
  );
}
