"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CreditCard,
  QrCode,
  Smartphone,
  Eye,
  TrendingUp,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Inbox,
  Users,
  ChevronRight,
  Info,
  Calendar,
} from "lucide-react";

export function AdminDashboardClient() {
  const [data, setData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState("30");
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

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

      const now = new Date();
      setLastUpdatedTime(
        `${now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} • ${now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
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

  const scansList = data?.scansOverTime || [];
  const maxScanInChart = Math.max(
    ...(scansList.map((s: any) => s.scans) || [1]),
    4
  );

  // SVG Smooth Curved Line computation
  const svgWidth = 600;
  const svgHeight = 150;
  const padX = 20;
  const padTop = 20;
  const padBottom = 25;
  const chartHeight = svgHeight - padTop - padBottom;

  const points = scansList.map((item: any, i: number) => {
    const x =
      scansList.length > 1
        ? padX + (i / (scansList.length - 1)) * (svgWidth - padX * 2)
        : svgWidth / 2;
    const y =
      svgHeight - padBottom - (item.scans / maxScanInChart) * chartHeight;
    return { x, y, ...item };
  });

  // Generate cubic bezier curve SVG path
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const cp1x = current.x + (next.x - current.x) / 2;
      const cp1y = current.y;
      const cp2x = current.x + (next.x - current.x) / 2;
      const cp2y = next.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    const last = points[points.length - 1];
    areaD = `${pathD} L ${last.x} ${svgHeight - padBottom} L ${points[0].x} ${svgHeight - padBottom} Z`;
  }

  const latestPoint = points.length > 0 ? points[points.length - 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER & ACTIONS */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#EBF7EE] via-[#F4FAF5] to-[#E3F4E9] border border-[#D8ECE0] p-6 lg:p-8 shadow-xs">
        {/* Soft background glow circles */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-80 h-80 bg-[#39E900]/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Heading & Telemetry */}
          <div className="max-w-xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#718096] mb-2">
              PLATFORM MANAGEMENT
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="text-[#050505]">Dashboard</span>{" "}
              <span className="text-[#006B21]">Overview</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52606D] mt-2 font-normal">
              GrowBroo dynamic review card network status and real-time telemetry.
            </p>

            {/* Live System Status line */}
            <div className="mt-4 flex items-center gap-3 text-xs text-[#52606D] font-medium flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#168A3A] inline-block animate-pulse"></span>
                <span className="font-semibold text-[#050505]">System Online</span>
              </div>
              <span className="text-[#8896A4]">|</span>
              <span>
                Last updated: {lastUpdatedTime || "Oct 8, 2026 • 12:42 PM"}
              </span>
            </div>
          </div>

          {/* Right Column: Top Buttons + 3D Banner Illustration */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            {/* Action Buttons Row */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchData}
                disabled={loading}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-[#D8ECE0] bg-white hover:bg-[#F2F8F3] text-[#52606D] hover:text-[#006B21] transition-all shadow-xs disabled:opacity-50"
                title="Refresh metrics"
              >
                <RefreshCw
                  className={`w-4 h-4 transition-transform ${
                    loading ? "animate-spin text-[#006B21]" : "hover:rotate-45"
                  }`}
                />
              </button>

              <Link
                href="/admin/cards"
                className="h-10 inline-flex items-center gap-2 px-4 rounded-xl bg-white hover:bg-[#F2F8F3] text-[#050505] border border-[#D8ECE0] font-semibold text-xs transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#006B21]" />
                <span>Generate Cards</span>
              </Link>

              <Link
                href="/admin/businesses"
                className="h-10 inline-flex items-center gap-2 px-4.5 rounded-xl bg-[#0B3B24] hover:bg-[#072919] text-white font-semibold text-xs transition-all shadow-xs"
              >
                <Building2 className="w-4 h-4 text-white" />
                <span>Add Business</span>
              </Link>
            </div>

            {/* 3D Illustration matching reference */}
            <div className="hidden lg:block relative w-72 h-36 mt-1 overflow-hidden rounded-xl shadow-xs border border-[#D8ECE0]/60">
              <Image
                src="/images/dashboard-hero.jpg"
                alt="GrowBroo Growth Telemetry"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE 4 RICH DARK GRADIENT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARD 1 — TOTAL BUSINESSES (Forest Green Gradient + 3D Wave) */}
        <Link
          href="/admin/businesses"
          className="relative overflow-hidden p-4 sm:p-5 rounded-[22px] bg-[#071F17] bg-gradient-to-br from-[#061D15] via-[#093526] to-[#0A4330] shadow-[0_10px_25px_rgba(6,29,21,0.4)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[135px] border border-white/[0.04]"
        >
          {/* Exact Glowing 3D Wave Image from Reference */}
          <img
            src="/images/clean_wave_1.png"
            alt=""
            className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[65%] object-cover object-right pointer-events-none select-none opacity-95 transition-transform duration-300 group-hover:scale-105"
          />

          <div className="relative z-10">
            {/* Top row: 3D Glossy Icon + Label */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#22C55E] to-[#15803D] shadow-[0_4px_12px_rgba(21,128,61,0.5),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_2px_rgba(0,0,0,0.25)] border border-[#4ADE80]/30 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-white drop-shadow-xs" />
              </div>
              <span className="text-[12px] sm:text-xs font-bold text-white tracking-tight">
                Total Businesses
              </span>
            </div>

            {/* Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mt-2.5 mb-1">
              {metrics.totalBusinesses}
            </div>
          </div>

          {/* Bottom row: Subtext on left + Trend on right */}
          <div className="relative z-10 flex items-center justify-between text-[11px] pt-1">
            <span className="text-white/70 font-medium">{metrics.activeBusinesses} active</span>
            <span className="inline-flex items-center gap-0.5 font-bold text-[#39E900]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0%</span>
            </span>
          </div>
        </Link>

        {/* CARD 2 — TOTAL QR CARDS (Violet/Purple Gradient + 3D Wave) */}
        <Link
          href="/admin/cards"
          className="relative overflow-hidden p-4 sm:p-5 rounded-[22px] bg-[#120924] bg-gradient-to-br from-[#140A28] via-[#221044] to-[#2B1454] shadow-[0_10px_25px_rgba(18,9,36,0.4)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[135px] border border-white/[0.04]"
        >
          {/* Exact Glowing 3D Wave Image from Reference */}
          <img
            src="/images/clean_wave_2.png"
            alt=""
            className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[65%] object-cover object-right pointer-events-none select-none opacity-95 transition-transform duration-300 group-hover:scale-105"
          />

          <div className="relative z-10">
            {/* Top row: 3D Glossy Icon + Label */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#A855F7] to-[#6B21A8] shadow-[0_4px_12px_rgba(107,33,168,0.5),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_2px_rgba(0,0,0,0.25)] border border-[#C084FC]/30 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-white drop-shadow-xs" />
              </div>
              <span className="text-[12px] sm:text-xs font-bold text-white tracking-tight">
                Total QR Cards
              </span>
            </div>

            {/* Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mt-2.5 mb-1">
              {metrics.totalCards}
            </div>
          </div>

          {/* Bottom row: Subtext on left + Trend on right */}
          <div className="relative z-10 flex items-center justify-between text-[11px] pt-1">
            <span className="text-white/70 font-medium truncate pr-1">
              {metrics.assignedCards} assigned, {metrics.unassignedCards} available
            </span>
            <span className="inline-flex items-center gap-0.5 font-bold text-[#39E900] shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0%</span>
            </span>
          </div>
        </Link>

        {/* CARD 3 — TOTAL SCANS (Ocean Blue Gradient + 3D Wave) */}
        <Link
          href="/admin/scan-history"
          className="relative overflow-hidden p-4 sm:p-5 rounded-[22px] bg-[#06182E] bg-gradient-to-br from-[#041935] via-[#08305E] to-[#0A3D78] shadow-[0_10px_25px_rgba(6,24,46,0.4)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[135px] border border-white/[0.04]"
        >
          {/* Exact Glowing 3D Wave Image from Reference */}
          <img
            src="/images/clean_wave_3.png"
            alt=""
            className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[65%] object-cover object-right pointer-events-none select-none opacity-95 transition-transform duration-300 group-hover:scale-105"
          />

          <div className="relative z-10">
            {/* Top row: 3D Glossy Icon + Label */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#0EA5E9] to-[#0369A1] shadow-[0_4px_12px_rgba(3,105,161,0.5),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_2px_rgba(0,0,0,0.25)] border border-[#38BDF8]/30 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-white drop-shadow-xs" />
              </div>
              <span className="text-[12px] sm:text-xs font-bold text-white tracking-tight">
                Total Scans
              </span>
            </div>

            {/* Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mt-2.5 mb-1">
              {metrics.totalScans.toLocaleString()}
            </div>
          </div>

          {/* Bottom row: Subtext on left + Trend on right */}
          <div className="relative z-10 flex items-center justify-between text-[11px] pt-1">
            <span className="text-white/70 font-medium">~{metrics.uniqueVisitors} unique visitors</span>
            <span className="inline-flex items-center gap-0.5 font-bold text-[#39E900]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0%</span>
            </span>
          </div>
        </Link>

        {/* CARD 4 — SCANS TODAY (Warm Amber/Bronze Gradient + 3D Wave) */}
        <Link
          href="/admin/analytics"
          className="relative overflow-hidden p-4 sm:p-5 rounded-[22px] bg-[#241407] bg-gradient-to-br from-[#2A1706] via-[#482708] to-[#60350B] shadow-[0_10px_25px_rgba(36,20,7,0.4)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[135px] border border-white/[0.04]"
        >
          {/* Exact Glowing 3D Wave Image from Reference */}
          <img
            src="/images/clean_wave_4.png"
            alt=""
            className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[65%] object-cover object-right pointer-events-none select-none opacity-95 transition-transform duration-300 group-hover:scale-105"
          />

          <div className="relative z-10">
            {/* Top row: 3D Glossy Icon + Label */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#F59E0B] to-[#B45309] shadow-[0_4px_12px_rgba(180,83,9,0.5),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_2px_rgba(0,0,0,0.25)] border border-[#FCD34D]/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white drop-shadow-xs" />
              </div>
              <span className="text-[12px] sm:text-xs font-bold text-white tracking-tight">
                Scans Today
              </span>
            </div>

            {/* Dominant Metric Number */}
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mt-2.5 mb-1">
              {metrics.scansToday}
            </div>
          </div>

          {/* Bottom row: Subtext on left + Trend on right */}
          <div className="relative z-10 flex items-center justify-between text-[11px] pt-1">
            <span className="text-white/70 font-medium">{metrics.scansThisMonth} this month</span>
            <span className="inline-flex items-center gap-0.5 font-bold text-[#39E900]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0%</span>
            </span>
          </div>
        </Link>
      </div>

      {/* 3. CUSTOMER INQUIRIES & LEADS BANNER */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] bg-white border border-[#DCEBDD] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Soft light green wave gradient on right */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[#E3F4E9]/90 via-[#E3F4E9]/30 to-transparent pointer-events-none"
        />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-[#EBF7EE] text-[#006B21] flex items-center justify-center border border-[#D0ECD7] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-[#050505]">
                Customer Inquiries & Leads ({inquiries.length})
              </h2>
              {inquiries.filter((i) => i.status === "NEW").length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7EE] border border-[#D0ECD7] text-[#006B21]">
                  {inquiries.filter((i) => i.status === "NEW").length} NEW
                </span>
              )}
            </div>
            <p className="text-xs text-[#52606D] mt-0.5">
              Client requests submitted through the website Contact Us page with selected plans.
            </p>
          </div>
        </div>

        <Link
          href="/admin/inquiries"
          className="relative z-10 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0B3B24] hover:bg-[#072919] text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto shrink-0"
        >
          <span>View All Inquiries</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/90" />
        </Link>
      </div>

      {/* 4. CHARTS & TELEMETRY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scans Over Time Chart (Smooth Green Wave Line) */}
        <div className="lg:col-span-2 p-6 rounded-[22px] bg-white border border-[#DCEBDD] shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#006B21] flex items-center justify-center border border-[#D0ECD7]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#050505]">
                    Scan Activity Over Time
                  </h2>
                  <p className="text-xs text-[#52606D] mt-0.5">
                    Dynamic QR scan volume over chosen timeframe
                  </p>
                </div>
              </div>

              {/* Filters & Active Date badge */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* 7d / 30d / 90d Pill */}
                <div className="inline-flex rounded-full bg-[#F4F7F5] p-0.5 text-xs border border-[#E2EBE4]">
                  {["7", "30", "90"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDaysFilter(d)}
                      className={`px-3 py-1 rounded-full font-semibold transition-all ${
                        daysFilter === d
                          ? "bg-[#0B3B24] text-white shadow-xs"
                          : "text-[#52606D] hover:text-[#050505]"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>

                {/* Date indicator pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F7FBF7] border border-[#DCEBDD] text-[#52606D] text-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#006B21]" />
                  <span>
                    {latestPoint?.date || "2026-10-05"} • {latestPoint?.scans || 0} scans
                  </span>
                </div>
              </div>
            </div>

            {/* Chart SVG Visualization */}
            <div className="relative w-full h-56 pt-4 pb-2">
              {/* Background horizontal dashed grid lines */}
              <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none">
                {[4, 3, 2, 1, 0].map((v) => (
                  <div
                    key={v}
                    className="flex items-center gap-3 text-[10px] text-[#A0AEC0] w-full"
                  >
                    <span className="w-3 text-right">{v}</span>
                    <div className="flex-1 border-b border-dashed border-[#E5EEE6]" />
                  </div>
                ))}
              </div>

              {/* Smooth Bezier Curve SVG */}
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible relative z-10"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="scanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006B21" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006B21" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area underneath the curve */}
                {areaD && <path d={areaD} fill="url(#scanWaveGrad)" />}

                {/* Stroke curve line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#006B21"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Highlight Point / Tooltip at latest endpoint */}
                {latestPoint && (
                  <g>
                    {/* Tooltip Box */}
                    <g transform={`translate(${latestPoint.x - 30}, ${Math.max(latestPoint.y - 38, 0)})`}>
                      <rect
                        width="60"
                        height="26"
                        rx="6"
                        fill="#0B3B24"
                        className="shadow-lg"
                      />
                      <text
                        x="30"
                        y="11"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="600"
                      >
                        {latestPoint.date}
                      </text>
                      <text
                        x="30"
                        y="21"
                        textAnchor="middle"
                        fill="#39E900"
                        fontSize="8.5"
                        fontWeight="700"
                      >
                        {latestPoint.scans} scans
                      </text>
                    </g>

                    {/* Glowing Circular Endpoint */}
                    <circle
                      cx={latestPoint.x}
                      cy={latestPoint.y}
                      r="5"
                      fill="#39E900"
                      stroke="#006B21"
                      strokeWidth="3"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* X-axis date labels */}
          <div className="flex items-center justify-between text-[11px] text-[#718096] pt-3 px-6 border-t border-[#E5EEE6] font-medium">
            {scansList.length > 0 ? (
              scansList
                .filter((_: any, i: number) => i % Math.ceil(scansList.length / 8) === 0 || i === scansList.length - 1)
                .map((item: any, idx: number) => (
                  <span key={idx}>{item.date}</span>
                ))
            ) : (
              <>
                <span>Sep 6</span>
                <span>Sep 10</span>
                <span>Sep 14</span>
                <span>Sep 18</span>
                <span>Sep 22</span>
                <span>Sep 26</span>
                <span>Sep 30</span>
                <span>Oct 4</span>
              </>
            )}
          </div>
        </div>

        {/* Device & Hardware Card */}
        <div className="p-6 rounded-[22px] bg-white border border-[#DCEBDD] shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#006B21] flex items-center justify-center border border-[#D0ECD7]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#050505]">
                  Device & Hardware
                </h2>
                <p className="text-xs text-[#52606D] mt-0.5">
                  Visitor device environment
                </p>
              </div>
            </div>

            {/* Device Categories */}
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-[#050505] mb-2">
                  Device Categories
                </div>
                <div className="flex justify-between text-xs text-[#52606D] mb-1.5 font-medium">
                  <span>Mobile</span>
                  <span className="font-bold text-[#006B21]">1 (100%)</span>
                </div>
                <div className="h-2 w-full bg-[#E5EEE6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006B21] rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Top Browsers */}
              <div className="pt-4 border-t border-[#E5EEE6]">
                <div className="text-xs font-bold text-[#050505] mb-2.5">
                  Top Browsers
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {/* Chrome Multi-color SVG icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#EA4335" />
                      <circle cx="12" cy="12" r="6" fill="#FBBC05" />
                      <circle cx="12" cy="12" r="4" fill="#34A853" />
                      <circle cx="12" cy="12" r="3" fill="#4285F4" />
                    </svg>
                    <span className="font-medium text-[#050505]">Chrome • 1</span>
                  </div>
                  <span className="text-[#52606D]">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom notice box */}
          <div className="mt-6 p-2.5 rounded-xl bg-[#F7FBF7] border border-[#E5EEE6] text-[11px] text-[#52606D] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#718096] shrink-0" />
            <span>Audience is 100% mobile users</span>
          </div>
        </div>
      </div>

      {/* 5. TOP PERFORMERS & RECENT AUDIT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Businesses by Scans */}
        <div className="p-6 rounded-[22px] bg-white border border-[#DCEBDD] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF7EE] text-[#006B21] flex items-center justify-center border border-[#D0ECD7]">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#050505]">
                  Top Businesses by Scans
                </h2>
                <p className="text-xs text-[#52606D]">Most active customer destinations</p>
              </div>
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
              <div className="py-6 text-center text-xs text-[#52606D]">
                No scan data recorded yet.
              </div>
            ) : (
              data?.scansByBusiness?.map((b: any, i: number) => (
                <div
                  key={i}
                  className="py-3 flex items-center justify-between hover:bg-[#F7FBF7] rounded-xl px-2 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#EBF7EE] text-[11px] font-bold text-[#006B21] flex items-center justify-center border border-[#D0ECD7]">
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
        <div className="p-6 rounded-[22px] bg-white border border-[#DCEBDD] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF7EE] text-[#006B21] flex items-center justify-center border border-[#D0ECD7]">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#050505]">
                  Recent System Activity
                </h2>
                <p className="text-xs text-[#52606D]">Administrative and card lifecycle logs</p>
              </div>
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
              <div className="py-6 text-center text-xs text-[#52606D]">
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF7EE] text-[#006B21] border border-[#D0ECD7] font-mono">
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
