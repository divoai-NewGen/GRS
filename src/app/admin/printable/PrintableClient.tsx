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
  Heart,
  Palette,
  Maximize2,
} from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/components/ui/Toast";

export interface CardFormat {
  id: "54x86" | "60x100" | "70x115";
  label: string;
  dimensionsMm: string;
  ratioLabel: string;
  widthMm: number;
  heightMm: number;
  previewWidthPx: number;
  previewHeightPx: number;
}

export const CARD_FORMATS: CardFormat[] = [
  {
    id: "54x86",
    label: "54 × 86 mm (Standard CR-80)",
    dimensionsMm: "54 × 86 mm",
    ratioLabel: "1 : 1.59",
    widthMm: 86,
    heightMm: 54,
    previewWidthPx: 380,
    previewHeightPx: 239,
  },
  {
    id: "60x100",
    label: "60 × 100 mm (Table Display)",
    dimensionsMm: "60 × 100 mm",
    ratioLabel: "3 : 5 (1 : 1.67)",
    widthMm: 100,
    heightMm: 60,
    previewWidthPx: 420,
    previewHeightPx: 252,
  },
  {
    id: "70x115",
    label: "70 × 115 mm (Large Display Card)",
    dimensionsMm: "70 × 115 mm",
    ratioLabel: "1 : 1.64",
    widthMm: 115,
    heightMm: 70,
    previewWidthPx: 460,
    previewHeightPx: 280,
  },
];

export type CardThemeId = "offwhite" | "darkgreen" | "minimalwhite";

export interface CardTheme {
  id: CardThemeId;
  name: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  qrBg: string;
  dividerColor: string;
  bottomLabelColor: string;
  footerTextColor: string;
}

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  offwhite: {
    id: "offwhite",
    name: "Off-White (Universal Match)",
    cardBg: "#F9FAF9",
    cardBorder: "#DCE5DC",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    accentColor: "#006B21",
    iconBg: "#006B21",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#E2E8F0",
    bottomLabelColor: "#006B21",
    footerTextColor: "#64748B",
  },
  darkgreen: {
    id: "darkgreen",
    name: "Deep Emerald Green",
    cardBg: "#0C2317",
    cardBorder: "#194D2C",
    textPrimary: "#FFFFFF",
    textSecondary: "#D1E7D6",
    accentColor: "#39E900",
    iconBg: "#006B21",
    iconColor: "#39E900",
    qrBg: "#FFFFFF",
    dividerColor: "rgba(0, 107, 33, 0.4)",
    bottomLabelColor: "#39E900",
    footerTextColor: "#94A3B8",
  },
  minimalwhite: {
    id: "minimalwhite",
    name: "Pure Clean White",
    cardBg: "#FFFFFF",
    cardBorder: "#E2E8F0",
    textPrimary: "#09090B",
    textSecondary: "#64748B",
    accentColor: "#006B21",
    iconBg: "#E9F8E9",
    iconColor: "#006B21",
    qrBg: "#FFFFFF",
    dividerColor: "#F1F5F9",
    bottomLabelColor: "#006B21",
    footerTextColor: "#94A3B8",
  },
};

export function PrintableClient() {
  const searchParams = useSearchParams();
  const initialCardId = searchParams.get("cardId") || "";
  const { success, error: toastError } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  // Selected format and theme
  const [selectedFormat, setSelectedFormat] = useState<"54x86" | "60x100" | "70x115">("54x86");
  const [selectedTheme, setSelectedTheme] = useState<CardThemeId>("offwhite");

  // Print layout options: both sides (side by side), front only, back only
  const [printMode, setPrintMode] = useState<"both" | "front" | "back">("both");

  // Template customizations (all customizable except bottom "SCAN TO REVIEW")
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("A place to feel at home.");
  const [headline, setHeadline] = useState("Your Experience Matters.");
  const [subline, setSubline] = useState("We'd love to hear from you.");
  const [accentNote, setAccentNote] = useState("Your feedback helps us grow.");
  const [footerNote, setFooterNote] = useState("Made with GrowBroo");
  const [backMessage, setBackMessage] = useState(
    "Thank you for supporting our local business."
  );
  const [backPolicyText, setBackPolicyText] = useState(
    "We believe in honest, authentic customer feedback. Your genuine review helps others find great local businesses."
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
            // Default to CARD003 if available, or first card
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

  // Auto-populate business name & tagline from selected card
  useEffect(() => {
    if (currentCard?.business?.name) {
      setBusinessName(currentCard.business.name);
      if (currentCard.business.description) {
        setTagline(currentCard.business.description.slice(0, 50));
      }
    } else if (currentCard) {
      setBusinessName("Sardar Hotel");
    }
  }, [currentCard?.id, currentCard?.business?.name]);

  useEffect(() => {
    if (!currentCard) return;

    // Use current origin so QR resolves reliably
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:3000";
    const url = `${origin}/r/${currentCard.publicToken}`;

    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      width: 900,
      margin: 1, // Compact margin maximizes camera scanning area
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
      if (!qrDataUrl) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      setTimeout(() => {
        setIsPreparingPrint(false);
        window.print();
      }, 150);
    } catch {
      setIsPreparingPrint(false);
      window.print();
    }
  };

  const activeFormat =
    CARD_FORMATS.find((f) => f.id === selectedFormat) || CARD_FORMATS[0];
  const currentTheme = CARD_THEMES[selectedTheme] || CARD_THEMES.offwhite;

  return (
    <div className="space-y-6">
      {/* Dedicated Print Stylesheet for selected card format on A4 Landscape */}
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

  /* Hide screen chrome, headers, controls, and nav */
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

  /* Physical Dimensions for ${activeFormat.label} */
  .cr80-card-frame {
    width: ${activeFormat.widthMm}mm !important;
    height: ${activeFormat.heightMm}mm !important;
    min-width: ${activeFormat.widthMm}mm !important;
    max-width: ${activeFormat.widthMm}mm !important;
    min-height: ${activeFormat.heightMm}mm !important;
    max-height: ${activeFormat.heightMm}mm !important;
    flex: 0 0 ${activeFormat.widthMm}mm !important;
    border-radius: 3.5mm !important;
    overflow: hidden !important;
    box-shadow: none !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    padding: ${activeFormat.heightMm >= 65 ? "4.5mm" : "3.8mm"} !important;
    box-sizing: border-box !important;
    background-color: ${currentTheme.cardBg} !important;
    color: ${currentTheme.textPrimary} !important;
    border: 0.4mm solid ${currentTheme.cardBorder} !important;
  }

  .print-qr-box {
    width: ${Math.round(activeFormat.heightMm * 0.44)}mm !important;
    height: ${Math.round(activeFormat.heightMm * 0.44)}mm !important;
    padding: 1.2mm !important;
    border-radius: 2mm !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
  }

  .print-title {
    font-size: 3.4mm !important;
    line-height: 4mm !important;
  }

  .print-subtitle {
    font-size: 2.1mm !important;
    line-height: 2.6mm !important;
  }

  .print-headline {
    font-size: ${activeFormat.heightMm >= 65 ? "4.2mm" : "3.6mm"} !important;
    line-height: ${activeFormat.heightMm >= 65 ? "4.8mm" : "4.2mm"} !important;
  }

  .print-accent {
    font-size: 2.2mm !important;
    line-height: 2.7mm !important;
  }

  .print-scan-label {
    font-size: 2.3mm !important;
    line-height: 2.8mm !important;
  }

  .print-footer-text {
    font-size: 2mm !important;
    line-height: 2.4mm !important;
  }

  .print-back-quote {
    font-size: 2.8mm !important;
    line-height: 3.4mm !important;
  }

  .print-back-disclaimer {
    font-size: 1.9mm !important;
    line-height: 2.4mm !important;
    padding: 1.6mm !important;
    border-radius: 1.8mm !important;
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
              {activeFormat.dimensionsMm} • {activeFormat.ratioLabel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
            Choose your physical card ratio, customize copy, and print directly on A4 landscape sheets.
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
      <div className="print:hidden p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-5">
        {/* Row 1: Dimensions Ratio Selector & Theme Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
          {/* Card Dimensions & Ratio Picker */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1.5 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#006B21]" />
              Card Dimension & Ratio Format
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#E9F8E9]/40 p-1.5 rounded-2xl border border-[#006B21]/20">
              {CARD_FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`py-2 px-1.5 rounded-xl text-center transition-all ${
                    selectedFormat === fmt.id
                      ? "bg-[#006B21] text-white shadow-xs font-bold"
                      : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60 font-medium"
                  }`}
                >
                  <div className="text-[11px] leading-tight font-bold">{fmt.dimensionsMm}</div>
                  <div className="text-[9px] opacity-80 leading-tight mt-0.5">Ratio {fmt.ratioLabel}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color Picker */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#006B21]" />
              Card Color Theme
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#E9F8E9]/40 p-1.5 rounded-2xl border border-[#006B21]/20">
              {(Object.keys(CARD_THEMES) as CardThemeId[]).map((thmKey) => {
                const thm = CARD_THEMES[thmKey];
                const isSelected = selectedTheme === thmKey;
                return (
                  <button
                    key={thmKey}
                    type="button"
                    onClick={() => setSelectedTheme(thmKey)}
                    className={`py-2 px-1.5 rounded-xl text-center transition-all ${
                      isSelected
                        ? "bg-[#006B21] text-white shadow-xs font-bold"
                        : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60 font-medium"
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-bold">
                      {thmKey === "offwhite"
                        ? "Off-White"
                        : thmKey === "darkgreen"
                        ? "Deep Green"
                        : "Pure White"}
                    </div>
                    <div className="text-[9px] opacity-80 leading-tight mt-0.5">
                      {thmKey === "offwhite" ? "Matches all" : thmKey === "darkgreen" ? "Original dark" : "Minimal"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Print Layout Mode (Both, Front, Back) */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#006B21]" />
              Print Sheet Layout
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#E9F8E9]/40 p-1.5 rounded-2xl border border-[#006B21]/20">
              <button
                type="button"
                onClick={() => setPrintMode("both")}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                  printMode === "both"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60"
                }`}
              >
                Both Sides
              </button>
              <button
                type="button"
                onClick={() => setPrintMode("front")}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                  printMode === "front"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60"
                }`}
              >
                Front Only
              </button>
              <button
                type="button"
                onClick={() => setPrintMode("back")}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                  printMode === "back"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60"
                }`}
              >
                Back Only
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Card Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Selector */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Select Card Inventory
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

          {/* Business / Brand Name */}
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

          {/* Business Tagline */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Business Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. A place to feel at home."
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Your Experience Matters."
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3: Subline, Accent Note, Footer Note & Back Message */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sub-headline */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Sub-headline
            </label>
            <input
              type="text"
              value={subline}
              onChange={(e) => setSubline(e.target.value)}
              placeholder="e.g. We'd love to hear from you."
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Heart Accent Note */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Heart Accent Note
            </label>
            <input
              type="text"
              value={accentNote}
              onChange={(e) => setAccentNote(e.target.value)}
              placeholder="e.g. Your feedback helps us grow."
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Bottom Right Footer Note */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Bottom Footer Note
            </label>
            <input
              type="text"
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              placeholder="e.g. Made with GrowBroo"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Bottom Left Scan Text (Notice: Locked to SCAN TO REVIEW per user request) */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Bottom Action Label
            </label>
            <input
              type="text"
              disabled
              value="SCAN TO REVIEW (Fixed)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 font-bold cursor-not-allowed"
            />
          </div>
        </div>

        {/* Back Card Messages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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

          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Back Card Policy Statement
            </label>
            <input
              type="text"
              value={backPolicyText}
              onChange={(e) => setBackPolicyText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>
        </div>

        {/* Metadata info row */}
        {currentCard && (
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-[11px] text-[#050505]/60 font-medium">
            <div>
              Card Code:{" "}
              <strong className="text-[#006B21] font-mono">
                {currentCard.cardCode}
              </strong>
            </div>
            <div>
              Selected Ratio: <strong>{activeFormat.dimensionsMm} ({activeFormat.ratioLabel})</strong>
            </div>
            <div>
              Theme: <strong>{currentTheme.name}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 
        CARD ARTWORK CONTAINER
        Screen: Exact visual preview with the chosen dimensions, theme, and customizable copy.
        Print: Exact .cr80-print-sheet (297mm x 210mm A4 landscape) with .cr80-card-frame (${activeFormat.widthMm}mm x ${activeFormat.heightMm}mm).
      */}
      <div className="cr80-print-sheet flex flex-col xl:flex-row items-center justify-center gap-8 py-6">
        {/* ==================== FRONT SIDE ==================== */}
        {(printMode === "both" || printMode === "front") && (
          <div className="flex flex-col items-center">
            <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
              Card Front ({activeFormat.dimensionsMm})
            </span>

            <div
              className="cr80-card-frame rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden transition-all"
              style={{
                width: `${activeFormat.previewWidthPx}px`,
                height: `${activeFormat.previewHeightPx}px`,
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                borderColor: currentTheme.cardBorder,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              {/* Top Row: Business Name & Tagline */}
              <div className="flex items-center justify-between z-10 leading-none">
                <div className="flex items-center gap-2.5 print:gap-[2mm] max-w-full">
                  <div
                    className="w-8 h-8 print:w-[6mm] print:h-[6mm] rounded-xl print:rounded-[1.5mm] flex items-center justify-center shadow-xs shrink-0"
                    style={{
                      backgroundColor: currentTheme.iconBg,
                      color: currentTheme.iconColor,
                    }}
                  >
                    <Building2 className="w-4 h-4 print:w-[3.5mm] print:h-[3.5mm]" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="text-sm sm:text-base print-title font-black tracking-tight leading-tight truncate">
                      {businessName || "Sardar Hotel"}
                    </div>
                    <div
                      className="text-[10px] sm:text-[11px] print-subtitle leading-tight truncate mt-0.5"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      {tagline || "A place to feel at home."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Content: Headline, Subtitle, Heart Note & QR code */}
              <div className="flex items-center justify-between gap-4 z-10 my-auto">
                <div className="flex-1 space-y-1 sm:space-y-1.5 min-w-0 pr-1">
                  <h3 className="print-headline text-base sm:text-lg font-black leading-tight tracking-tight">
                    {headline}
                  </h3>
                  <p
                    className="print-subtitle text-[11px] sm:text-xs leading-snug"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    {subline}
                  </p>
                  <div
                    className="print-accent pt-1 flex items-center gap-1.5 text-[11px] font-bold leading-none"
                    style={{ color: currentTheme.accentColor }}
                  >
                    <Heart className="w-3.5 h-3.5 print:w-[2.5mm] print:h-[2.5mm] fill-current" />
                    <span>{accentNote}</span>
                  </div>
                </div>

                {/* High Contrast QR Code Box */}
                <div className="print-qr-box p-1.5 sm:p-2 bg-white rounded-2xl shadow-md shrink-0 flex items-center justify-center border border-slate-200/80">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Physical card QR"
                      className="w-20 h-20 sm:w-24 sm:h-24 print:w-full print:h-full object-contain block"
                    />
                  ) : (
                    <Loader2 className="w-6 h-6 animate-spin text-[#006B21]" />
                  )}
                </div>
              </div>

              {/* Divider Line */}
              <div
                className="border-t my-1 print:my-[1.2mm]"
                style={{ borderColor: currentTheme.dividerColor }}
              />

              {/* Bottom Row: SCAN TO REVIEW (Left) & Footer Note (Right) */}
              <div className="flex items-center justify-between text-xs leading-none z-10 pt-0.5">
                <span
                  className="print-scan-label tracking-wider uppercase text-[11px] sm:text-xs font-black"
                  style={{ color: currentTheme.bottomLabelColor }}
                >
                  SCAN TO REVIEW
                </span>
                <span
                  className="print-footer-text text-[10px] sm:text-[11px] font-semibold"
                  style={{ color: currentTheme.footerTextColor }}
                >
                  {footerNote}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BACK SIDE ==================== */}
        {(printMode === "both" || printMode === "back") && (
          <div className="flex flex-col items-center">
            <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
              Card Back ({activeFormat.dimensionsMm})
            </span>

            <div
              className="cr80-card-frame rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden transition-all"
              style={{
                width: `${activeFormat.previewWidthPx}px`,
                height: `${activeFormat.previewHeightPx}px`,
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                borderColor: currentTheme.cardBorder,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              {/* Top Row: Authentic Customer Feedback (Clean, No Token ID) */}
              <div className="flex items-center justify-between text-xs print-meta-text leading-none">
                <span
                  className="font-bold tracking-wider uppercase text-[11px] print:text-[2.2mm]"
                  style={{ color: currentTheme.textSecondary }}
                >
                  Authentic Customer Feedback
                </span>
              </div>

              {/* Center Content: Back Message & Policy Compliance */}
              <div className="space-y-3 my-auto text-center px-3">
                <p className="print-back-quote text-sm sm:text-base font-bold leading-snug">
                  &ldquo;{backMessage}&rdquo;
                </p>
                <div
                  className="print-back-disclaimer p-2.5 rounded-xl text-[10px] sm:text-[11px] leading-relaxed font-normal"
                  style={{
                    backgroundColor:
                      currentTheme.id === "darkgreen" ? "#10251A" : "#FFFFFF",
                    border: `1px solid ${currentTheme.dividerColor}`,
                    color: currentTheme.textSecondary,
                  }}
                >
                  {backPolicyText}
                </div>
              </div>

              {/* Bottom Row: Footer Branding */}
              <div
                className="text-center text-[10px] print-meta-text font-bold tracking-wide leading-none pt-1"
                style={{ color: currentTheme.bottomLabelColor }}
              >
                Powered by GrowBroo • Dynamic Review Network
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
