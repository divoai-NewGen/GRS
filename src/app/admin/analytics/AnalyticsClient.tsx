"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Smartphone,
  Globe,
  Building2,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function AnalyticsClient() {
  const { error: toastError } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      toastError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const metrics = data?.metrics || {
    totalScans: 0,
    uniqueVisitors: 0,
    scansToday: 0,
    scansThisMonth: 0,
  };

  const maxScanInTimeline = Math.max(
    ...(data?.scansOverTime?.map((s: any) => s.scans) || [1]),
    1
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Scan Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Real-time physical card engagement telemetry across all businesses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-[#10251A] border border-[#006B21]/30 p-1 text-xs">
            {["7", "30", "90"].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  days === d
                    ? "bg-[#006B21] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl border border-[#006B21]/40 bg-[#10251A] hover:bg-[#153322] text-white/70 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#39E900]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Total Scans Logged
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {metrics.totalScans.toLocaleString()}
          </div>
          <span className="text-[11px] text-white/50">Gross scan attempts</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
            Approx. Unique Visitors
            <span title="Calculated from anonymized hashed IP signatures" className="cursor-help inline-flex">
              <HelpCircle className="w-3 h-3 text-[#39E900]" />
            </span>
          </span>
          <div className="text-2xl font-black text-[#39E900] mt-1">
            {metrics.uniqueVisitors.toLocaleString()}
          </div>
          <span className="text-[11px] text-white/50">Distinct device fingerprints</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Scans Today
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {metrics.scansToday}
          </div>
          <span className="text-[11px] text-white/50">Past 24 hours</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Scans This Month
          </span>
          <div className="text-2xl font-black text-[#39E900] mt-1">
            {metrics.scansThisMonth}
          </div>
          <span className="text-[11px] text-white/50">Current calendar month</span>
        </div>
      </div>

      {/* Scans Timeline Chart */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
        <div className="mb-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#39E900]" />
            Scan Volume Over Time ({days} Days)
          </h2>
          <p className="text-xs text-white/60">
            Dynamic QR redirects processed daily
          </p>
        </div>

        <div className="h-64 flex items-end gap-1.5 pt-6 pb-2 px-1 border-b border-[#006B21]/20">
          {data?.scansOverTime?.map((item: any, idx: number) => {
            const heightPct = Math.max((item.scans / maxScanInTimeline) * 100, 4);
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#10251A] border border-[#006B21] text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                  {item.date}: <span className="text-[#39E900] font-bold">{item.scans} scans</span>
                </div>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full bg-[#006B21] group-hover:bg-[#39E900] rounded-t-sm transition-all"
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/50 mt-3 px-1 font-mono">
          <span>{data?.scansOverTime?.[0]?.date}</span>
          <span>{data?.scansOverTime?.[data.scansOverTime.length - 1]?.date}</span>
        </div>
      </div>

      {/* Hardware & Environment Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device breakdown */}
        <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#39E900]" />
            Device Category
          </h3>
          <p className="text-xs text-white/60 mb-4">Mobile vs Desktop</p>

          <div className="space-y-3">
            {data?.deviceBreakdown?.map((d: any, i: number) => {
              const pct = Math.round((d.value / (metrics.totalScans || 1)) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>{d.name}</span>
                    <span className="font-bold text-[#39E900]">{d.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#10251A] border border-[#006B21]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#39E900] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#39E900]" />
            Operating Systems
          </h3>
          <p className="text-xs text-white/60 mb-4">iOS, Android, Windows, Mac</p>

          <div className="space-y-3">
            {data?.osBreakdown?.map((o: any, i: number) => {
              const pct = Math.round((o.value / (metrics.totalScans || 1)) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>{o.name}</span>
                    <span className="font-bold text-[#39E900]">{o.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#10251A] border border-[#006B21]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006B21] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browsers */}
        <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#39E900]" />
            Top Browsers
          </h3>
          <p className="text-xs text-white/60 mb-4">Client user agent engines</p>

          <div className="space-y-3">
            {data?.browserBreakdown?.map((b: any, i: number) => {
              const pct = Math.round((b.value / (metrics.totalScans || 1)) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>{b.name}</span>
                    <span className="font-bold text-[#39E900]">{b.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#10251A] border border-[#006B21]/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#39E900] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard Lists: Businesses & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scans By Business */}
        <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#39E900]" />
            Top Businesses by Review Scans
          </h3>
          <div className="divide-y divide-[#006B21]/20">
            {data?.scansByBusiness?.map((item: any, i: number) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {i + 1}. {item.name}
                </span>
                <span className="font-mono font-bold text-[#39E900] bg-[#10251A] border border-[#006B21]/40 px-2 py-0.5 rounded">
                  {item.count} scans
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scans By Card */}
        <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#39E900]" />
            Top Physical Cards by Scans
          </h3>
          <div className="divide-y divide-[#006B21]/20">
            {data?.scansByCard?.map((item: any, i: number) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-white">
                  {i + 1}. {item.cardCode}
                </span>
                <span className="font-mono font-bold text-[#39E900] bg-[#10251A] border border-[#006B21]/40 px-2 py-0.5 rounded">
                  {item.count} scans
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
