"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Building2,
  ExternalLink,
  Download,
  Printer,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  Eye,
  Calendar,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  Smartphone,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function CardDetailClient() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const { success, error: toastError } = useToast();

  const [cardData, setCardData] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hostMode, setHostMode] = useState<"network" | "localhost">("network");
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [liveOrigin, setLiveOrigin] = useState("");
  const networkHost = "http://192.168.88.40:3000";

  // Modals
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetBusinessId, setTargetBusinessId] = useState("");
  const [cardLabel, setCardLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      setIsLocalhost(isLocal);
      setLiveOrigin(window.location.origin);
    }
  }, []);

  const fetchCardData = async (mode = hostMode) => {
    setLoading(true);
    try {
      let activeHost = "";
      if (typeof window !== "undefined") {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (isLocal) {
          activeHost = mode === "network" ? networkHost : "http://localhost:3000";
        } else {
          // Cloud / Vercel / Production environment: ALWAYS use live origin
          activeHost = window.location.origin;
        }
      }

      const [cRes, bRes] = await Promise.all([
        fetch(`/api/cards/${id}?host=${encodeURIComponent(activeHost)}`),
        fetch("/api/businesses"),
      ]);

      if (cRes.ok) {
        const cData = await cRes.json();
        setCardData(cData);
        setCardLabel(cData.card?.label || "");
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setBusinesses(bData.businesses || []);
      }
    } catch {
      toastError("Failed to fetch card details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCardData();
  }, [id]);

  const handleSwitchHostMode = (mode: "network" | "localhost") => {
    setHostMode(mode);
    fetchCardData(mode);
  };

  const copyUrlToClipboard = () => {
    if (!cardData?.publicUrl) return;
    navigator.clipboard.writeText(cardData.publicUrl);
    setCopied(true);
    success("Public URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQrPng = () => {
    if (!cardData?.qrDataUrl) return;
    const link = document.createElement("a");
    link.href = cardData.qrDataUrl;
    link.download = `${cardData.card.cardCode}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("QR Code PNG downloaded!");
  };

  const downloadQrSvg = () => {
    if (!cardData?.qrSvg) return;
    const blob = new Blob([cardData.qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cardData.card.cardCode}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success("QR Code SVG downloaded!");
  };

  const handleUpdateLabel = async () => {
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: cardLabel }),
      });
      if (res.ok) {
        success("Label saved successfully!");
        fetchCardData();
      }
    } catch {
      toastError("Failed to save label");
    }
  };

  const handleReassign = async () => {
    if (!targetBusinessId) return;
    setSubmitting(true);
    try {
      const endpoint = cardData.card.businessId
        ? `/api/cards/${id}/reassign`
        : `/api/cards/${id}/assign`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: targetBusinessId }),
      });

      if (res.ok) {
        success("Card assigned/reassigned successfully!");
        setReassignModalOpen(false);
        fetchCardData();
      } else {
        const data = await res.json();
        toastError(data.error || "Assignment failed");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const endpoint =
        cardData.card.status === "DISABLED"
          ? `/api/cards/${id}/enable`
          : `/api/cards/${id}/disable`;

      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        success(`Card ${cardData.card.status === "DISABLED" ? "enabled" : "disabled"} successfully!`);
        fetchCardData();
      }
    } catch {
      toastError("Action failed");
    }
  };

  const handleToggleBusinessPlan = async (targetPlan: string) => {
    if (!cardData?.card?.business?.id) return;
    try {
      const res = await fetch(`/api/businesses/${cardData.card.business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: targetPlan }),
      });
      if (res.ok) {
        success(`Plan updated to ${targetPlan === "PREMIUM" ? "Premium (Smart Funnel)" : "Basic (Direct Google Redirect)"}!`);
        fetchCardData();
      } else {
        toastError("Failed to update plan");
      }
    } catch {
      toastError("Network error");
    }
  };

  const handleDeleteCard = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        success(`Card ${cardData.card.cardCode} deleted successfully!`);
        router.push("/admin/cards");
      } else {
        toastError(data.error || "Failed to delete card");
      }
    } catch {
      toastError("Network error while deleting card");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
        <span className="text-xs">Loading card details...</span>
      </div>
    );
  }

  if (!cardData?.card) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-lg font-bold text-white">
          Card not found
        </h3>
        <Link
          href="/admin/cards"
          className="mt-4 inline-flex items-center gap-2 text-xs text-[#39E900] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cards inventory
        </Link>
      </div>
    );
  }

  const { card, publicUrl, stats, qrDataUrl } = cardData;

  let badge = "bg-[#E9F8E9] text-[#050505]/70 border border-[#006B21]/20";
  if (card.status === "ASSIGNED") {
    badge = "bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/30";
  } else if (card.status === "DISABLED") {
    badge = "bg-rose-50 text-rose-700 border border-rose-200";
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/cards"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#050505]/60 hover:text-[#050505] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cards Inventory
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            Delete Card
          </button>

          <Link
            href={`/admin/printable?cardId=${card.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#006B21]/20 bg-white text-xs font-bold text-[#050505] hover:bg-[#E9F8E9] transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#006B21]" />
            Print Card
          </Link>

          <button
            onClick={() => {
              setTargetBusinessId(card.businessId || "");
              setReassignModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all"
          >
            {card.businessId ? "Reassign Destination" : "Assign to Business"}
          </button>
        </div>
      </div>

      {/* Hero Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Presentation Box */}
        <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm flex flex-col items-center text-center">
          {/* Host Mode Selector for Mobile vs Desktop (Only on localhost) */}
          {isLocalhost ? (
            <div className="w-full mb-3 p-1 rounded-xl bg-[#E9F8E9]/60 border border-[#006B21]/20 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSwitchHostMode("network")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  hostMode === "network"
                    ? "bg-[#006B21] text-white shadow-sm border border-[#006B21]/30"
                    : "text-[#050505]/60 hover:text-[#050505]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 Phone Scanner</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchHostMode("localhost")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  hostMode === "localhost"
                    ? "bg-[#006B21] text-white shadow-sm border border-[#006B21]/30"
                    : "text-[#050505]/60 hover:text-[#050505]"
                }`}
              >
                <span>💻 Desktop</span>
              </button>
            </div>
          ) : (
            <div className="w-full mb-3 py-1.5 px-3 rounded-xl bg-[#E9F8E9] border border-[#006B21]/20 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#006B21]">
              <span className="w-2 h-2 rounded-full bg-[#006B21] animate-pulse" />
              <span>Live Cloud Domain ({liveOrigin})</span>
            </div>
          )}

          <div className="w-56 h-56 p-3 bg-[#E9F8E9]/40 rounded-2xl shadow-inner border border-[#006B21]/15 mb-3 flex items-center justify-center">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt={`QR code for ${card.cardCode}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <span className="font-mono font-black text-lg text-[#050505] tracking-wider">
            {card.cardCode}
          </span>
          <span className="text-xs text-[#050505]/60 mt-0.5 font-medium">
            Token: <span className="font-mono text-[#006B21] font-bold">{card.publicToken}</span>
          </span>

          <p className="text-[10px] text-[#006B21] font-semibold mt-2 px-2 py-1 bg-[#E9F8E9] rounded-lg border border-[#006B21]/20">
            {!isLocalhost
              ? "✓ Global Live QR: Kisi bhi phone se 4G/5G par scan karein!"
              : hostMode === "network"
              ? "✓ Phone se scan karein (Same Wi-Fi par connected rahein)"
              : "Desktop localhost mode"}
          </p>

          <div className="flex items-center gap-2 mt-3 w-full">
            <button
              onClick={downloadQrPng}
              className="flex-1 py-2 px-3 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-xs font-bold text-[#050505] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#006B21]" />
              PNG
            </button>
            <button
              onClick={downloadQrSvg}
              className="flex-1 py-2 px-3 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-xs font-bold text-[#050505] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#006B21]" />
              SVG
            </button>
          </div>
        </div>

        {/* Card Metadata & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#006B21]/15">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-[#050505] font-mono">
                    {card.cardCode}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge}`}>
                    {card.status}
                  </span>
                </div>
                <p className="text-xs text-[#050505]/60 mt-1 font-medium">
                  Created {new Date(card.createdAt).toLocaleDateString()}
                  {card.assignedAt && ` • Assigned ${new Date(card.assignedAt).toLocaleDateString()}`}
                </p>
              </div>

              <button
                onClick={handleToggleStatus}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto ${
                  card.status === "DISABLED"
                    ? "bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/30"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {card.status === "DISABLED" ? "Re-enable Card" : "Disable Card"}
              </button>
            </div>

            {/* Permanent Redirect URL Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-1.5">
                Permanent Public Redirect URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 px-3.5 py-2.5 bg-[#E9F8E9]/50 border border-[#006B21]/20 rounded-xl text-xs font-mono text-[#050505] font-medium focus:outline-none"
                />
                <button
                  onClick={copyUrlToClipboard}
                  className="p-2.5 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-[#050505] transition-colors shadow-sm"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-4 h-4 text-[#006B21]" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#006B21] text-white hover:bg-[#005219] transition-opacity shadow-sm"
                  title="Test Scan"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
              </div>
              <p className="text-[11px] text-[#050505]/60 mt-1.5 font-medium">
                ⚡ This permanent address is printed on the physical card. The backend dynamically resolves it to the assigned business.
              </p>
            </div>

            {/* Assigned Business Destination */}
            <div className="p-4 rounded-2xl bg-[#E9F8E9]/60 border border-[#006B21]/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#006B21]">
                Currently Assigned Business
              </span>
              {card.business ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <Link
                        href={`/admin/businesses/${card.business.id}`}
                        className="font-bold text-sm text-[#050505] hover:text-[#006B21] flex items-center gap-1.5"
                      >
                        <Building2 className="w-4 h-4 text-[#006B21]" />
                        {card.business.name}
                      </Link>
                      <div className="text-xs font-mono text-[#050505]/70 mt-1 truncate max-w-md">
                        {card.business.googleReviewUrl}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setTargetBusinessId(card.businessId);
                        setReassignModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#006B21] border border-[#006B21]/30 text-xs font-bold text-white hover:bg-[#005219] shadow-sm"
                    >
                      Reassign
                    </button>
                  </div>

                  {/* Subscription Plan & Scan Routing Behavior Box */}
                  <div className="mt-3 pt-3 border-t border-[#006B21]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#050505]/60">Plan & Scan Behavior:</span>
                        {card.business.planType === "PREMIUM" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#006B21] text-white border border-[#006B21]/30 flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-[#E9F8E9]" /> PREMIUM PLAN
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E9F8E9] text-[#050505]/80 border border-[#006B21]/20">
                            🟢 BASIC PLAN
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#050505]/70 font-medium">
                        {card.business.planType === "PREMIUM"
                          ? "⭐ QR scan karne par Smart Review Funnel khulta hai (4-5★ auto copy compliments, 1-3★ private feedback shield)."
                          : "🟢 QR scan karne par seedha Google Review page open hota hai."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {card.business.planType === "PREMIUM" && (
                        <a
                          href={`/review/${card.publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#006B21]/30 text-[#006B21] hover:bg-[#E9F8E9] text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview Smart Page
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleToggleBusinessPlan(card.business.planType === "PREMIUM" ? "BASIC" : "PREMIUM")}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#006B21]/20 hover:bg-[#E9F8E9] text-xs font-bold text-[#050505] transition-colors shadow-sm"
                      >
                        {card.business.planType === "PREMIUM" ? "Switch to Basic" : "Upgrade to Premium"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#050505]/50 italic font-medium">Unassigned (In warehouse stock)</span>
                  <button
                    onClick={() => {
                      setTargetBusinessId("");
                      setReassignModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#006B21] text-white text-xs font-bold hover:bg-[#005219] shadow-sm"
                  >
                    Assign Now
                  </button>
                </div>
              )}
            </div>

            {/* Label editing */}
            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Card Location / Desk Label
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cardLabel}
                  onChange={(e) => setCardLabel(e.target.value)}
                  placeholder="e.g. Front Desk Checkout, Table 12, VIP Lounge"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#006B21]"
                />
                <button
                  onClick={handleUpdateLabel}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold transition-opacity shadow-sm"
                >
                  Save Label
                </button>
              </div>
            </div>
          </div>

          {/* Stats Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
              <span className="text-[11px] font-bold text-[#050505]/60 uppercase">Today</span>
              <div className="text-xl font-black text-[#050505] mt-1">
                {stats?.today || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
              <span className="text-[11px] font-bold text-[#050505]/60 uppercase">7 Days</span>
              <div className="text-xl font-black text-[#050505] mt-1">
                {stats?.sevenDays || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
              <span className="text-[11px] font-bold text-[#050505]/60 uppercase">30 Days</span>
              <div className="text-xl font-black text-[#050505] mt-1">
                {stats?.thirtyDays || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
              <span className="text-[11px] font-bold text-[#050505]/60 uppercase">All Time</span>
              <div className="text-xl font-black text-[#006B21] mt-1">
                {stats?.total || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Telemetry for this Card */}
      <div className="bg-white rounded-2xl border border-[#006B21]/15 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#006B21]/15">
          <h2 className="text-base font-bold text-[#050505]">
            Recent Scans Telemetry ({card.scans?.length || 0})
          </h2>
          <p className="text-xs text-[#050505]/60 font-medium">
            Real-time audit log of customer interactions with this specific card.
          </p>
        </div>

        {card.scans?.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#050505]/50 font-medium">
            No scans recorded yet for this card. Test it by scanning the QR code above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E9F8E9] text-[#006B21] uppercase tracking-wider font-bold border-b border-[#006B21]/15">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Browser & OS</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Hashed IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/10">
                {card.scans.map((s: any) => (
                  <tr key={s.id} className="hover:bg-[#E9F8E9]/40 transition-colors">
                    <td className="py-3 px-4 text-[#050505]/70 font-mono">
                      {new Date(s.scannedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#050505]">
                      {s.deviceType || "Mobile"}
                    </td>
                    <td className="py-3 px-4 text-[#050505]/70 font-medium">
                      {s.browser} on {s.os}
                    </td>
                    <td className="py-3 px-4 text-[#050505]/60 font-medium">
                      {s.city ? `${s.city}, ${s.country}` : "Global"}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#050505]/40">
                      {s.ipHash ? s.ipHash.slice(0, 12) + "…" : "anonymized"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reassignment Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#006B21]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#050505]">
                  {card.businessId ? "Reassign Destination Business" : "Assign to Business"}
                </h3>
                <p className="text-xs text-[#050505]/60 mt-0.5 font-medium">
                  Card Code: <span className="font-mono font-bold text-[#006B21]">{card.cardCode}</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#E9F8E9]/60 border border-[#006B21]/20 rounded-xl text-xs text-[#050505]/80 leading-relaxed font-medium">
              ⚠️ <strong className="text-[#006B21]">Notice:</strong> Customers scanning this physical QR card will be redirected to the new business destination immediately. The physical card remains 100% reusable and does NOT need to be reprinted.
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs">
                <span className="text-[#050505]/60">Current Destination: </span>
                <span className="font-bold text-[#050505]">
                  {card.business ? card.business.name : "Unassigned"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                  Choose New Business Destination *
                </label>
                <select
                  required
                  value={targetBusinessId}
                  onChange={(e) => setTargetBusinessId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
                >
                  <option value="">Select a business...</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.businessType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#006B21]/15">
              <button
                type="button"
                onClick={() => setReassignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/70 hover:bg-[#E9F8E9]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !targetBusinessId}
                onClick={handleReassign}
                className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4 text-[#050505]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#050505]">Delete QR Card</h3>
                <p className="text-xs text-[#050505]/60">Permanently delete {card.cardCode}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E9F8E9]/40 border border-[#006B21]/15 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Card Code:</span>
                <span className="font-mono font-bold text-[#050505]">{card.cardCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Public Token:</span>
                <span className="font-mono text-[#006B21] font-bold">/r/{card.publicToken}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Assigned Business:</span>
                <span className="text-[#050505] font-medium">
                  {card.business?.name || "None (Unassigned)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Total Scans:</span>
                <span className="text-[#050505] font-bold">{stats?.total || 0}</span>
              </div>
            </div>

            <p className="text-xs text-rose-700 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
              ⚠️ Warning: Deleting this card will permanently wipe its redirect routing and all recorded scan history. Any physical card already printed with this QR code will stop working.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#006B21]/15">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/70 hover:bg-[#E9F8E9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCard}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
