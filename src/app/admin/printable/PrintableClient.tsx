"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Printer,
  QrCode,
  Sparkles,
  Download,
  Loader2,
  CheckCircle,
  HelpCircle,
  Layers,
  Info,
  Check,
  Building2,
} from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/components/ui/Toast";

export function PrintableClient() {
  const searchParams = useSearchParams();
  const initialCardId = searchParams.get("cardId") || "";
  const { success, error: toastError } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  // Print layout options: both sides (side by side), front only, back only
  const [printMode, setPrintMode] = useState<"both" | "front" | "back">("both");

  // Template customizations
  const [businessName, setBusinessName] = useState("");
  const [headline, setHeadline] = useState("Scan to Review Us");
  const [subline, setSubline] = useState("Your honest feedback helps us improve");
  const [backMessage, setBackMessage] = useState(
    "Thank you for supporting our local business."
  );

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch("/api/cards");
        if (res.ok) {
          const data = await res.json();
          const cardList = data.cards || [];
          setCards(cardList);

          if (initialCardId) {
            const found = cardList.find((c: any) => c.id === initialCardId);
            if (found) setSelectedCardId(found.id);
            else if (cardList.length > 0) setSelectedCardId(cardList[0].id);
          } else if (cardList.length > 0) {
            // Default to CARD003 if available, or the first card
            const card003 = cardList.find((c: any) => c.cardCode === "CARD003");
            setSelectedCardId(card003 ? card003.id : cardList[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, [initialCardId]);

  const currentCard = cards.find((c) => c.id === selectedCardId);

  // Update business name when card changes
  useEffect(() => {
    if (currentCard?.business?.name) {
      setBusinessName(currentCard.business.name);
    } else if (currentCard) {
      setBusinessName("Your Business Name");
    }
  }, [currentCard?.id, currentCard?.business?.name]);

  useEffect(() => {
    if (!currentCard) return;

    // Use current origin so the QR code resolves correctly everywhere
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:3000";
    const url = `${origin}/r/${currentCard.publicToken}`;

    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      width: 900,
      margin: 1, // Compact margin ensures maximum physical scanning area
      color: { dark: "#050505", light: "#ffffff" },
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
      });
  }, [currentCard]);

  const handlePrint = async () => {
    setIsPreparingPrint(true);
    try {
      // Ensure QR code is loaded
      if (!qrDataUrl) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      // Ensure all document fonts are ready before triggering Chrome print
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      // Small delay for browser rendering pass
      setTimeout(() => {
        setIsPreparingPrint(false);
        window.print();
      }, 150);
    } catch {
      setIsPreparingPrint(false);
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Dedicated Print Stylesheet for CR-80 physical dimensions on A4 Landscape */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@page {
  size: A4 landscape;
  margin: 0;
}

@media print {
  *, *:before, *:after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box !important;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    width: 297mm !important;
    height: 210mm !important;
    overflow: hidden !important;
  }

  /* Hide screen-only chrome, headers, controls, and navigation */
  .no-print,
  .print\\:hidden,
  header,
  nav,
  aside,
  footer {
    display: none !important;
  }

  /* Full A4 Landscape Printable Sheet (297mm x 210mm) */
  .cr80-print-sheet {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8mm !important;
    width: 297mm !important;
    height: 210mm !important;
    max-width: 297mm !important;
    max-height: 210mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    background: #ffffff !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
  }

  /* Exact CR-80 Physical Dimensions: 85.60 mm x 53.98 mm */
  .cr80-card-frame {
    width: 85.6mm !important;
    height: 53.98mm !important;
    min-width: 85.6mm !important;
    max-width: 85.6mm !important;
    min-height: 53.98mm !important;
    max-height: 53.98mm !important;
    flex: 0 0 85.6mm !important;
    border-radius: 3.18mm !important;
    overflow: hidden !important;
    box-shadow: none !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    padding: 3.6mm !important;
    border: 0.4mm solid #006B21 !important;
  }

  /* Physical Millimeter Font Scale & Container Overrides for Print */
  .cr80-front-card {
    background-color: #10251A !important;
    color: #ffffff !important;
  }

  .cr80-back-card {
    background-color: #050505 !important;
    color: #ffffff !important;
  }

  .print-qr-box {
    width: 23.5mm !important;
    height: 23.5mm !important;
    padding: 1.2mm !important;
    border-radius: 1.8mm !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
  }

  .print-title {
    font-size: 3.5mm !important;
    line-height: 4.1mm !important;
  }

  .print-subtitle {
    font-size: 2.2mm !important;
    line-height: 2.7mm !important;
  }

  .print-stars {
    font-size: 2.4mm !important;
    line-height: 2.8mm !important;
  }

  .print-meta-text {
    font-size: 2mm !important;
    line-height: 2.4mm !important;
  }

  .print-brand-text {
    font-size: 3.2mm !important;
    line-height: 3.7mm !important;
  }

  .print-back-quote {
    font-size: 2.7mm !important;
    line-height: 3.3mm !important;
  }

  .print-back-disclaimer {
    font-size: 1.85mm !important;
    line-height: 2.3mm !important;
    padding: 1.4mm !important;
    border-radius: 1.6mm !important;
    background-color: #10251A !important;
    border: 0.3mm solid rgba(0, 107, 33, 0.4) !important;
  }
}
`,
        }}
      />

      {/* Top Banner (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#050505] tracking-tight">
              Printable Card Template Designer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20">
              CR-80 Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
            Exact physical ISO 7810 ID-1 card dimensions (85.60 mm × 53.98 mm). Side by side on A4 Landscape.
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={isPreparingPrint || !qrDataUrl}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {isPreparingPrint ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Printer className="w-4 h-4 text-white" />
          )}
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Chrome Print Setup Guide Alert (Hidden in Print) */}
      <div className="print:hidden p-4 rounded-2xl bg-[#E9F8E9]/60 border border-[#006B21]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-[#050505]/80">
          <Info className="w-4 h-4 text-[#006B21] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#006B21] block">
              Chrome Print / PDF Settings for Exact Physical Dimensions:
            </span>
            <span className="text-[#050505]/70">
              In the Chrome Print dialog, ensure: <strong>Layout: Landscape</strong> • <strong>Paper: A4</strong> • <strong>Margins: None</strong> • <strong>Scale: 100%</strong> • <strong>Options: Background graphics [✓] Checked</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Controls (Hidden in Print) */}
      <div className="print:hidden p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card Selector */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Select Physical Card
            </label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-semibold focus:outline-none"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cardCode} {c.business ? `(${c.business.name})` : "(Unassigned)"}
                </option>
              ))}
            </select>
          </div>

          {/* Business / Brand Name Input */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Business / Brand Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sardar Hotel"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-semibold focus:outline-none"
            />
          </div>

          {/* Print Layout Mode */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Print Sheet Layout
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#E9F8E9]/40 p-1 rounded-xl border border-[#006B21]/20">
              <button
                type="button"
                onClick={() => setPrintMode("both")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  printMode === "both"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#050505]/70 hover:text-[#050505]"
                }`}
              >
                Both Sides
              </button>
              <button
                type="button"
                onClick={() => setPrintMode("front")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  printMode === "front"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#050505]/70 hover:text-[#050505]"
                }`}
              >
                Front Only
              </button>
              <button
                type="button"
                onClick={() => setPrintMode("back")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  printMode === "back"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#050505]/70 hover:text-[#050505]"
                }`}
              >
                Back Only
              </button>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Card Front Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Card Front Subtitle
            </label>
            <input
              type="text"
              value={subline}
              onChange={(e) => setSubline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Back Message */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Card Back Message
            </label>
            <input
              type="text"
              value={backMessage}
              onChange={(e) => setBackMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>
        </div>

        {/* Card Metadata info row */}
        {currentCard && (
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-[11px] text-[#050505]/60 font-medium">
            <div>
              Card Code:{" "}
              <strong className="text-[#006B21] font-mono">
                {currentCard.cardCode}
              </strong>
            </div>
            <div>
              Assigned Business:{" "}
              <strong className="text-slate-800">
                {currentCard.business?.name || "Unassigned"}
              </strong>
            </div>
            <div>
              Physical Card Ratio: <strong>1.586 : 1 (85.60 × 53.98 mm)</strong>
            </div>
          </div>
        )}
      </div>

      {/* 
        CARD ARTWORK CONTAINER
        Screen: Responsive side-by-side / stacked preview with high-res styling.
        Print: Exact .cr80-print-sheet (297mm x 210mm A4 landscape) with .cr80-card-frame (85.6mm x 53.98mm).
      */}
      <div className="cr80-print-sheet flex flex-col xl:flex-row items-center justify-center gap-8 py-6">
        {/* ==================== FRONT SIDE ==================== */}
        {(printMode === "both" || printMode === "front") && (
          <div className="flex flex-col items-center">
            <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
              Card Front (Customer Facing)
            </span>

            <div className="cr80-card-frame cr80-front-card w-[380px] h-[240px] sm:w-[410px] sm:h-[258px] rounded-2xl bg-[#10251A] text-white p-5 sm:p-6 shadow-2xl border border-[#006B21]/50 relative flex flex-col justify-between overflow-hidden">
              {/* Subtle background radial glow (screen only) */}
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#006B21]/20 rounded-full blur-2xl pointer-events-none print:hidden" />

              {/* Top Row: Business / Brand Name (Customized) */}
              <div className="flex items-center justify-between z-10 leading-none">
                <div className="flex items-center gap-2 print:gap-[1.5mm] max-w-full">
                  <div className="w-7 h-7 print-logo-box rounded-lg bg-[#006B21] flex items-center justify-center shadow-sm shrink-0">
                    <Building2 className="w-4 h-4 print-logo-icon text-[#39E900]" />
                  </div>
                  <span className="text-sm sm:text-base print-brand-text font-black tracking-tight leading-none truncate text-white">
                    {businessName || currentCard?.business?.name || "Business Name"}
                  </span>
                </div>
              </div>

              {/* Center Content: Headline, Subtitle, Rating & QR code */}
              <div className="flex items-center justify-between gap-4 z-10 my-auto">
                <div className="flex-1 space-y-1 min-w-0 pr-1">
                  <h3 className="print-title text-base sm:text-lg font-black leading-tight text-white tracking-tight">
                    {headline}
                  </h3>
                  <p className="print-subtitle text-[11px] sm:text-xs text-white/85 leading-snug">
                    {subline}
                  </p>
                  <div className="print-stars pt-1.5 flex items-center gap-1 text-[11px] text-amber-300 font-bold leading-none">
                    <span className="tracking-widest">★ ★ ★ ★ ★</span>
                    <span className="text-white/70 font-semibold ml-1 text-[10px]">
                      Google Reviews
                    </span>
                  </div>
                </div>

                {/* High Contrast QR Code Canvas */}
                <div className="print-qr-box w-24 h-24 sm:w-28 sm:h-28 bg-white p-1.5 rounded-xl shadow-lg shrink-0 flex items-center justify-center border border-white/30">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Physical card QR"
                      className="w-full h-full object-contain block"
                    />
                  ) : (
                    <Loader2 className="w-6 h-6 animate-spin text-[#006B21]" />
                  )}
                </div>
              </div>

              {/* Bottom Row: Card Code Only (No Tap prompt) */}
              <div className="flex items-center justify-between text-[10px] print-meta-text text-white/60 z-10 pt-2 border-t border-[#006B21]/30 leading-none">
                <span className="font-mono font-bold text-[#39E900]">
                  {currentCard?.cardCode || "CARD0001"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BACK SIDE ==================== */}
        {(printMode === "both" || printMode === "back") && (
          <div className="flex flex-col items-center">
            <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
              Card Back (Policy Compliant)
            </span>

            <div className="cr80-card-frame cr80-back-card w-[380px] h-[240px] sm:w-[410px] sm:h-[258px] rounded-2xl bg-[#050505] text-white p-5 sm:p-6 shadow-2xl border border-[#006B21]/50 relative flex flex-col justify-between overflow-hidden">
              {/* Top Row: Authentic Feedback Title Only (No ID/Token) */}
              <div className="flex items-center justify-between text-xs print-meta-text leading-none">
                <span className="font-bold text-white/60">
                  Authentic Feedback
                </span>
              </div>

              {/* Center Content: Back Message & Policy Compliance */}
              <div className="space-y-3 my-auto text-center px-3">
                <p className="print-back-quote text-sm sm:text-base font-bold text-white leading-snug">
                  &ldquo;{backMessage}&rdquo;
                </p>
                <div className="print-back-disclaimer p-2.5 rounded-xl bg-[#10251A] border border-[#006B21]/40 text-[10px] sm:text-[11px] text-white/80 leading-relaxed font-normal">
                  We believe in honest, authentic customer feedback. Your genuine review helps others find great local businesses.
                </div>
              </div>

              {/* Bottom Row: Branding */}
              <div className="text-center text-[10px] print-meta-text text-[#39E900] font-bold tracking-wide leading-none pt-1">
                Powered by GrowBroo • Dynamic Review Network
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
