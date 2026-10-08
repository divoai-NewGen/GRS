"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Store,
  CreditCard,
  Eye,
  TrendingUp,
  ExternalLink,
  Download,
  CheckCircle,
  Loader2,
  Calendar,
  Smartphone,
  QrCode,
  Sparkles,
  Star,
  MessageSquareHeart,
  BarChart3,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import QRCode from "qrcode";

export function BusinessDashboardClient({
  initialBusinesses,
}: {
  initialBusinesses: any[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = searchParams.get("tab") as "overview" | "cards" | "feedback" | "profile" | null;
  const activeTab = urlTab || "overview";

  const { success, error: toastError } = useToast();
  const [businesses, setBusinesses] = useState<any[]>(initialBusinesses || []);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    initialBusinesses?.[0]?.id || ""
  );
  const [businessDetail, setBusinessDetail] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // QR preview modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrCard, setActiveQrCard] = useState<any>(null);
  const [activeQrDataUrl, setActiveQrDataUrl] = useState<string>("");

  const fetchBusinessData = async (bId: string) => {
    if (!bId) return;
    setLoading(true);
    try {
      const [bRes, aRes, fRes] = await Promise.all([
        fetch(`/api/businesses/${bId}`),
        fetch(`/api/analytics/business/${bId}`),
        fetch(`/api/feedback?businessId=${bId}`),
      ]);

      if (bRes.ok) {
        const bJson = await bRes.json();
        setBusinessDetail(bJson.business);
      }
      if (aRes.ok) {
        const aJson = await aRes.json();
        setAnalytics(aJson);
      }
      if (fRes.ok) {
        const fJson = await fRes.json();
        setFeedbacks(fJson.feedbacks || []);
      }
    } catch {
      toastError("Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessId) {
      fetchBusinessData(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const handleOpenQrModal = async (card: any) => {
    setActiveQrCard(card);
    const host = window.location.origin;
    const url = `${host}/r/${card.publicToken}`;
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      width: 600,
      margin: 2,
      color: { dark: "#050505", light: "#ffffff" },
    });
    setActiveQrDataUrl(dataUrl);
    setQrModalOpen(true);
  };

  const downloadQr = () => {
    if (!activeQrDataUrl || !activeQrCard) return;
    const a = document.createElement("a");
    a.href = activeQrDataUrl;
    a.download = `${activeQrCard.cardCode}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success("QR Code image downloaded!");
  };

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard?tab=${tabId}`, { scroll: false });
  };

  if (!selectedBusinessId || businesses.length === 0) {
    return (
      <div className="py-20 text-center">
        <Store className="w-12 h-12 text-[#39E900] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">
          No business assigned yet
        </h2>
        <p className="text-xs text-white/60 mt-1">
          Please contact your GrowBroo platform administrator to link your business profile.
        </p>
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalScans: businessDetail?._count?.scans || 0,
    scansToday: 0,
    scansThisMonth: 0,
    activeCardsCount: businessDetail?.cards?.length || 0,
  };

  const maxScan = Math.max(
    ...(analytics?.scansOverTime?.map((s: any) => s.scans) || [1]),
    1
  );

  return (
    <div className="space-y-6">
      {/* Top Business Switcher / Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#050505] border border-[#006B21]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/30">
              Active Client Store
            </span>
            {businessDetail?.planType === "PREMIUM" ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#006B21] text-[#39E900] border border-[#39E900]/50 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#39E900]" /> PREMIUM PLAN (Smart Assistant)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#10251A] text-white/70 border border-[#006B21]/40">
                BASIC PLAN (Instant Google Redirect)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
            {businessDetail?.name || "Your Business"}
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Official Dynamic QR Google Review Management Portal
          </p>
        </div>

        {businesses.length > 1 && (
          <select
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#006B21]/50 bg-[#10251A] text-white text-xs font-semibold focus:outline-none"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Modern Desktop & Tablet Segmented Tab Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#050505] rounded-2xl border border-[#006B21]/40 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
              : "text-white/60 hover:text-white hover:bg-[#10251A]"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#39E900]" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleTabChange("cards")}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "cards"
              ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
              : "text-white/60 hover:text-white hover:bg-[#10251A]"
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#39E900]" />
          <span>My QR Cards ({businessDetail?.cards?.length || 0})</span>
        </button>

        <button
          onClick={() => handleTabChange("feedback")}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "feedback"
              ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
              : "text-white/60 hover:text-white hover:bg-[#10251A]"
          }`}
        >
          <MessageSquareHeart className="w-4 h-4 text-[#39E900]" />
          <span>Private Feedbacks ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("profile")}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-[#006B21] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
              : "text-white/60 hover:text-white hover:bg-[#10251A]"
          }`}
        >
          <Building2 className="w-4 h-4 text-[#39E900]" />
          <span>Store Info & Link</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: OVERVIEW & ANALYTICS                          */}
      {/* ==================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Destination Google URL Banner */}
          <div className="p-5 rounded-2xl bg-[#10251A] border border-[#006B21]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#39E900]">
                Connected Google Review Request Link
              </span>
              <div className="text-xs font-mono text-white/90 mt-1 truncate max-w-xl">
                {businessDetail?.googleReviewUrl || "Not configured"}
              </div>
            </div>

            {businessDetail?.googleReviewUrl && (
              <a
                href={businessDetail.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#39E900]" />
                Test Live Review Page
              </a>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                Active QR Cards
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {metrics.activeCardsCount}
              </div>
              <span className="text-[10px] text-white/50">In field circulation</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                Total Scans
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#39E900] mt-1">
                {metrics.totalScans}
              </div>
              <span className="text-[10px] text-white/50">
                ~{analytics?.metrics?.uniqueVisitors || 0} unique visitors
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                Scans Today
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {metrics.scansToday}
              </div>
              <span className="text-[10px] text-white/50">Last 24 hours</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                This Month
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#39E900] mt-1">
                {metrics.scansThisMonth}
              </div>
              <span className="text-[10px] text-white/50">Current calendar month</span>
            </div>
          </div>

          {/* 14-Day Scan Activity Chart */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md">
            <h2 className="text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#39E900]" />
              Review Scan Activity (Past 14 Days)
            </h2>
            <p className="text-xs text-white/60 mb-6">
              Daily customer scans navigating to leave Google reviews for your business.
            </p>

            <div className="h-44 sm:h-56 flex items-end gap-1.5 sm:gap-3 pt-6 border-b border-[#006B21]/20 pb-2">
              {analytics?.scansOverTime?.length > 0 ? (
                analytics.scansOverTime.map((d: any, idx: number) => {
                  const heightPercent = Math.max((d.scans / maxScan) * 100, 4);
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[#39E900] font-bold">
                        {d.scans}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#006B21] group-hover:bg-[#39E900] rounded-t-md transition-all duration-300 shadow-sm"
                      />
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                  Telemetry data will populate as customers scan your physical QR cards.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mt-3">
              <span>{analytics?.scansOverTime?.[0]?.date || "14 days ago"}</span>
              <span>Today</span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleTabChange("cards")}
              className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 hover:border-[#39E900]/60 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10251A] flex items-center justify-center text-[#39E900]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#39E900] transition-colors">
                    Manage & Download Cards
                  </div>
                  <div className="text-xs text-white/50">
                    {businessDetail?.cards?.length || 0} physical cards assigned
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#39E900]" />
            </button>

            <button
              onClick={() => handleTabChange("feedback")}
              className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 hover:border-[#39E900]/60 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10251A] flex items-center justify-center text-[#39E900]">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#39E900] transition-colors">
                    Customer Feedback Inbox
                  </div>
                  <div className="text-xs text-white/50">
                    {feedbacks.length} private grievances recorded
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#39E900]" />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: MY QR CARDS                                   */}
      {/* ==================================================== */}
      {activeTab === "cards" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#39E900]" />
                Your Active Review Cards
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Physical QR cards assigned and distributed across your store location.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#10251A] border border-[#006B21]/40 text-xs font-bold text-[#39E900] self-start sm:self-auto">
              {businessDetail?.cards?.length || 0} Cards Active
            </span>
          </div>

          {!businessDetail?.cards || businessDetail.cards.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#050505] border border-[#006B21]/30">
              <CreditCard className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No QR cards assigned yet</h3>
              <p className="text-xs text-white/50 mt-1">
                Your GrowBroo platform administrator will link physical cards to your account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessDetail.cards.map((c: any) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md space-y-4 hover:border-[#39E900]/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                        Card Code
                      </span>
                      <span className="text-lg font-black font-mono text-[#39E900]">
                        {c.cardCode}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/30">
                      {c.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#10251A]/60 border border-[#006B21]/30 text-xs">
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase">Placement Label</span>
                      <span className="font-semibold text-white truncate block">
                        {c.label || "Front Counter"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase">Total Scans</span>
                      <span className="font-bold text-[#39E900] text-sm">
                        {c._count?.scans || 0} scans
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenQrModal(c)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#39E900]" />
                      View & Download QR
                    </button>
                    <a
                      href={`/r/${c.publicToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#10251A] hover:bg-[#10251A]/80 text-white/70 hover:text-white border border-[#006B21]/40 transition-colors"
                      title="Test live redirect"
                    >
                      <ExternalLink className="w-4 h-4 text-[#39E900]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How Dynamic QR Works Info Card */}
          <div className="p-5 rounded-2xl bg-[#10251A] border border-[#006B21]/40 space-y-2 text-xs text-white/70">
            <div className="font-bold text-[#39E900] flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4" />
              Dynamic Permanent Cards (Never Need Reprints)
            </div>
            <p>
              Your physical QR cards link permanently to GrowBroo system tokens. Whenever you update your Google Review URL, all printed cards instantly redirect customers to the new link in real time without having to reprint or replace physical cards!
            </p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: CUSTOMER FEEDBACK INBOX                       */}
      {/* ==================================================== */}
      {activeTab === "feedback" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#39E900]" />
                Private Customer Feedback Inbox
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Customer grievances captured from 1-3 star ratings so you can resolve them privately without hurting your public Google rating.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-800 text-xs font-bold text-amber-300 self-start sm:self-auto">
              {feedbacks.length} Grievances Filtered
            </span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#050505] border border-[#006B21]/30 space-y-3">
              <CheckCircle className="w-12 h-12 text-[#39E900] mx-auto opacity-80" />
              <h3 className="text-base font-bold text-white">
                No negative complaints recorded!
              </h3>
              <p className="text-xs text-white/60 max-w-md mx-auto">
                Your Google review rating is fully protected. All satisfied customers (4-5 stars) are directed straight to Google Reviews!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((f: any) => {
                let issues: string[] = [];
                try {
                  issues = f.tags ? JSON.parse(f.tags) : [];
                } catch {
                  issues = [];
                }
                return (
                  <div
                    key={f.id}
                    className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md space-y-3 hover:border-amber-700/50 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-950/70 border border-amber-900 px-2.5 py-1 rounded-lg text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {f.rating} / 5 Stars
                        </span>
                        <span className="font-bold text-white text-sm">
                          {f.customerName || "Anonymous Customer"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {f.customerPhone && (
                      <div className="text-xs text-white/60 font-mono flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#39E900]" />
                        <span>Contact: {f.customerPhone}</span>
                      </div>
                    )}

                    {issues.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {issues.map((issue: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#10251A] text-amber-300 text-[11px] border border-amber-900/50"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    )}

                    {f.feedback && (
                      <p className="text-xs text-white/80 bg-[#10251A]/60 p-3 rounded-xl border border-[#006B21]/20">
                        &quot;{f.feedback}&quot;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: STORE PROFILE & SETUP                         */}
      {/* ==================================================== */}
      {activeTab === "profile" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#39E900]" />
              Store Profile & Connection Settings
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Verified business details, active plan type, and destination review configuration.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/40 shadow-md space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                  Business Name
                </span>
                <span className="text-base font-bold text-white">
                  {businessDetail?.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                  Category / Industry
                </span>
                <span className="text-base font-bold text-[#39E900]">
                  {businessDetail?.businessType || "Retail"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                  Location Address
                </span>
                <span className="text-xs text-white/80">
                  {businessDetail?.address || "Address not provided"}
                  {businessDetail?.city && `, ${businessDetail.city}`}
                  {businessDetail?.country && `, ${businessDetail.country}`}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                  Contact Phone / Email
                </span>
                <span className="text-xs text-white/80">
                  {businessDetail?.phone || "No Phone"} • {businessDetail?.email || "No Email"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#006B21]/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#39E900] block mb-1">
                Connected Google Review Request Link
              </span>
              <div className="p-3 bg-[#10251A] rounded-xl border border-[#006B21]/40 text-xs font-mono text-white/90 break-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="truncate">{businessDetail?.googleReviewUrl}</span>
                {businessDetail?.googleReviewUrl && (
                  <a
                    href={businessDetail.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shrink-0 self-start sm:self-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#39E900]" />
                    Test Review Page
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#006B21]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  GrowBroo Plan: {businessDetail?.planType === "PREMIUM" ? "Premium (Smart Review Assistant)" : "Basic (Direct Deep-Link)"}
                </span>
                <span className="text-[11px] text-white/50">
                  Need more QR physical cards, counter stands, or plan upgrade?
                </span>
              </div>
              <a
                href="mailto:growbroo.info@gmail.com"
                className="px-4 py-2 rounded-xl bg-[#10251A] hover:bg-[#006B21] border border-[#006B21]/50 text-[#39E900] hover:text-white font-bold text-xs transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                Contact Administrator
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal for Business Owner */}
      {qrModalOpen && activeQrCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#050505] rounded-3xl p-6 shadow-2xl border border-[#006B21]/50 text-center space-y-4">
            <h3 className="text-base font-bold text-white">
              {activeQrCard.cardCode} QR Code
            </h3>
            <p className="text-xs text-white/60">
              {activeQrCard.label || "Customer Review QR Card"}
            </p>

            <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl shadow-inner border border-slate-100">
              {activeQrDataUrl && (
                <img
                  src={activeQrDataUrl}
                  alt={`QR for ${activeQrCard.cardCode}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setQrModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#006B21]/40 text-xs font-bold text-white hover:bg-[#10251A]"
              >
                Close
              </button>
              <button
                onClick={downloadQr}
                className="flex-1 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#39E900]" />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
