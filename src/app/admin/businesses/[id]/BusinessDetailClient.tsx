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
  Clock,
  RotateCw,
  Scissors,
  UtensilsCrossed,
  Coffee,
  Hotel,
  Dumbbell,
  Stethoscope,
  ShoppingBag,
  Car,
  Home,
  Briefcase,
  Layers,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { CATEGORY_PRESETS, getRotatingReviewsAndTags } from "@/lib/reviewTemplates";
const CATEGORY_LIST = [
  { id: "RESTAURANT", name: "Restaurant & Dining", icon: UtensilsCrossed, desc: "Food taste, waiter service, ambience & kitchen hygiene" },
  { id: "SALON", name: "Salon, Spa & Beauty", icon: Scissors, desc: "Stylist skills, haircuts, beard grooming & salon hygiene" },
  { id: "CAFE", name: "Cafe & Bakery", icon: Coffee, desc: "Specialty brews, aesthetic vibes, snacks & peaceful setup" },
  { id: "HOTEL", name: "Hotel, Resort & Stay", icon: Hotel, desc: "Clean rooms, front desk, room service & amenities" },
  { id: "CLINIC", name: "Clinic & Healthcare", icon: Stethoscope, desc: "Doctor compassion, accurate diagnosis & nursing care" },
  { id: "DENTIST", name: "Dental Clinic", icon: Stethoscope, desc: "Painless procedures, modern tools & gentle treatment" },
  { id: "GYM", name: "Gym & Fitness Center", icon: Dumbbell, desc: "Certified trainers, workout machines & workout vibe" },
  { id: "RETAIL", name: "Retail & Supermarket", icon: ShoppingBag, desc: "Wide inventory, discounts, helpful staff & fast billing" },
  { id: "AUTO_SERVICE", name: "Automobile & Car Care", icon: Car, desc: "Expert mechanics, genuine parts & clean detailing" },
  { id: "REAL_ESTATE", name: "Real Estate & Property", icon: Home, desc: "Transparent deals, legal paperwork & property advice" },
  { id: "OTHER", name: "General Business & Services", icon: Briefcase, desc: "Professional services, reliable team & fair pricing" },
];

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

  // Edit Business Category Modal & Rotation Simulator
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("OTHER");
  const [savingCategory, setSavingCategory] = useState(false);
  const [previewHourOffset, setPreviewHourOffset] = useState<number>(0);

  // Edit A to Z Business Details modal
  const [editDetailsModal, setEditDetailsModal] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    businessType: "RESTAURANT",
    description: "",
    logoUrl: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    googleBusinessName: "",
    googleReviewUrl: "",
    status: "ACTIVE",
    planType: "BASIC",
  });

  const handleOpenEditDetails = () => {
    if (!business) return;
    setEditFormData({
      name: business.name || "",
      businessType: business.businessType || "RESTAURANT",
      description: business.description || "",
      logoUrl: business.logoUrl || "",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      address: business.address || "",
      city: business.city || "",
      state: business.state || "",
      country: business.country || "USA",
      googleBusinessName: business.googleBusinessName || "",
      googleReviewUrl: business.googleReviewUrl || "",
      status: business.status || "ACTIVE",
      planType: business.planType || "BASIC",
    });
    setEditDetailsModal(true);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      const payload: any = {
        ...editFormData,
        email: editFormData.email.trim() || null,
        website: editFormData.website.trim() || null,
        logoUrl: editFormData.logoUrl.trim() || null,
        phone: editFormData.phone.trim() || null,
        description: editFormData.description.trim() || null,
        address: editFormData.address.trim() || null,
        city: editFormData.city.trim() || null,
        state: editFormData.state.trim() || null,
        country: editFormData.country.trim() || null,
        googleBusinessName: editFormData.googleBusinessName.trim() || null,
      };

      const res = await fetch(`/api/businesses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || "Failed to update business details");
        setSavingDetails(false);
        return;
      }

      success("Business details updated successfully!");
      setEditDetailsModal(false);
      fetchBusinessData();
    } catch {
      toastError("Network error while saving details");
    } finally {
      setSavingDetails(false);
    }
  };

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
        setSelectedCategory(bData.business.businessType || "OTHER");
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

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType: selectedCategory }),
      });

      if (res.ok) {
        success(
          `Category updated to ${CATEGORY_PRESETS[selectedCategory]?.name || selectedCategory}!`
        );
        setEditCategoryModal(false);
        fetchBusinessData();
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to update category");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSavingCategory(false);
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

  const previewRotation = business
    ? getRotatingReviewsAndTags({
        businessType: business.businessType,
        businessName: business.name,
        businessId: business.id,
        customTags: business.customTags,
        customReviews: business.recommendedReviews,
        hourOffset: previewHourOffset,
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Top Back & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/admin/businesses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#050505]/60 hover:text-[#050505] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Businesses
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenEditDetails}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#006B21]/30 hover:bg-[#E9F8E9] text-[#006B21] font-bold text-xs shadow-sm transition-all"
            title="Edit Business Details (A to Z)"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#006B21]" />
            Edit Business Details (A to Z)
          </button>
          <button
            onClick={() => setAssignCardModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            Assign QR Card
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E9F8E9] flex items-center justify-center font-black text-xl text-[#006B21] shrink-0 border border-[#006B21]/20 overflow-hidden">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-[#006B21]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#050505] tracking-tight">
                {business.name}
              </h1>
              <button
                type="button"
                onClick={handleOpenEditDetails}
                className="p-1.5 rounded-xl hover:bg-[#E9F8E9] text-[#006B21] transition-colors"
                title="Edit Business Details (A to Z)"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20">
                  {CATEGORY_PRESETS[business.businessType]?.name || business.businessType}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(business.businessType || "OTHER");
                    setEditCategoryModal(true);
                  }}
                  className="p-1 rounded-lg hover:bg-[#E9F8E9] text-[#006B21] transition-colors"
                  title="Change Business Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {business.status === "ACTIVE" ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-[#050505]/60 mt-1 max-w-xl">
              {business.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Contact info pill */}
        <div className="flex flex-wrap gap-4 text-xs text-[#050505]/60 border-t md:border-t-0 md:border-l border-[#006B21]/15 pt-4 md:pt-0 md:pl-6 font-medium">
          {business.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#006B21]" />
              <span>{business.city}, {business.state}</span>
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#006B21]" />
              <span>{business.phone}</span>
            </div>
          )}
          {business.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#006B21]" />
              <span>{business.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Google Review Destination Box */}
      <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006B21]">
              Live Google Review Destination
            </span>
          </div>
          <div className="text-xs font-mono text-[#050505] truncate max-w-2xl bg-[#E9F8E9]/60 px-3 py-1.5 rounded-lg border border-[#006B21]/20 font-medium">
            {business.googleReviewUrl}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={business.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-[#006B21]/20 text-xs font-bold text-[#050505] hover:bg-[#E9F8E9] transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B21]" />
            Test Link
          </a>
          <button
            onClick={() => setEditUrlModal(true)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-white" />
            Edit Destination
          </button>
        </div>
      </div>

      {/* Plan Configuration & Smart Review Flow Box */}
      <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#050505]/60">
              Subscription Plan & Routing Mode
            </span>
            {business.planType === "PREMIUM" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#006B21] text-white border border-[#006B21]/30 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#E9F8E9]" /> PREMIUM PLAN
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E9F8E9] text-[#050505]/80 border border-[#006B21]/20 flex items-center gap-1">
                BASIC PLAN
              </span>
            )}
          </div>

          <p className="text-xs text-[#050505]/70 max-w-2xl leading-relaxed">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E9F8E9] border border-[#006B21]/30 text-xs font-bold text-[#006B21] hover:bg-[#E9F8E9]/80 transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-[#006B21]" />
              Preview Smart Flow
            </a>
          )}

          <button
            disabled={updatingPlan}
            onClick={() => handleTogglePlan(business.planType === "PREMIUM" ? "BASIC" : "PREMIUM")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              business.planType === "PREMIUM"
                ? "bg-white border border-[#006B21]/30 text-[#006B21] hover:bg-[#E9F8E9]"
                : "bg-[#006B21] hover:bg-[#005219] text-white shadow-md shadow-[#006B21]/20 border border-[#006B21]/30"
            }`}
          >
            {updatingPlan && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {business.planType === "PREMIUM" ? "Switch to Basic Plan" : "Upgrade to Premium Plan"}
          </button>
        </div>
      </div>

      {/* Industry Category & 1-Hour Dynamic Review Engine */}
      <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#006B21]/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20">
                <RotateCw className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-[#050505]">
                Industry Category & 1-Hour Anti-Duplicate Rotation Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Google Spam-Safe
              </span>
            </div>
            <p className="text-xs text-[#050505]/60 max-w-2xl leading-relaxed">
              Reviews & tags shift automatically every 60 minutes from a master pool of 15+ curated templates. Google&apos;s algorithm detects diverse, genuine reviews and avoids duplicate penalties.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedCategory(business.businessType || "OTHER");
                setEditCategoryModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold shadow-sm transition-all"
            >
              <Edit2 className="w-3.5 h-3.5 text-white" />
              Change Category
            </button>
          </div>
        </div>

        {/* Category Details Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Selected Category:</span>
            <span className="font-bold text-slate-900">
              {CATEGORY_PRESETS[business.businessType]?.name || business.businessType}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Master Pool Size:</span>
            <span className="font-bold text-emerald-700">
              {previewRotation?.totalPoolSize || 15} Unique Reviews (3/hr)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Rotation Frequency:</span>
            <span className="font-bold text-blue-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Every 60 Minutes
            </span>
          </div>
        </div>

        {/* Live Simulation & Preview Bar */}
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                Hourly Review Rotation Preview:
              </span>
              <span className="text-[11px] text-slate-400">
                (Simulate how customer templates change over time)
              </span>
            </div>

            {/* Hour Offset Simulation Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setPreviewHourOffset(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewHourOffset === 0
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ● Current Hour
              </button>
              <button
                type="button"
                onClick={() => setPreviewHourOffset(1)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewHourOffset === 1
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                +1 Hour (Shift 1)
              </button>
              <button
                type="button"
                onClick={() => setPreviewHourOffset(2)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewHourOffset === 2
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                +2 Hours (Shift 2)
              </button>
            </div>
          </div>

          {/* 3 Active Review Templates */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              3 Reviews Served to Customers for this Hour:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {previewRotation?.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs flex flex-col justify-between"
                >
                  <p className="text-slate-700 leading-relaxed font-medium">
                    &ldquo;{rev}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
                    <span>Template #{idx + 1 + previewHourOffset * 3}</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active 6 Positive Tags */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Active &ldquo;Tap to Add&rdquo; Highlights for this Hour:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {previewRotation?.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-xs"
                >
                  + {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
          <span className="text-xs font-bold text-[#050505]/60 uppercase tracking-wider">
            Total Scans
          </span>
          <div className="text-2xl font-black text-[#006B21] mt-1">
            {analytics?.metrics?.totalScans || business._count?.scans || 0}
          </div>
          <span className="text-[11px] text-[#050505]/50 font-medium">
            ~{analytics?.metrics?.uniqueVisitors || 0} unique visitors
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
          <span className="text-xs font-bold text-[#050505]/60 uppercase tracking-wider">
            Scans Today
          </span>
          <div className="text-2xl font-black text-[#050505] mt-1">
            {analytics?.metrics?.scansToday || 0}
          </div>
          <span className="text-[11px] text-[#050505]/50 font-medium">Last 24 hours</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
          <span className="text-xs font-bold text-[#050505]/60 uppercase tracking-wider">
            Scans This Month
          </span>
          <div className="text-2xl font-black text-[#006B21] mt-1">
            {analytics?.metrics?.scansThisMonth || 0}
          </div>
          <span className="text-[11px] text-[#050505]/50 font-medium">Current calendar month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm">
          <span className="text-xs font-bold text-[#050505]/60 uppercase tracking-wider">
            Active QR Cards
          </span>
          <div className="text-2xl font-black text-[#050505] mt-1">
            {business.cards?.length || 0}
          </div>
          <span className="text-[11px] text-[#050505]/50 font-medium">Deployed in field</span>
        </div>
      </div>

      {/* Assigned Cards Table */}
      <div className="bg-white rounded-2xl border border-[#006B21]/15 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#006B21]/15 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#050505]">
              Assigned QR Cards ({business.cards?.length || 0})
            </h2>
            <p className="text-xs text-[#050505]/60 font-medium">
              Cards actively routing customer scans to this business.
            </p>
          </div>
          <button
            onClick={() => setAssignCardModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-xs font-bold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-white" /> Assign Card
          </button>
        </div>

        {business.cards?.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#050505]/50 font-medium">
            No cards assigned to this business yet. Click &quot;Assign QR Card&quot; to connect a card.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E9F8E9] text-[#006B21] uppercase tracking-wider font-bold border-b border-[#006B21]/15">
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
              <tbody className="divide-y divide-[#006B21]/10">
                {business.cards.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#E9F8E9]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#006B21]">
                      <Link href={`/admin/cards/${c.id}`} className="hover:underline">
                        {c.cardCode}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#050505]/80 font-medium">
                      {c.label || "Default"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#050505]/50">
                      /r/{c.publicToken}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#006B21]">
                      {c._count?.scans || 0}
                    </td>
                    <td className="py-3.5 px-4 text-[#050505]/60 font-mono">
                      {c.assignedAt ? new Date(c.assignedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/cards/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#006B21] hover:underline font-bold"
                      >
                        Inspect Card
                        <ExternalLink className="w-3 h-3 text-[#006B21]" />
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
      <div className="bg-white rounded-2xl border border-[#006B21]/15 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#006B21]/15 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#050505]">
                Private Customer Feedback Inbox
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-800 shadow-sm">
                {feedbacks.length} Filtered Complaints
              </span>
            </div>
            <p className="text-xs text-[#050505]/60 mt-1 font-medium">
              Customer grievances captured from 1-3 star ratings before reaching Google Reviews.
            </p>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="py-12 text-center text-[#050505]/50 text-xs font-medium">
            <CheckCircle className="w-8 h-8 text-[#006B21] mx-auto mb-2 opacity-80" />
            No negative complaints recorded. Customers are leaving 4 & 5 star reviews!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E9F8E9] text-[#006B21] font-bold uppercase tracking-wider border-b border-[#006B21]/15">
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
                    <tr key={f.id} className="hover:bg-[#E9F8E9]/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {f.rating} / 5
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#050505]">
                        {f.customerName || "Anonymous Customer"}
                      </td>
                      <td className="py-3 px-4 text-[#050505]/70 font-mono text-[11px]">
                        {f.customerPhone || "Not provided"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {issues.map((i: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#E9F8E9] text-[#006B21] text-[10px] border border-[#006B21]/20 font-medium"
                            >
                              {i}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#050505]/80 max-w-xs truncate font-medium" title={f.feedback}>
                        {f.feedback}
                      </td>
                      <td className="py-3 px-4 text-[#050505]/60 font-mono">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <h3 className="text-base font-black text-[#050505]">
              Update Google Review Destination URL
            </h3>
            <p className="text-xs text-[#050505]/60 leading-relaxed font-medium">
              When updated, all assigned QR cards immediately redirect customers to this new Google review link. Physical cards do not need reprinting.
            </p>

            <form onSubmit={handleUpdateReviewUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                  Official Google Review URL *
                </label>
                <input
                  type="url"
                  required
                  value={newReviewUrl}
                  onChange={(e) => setNewReviewUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-mono focus:outline-none focus:ring-2 focus:ring-[#006B21]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUrlModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/70 hover:bg-[#E9F8E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUrl}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingUrl && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  Save New Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Card Modal */}
      {assignCardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <h3 className="text-base font-black text-[#050505]">
              Assign Pre-printed QR Card
            </h3>
            <p className="text-xs text-[#050505]/60 font-medium">
              Select an unassigned card from warehouse inventory to connect to {business.name}.
            </p>

            <form onSubmit={handleAssignCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                  Available Unassigned Cards
                </label>
                {unassignedCards.length === 0 ? (
                  <div className="p-3 bg-[#E9F8E9]/60 rounded-xl border border-[#006B21]/20 text-xs text-[#006B21] font-medium">
                    No unassigned cards available. Please generate new cards in the Cards inventory first.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
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
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/70 hover:bg-[#E9F8E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigningCard || !selectedCardId}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {assigningCard && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  Assign to Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-[#050505] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-[#050505]">
                  Select Business Industry Category
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the category that matches this business. Review templates, compliments, and tags will automatically adjust and rotate.
                </p>
              </div>
              <button
                onClick={() => setEditCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORY_LIST.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-[#E9F8E9] border-[#006B21] ring-2 ring-[#006B21]/20 shadow-xs"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected
                            ? "bg-[#006B21] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold block ${
                              isSelected ? "text-[#006B21]" : "text-slate-800"
                            }`}
                          >
                            {cat.name}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#006B21] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingCategory && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  )}
                  Save & Apply Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Business Details (A to Z) Modal */}
      {editDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#006B21]/20 overflow-hidden flex flex-col max-h-[90vh] text-[#050505]">
            <div className="p-6 border-b border-[#006B21]/15 flex items-center justify-between bg-[#E9F8E9]/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#006B21]/10 text-[#006B21]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#050505]">
                    Edit Business Details (A to Z)
                  </h3>
                  <p className="text-xs text-[#050505]/60 mt-0.5">
                    Update phone, email, address, Google review destination, and configurations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditDetailsModal(false)}
                className="p-2 rounded-xl text-[#050505]/50 hover:text-[#050505]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="e.g. Royal Salon"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#006B21]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Business Category *
                  </label>
                  <select
                    value={editFormData.businessType}
                    onChange={(e) => setEditFormData({ ...editFormData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
                  >
                    <option value="SALON">Salon / Spa</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="CAFE">Cafe / Bakery</option>
                    <option value="HOTEL">Hotel / Hospitality</option>
                    <option value="GYM">Gym / Fitness</option>
                    <option value="CLINIC">Clinic / Healthcare</option>
                    <option value="DENTIST">Dentist</option>
                    <option value="RETAIL">Retail Store</option>
                    <option value="AUTO_SERVICE">Auto Service</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="OTHER">Other Local Business</option>
                  </select>
                </div>
              </div>

              {/* CRITICAL: Google Review URL */}
              <div className="p-4 rounded-2xl bg-[#E9F8E9]/60 border border-[#006B21]/20">
                <label className="block text-xs font-bold text-[#006B21] mb-1">
                  Google Review Request URL *
                </label>
                <input
                  type="url"
                  required
                  value={editFormData.googleReviewUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, googleReviewUrl: e.target.value })}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/30 bg-white text-xs text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#006B21] font-mono shadow-sm"
                />
                <p className="text-[11px] text-[#050505]/70 mt-2 font-medium">
                  ℹ️ Customers scanning the NFC card or QR will be directed to this review page.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Contact Email (Mail)
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="contact@business.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Phone Number (Number)
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editFormData.website}
                    onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                    placeholder="https://mybusiness.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Google Business Maps Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.googleBusinessName}
                    onChange={(e) => setEditFormData({ ...editFormData, googleBusinessName: e.target.value })}
                    placeholder="e.g. Royal Salon - Downtown"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                  Street / Location Address
                </label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  placeholder="e.g. 123 Main Street, Suite 400"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    placeholder="e.g. New York"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    placeholder="e.g. NY"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    placeholder="USA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Subscription Plan & Flow *
                  </label>
                  <select
                    value={editFormData.planType}
                    onChange={(e) => setEditFormData({ ...editFormData, planType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
                  >
                    <option value="BASIC">Basic Plan (Direct 307 Redirect)</option>
                    <option value="PREMIUM">Premium Plan (Smart Review Assistant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                    Status *
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
                  >
                    <option value="ACTIVE">Active (Scans route normally)</option>
                    <option value="INACTIVE">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                  Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={editFormData.logoUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#050505]/80 mb-1">
                  Business Description / Note
                </label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="Brief note or description about the business..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#006B21]/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditDetailsModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#006B21]/20 text-xs font-medium text-[#050505]/70 hover:bg-[#E9F8E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDetails}
                  className="px-5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingDetails && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
