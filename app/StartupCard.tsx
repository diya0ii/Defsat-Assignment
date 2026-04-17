"use client";

import { Startup, Decision } from "../data/startups";

interface StartupCardProps {
  startup: Startup;
  onDecision: (id: string, decision: Decision) => void;
}

const scoreConfig = (score: number) => {
  if (score >= 7) return { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", bar: "bg-emerald-400", label: "Strong" };
  if (score >= 5) return { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", bar: "bg-amber-400", label: "Medium" };
  return { color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/30", bar: "bg-rose-400", label: "Weak" };
};

const decisionStyles: Record<Decision, string> = {
  Interested: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
  Pass: "bg-rose-400/15 text-rose-300 border-rose-400/40",
  Pending: "bg-slate-400/15 text-slate-300 border-slate-400/30",
};

const stageColors: Record<string, string> = {
  "Pre-Seed": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Seed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Series A": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Series B": "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

export default function StartupCard({ startup, onDecision }: StartupCardProps) {
  const cfg = scoreConfig(startup.score);
  const stageStyle = stageColors[startup.stage] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";

  return (
    <div className="group relative flex flex-col bg-[#0f1623] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5">
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${cfg.bar} opacity-60`} />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">{startup.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">{startup.industry}</span>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-500">{startup.location}</span>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-500">Est. {startup.founded}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${stageStyle}`}>
              {startup.stage}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${decisionStyles[startup.decision]}`}>
              {startup.decision}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-400 leading-relaxed">{startup.summary}</p>

        {/* Score */}
        <div className={`rounded-xl p-4 border ${cfg.bg}`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Investment Score</span>
            <span className={`text-2xl font-bold ${cfg.color} tabular-nums`}>
              {startup.score}<span className="text-sm font-normal text-slate-600">/10</span>
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
              style={{ width: `${startup.score * 10}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3 italic">"{startup.reason}"</p>
        </div>

        {/* Strengths & Risks */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Strengths</p>
            <ul className="space-y-1.5">
              {startup.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                  <span className="text-emerald-500 mt-0.5 shrink-0">↑</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-2">Risks</p>
            <ul className="space-y-1.5">
              {startup.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                  <span className="text-rose-500 mt-0.5 shrink-0">↓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="px-6 pb-6 pt-2 flex gap-3">
        <button
          onClick={() => onDecision(startup.id, "Interested")}
          disabled={startup.decision === "Interested"}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
            ${startup.decision === "Interested"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30 cursor-pointer"
            }`}
        >
          {startup.decision === "Interested" ? "✓ Interested" : "Interested"}
        </button>
        <button
          onClick={() => onDecision(startup.id, "Pass")}
          disabled={startup.decision === "Pass"}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
            ${startup.decision === "Pass"
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 cursor-default"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/30 cursor-pointer"
            }`}
        >
          {startup.decision === "Pass" ? "✗ Passed" : "Pass"}
        </button>
      </div>
    </div>
  );
}
