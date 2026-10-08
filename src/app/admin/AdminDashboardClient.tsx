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
          <h1 className="text-2xl sm:text-3xl font-black text-[#050505] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
            GrowBroo dynamic review card network status and real-time telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-[#050505]/70 hover:text-[#050505] transition-colors shadow-xs"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#006B21]" : ""}`} />
          </button>

          <Link
            href="/admin/cards"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E9F8E9] text-[#050505] border border-[#006B21]/20 font-bold text-xs transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#006B21]" />
            Generate Cards
          </Link>

          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs transition-colors shadow-sm shadow-[#006B21]/20"
          >
            <Building2 className="w-4 h-4 text-white" />
            Add Business
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              href={c.href}
              className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs hover:border-[#006B21]/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#050505]/60">
                  {c.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-[#050505] tracking-tight">
                {c.value}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#006B21]/10 text-xs text-[#050505]/60">
                <span>{c.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#050505]/40 group-hover:text-[#006B21] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Customer Leads & Inquiries Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F8E9] flex items-center justify-center text-[#006B21] shadow-xs shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#050505]">
                Customer Inquiries & Leads ({inquiries.length})
              </h2>
              {inquiries.filter((i) => i.status === "NEW").length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 border border-amber-300 text-amber-800 animate-pulse">
                  {inquiries.filter((i) => i.status === "NEW").length} NEW LEADS
                </span>
              )}
            </div>
            <p className="text-xs text-[#050505]/60 mt-0.5">
              Client requests submitted through the website Contact Us page with selected plans.
            </p>
          </div>
        </div>

        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-sm shadow-[#006B21]/20 transition-all self-start sm:self-auto shrink-0"
        >
          <span>View All Inquiries</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scans Over Time Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#050505] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#006B21]" />
                Scan Activity Over Time
              </h2>
              <p className="text-xs text-[#050505]/60">
                Dynamic QR scan volume over chosen timeframe
              </p>
            </div>

            <div className="inline-flex rounded-xl bg-[#E9F8E9] p-1 text-xs border border-[#006B21]/20">
              {["7", "30", "90"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDaysFilter(d)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    daysFilter === d
                      ? "bg-[#006B21] text-white shadow-xs"
                      : "text-[#050505]/60 hover:text-[#050505]"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bar Visualizer */}
          <div className="h-56 flex items-end gap-1.5 pt-4 pb-2 px-1 border-b border-[#006B21]/15">
            {data?.scansOverTime?.map((item: any, idx: number) => {
              const heightPct = Math.max((item.scans / maxScanInChart) * 100, 4);
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#050505] text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-bold">
                    {item.date}: <span className="text-[#39E900]">{item.scans} scans</span>
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#006B21] group-hover:bg-[#005219] rounded-t-sm transition-all"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#050505]/50 mt-3 px-1 font-mono">
            <span>{data?.scansOverTime?.[0]?.date || "Start"}</span>
            <span>
              {data?.scansOverTime?.[data.scansOverTime.length - 1]?.date || "Today"}
            </span>
          </div>
        </div>

        {/* Device & Hardware Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#050505] flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-[#006B21]" />
              Device & Hardware
            </h2>
            <p className="text-xs text-[#050505]/60 mb-6">Visitor device environment</p>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-[#050505] mb-2">
                  Device Categories
                </div>
                {data?.deviceBreakdown?.map((dev: any, i: number) => {
                  const pct = Math.round(
                    (dev.value / (metrics.totalScans || 1)) * 100
                  );
                  return (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between text-xs text-[#050505]/70 mb-1">
                        <span>{dev.name}</span>
                        <span className="font-bold text-[#006B21]">
                          {dev.value} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden border border-[#006B21]/15">
                        <div
                          className="h-full bg-[#006B21] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#006B21]/10">
                <div className="text-xs font-bold text-[#050505] mb-2">
                  Top Browsers
                </div>
                <div className="flex flex-wrap gap-2">
                  {data?.browserBreakdown?.map((br: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#E9F8E9] border border-[#006B21]/20 text-[11px] font-medium text-[#050505]"
                    >
                      {br.name}: <span className="text-[#006B21] font-bold">{br.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#006B21]/10 text-center">
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-[#006B21] hover:underline"
            >
              View detailed analytics report →
            </Link>
          </div>
        </div>
      </div>

      {/* Top Performers & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Businesses by Scans */}
        <div className="p-6 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#050505] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#006B21]" />
                Top Businesses by Scans
              </h2>
              <p className="text-xs text-[#050505]/60">Most active customer destinations</p>
            </div>
            <Link
              href="/admin/businesses"
              className="text-xs font-bold text-[#006B21] hover:underline"
            >
              Manage all
            </Link>
          </div>

          <div className="divide-y divide-[#006B21]/10">
            {data?.scansByBusiness?.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#050505]/40">
                No scan data recorded yet.
              </div>
            ) : (
              data?.scansByBusiness?.map((b: any, i: number) => (
                <div
                  key={i}
                  className="py-3 flex items-center justify-between hover:bg-[#E9F8E9]/50 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E9F8E9] text-[11px] font-bold text-[#006B21] flex items-center justify-center border border-[#006B21]/20">
                      #{i + 1}
                    </span>
                    <span className="text-xs font-bold text-[#050505]">
                      {b.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#006B21] bg-[#E9F8E9] border border-[#006B21]/20 px-2.5 py-1 rounded-lg">
                    {b.count} scans
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="p-6 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#050505] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#006B21]" />
                Recent System Activity
              </h2>
              <p className="text-xs text-[#050505]/60">Administrative and card lifecycle logs</p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-bold text-[#006B21] hover:underline"
            >
              View all logs
            </Link>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#050505]/40">
                No audit events recorded.
              </div>
            ) : (
              logs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#E9F8E9]/40 border border-[#006B21]/15 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#006B21]/10 text-[#006B21] border border-[#006B21]/20 font-mono">
                        {log.action}
                      </span>
                      <span className="font-bold text-[#050505]">
                        {log.user?.name || "System"}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#050505]/60 font-mono">
                      {log.metadata ? log.metadata.slice(0, 70) : "Action executed"}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#050505]/40 shrink-0 font-mono">
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
