"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquareWarning,
  Send,
  Loader2,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronRight,
  ThumbsUp,
  HeartHandshake,
  Utensils,
  Languages,
  RotateCw,
  X,
  Plus,
} from "lucide-react";

interface ReviewClientProps {
  cardId: string;
  cardCode: string;
  publicToken: string;
  business: {
    id: string;
    name: string;
    slug: string;
    businessType: string;
    description: string | null;
    logoUrl: string | null;
    googleBusinessName: string | null;
    googleReviewUrl: string;
    planType: string;
    negativeFeedbackFilter: boolean;
    customTags: string[];
    recommendedReviews: string[];
    menuItems?: string[];
  };
}

import { getRotatingReviewsAndTags, generateSmartReview } from "@/lib/reviewTemplates";

export function ReviewClient({
  cardId,
  cardCode,
  publicToken,
  business,
}: ReviewClientProps) {
  // Stars are initially empty (0 rating until user clicks)
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Dynamic Category & 1-Hour Anti-Duplicate Rotating Engine
  const {
    tags: availableTags,
    reviews: availableTemplates,
    menuItems: availableMenu,
    negativeTags: availableNegativeTags,
  } = React.useMemo(() => {
    return getRotatingReviewsAndTags({
      businessType: business.businessType,
      businessName: business.name,
      businessId: business.id,
      customTags: business.customTags,
      customReviews: business.recommendedReviews,
      customMenuItems: business.menuItems,
    });
  }, [
    business.businessType,
    business.name,
    business.id,
    business.customTags,
    business.recommendedReviews,
    business.menuItems,
  ]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>(
    availableTemplates[0] || ""
  );
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Smart Guided Review Assistant State
  const [smartBuilderOpen, setSmartBuilderOpen] = useState<boolean>(false);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [customItemInput, setCustomItemInput] = useState<string>("");
  const [tasteChoice, setTasteChoice] = useState<"superb" | "great" | "good" | "average">("superb");
  const [cleanChoice, setCleanChoice] = useState<"spotless" | "clean" | "decent">("spotless");
  const [staffChoice, setStaffChoice] = useState<"very_polite" | "courteous" | "helpful">("very_polite");
  const [languageChoice, setLanguageChoice] = useState<"hinglish" | "english">("hinglish");
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [generatedReviewDraft, setGeneratedReviewDraft] = useState<string>("");

  // Re-generate smart review whenever inputs change
  useEffect(() => {
    if (business) {
      const generated = generateSmartReview({
        businessName: business.name,
        businessType: business.businessType,
        selectedItems: selectedMenuItems,
        tasteRating: tasteChoice,
        cleanlinessRating: cleanChoice,
        staffRating: staffChoice,
        language: languageChoice,
        variationIndex,
      });
      setGeneratedReviewDraft(generated);
    }
  }, [
    business.name,
    business.businessType,
    selectedMenuItems,
    tasteChoice,
    cleanChoice,
    staffChoice,
    languageChoice,
    variationIndex,
  ]);

  // Handle star rating selection
  const handleSelectRating = (star: number) => {
    setRating(star);
    if (star >= 4) {
      setSmartBuilderOpen(true);
    }
  };

  const toggleMenuItem = (item: string) => {
    setSelectedMenuItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddCustomItem = () => {
    const trimmed = customItemInput.trim();
    if (!trimmed) return;
    if (!selectedMenuItems.includes(trimmed)) {
      setSelectedMenuItems((prev) => [...prev, trimmed]);
    }
    setCustomItemInput("");
  };

  const handleApplySmartReview = async () => {
    const textToCopy = generatedReviewDraft || reviewText;
    setReviewText(textToCopy);
    setSmartBuilderOpen(false);
    await copyTextToClipboard(textToCopy);
    setCopiedSuccess(true);
    if (business.googleReviewUrl) {
      window.open(business.googleReviewUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Negative feedback states
  const [negativeSelectedTags, setNegativeSelectedTags] = useState<string[]>([]);
  const [complaintText, setComplaintText] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Toggle positive tags and dynamically blend into the review text
  const togglePositiveTag = (tag: string) => {
    let nextTags: string[];
    if (selectedTags.includes(tag)) {
      nextTags = selectedTags.filter((t) => t !== tag);
    } else {
      nextTags = [...selectedTags, tag];
    }
    setSelectedTags(nextTags);

    const base =
      availableTemplates[selectedTemplateIndex] || availableTemplates[0] || "";
    if (nextTags.length > 0) {
      setReviewText(`${base} Specially loved their ${nextTags.join(", ")}!`);
    } else {
      setReviewText(base);
    }
  };

  // Toggle negative tags
  const toggleNegativeTag = (tag: string) => {
    if (negativeSelectedTags.includes(tag)) {
      setNegativeSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setNegativeSelectedTags((prev) => [...prev, tag]);
    }
  };

  // Robust Cross-Browser Clipboard Copy
  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    let success = false;
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn("navigator.clipboard failed:", err);
      }
    }
    if (!success && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (err) {
        console.warn("execCommand copy fallback failed:", err);
      }
    }
    return success;
  };

  // Handle 1-Click Copy & Google Review redirect
  const handleCopyAndOpenGoogle = async () => {
    await copyTextToClipboard(reviewText);
    setCopiedSuccess(true);

    // Auto navigate after 1.5s so user reads the instruction
    setTimeout(() => {
      window.location.href = business.googleReviewUrl;
    }, 1500);
  };

  // Submit Private Negative Feedback
  const handleSubmitPrivateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          cardId,
          rating,
          tags: negativeSelectedTags,
          feedback: complaintText,
          customerName,
          customerPhone,
        }),
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const isPositive = rating >= 4;
  const isNegative = rating >= 1 && rating <= 3;
  const effectiveRating = hoverRating || rating;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* Top Header / Business Card Hero */}
      <div className="w-full max-w-lg mx-auto p-4 sm:p-6 space-y-6">
        <div className="text-center pt-4 sm:pt-6 space-y-3">
          {/* Business Logo or Avatar */}
          <div className="inline-flex p-1.5 rounded-3xl bg-white shadow-md shadow-slate-200/60 border border-slate-200/80">
            <div className="w-20 h-20 rounded-[20px] bg-slate-50 flex items-center justify-center overflow-hidden">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10 text-slate-700" />
              )}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700 mb-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Verified Business
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {business.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1">
              Your honest feedback helps us serve you better.
            </p>
          </div>
        </div>

        {/* Star Rating Selector Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Rate Your Experience
          </span>

          {/* 5 Stars: Initially empty, golden-yellow on click/hover */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = effectiveRating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleSelectRating(star)}
                  className="p-1 rounded-2xl transition-all transform hover:scale-125 active:scale-95 focus:outline-none"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-150 ${
                      isFilled
                        ? "fill-[#FFB800] text-[#FFB800] drop-shadow-[0_2px_8px_rgba(255,184,0,0.45)] stroke-[#E5A500] stroke-[1]"
                        : "fill-slate-100 text-slate-300 stroke-slate-300 stroke-[1.5] hover:text-[#FFB800]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-600 min-h-[20px]">
            {rating === 0 && (
              <span className="text-slate-400 font-normal">
                Tap a star above to rate your experience
              </span>
            )}
            {rating === 5 && (
              <span className="text-amber-600 font-bold">
                Outstanding Experience! ⭐⭐⭐⭐⭐
              </span>
            )}
            {rating === 4 && (
              <span className="text-amber-600 font-bold">
                Great Experience! ⭐⭐⭐⭐
              </span>
            )}
            {rating === 3 && (
              <span className="text-slate-700 font-bold">Average ⭐⭐⭐</span>
            )}
            {rating === 2 && (
              <span className="text-slate-700 font-bold">
                Could be better ⭐⭐
              </span>
            )}
            {rating === 1 && (
              <span className="text-slate-700 font-bold">Disappointing ⭐</span>
            )}
          </p>
        </div>

        {/* ---------------- POSITIVE REVIEW FLOW (4 & 5 STARS) ---------------- */}
        {isPositive && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Smart Guided Assistant Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Aapne kya try kiya? (Smart Review Generator)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Dishes/services choose karke instant Hinglish ya English genuine review generate karein!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmartBuilderOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-xs transition-all shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Assistant</span>
              </button>
            </div>
            {/* Filter Chips / Positive Highlights */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                What did you like the most? (Tap to add)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => togglePositiveTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#FFB800] text-slate-900 font-bold shadow-sm scale-105 border border-[#E5A500]"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected ? "✓" : "+"} {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommended Template Reviews */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Select a ready-made compliment:</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Zero typing needed
                </span>
              </label>

              <div className="space-y-2.5">
                {availableTemplates.map((template, idx) => {
                  const isSelected = selectedTemplateIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateIndex(idx);
                        setSelectedTags([]);
                        setReviewText(template);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed transition-all ${
                        isSelected
                          ? "bg-amber-50/50 border-[#FFB800] text-slate-900 ring-2 ring-[#FFB800]/30 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[#FFB800] font-black text-base leading-none">
                          “
                        </span>
                        <p className="flex-1 font-medium">{template}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Review Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Your Google Review:
                </label>
                <span className="text-[10px] text-slate-400">
                  {reviewText.length} characters
                </span>
              </div>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none leading-relaxed shadow-2xs"
              />
            </div>

            {/* Big 1-Click Copy & Google Review Button */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleCopyAndOpenGoogle}
                className="w-full py-4 px-6 rounded-2xl bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all group"
              >
                {/* Official Google G Logo icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#FFFFFF"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Copy Review & Post on Google</span>
                <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="text-center">
                <a
                  href={business.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4"
                >
                  Or write directly on Google from scratch
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- NEGATIVE FEEDBACK FUNNEL (1 to 3 STARS) ---------------- */}
        {isNegative && !feedbackSubmitted && (
          <form
            onSubmit={handleSubmitPrivateFeedback}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mt-0.5">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  We care about your experience
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  Please let our management know what went wrong so we can fix it right away.
                </p>
              </div>
            </div>

            {/* Quick Issue Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                What area needs improvement?
              </label>
              <div className="flex flex-wrap gap-2">
                {availableNegativeTags.map((tag) => {
                  const isSelected = negativeSelectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleNegativeTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-amber-600 text-white shadow-xs font-bold"
                          : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected ? "✓" : "+"} {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Complaint Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Your feedback to management:
              </label>
              <textarea
                required
                rows={3}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Tell us what happened..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Contact details for management followup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingFeedback || !complaintText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              {submittingFeedback ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Directly to Management
            </button>
          </form>
        )}

        {/* Feedback Submitted Confirmation */}
        {isNegative && feedbackSubmitted && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Thank You for Your Feedback
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your message has been received privately by the store management. We appreciate you giving us the chance to address this and improve.
            </p>
          </div>
        )}
      </div>

      {/* Copy Success Animated Overlay Modal */}
      {copiedSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Review Copied! ✓</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review aapke clipboard par copy ho chuka hai.
              </p>
            </div>

            {/* Step Guide */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-[11px] text-slate-700">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1A73E8] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Google Review page par review box mein <strong>Paste</strong> karein.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1A73E8] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Upar diye gaye <strong>Post</strong> button par tap karein!
                </span>
              </div>
            </div>

            {/* Direct Open Button */}
            <div className="pt-2 space-y-2">
              <a
                href={business.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Open Google Review Now →</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                <span>Redirecting automatically...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SMART GUIDED REVIEW ASSISTANT MODAL ---------------- */}
      {smartBuilderOpen && isPositive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 animate-in slide-in-from-bottom duration-250">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-emerald-50/50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    Review Assistant
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ★ {rating} Stars
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    A few quick taps to craft your genuine review!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmartBuilderOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Question 1: What did you order / try? */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    <span>1. Aapne kya try kiya? / What did you have?</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Tap to select</span>
                </div>

                {/* Menu items chips */}
                <div className="flex flex-wrap gap-1.5">
                  {availableMenu.map((item) => {
                    const isSelected = selectedMenuItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMenuItem(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#006B21] text-white shadow-xs scale-105"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {isSelected ? "✓" : "+"} {item}
                      </button>
                    );
                  })}
                </div>

                {/* Custom write-in item input */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={customItemInput}
                    onChange={(e) => setCustomItemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomItem();
                      }
                    }}
                    placeholder="+ Type other dish / service..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006B21]"
                  />
                  {customItemInput.trim() && (
                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs shrink-0"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 2. Taste / Food Quality */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <label className="font-bold text-slate-700 block text-[11px]">
                    2. Taste / Swad:
                  </label>
                  <select
                    value={tasteChoice}
                    onChange={(e) => setTasteChoice(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#006B21]"
                  >
                    <option value="superb">Lajawab / Superb ★★★★★</option>
                    <option value="great">Very Tasty / Badiya ★★★★</option>
                    <option value="good">Good / Accha ★★★</option>
                    <option value="average">Moderate / Theek-thaak ★★</option>
                  </select>
                </div>

                {/* 3. Cleanliness / Hygiene */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <label className="font-bold text-slate-700 block text-[11px]">
                    3. Cleaning & Hygiene:
                  </label>
                  <select
                    value={cleanChoice}
                    onChange={(e) => setCleanChoice(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#006B21]"
                  >
                    <option value="spotless">Spotless / Ekdum Saaf ✨</option>
                    <option value="clean">Clean & Tidy / Kaafi Saaf</option>
                    <option value="decent">Decent / Normal</option>
                  </select>
                </div>

                {/* 4. Staff Behaviour */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <label className="font-bold text-slate-700 block text-[11px]">
                    4. Staff Behaviour:
                  </label>
                  <select
                    value={staffChoice}
                    onChange={(e) => setStaffChoice(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#006B21]"
                  >
                    <option value="very_polite">Very Polite / Vinamra 😊</option>
                    <option value="courteous">Courteous & Fast</option>
                    <option value="helpful">Helpful & Friendly</option>
                  </select>
                </div>
              </div>

              {/* Language Switcher & Regenerate Variation */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/80">
                <div className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  <button
                    type="button"
                    onClick={() => setLanguageChoice("hinglish")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      languageChoice === "hinglish"
                        ? "bg-[#006B21] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🇮🇳 Hinglish
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguageChoice("english")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      languageChoice === "english"
                        ? "bg-[#006B21] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🌐 English
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setVariationIndex((prev) => prev + 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold text-[11px] shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <RotateCw className="w-3 h-3 text-[#006B21]" />
                  <span>Re-phrase</span>
                </button>
              </div>

              {/* Live Generated Review Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Your Generated Review:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Editable anytime</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                  &ldquo;{generatedReviewDraft}&rdquo;
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleApplySmartReview}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {/* Google G logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#FFFFFF"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#FFFFFF"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Copy & Paste on Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewText(generatedReviewDraft);
                  setSmartBuilderOpen(false);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Insert into Review Box
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="py-6 text-center text-xs text-slate-400">
        Powered by{" "}
        <span className="font-semibold text-slate-600">
          GrowBroo
        </span>{" "}
        Smart Review Network
      </footer>
    </div>
  );
}
