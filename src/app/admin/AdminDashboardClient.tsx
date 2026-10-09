"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  CreditCard,
  QrCode,
  Smartphone,
  Eye,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Inbox,
  Sparkles,
  Zap,
} from "lucide-react";

export function AdminDashboardClient() {
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState("30");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, logsRes, inqRes] = await Promise.all([
        fetch(`/api/analytics?days=${daysFilter}`),
        fetch("/api/audit-logs?limit=8"),
        fetch("/api/inquiries"),
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setData(analyticsData);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.inquiries || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [daysFilter]);

  const metrics = data?.metrics || {
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalCards: 0,
    assignedCards: 0,
    unassignedCards: 0,
    disabledCards: 0,
    totalScans: 0,
    scansToday: 0,
    scansThisMonth: 0,
    uniqueVisitors: 0,
  };

  const statCards = [
    {
      title: "Total Businesses",
      value: metrics.totalBusinesses,
      subtext: `${metrics.activeBusinesses} active`,
      icon: Building2,
      color: "bg-[#E9F8E9] text-[#006B21]",
      href: "/admin/businesses",
    },
    {
      title: "Total QR Cards",
      value: metrics.totalCards,
      subtext: `${metrics.assignedCards} assigned, ${metrics.unassignedCards} available`,
      icon: CreditCard,
      color: "bg-[#E9F8E9] text-[#006B21]",
      href: "/admin/cards",
    },
    {
      title: "Total Scans",
      value: metrics.totalScans.toLocaleString(),
      subtext: `~${metrics.uniqueVisitors} unique visitors`,
      icon: Eye,
      color: "bg-[#E9F8E9] text-[#006B21]",
      href: "/admin/scan-history",
    },
    {
      title: "Scans Today",
      value: metrics.scansToday,
      subtext: `${metrics.scansThisMonth} this month`,
      icon: TrendingUp,
      color: "bg-[#E9F8E9] text-[#006B21]",
      href: "/admin/analytics",
    },
  ];

  const maxScanInChart = Math.max(
    ...(data?.scansOverTime?.map((s: any) => s.scans) || [1]),
    1
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            <span className="text-[#050505]">Dashboard</span>{" "}
            <span className="text-[#006B21]">Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#52606D] mt-1.5 font-normal">
            GrowBroo dynamic review card network status and real-time telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="h-11 w-11 flex items-center justify-center rounded-xl border border-[#DCEBDD] bg-white hover:bg-[#E9F8E9] text-[#52606D] hover:text-[#006B21] transition-all duration-200 shadow-xs group disabled:opacity-50"
            title="Refresh metrics"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform ${
                loading ? "animate-spin text-[#006B21]" : "group-hover:rotate-45"
              }`}
            />
          </button>

          <Link
            href="/admin/cards"
            className="h-11 inline-flex items-center gap-2 px-4.5 rounded-xl bg-white hover:bg-[#E9F8E9] text-[#050505] border border-[#DCEBDD] hover:border-[#006B21]/30 font-semibold text-xs transition-all duration-200 shadow-xs active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-[#006B21]" />
            Generate Cards
          </Link>

          <Link
            href="/admin/businesses"
            className="h-11 inline-flex items-center gap-2 px-5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-semibold text-xs transition-all duration-200 shadow-sm shadow-[#006B21]/20 hover:shadow-md hover:shadow-[#006B21]/25 active:scale-[0.98]"
          >
            <Building2 className="w-4 h-4 text-white" />
            Add Business
          </Link>
        </div>
      </div>

      {/* 4 Premium Mixed KPI Cards Grid (Pure White Cards with Pastel Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1 — TOTAL BUSINESSES (Green Accent) */}
        <Link
          href="/admin/businesses"
          className="relative overflow-hidden p-6 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,80,30,0.06)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(0,80,30,0.10)] transition-all duration-200 group flex flex-col justify-between"
        >
          {/* Extremely subtle corner wave accent */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#E9F8E9]/60 rounded-full blur-xl pointer-events-none transition-transform duration-300 group-hover:scale-110"
          />

          <div className="relative z-10">
            {/* Top row: Icon + Label */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52606D]">
                Total Businesses
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 border border-[#DCEBDD]/60">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Middle: Large Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-[#050505] tracking-tight leading-none mb-3.5">
              {metrics.totalBusinesses}
            </div>
          </div>

          {/* Bottom: Supporting Information + Trend Indicator */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[#DCEBDD]/60 text-xs text-[#52606D]">
            <span>{metrics.activeBusinesses} active</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#168A3A]">
              <span>↑ 0%</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* CARD 2 — TOTAL QR CARDS (Purple Accent) */}
        <Link
          href="/admin/cards"
          className="relative overflow-hidden p-6 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,80,30,0.06)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(0,80,30,0.10)] transition-all duration-200 group flex flex-col justify-between"
        >
          {/* Extremely subtle corner wave accent */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#F1ECFF]/60 rounded-full blur-xl pointer-events-none transition-transform duration-300 group-hover:scale-110"
          />

          <div className="relative z-10">
            {/* Top row: Icon + Label */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52606D]">
                Total QR Cards
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F1ECFF] text-[#7657D9] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 border border-[#E8DEFF]">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            {/* Middle: Large Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-[#050505] tracking-tight leading-none mb-3.5">
              {metrics.totalCards}
            </div>
          </div>

          {/* Bottom: Supporting Information + Trend Indicator */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[#DCEBDD]/60 text-xs text-[#52606D]">
            <span className="truncate pr-1">
              {metrics.assignedCards} assigned, {metrics.unassignedCards} available
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#7657D9] shrink-0">
              <span>↑ Active</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* CARD 3 — TOTAL SCANS (Cyan/Blue Accent) */}
        <Link
          href="/admin/scan-history"
          className="relative overflow-hidden p-6 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,80,30,0.06)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(0,80,30,0.10)] transition-all duration-200 group flex flex-col justify-between"
        >
          {/* Extremely subtle corner wave accent */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#EAF4FF]/60 rounded-full blur-xl pointer-events-none transition-transform duration-300 group-hover:scale-110"
          />

          <div className="relative z-10">
            {/* Top row: Icon + Label */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52606D]">
                Total Scans
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#2878C8] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 border border-[#D4E7FA]">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            {/* Middle: Large Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-[#050505] tracking-tight leading-none mb-3.5">
              {metrics.totalScans.toLocaleString()}
            </div>
          </div>

          {/* Bottom: Supporting Information + Trend Indicator */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[#DCEBDD]/60 text-xs text-[#52606D]">
            <span>~{metrics.uniqueVisitors} unique visitors</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#2878C8]">
              <span>↑ Live</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* CARD 4 — SCANS TODAY (Lime/Amber Accent) */}
        <Link
          href="/admin/analytics"
          className="relative overflow-hidden p-6 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,80,30,0.06)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(0,80,30,0.10)] transition-all duration-200 group flex flex-col justify-between"
        >
          {/* Extremely subtle corner wave accent */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FFF6E5]/60 rounded-full blur-xl pointer-events-none transition-transform duration-300 group-hover:scale-110"
          />

          <div className="relative z-10">
            {/* Top row: Icon + Label */}
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52606D]">
                Scans Today
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#FFF6E5] text-[#D98B00] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 border border-[#F5E5C6]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Middle: Large Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-[#050505] tracking-tight leading-none mb-3.5">
              {metrics.scansToday}
            </div>
          </div>

          {/* Bottom: Supporting Information + Trend Indicator */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[#DCEBDD]/60 text-xs text-[#52606D]">
            <span>{metrics.scansThisMonth} this month</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#168A3A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39E900]"></span>
              <span>↑ Today</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Customer Leads & Inquiries Banner */}
      <div className="relative overflow-hidden p-6 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,60,20,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Subtle mint/green decorative gradient on the right side */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[#E9F8E9]/60 via-[#E9F8E9]/20 to-transparent pointer-events-none"
        />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F8E9] flex items-center justify-center text-[#006B21] shadow-xs shrink-0 border border-[#DCEBDD]">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-bold text-[#050505]">
                Customer Inquiries & Leads ({inquiries.length})
              </h2>
              {inquiries.filter((i) => i.status === "NEW").length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0CF] border border-[#F5E5C6] text-[#C98616] animate-pulse">
                  {inquiries.filter((i) => i.status === "NEW").length} NEW LEADS
                </span>
              )}
            </div>
            <p className="text-xs text-[#52606D] mt-1">
              Client requests submitted through the website Contact Us page with selected plans.
            </p>
          </div>
        </div>

        <Link
          href="/admin/inquiries"
          className="relative z-10 inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-semibold text-xs shadow-sm shadow-[#006B21]/20 transition-all duration-200 self-start sm:self-auto shrink-0"
        >
          <span>View All Inquiries</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scans Over Time Chart (White Premium Card) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,60,20,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-[#050505] flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-[#006B21]" />
                  Scan Activity Over Time
                </h2>
                <p className="text-xs text-[#52606D] mt-0.5">
                  Dynamic QR scan volume over chosen timeframe
                </p>
              </div>

              {/* Time filter pill selector */}
              <div className="inline-flex rounded-xl bg-[#F7FBF7] p-1 text-xs border border-[#DCEBDD]">
                {["7", "30", "90"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDaysFilter(d)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
                      daysFilter === d
                        ? "bg-[#006B21] text-white shadow-xs"
                        : "text-[#52606D] hover:text-[#050505]"
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Visualizer */}
            <div className="h-60 flex items-end gap-1.5 pt-6 pb-2 px-2 border-b border-[#EAF0EA] relative">
              {data?.scansOverTime?.map((item: any, idx: number) => {
                const heightPct = Math.max((item.scans / maxScanInChart) * 100, 5);
                const isLatest = idx === (data?.scansOverTime?.length || 0) - 1;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-11 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[#050505] text-white text-[10px] px-2.5 py-1 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 font-medium border border-white/10 flex items-center gap-1.5">
                      <span>{item.date}:</span>
                      <span className="text-[#39E900] font-bold">{item.scans} scans</span>
                    </div>

                    {/* Bar with subtle vertical gradient and highlight */}
                    <div className="w-full relative flex flex-col items-center justify-end h-full">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-all duration-200 bg-gradient-to-t from-[#006B21]/80 to-[#006B21] group-hover:from-[#005219] group-hover:to-[#006B21] ${
                          isLatest ? "ring-1 ring-[#39E900]/40" : ""
                        }`}
                      >
                        {/* Tiny endpoint highlight on latest bar */}
                        {isLatest && item.scans > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#39E900] mx-auto -mt-1 shadow-[0_0_6px_#39E900]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#718071] mt-3.5 px-2 font-mono">
            <span>{data?.scansOverTime?.[0]?.date || "Start"}</span>
            <span className="text-[#006B21] font-semibold">
              Peak: {maxScanInChart} scans
            </span>
            <span>
              {data?.scansOverTime?.[data.scansOverTime.length - 1]?.date || "Today"}
            </span>
          </div>
        </div>

        {/* Device & Hardware Card (White Premium Card) */}
        <div className="relative overflow-hidden p-6 sm:p-7 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,60,20,0.05)] flex flex-col justify-between">
          {/* Subtle blue/mint background decoration in corner */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-36 h-36 bg-[#E9F8E9]/40 rounded-full blur-2xl pointer-events-none"
          />

          <div>
            <h2 className="text-base font-bold text-[#050505] flex items-center gap-2 mb-0.5">
              <Smartphone className="w-4.5 h-4.5 text-[#006B21]" />
              Device & Hardware
            </h2>
            <p className="text-xs text-[#52606D] mb-6">Visitor device environment</p>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-[#050505] mb-2.5">
                  Device Categories
                </div>
                {data?.deviceBreakdown?.map((dev: any, i: number) => {
                  const pct = Math.round(
                    (dev.value / (metrics.totalScans || 1)) * 100
                  );
                  return (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between text-xs text-[#52606D] mb-1">
                        <span>{dev.name}</span>
                        <span className="font-bold text-[#006B21]">
                          {dev.value} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#E9F8E9] rounded-full overflow-hidden border border-[#DCEBDD]/40">
                        <div
                          className="h-full bg-[#006B21] rounded-full relative transition-all duration-300"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        >
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#39E900]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#E5EEE6]">
                <div className="text-xs font-bold text-[#050505] mb-2.5">
                  Top Browsers
                </div>
                <div className="flex flex-wrap gap-2">
                  {data?.browserBreakdown?.map((br: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#F7FBF7] border border-[#E5EEE6] text-[11px] font-medium text-[#050505]"
                    >
                      {br.name}: <span className="text-[#006B21] font-bold">{br.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5EEE6] text-center">
            <Link
              href="/admin/analytics"
              className="text-xs font-semibold text-[#006B21] hover:underline inline-flex items-center gap-1"
            >
              <span>View detailed analytics report</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Performers & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Businesses by Scans */}
        <div className="p-6 sm:p-7 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,60,20,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#050505] flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-[#006B21]" />
                Top Businesses by Scans
              </h2>
              <p className="text-xs text-[#52606D] mt-0.5">Most active customer destinations</p>
            </div>
            <Link
              href="/admin/businesses"
              className="text-xs font-semibold text-[#006B21] hover:underline"
            >
              Manage all
            </Link>
          </div>

          <div className="divide-y divide-[#E5EEE6]">
            {data?.scansByBusiness?.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#52606D]">
                No scan data recorded yet.
              </div>
            ) : (
              data?.scansByBusiness?.map((b: any, i: number) => (
                <div
                  key={i}
                  className="py-3 flex items-center justify-between hover:bg-[#F7FBF7] rounded-xl px-2 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E9F8E9] text-[11px] font-bold text-[#006B21] flex items-center justify-center border border-[#DCEBDD]">
                      #{i + 1}
                    </span>
                    <span className="text-xs font-bold text-[#050505]">
                      {b.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#006B21] bg-[#F7FBF7] border border-[#DCEBDD] px-2.5 py-1 rounded-lg">
                    {b.count} scans
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="p-6 sm:p-7 rounded-[20px] bg-white border border-[#DCEBDD] shadow-[0_8px_30px_rgba(0,60,20,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#050505] flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-[#006B21]" />
                Recent System Activity
              </h2>
              <p className="text-xs text-[#52606D] mt-0.5">Administrative and card lifecycle logs</p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-[#006B21] hover:underline"
            >
              View all logs
            </Link>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#52606D]">
                No audit events recorded.
              </div>
            ) : (
              logs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-[#F7FBF7] border border-[#E5EEE6] flex items-start justify-between gap-3 text-xs hover:border-[#DCEBDD] transition-colors duration-150"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E9F8E9] text-[#006B21] border border-[#DCEBDD] font-mono">
                        {log.action}
                      </span>
                      <span className="font-bold text-[#050505]">
                        {log.user?.name || "System"}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#52606D] font-mono">
                      {log.metadata ? log.metadata.slice(0, 70) : "Action executed"}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#52606D] shrink-0 font-mono">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
