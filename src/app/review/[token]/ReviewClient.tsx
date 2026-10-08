"use client";

import React, { useState } from "react";
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
  };
}

// Default tags based on typical local business types
const DEFAULT_POSITIVE_TAGS = [
  "Polite Staff",
  "Quick Service",
  "Clean & Hygienic",
  "Great Ambiance",
  "Value for Money",
  "Highly Recommended",
];

const DEFAULT_NEGATIVE_TAGS = [
  "Long Wait Time",
  "Staff Behavior",
  "Pricing Issue",
  "Quality Not Met",
  "Cleanliness",
];

export function ReviewClient({
  cardId,
  cardCode,
  publicToken,
  business,
}: ReviewClientProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Positive flow states
  const availableTags =
    business.customTags && business.customTags.length > 0
      ? business.customTags
      : DEFAULT_POSITIVE_TAGS;

  const defaultTemplates = [
    `Exceptional experience at ${business.name}! The staff was courteous, service was super prompt, and the ambiance was top notch. Highly recommended!`,
    `Had a wonderful visit! Top-notch service and great attention to detail. Will definitely be coming back.`,
    `10/10 service! Professional staff, great hygiene, and reasonable pricing. Best place around!`,
  ];

  const availableTemplates =
    business.recommendedReviews && business.recommendedReviews.length > 0
      ? business.recommendedReviews
      : defaultTemplates;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>(availableTemplates[0]);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Negative feedback states
  const [negativeSelectedTags, setNegativeSelectedTags] = useState<string[]>([]);
  const [complaintText, setComplaintText] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Toggle positive tags
  const togglePositiveTag = (tag: string) => {
    let nextTags: string[];
    if (selectedTags.includes(tag)) {
      nextTags = selectedTags.filter((t) => t !== tag);
    } else {
      nextTags = [...selectedTags, tag];
    }
    setSelectedTags(nextTags);

    // Auto-enrich template text if desired
    if (nextTags.length > 0) {
      const base = availableTemplates[selectedTemplateIndex] || defaultTemplates[0];
      setReviewText(`${base} Specially loved their ${nextTags.join(", ")}!`);
    } else {
      setReviewText(availableTemplates[selectedTemplateIndex] || defaultTemplates[0]);
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

  // Robust Cross-Browser Clipboard Copy (Works on mobile HTTP, Safari, Chrome & WebViews)
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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-[#39E900] selection:text-black">
      {/* Top Header / Business Card Hero */}
      <div className="w-full max-w-lg mx-auto p-4 sm:p-6 space-y-6">
        <div className="text-center pt-4 sm:pt-6 space-y-3">
          {/* Business Logo or Avatar */}
          <div className="inline-flex p-1 rounded-3xl bg-gradient-to-tr from-[#006B21] to-[#39E900] shadow-lg shadow-[#006B21]/30">
            <div className="w-20 h-20 rounded-[22px] bg-[#10251A] border-2 border-[#050505] flex items-center justify-center overflow-hidden">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10 text-[#39E900]" />
              )}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10251A] border border-[#006B21]/50 text-[11px] font-bold text-[#39E900] mb-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Business
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {business.name}
            </h1>
            <p className="text-xs text-white/60 max-w-xs mx-auto mt-1">
              Your honest feedback helps us serve you better.
            </p>
          </div>
        </div>

        {/* Star Rating Selector */}
        <div className="p-6 rounded-3xl bg-[#10251A]/80 border border-[#006B21]/40 shadow-xl text-center space-y-4 backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-[#39E900]">
            Rate Your Experience
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-2xl transition-all transform hover:scale-125 active:scale-95 focus:outline-none"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                      active
                        ? "fill-[#39E900] text-[#39E900] drop-shadow-[0_0_12px_rgba(57,233,0,0.6)]"
                        : "fill-transparent text-white/25 stroke-[1.5]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs font-semibold text-white/80">
            {rating === 5 && "Outstanding Experience! ⭐⭐⭐⭐⭐"}
            {rating === 4 && "Great Experience! ⭐⭐⭐⭐"}
            {rating === 3 && "Average ⭐⭐⭐"}
            {rating === 2 && "Could be better ⭐⭐"}
            {rating === 1 && "Disappointing ⭐"}
          </p>
        </div>

        {/* ---------------- POSITIVE REVIEW FLOW (4 & 5 STARS) ---------------- */}
        {isPositive && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Filter Chips / Positive Highlights */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#39E900]" />
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#39E900] text-black shadow-md shadow-[#39E900]/30 scale-105"
                          : "bg-[#10251A] border border-[#006B21]/40 text-white/80 hover:text-white hover:border-[#39E900]/40"
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
              <label className="text-xs font-bold text-white/80 flex items-center justify-between">
                <span>Select a ready-made compliment:</span>
                <span className="text-[10px] text-[#39E900] font-normal">
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
                          ? "bg-[#10251A] border-[#39E900] text-white shadow-md shadow-[#39E900]/10 ring-1 ring-[#39E900]"
                          : "bg-[#050505] border-[#006B21]/30 text-white/70 hover:bg-[#10251A]/40 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[#39E900] font-black text-sm">“</span>
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
                <label className="text-xs font-bold text-white/80">
                  Your Google Review:
                </label>
                <span className="text-[10px] text-white/40">
                  {reviewText.length} characters
                </span>
              </div>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                className="w-full p-3.5 rounded-2xl bg-[#10251A] border border-[#006B21]/40 text-xs text-white focus:outline-none focus:border-[#39E900] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Big 1-Click Copy & Google Review Button */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleCopyAndOpenGoogle}
                className="w-full py-4 px-6 rounded-2xl bg-[#006B21] hover:bg-[#005219] active:scale-[0.99] text-white font-black text-sm shadow-xl shadow-[#006B21]/40 border border-[#39E900]/40 flex items-center justify-center gap-2.5 transition-all group"
              >
                <Copy className="w-4 h-4 text-[#39E900] group-hover:scale-110 transition-transform" />
                <span>Copy Review & Post on Google</span>
                <ChevronRight className="w-4 h-4 text-[#39E900]" />
              </button>

              <div className="text-center">
                <a
                  href={business.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[#39E900] transition-colors underline underline-offset-4"
                >
                  Or write directly on Google from scratch
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- NEGATIVE FEEDBACK FUNNEL (1 to 3 STARS) ---------------- */}
        {!isPositive && !feedbackSubmitted && (
          <form
            onSubmit={handleSubmitPrivateFeedback}
            className="p-5 rounded-3xl bg-[#10251A] border border-amber-900/60 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 mt-0.5">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  We care about your experience
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                  Please let our management know what went wrong so we can fix it right away.
                </p>
              </div>
            </div>

            {/* Quick Issue Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/80">
                What area needs improvement?
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_NEGATIVE_TAGS.map((tag) => {
                  const isSelected = negativeSelectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleNegativeTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-[#050505] border border-amber-900/40 text-white/70 hover:text-white"
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
              <label className="text-xs font-bold text-white/80">
                Your feedback to management:
              </label>
              <textarea
                required
                rows={3}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Tell us what happened..."
                className="w-full p-3 rounded-xl bg-[#050505] border border-amber-900/40 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Contact details for management followup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-white/60 block mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-[#050505] border border-amber-900/40 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-white/60 block mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-[#050505] border border-amber-900/40 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingFeedback || !complaintText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-900/30 flex items-center justify-center gap-2 transition-all"
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
        {!isPositive && feedbackSubmitted && (
          <div className="p-6 rounded-3xl bg-[#10251A] border border-[#006B21]/50 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#006B21] text-[#39E900] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">
              Thank You for Your Feedback
            </h3>
            <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
              Your message has been received privately by the store management. We appreciate you giving us the chance to address this and improve.
            </p>
          </div>
        )}
      </div>

      {/* Copy Success Animated Overlay Toast */}
      {copiedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#10251A] rounded-3xl p-6 border border-[#39E900]/50 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#006B21] text-[#39E900] mx-auto flex items-center justify-center shadow-lg shadow-[#006B21]/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">Review Copied! ✓</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Review aapke clipboard par copy ho chuka hai.
              </p>
            </div>

            {/* Step Guide */}
            <div className="p-3 rounded-2xl bg-[#050505] border border-[#006B21]/40 text-left space-y-2 text-[11px] text-white/80">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#39E900] text-black font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Google Review page par review box mein <strong>Paste</strong> karein.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#39E900] text-black font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Upar diye gaye <strong>Post</strong> button par tap karein!</span>
              </div>
            </div>

            {/* Direct Open Button */}
            <div className="pt-2 space-y-2">
              <a
                href={business.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-black text-xs shadow-md border border-[#39E900]/50 flex items-center justify-center gap-2 transition-all"
              >
                <span>Open Google Review Now →</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#39E900]" />
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#39E900] font-semibold">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Redirecting automatically...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="py-6 text-center text-[11px] text-white/40">
        Powered by{" "}
        <span className="font-bold text-white">
          Grow<span className="text-[#39E900]">Broo</span>
        </span>{" "}
        Smart Review Network
      </footer>
    </div>
  );
}
