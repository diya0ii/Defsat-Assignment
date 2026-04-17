"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { investments, FundingType, InvestmentStatus } from "../investments-data";

const FUNDING_TYPES: FundingType[] = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Corporate Round",
  "Private Equity",
];

const DATE_RANGES = [
  "All Time",
  "Past 30 Days",
  "Past 60 Days",
  "Past 90 Days",
  "Past Year",
] as const;
type DateRange = (typeof DATE_RANGES)[number];

const ITEMS_PER_PAGE = 10;

function formatMoney(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isWithinRange(iso: string, range: DateRange): boolean {
  if (range === "All Time") return true;
  const now = new Date();
  const date = new Date(iso);
  const days =
    range === "Past 30 Days"
      ? 30
      : range === "Past 60 Days"
      ? 60
      : range === "Past 90 Days"
      ? 90
      : 365;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return date >= cutoff;
}

const fundingTypeColors: Record<FundingType, string> = {
  "Pre-Seed": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Seed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Series A": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Series B": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Series C": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Corporate Round": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Private Equity": "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const statusColors: Record<InvestmentStatus, string> = {
  Active: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
  Exited: "bg-blue-400/15 text-blue-300 border-blue-400/40",
  "Written Off": "bg-rose-400/15 text-rose-300 border-rose-400/40",
  Pending: "bg-amber-400/15 text-amber-300 border-amber-400/40",
};

export default function InvestmentDashboard() {
  const [selectedTypes, setSelectedTypes] = useState<FundingType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("All Time");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showMoreTypes, setShowMoreTypes] = useState(false);

  const toggleType = (type: FundingType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    return investments.filter((inv) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(inv.fundingType))
        return false;
      if (!isWithinRange(inv.announcedDate, dateRange)) return false;
      if (minAmount && inv.checkSize !== null && inv.checkSize < Number(minAmount))
        return false;
      if (maxAmount && inv.checkSize !== null && inv.checkSize > Number(maxAmount))
        return false;
      if (
        search &&
        !inv.organizationName.toLowerCase().includes(search.toLowerCase()) &&
        !inv.transactionName.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [selectedTypes, dateRange, minAmount, maxAmount, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const totalDeployed = investments.reduce(
      (s, i) => s + (i.checkSize ?? 0),
      0
    );
    const withCheck = investments.filter((i) => i.checkSize !== null);
    const avgCheck = withCheck.length
      ? totalDeployed / withCheck.length
      : 0;
    const exitCount = investments.filter((i) => i.status === "Exited").length;
    return { totalDeployed, count: investments.length, avgCheck, exitCount };
  }, []);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length && paginated.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((i) => i.id)));
    }
  };

  const visibleTypes = showMoreTypes ? FUNDING_TYPES : FUNDING_TYPES.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#080d14] text-white">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M0 0h1v40H0zm40 0h-1v40h1zM0 0v1h40V0zm0 40v-1h40v1z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

      <div className="relative flex min-h-screen">
        {/* ── Sidebar ────────────────────────────────────────────── */}
        <aside className="w-56 shrink-0 border-r border-white/[0.07] bg-[#0a1018] sticky top-0 h-screen overflow-y-auto flex flex-col gap-6 p-5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
              D
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
              DealFlow OS
            </span>
          </Link>

          <div className="h-px bg-white/[0.06]" />

          {/* Filters heading */}
          <p className="text-sm font-semibold text-white -mb-2">Filters</p>

          {/* Search */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Company Name
            </p>
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="E.g. NovaMed AI"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Investment Type */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2.5">
              Investment Type
            </p>
            <div className="space-y-2">
              {visibleTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-3.5 h-3.5 rounded border border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowMoreTypes((v) => !v)}
              className="mt-2.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showMoreTypes ? "− Less options" : "+ More options"}
            </button>
          </div>

          {/* Announced On */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Announced On
              </p>
              {dateRange !== "All Time" && (
                <button
                  onClick={() => {
                    setDateRange("All Time");
                    setPage(1);
                  }}
                  className="text-slate-600 hover:text-slate-400 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="space-y-2">
              {DATE_RANGES.map((range) => (
                <label
                  key={range}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="dateRange"
                    checked={dateRange === range}
                    onChange={() => {
                      setDateRange(range);
                      setPage(1);
                    }}
                    className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    {range}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Check Size */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2.5">
              Check Size
            </p>
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 text-xs">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => {
                    setMinAmount(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-5 pr-2 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <span className="text-slate-600 text-xs shrink-0">—</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 text-xs">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => {
                    setMaxAmount(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-5 pr-2 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-auto pt-4 border-t border-white/[0.06]">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Pipeline
            </Link>
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────────── */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-[1200px]">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Investment Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Track your portfolio of funding rounds and deployed capital.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Deployed",
                  value: formatMoney(stats.totalDeployed),
                  color: "text-white",
                  sub: "across all rounds",
                },
                {
                  label: "Investments",
                  value: stats.count,
                  color: "text-blue-400",
                  sub: "funding rounds",
                },
                {
                  label: "Avg Check Size",
                  value: formatMoney(Math.round(stats.avgCheck)),
                  color: "text-emerald-400",
                  sub: "per round",
                },
                {
                  label: "Exits",
                  value: stats.exitCount,
                  color: "text-violet-400",
                  sub: "realized returns",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-[#0f1623] border border-white/[0.07] rounded-xl px-5 py-4"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                    {s.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Table card */}
            <div className="bg-[#0f1623] border border-white/[0.07] rounded-2xl overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {filtered.length > 0
                      ? `${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                          page * ITEMS_PER_PAGE,
                          filtered.length
                        )} of ${filtered.length} results`
                      : "0 results"}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default transition-colors"
                    >
                      ← PREV
                    </button>
                    <span className="text-xs text-slate-600 px-1">{page}</span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default transition-colors"
                    >
                      NEXT →
                    </button>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  EXPORT TO CSV
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      <th className="w-10 px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedRows.size === paginated.length &&
                            paginated.length > 0
                          }
                          onChange={toggleAll}
                          className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="w-8 px-2 py-3 text-left text-xs text-slate-600 font-medium">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        Transaction Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        Organization Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        Funding Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        Check Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        Announced Date
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded px-2 py-0.5 transition-all whitespace-nowrap">
                          + ADD COLUMN
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-16 text-center">
                          <p className="text-slate-500 text-sm">
                            No investments match the current filters
                          </p>
                          <p className="text-slate-600 text-xs mt-1">
                            Try adjusting your filters
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginated.map((inv, idx) => (
                        <tr
                          key={inv.id}
                          className={`border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors cursor-default ${
                            selectedRows.has(inv.id) ? "bg-blue-500/5" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedRows.has(inv.id)}
                              onChange={() => toggleRow(inv.id)}
                              className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-3.5 text-xs text-slate-600">
                            {(page - 1) * ITEMS_PER_PAGE + idx + 1}.
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-6 h-6 rounded bg-gradient-to-br ${inv.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}
                              >
                                {inv.initials[0]}
                              </div>
                              <span className="text-sm text-slate-200 font-medium whitespace-nowrap">
                                {inv.transactionName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded bg-gradient-to-br ${inv.avatarColor} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}
                              >
                                {inv.initials[0]}
                              </div>
                              <span className="text-sm text-slate-300 whitespace-nowrap">
                                {inv.organizationName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                fundingTypeColors[inv.fundingType]
                              }`}
                            >
                              {inv.fundingType}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-slate-300 font-medium tabular-nums whitespace-nowrap">
                            {formatMoney(inv.checkSize)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                statusColors[inv.status]
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                            {formatDate(inv.announcedDate)}
                          </td>
                          <td className="px-4 py-3.5" />
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-white/[0.05]">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default transition-colors rounded-lg hover:bg-white/5"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default transition-colors rounded-lg hover:bg-white/5"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-white/[0.05] text-center text-xs text-slate-700">
              DealFlow OS · {new Date().getFullYear()} · Prototype
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
