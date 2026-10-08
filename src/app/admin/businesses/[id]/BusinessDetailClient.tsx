"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  Eye,
  ExternalLink,
  Edit2,
  Check,
  Plus,
  ArrowLeft,
  Loader2,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  TrendingUp,
  Sparkles,
  Star,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function BusinessDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { success, error: toastError } = useToast();

  const [business, setBusiness] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [unassignedCards, setUnassignedCards] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState(false);

  // Edit Google Review URL modal
  const [editUrlModal, setEditUrlModal] = useState(false);
  const [newReviewUrl, setNewReviewUrl] = useState("");
  const [savingUrl, setSavingUrl] = useState(false);

  // Assign card modal
  const [assignCardModal, setAssignCardModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [assigningCard, setAssigningCard] = useState(false);

  const fetchBusinessData = async () => {
    setLoading(true);
    try {
      const [bRes, aRes, cRes, fRes] = await Promise.all([
        fetch(`/api/businesses/${id}`),
        fetch(`/api/analytics/business/${id}`),
        fetch("/api/cards?status=UNASSIGNED"),
        fetch(`/api/feedback?businessId=${id}`),
      ]);

      if (bRes.ok) {
        const bData = await bRes.json();
        setBusiness(bData.business);
        setNewReviewUrl(bData.business.googleReviewUrl);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setAnalytics(aData);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setUnassignedCards(cData.cards || []);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        setFeedbacks(fData.feedbacks || []);
      }
    } catch {
      toastError("Failed to load business details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBusinessData();
  }, [id]);

  const handleTogglePlan = async (targetPlan: string) => {
    setUpdatingPlan(true);
    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: targetPlan }),
      });
      if (res.ok) {
        success(
          `Business upgraded to ${
            targetPlan === "PREMIUM"
              ? "Premium (Smart Review Assistant)"
              : "Basic (Direct Redirect)"
          }!`
        );
        fetchBusinessData();
      } else {
        toastError("Failed to update plan");
      }
    } catch {
      toastError("Network error");
    } finally {
      setUpdatingPlan(false);
    }
  };

  const handleUpdateReviewUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUrl(true);
    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleReviewUrl: newReviewUrl }),
      });

      if (res.ok) {
        success("Google Review destination updated!");
        setEditUrlModal(false);
        fetchBusinessData();
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to update URL");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSavingUrl(false);
    }
  };

  const handleAssignCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId) return;

    setAssigningCard(true);
    try {
      const res = await fetch(`/api/cards/${selectedCardId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: id }),
      });

      if (res.ok) {
        success("Card assigned to business successfully!");
        setAssignCardModal(false);
        setSelectedCardId("");
        fetchBusinessData();
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to assign card");
      }
    } catch {
      toastError("Network error");
    } finally {
      setAssigningCard(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
        <span className="text-xs">Loading business profile...</span>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Business not found
        </h3>
        <Link
          href="/admin/businesses"
          className="mt-4 inline-flex items-center gap-2 text-xs text-[#39E900] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to businesses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back & Action Row */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/businesses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Businesses
        </Link>

        <button
          onClick={() => setAssignCardModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all"
        >
          <Plus className="w-4 h-4 text-[#39E900]" />
          Assign QR Card
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#006B21]/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#10251A] flex items-center justify-center font-black text-xl text-white shrink-0 border border-[#006B21]/40 overflow-hidden">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-[#39E900]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {business.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10251A] text-[#39E900] border border-[#006B21]/40">
                {business.businessType}
              </span>
              {business.status === "ACTIVE" ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/40 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-900 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 mt-1 max-w-xl">
              {business.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Contact info pill */}
        <div className="flex flex-wrap gap-4 text-xs text-white/60 border-t md:border-t-0 md:border-l border-[#006B21]/20 pt-4 md:pt-0 md:pl-6">
          {business.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#39E900]" />
              <span>{business.city}, {business.state}</span>
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#39E900]" />
              <span>{business.phone}</span>
            </div>
          )}
          {business.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#39E900]" />
              <span>{business.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Google Review Destination Box */}
      <div className="p-5 rounded-2xl bg-[#10251A] border border-[#006B21]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#39E900]">
              Live Google Review Destination
            </span>
          </div>
          <div className="text-xs font-mono text-white/90 truncate max-w-2xl bg-[#050505] px-3 py-1.5 rounded-lg border border-[#006B21]/30">
            {business.googleReviewUrl}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={business.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#050505] border border-[#006B21]/40 text-xs font-bold text-white hover:bg-[#10251A] transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#39E900]" />
            Test Link
          </a>
          <button
            onClick={() => setEditUrlModal(true)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#39E900]" />
            Edit Destination
          </button>
        </div>
      </div>

      {/* Plan Configuration & Smart Review Flow Box */}
      <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              Subscription Plan & Routing Mode
            </span>
            {business.planType === "PREMIUM" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#006B21] text-[#39E900] border border-[#39E900]/50 flex items-center gap-1 shadow-[0_0_10px_rgba(57,233,0,0.3)]">
                <Sparkles className="w-3 h-3 text-[#39E900]" /> PREMIUM PLAN
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10251A] text-white/80 border border-[#006B21]/50 flex items-center gap-1">
                BASIC PLAN
              </span>
            )}
          </div>

          <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
            {business.planType === "PREMIUM"
              ? "⭐ Smart Review Assistant Active: Physical QR scans open the interactive GrowBroo funnel with category filters, ready-made compliments, 1-click clipboard copy, and negative review filtering (1-3 stars routed to private management feedback)."
              : "🟢 Basic Direct Mode: Physical QR scans perform an instant direct 307 redirect to the official Google Review URL."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {business.cards?.[0] && business.planType === "PREMIUM" && (
            <a
              href={`/review/${business.cards[0].publicToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10251A] border border-[#39E900]/40 text-xs font-bold text-[#39E900] hover:bg-[#153322] transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-[#39E900]" />
              Preview Smart Flow
            </a>
          )}

          <button
            disabled={updatingPlan}
            onClick={() => handleTogglePlan(business.planType === "PREMIUM" ? "BASIC" : "PREMIUM")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              business.planType === "PREMIUM"
                ? "bg-[#10251A] border border-[#006B21]/50 text-white/80 hover:text-white hover:bg-white/5"
                : "bg-[#006B21] hover:bg-[#005219] text-white shadow-md shadow-[#006B21]/30 border border-[#39E900]/40"
            }`}
          >
            {updatingPlan && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {business.planType === "PREMIUM" ? "Switch to Basic Plan" : "Upgrade to Premium Plan"}
          </button>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Total Scans
          </span>
          <div className="text-2xl font-black text-[#39E900] mt-1">
            {analytics?.metrics?.totalScans || business._count?.scans || 0}
          </div>
          <span className="text-[11px] text-white/50">
            ~{analytics?.metrics?.uniqueVisitors || 0} unique visitors
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Scans Today
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {analytics?.metrics?.scansToday || 0}
          </div>
          <span className="text-[11px] text-white/50">Last 24 hours</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Scans This Month
          </span>
          <div className="text-2xl font-black text-[#39E900] mt-1">
            {analytics?.metrics?.scansThisMonth || 0}
          </div>
          <span className="text-[11px] text-white/50">Current calendar month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
            Active QR Cards
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {business.cards?.length || 0}
          </div>
          <span className="text-[11px] text-white/50">Deployed in field</span>
        </div>
      </div>

      {/* Assigned Cards Table */}
      <div className="bg-[#050505] rounded-2xl border border-[#006B21]/30 shadow-md overflow-hidden">
        <div className="p-5 border-b border-[#006B21]/20 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Assigned QR Cards ({business.cards?.length || 0})
            </h2>
            <p className="text-xs text-white/60">
              Cards actively routing customer scans to this business.
            </p>
          </div>
          <button
            onClick={() => setAssignCardModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-xs font-bold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#39E900]" /> Assign Card
          </button>
        </div>

        {business.cards?.length === 0 ? (
          <div className="py-12 text-center text-xs text-white/40">
            No cards assigned to this business yet. Click &quot;Assign QR Card&quot; to connect a card.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10251A] text-white/60 uppercase tracking-wider font-semibold border-b border-[#006B21]/30">
                <tr>
                  <th className="py-3 px-4">Card Code</th>
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">Public Token</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Scans</th>
                  <th className="py-3 px-4">Assigned On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/20">
                {business.cards.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#10251A]/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      <Link href={`/admin/cards/${c.id}`} className="hover:text-[#39E900]">
                        {c.cardCode}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-white/70">
                      {c.label || "Default"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                      /r/{c.publicToken}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/40">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#39E900]">
                      {c._count?.scans || 0}
                    </td>
                    <td className="py-3.5 px-4 text-white/50">
                      {c.assignedAt ? new Date(c.assignedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/cards/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#39E900] hover:underline font-bold"
                      >
                        Inspect Card
                        <ExternalLink className="w-3 h-3 text-[#39E900]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Private Customer Feedback Inbox (Filtered 1-3 Stars) */}
      <div className="bg-[#050505] rounded-2xl border border-[#006B21]/30 shadow-md overflow-hidden">
        <div className="p-5 border-b border-[#006B21]/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Private Customer Feedback Inbox
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 border border-amber-800 text-amber-300">
                {feedbacks.length} Filtered Complaints
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Customer grievances captured from 1-3 star ratings before reaching Google Reviews.
            </p>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-xs">
            <CheckCircle className="w-8 h-8 text-[#39E900] mx-auto mb-2 opacity-80" />
            No negative complaints recorded. Customers are leaving 4 & 5 star reviews!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10251A] text-white/70 font-semibold border-b border-[#006B21]/20">
                <tr>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Issues</th>
                  <th className="py-3 px-4">Feedback Message</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/10">
                {feedbacks.map((f: any) => {
                  let issues: string[] = [];
                  try {
                    issues = f.tags ? JSON.parse(f.tags) : [];
                  } catch {
                    issues = [];
                  }
                  return (
                    <tr key={f.id} className="hover:bg-[#10251A]/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-950/60 border border-amber-900 px-2 py-0.5 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {f.rating} / 5
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {f.customerName || "Anonymous Customer"}
                      </td>
                      <td className="py-3 px-4 text-white/70 font-mono text-[11px]">
                        {f.customerPhone || "Not provided"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {issues.map((i: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#10251A] text-amber-300 text-[10px] border border-amber-900/50"
                            >
                              {i}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/80 max-w-xs truncate" title={f.feedback}>
                        {f.feedback}
                      </td>
                      <td className="py-3 px-4 text-white/50">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Review Destination Modal */}
      {editUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#050505] rounded-3xl p-6 shadow-2xl border border-[#006B21]/50 space-y-4">
            <h3 className="text-base font-black text-white">
              Update Google Review Destination URL
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              When updated, all assigned QR cards immediately redirect customers to this new Google review link. Physical cards do not need reprinting.
            </p>

            <form onSubmit={handleUpdateReviewUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  Official Google Review URL *
                </label>
                <input
                  type="url"
                  required
                  value={newReviewUrl}
                  onChange={(e) => setNewReviewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white font-mono focus:outline-none focus:border-[#39E900]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUrlModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-[#10251A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUrl}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingUrl && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#39E900]" />}
                  Save New Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Card Modal */}
      {assignCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#050505] rounded-3xl p-6 shadow-2xl border border-[#006B21]/50 space-y-4">
            <h3 className="text-base font-black text-white">
              Assign Pre-printed QR Card
            </h3>
            <p className="text-xs text-white/60">
              Select an unassigned card from warehouse inventory to connect to {business.name}.
            </p>

            <form onSubmit={handleAssignCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  Available Unassigned Cards
                </label>
                {unassignedCards.length === 0 ? (
                  <div className="p-3 bg-[#10251A] rounded-xl border border-[#006B21]/40 text-xs text-[#39E900]">
                    No unassigned cards available. Please generate new cards in the Cards inventory first.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none"
                  >
                    <option value="">Choose a card to assign...</option>
                    {unassignedCards.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.cardCode} — {c.label || "No label"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignCardModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-[#10251A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigningCard || !selectedCardId}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {assigningCard && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#39E900]" />}
                  Assign to Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
