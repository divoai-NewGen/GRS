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
  RotateCw,
} from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/components/ui/Toast";

export interface CardFormat {
  id: "54x86" | "60x100" | "70x115";
  label: string;
  portraitDimensionsMm: string;
  landscapeDimensionsMm: string;
  ratioLabel: string;
  shortMm: number; // width in portrait, height in landscape
  longMm: number;  // height in portrait, width in landscape
  portraitPreviewWidthPx: number;
  portraitPreviewHeightPx: number;
  landscapePreviewWidthPx: number;
  landscapePreviewHeightPx: number;
}

export const CARD_FORMATS: CardFormat[] = [
  {
    id: "54x86",
    label: "54 × 86 mm (Standard CR-80)",
    portraitDimensionsMm: "54 × 86 mm",
    landscapeDimensionsMm: "86 × 54 mm",
    ratioLabel: "1 : 1.59",
    shortMm: 54,
    longMm: 86,
    portraitPreviewWidthPx: 285,
    portraitPreviewHeightPx: 454,
    landscapePreviewWidthPx: 380,
    landscapePreviewHeightPx: 239,
  },
  {
    id: "60x100",
    label: "60 × 100 mm (Table Display)",
    portraitDimensionsMm: "60 × 100 mm",
    landscapeDimensionsMm: "100 × 60 mm",
    ratioLabel: "3 : 5 (1 : 1.67)",
    shortMm: 60,
    longMm: 100,
    portraitPreviewWidthPx: 300,
    portraitPreviewHeightPx: 500,
    landscapePreviewWidthPx: 420,
    landscapePreviewHeightPx: 252,
  },
  {
    id: "70x115",
    label: "70 × 115 mm (Large Counter Stand)",
    portraitDimensionsMm: "70 × 115 mm",
    landscapeDimensionsMm: "115 × 70 mm",
    ratioLabel: "1 : 1.64",
    shortMm: 70,
    longMm: 115,
    portraitPreviewWidthPx: 330,
    portraitPreviewHeightPx: 542,
    landscapePreviewWidthPx: 460,
    landscapePreviewHeightPx: 280,
  },
];

export type CardThemeId =
  | "offwhite"
  | "royalblue"
  | "luxuryamber"
  | "midnightpurple"
  | "rubycrimson"
  | "cyberslate"
  | "darkgreen";

export interface CardTheme {
  id: CardThemeId;
  name: string;
  shortName: string;
  badgeLabel: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  cornerArcBg: string;
  cornerArcBorder: string;
  iconBg: string;
  iconColor: string;
  qrBg: string;
  dividerColor: string;
  bottomLabelColor: string;
  footerTextColor: string;
}

export const PRESET_BORDER_COLORS = [
  { name: "Emerald", hex: "#22C55E" },
  { name: "Sapphire", hex: "#2563EB" },
  { name: "Gold", hex: "#D97706" },
  { name: "Ruby", hex: "#E11D48" },
  { name: "Purple", hex: "#7C3AED" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Obsidian", hex: "#0F172A" },
];

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  offwhite: {
    id: "offwhite",
    name: "Emerald Mint (Primary)",
    shortName: "Emerald Mint",
    badgeLabel: "Primary",
    cardBg: "#F8FAF6",
    cardBorder: "#22C55E",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    accentColor: "#16A34A",
    cornerArcBg: "#E5F7EB",
    cornerArcBorder: "#86EFAC",
    iconBg: "#16A34A",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#E2E8F0",
    bottomLabelColor: "#16A34A",
    footerTextColor: "#64748B",
  },
  royalblue: {
    id: "royalblue",
    name: "Sapphire Royal Blue",
    shortName: "Royal Blue",
    badgeLabel: "Sapphire",
    cardBg: "#F8FAFD",
    cardBorder: "#2563EB",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    accentColor: "#1D4ED8",
    cornerArcBg: "#EFF6FF",
    cornerArcBorder: "#BFDBFE",
    iconBg: "#2563EB",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#E2E8F0",
    bottomLabelColor: "#1D4ED8",
    footerTextColor: "#64748B",
  },
  luxuryamber: {
    id: "luxuryamber",
    name: "Luxury Gold & Amber",
    shortName: "Luxury Gold",
    badgeLabel: "Warm Amber",
    cardBg: "#FAF8F5",
    cardBorder: "#D97706",
    textPrimary: "#1C1917",
    textSecondary: "#57534E",
    accentColor: "#B45309",
    cornerArcBg: "#FEF3C7",
    cornerArcBorder: "#FDE68A",
    iconBg: "#D97706",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#E7E5E4",
    bottomLabelColor: "#B45309",
    footerTextColor: "#78716C",
  },
  midnightpurple: {
    id: "midnightpurple",
    name: "Royal Violet & Purple",
    shortName: "Royal Violet",
    badgeLabel: "Purple",
    cardBg: "#FAF7FD",
    cardBorder: "#7C3AED",
    textPrimary: "#1E1B4B",
    textSecondary: "#475569",
    accentColor: "#6D28D9",
    cornerArcBg: "#F3E8FF",
    cornerArcBorder: "#DDD6FE",
    iconBg: "#7C3AED",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#E2E8F0",
    bottomLabelColor: "#6D28D9",
    footerTextColor: "#64748B",
  },
  rubycrimson: {
    id: "rubycrimson",
    name: "Ruby Crimson & Rose",
    shortName: "Ruby Crimson",
    badgeLabel: "Rose",
    cardBg: "#FFF8F9",
    cardBorder: "#E11D48",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    accentColor: "#BE123C",
    cornerArcBg: "#FFE4E6",
    cornerArcBorder: "#FECDD3",
    iconBg: "#E11D48",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#F1F5F9",
    bottomLabelColor: "#BE123C",
    footerTextColor: "#64748B",
  },
  cyberslate: {
    id: "cyberslate",
    name: "Obsidian & Modern Slate",
    shortName: "Obsidian",
    badgeLabel: "Slate Black",
    cardBg: "#F8FAFC",
    cardBorder: "#0F172A",
    textPrimary: "#020617",
    textSecondary: "#475569",
    accentColor: "#0F172A",
    cornerArcBg: "#F1F5F9",
    cornerArcBorder: "#CBD5E1",
    iconBg: "#0F172A",
    iconColor: "#FFFFFF",
    qrBg: "#FFFFFF",
    dividerColor: "#E2E8F0",
    bottomLabelColor: "#0F172A",
    footerTextColor: "#64748B",
  },
  darkgreen: {
    id: "darkgreen",
    name: "Deep Emerald Dark Mode",
    shortName: "Deep Emerald",
    badgeLabel: "Dark Mode",
    cardBg: "#0C2317",
    cardBorder: "#194D2C",
    textPrimary: "#FFFFFF",
    textSecondary: "#D1E7D6",
    accentColor: "#39E900",
    cornerArcBg: "rgba(0, 107, 33, 0.2)",
    cornerArcBorder: "rgba(57, 233, 0, 0.25)",
    iconBg: "#006B21",
    iconColor: "#39E900",
    qrBg: "#FFFFFF",
    dividerColor: "rgba(0, 107, 33, 0.4)",
    bottomLabelColor: "#39E900",
    footerTextColor: "#94A3B8",
  },
};

export interface PrintableCardDesignerProps {
  cards?: any[];
  initialCardId?: string;
  defaultBusinessName?: string;
  defaultTagline?: string;
  portalMode?: boolean;
}

export function PrintableCardDesigner({
  cards: propCards,
  initialCardId: propInitialCardId = "",
  defaultBusinessName = "",
  defaultTagline = "",
  portalMode = false,
}: PrintableCardDesignerProps) {
  const searchParams = useSearchParams();
  const urlCardId = searchParams?.get("cardId") || "";
  const initialCardId = propInitialCardId || urlCardId;
  const { success, error: toastError } = useToast();

  const [cards, setCards] = useState<any[]>(propCards || []);
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId);
  const [loading, setLoading] = useState(!propCards || propCards.length === 0);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  // Orientation toggle: Portrait (Vertical Stand) or Landscape (Horizontal Card)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  // Selected format, theme, and custom border color
  const [selectedFormat, setSelectedFormat] = useState<"54x86" | "60x100" | "70x115">("60x100");
  const [selectedTheme, setSelectedTheme] = useState<CardThemeId>("offwhite");
  const [customBorderColor, setCustomBorderColor] = useState<string>("#22C55E");

  const handleSelectTheme = (thmKey: CardThemeId) => {
    setSelectedTheme(thmKey);
    setCustomBorderColor(CARD_THEMES[thmKey].cardBorder);
  };

  // Print layout options: both sides (side by side), front only, back only
  const [printMode, setPrintMode] = useState<"both" | "front" | "back">("front");

  // Template customizations (all customizable)
  const [businessName, setBusinessName] = useState(defaultBusinessName || "GrowBroo");
  const [tagline, setTagline] = useState(defaultTagline || "More Reviews • More Growth");
  const [headlineTop, setHeadlineTop] = useState("Scan to");
  const [headlineMain, setHeadlineMain] = useState("Review Us");
  const [subline, setSubline] = useState("Your feedback helps us grow");
  const [ratingSubtitle, setRatingSubtitle] = useState("Share your honest experience.");
  const [bottomQuote, setBottomQuote] = useState("Thanks for your visit! Welcome again.");
  const [footerNote, setFooterNote] = useState("Made with GrowBroo");
  const [backMessage, setBackMessage] = useState(
    "Thank you for supporting our local business."
  );
  const [backPolicyText, setBackPolicyText] = useState(
    "We believe in honest, authentic customer feedback. Your genuine review helps others find great local businesses."
  );

  // If propCards are provided, sync them
  useEffect(() => {
    if (propCards && propCards.length > 0) {
      setCards(propCards);
      setLoading(false);
      if (initialCardId) {
        const found = propCards.find((c: any) => c.id === initialCardId);
        if (found) setSelectedCardId(found.id);
        else setSelectedCardId(propCards[0].id);
      } else if (!selectedCardId) {
        setSelectedCardId(propCards[0].id);
      }
    }
  }, [propCards, initialCardId]);

  // Load cards from API if not passed via props
  useEffect(() => {
    if (propCards && propCards.length > 0) return;

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
  }, [initialCardId, propCards]);

  const currentCard = cards.find((c) => c.id === selectedCardId);

  // Auto-populate business name & tagline from current card or default props
  useEffect(() => {
    if (currentCard?.business?.name) {
      setBusinessName(currentCard.business.name);
      if (currentCard.business.description) {
        setTagline(currentCard.business.description.slice(0, 50));
      } else {
        setTagline("More Reviews • More Growth");
      }
    } else if (defaultBusinessName) {
      setBusinessName(defaultBusinessName);
      if (defaultTagline) setTagline(defaultTagline);
    } else if (currentCard) {
      setBusinessName("GrowBroo");
      setTagline("More Reviews • More Growth");
    }
  }, [currentCard?.id, currentCard?.business?.name, defaultBusinessName, defaultTagline]);

  // Generate high-resolution QR code
  useEffect(() => {
    if (!currentCard) return;

    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:3000";
    const url = `${origin}/r/${currentCard.publicToken}`;

    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      width: 900,
      margin: 1,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });
  }, [currentCard?.id, currentCard?.publicToken]);

  const handlePrint = async () => {
    if (!currentCard) {
      toastError("Please select a valid card first.");
      return;
    }

    setIsPreparingPrint(true);
    try {
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
    CARD_FORMATS.find((f) => f.id === selectedFormat) || CARD_FORMATS[1];
  const currentTheme = CARD_THEMES[selectedTheme] || CARD_THEMES.offwhite;
  const effectiveBorderColor = customBorderColor || currentTheme.cardBorder;

  const isPortrait = orientation === "portrait";
  const printWidthMm = isPortrait ? activeFormat.shortMm : activeFormat.longMm;
  const printHeightMm = isPortrait ? activeFormat.longMm : activeFormat.shortMm;
  const previewWidthPx = isPortrait
    ? activeFormat.portraitPreviewWidthPx
    : activeFormat.landscapePreviewWidthPx;
  const previewHeightPx = isPortrait
    ? activeFormat.portraitPreviewHeightPx
    : activeFormat.landscapePreviewHeightPx;

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

  main {
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
    width: 297mm !important;
    height: 210mm !important;
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

  /* Physical Dimensions: ${printWidthMm}mm x ${printHeightMm}mm */
  .cr80-card-frame {
    width: ${printWidthMm}mm !important;
    height: ${printHeightMm}mm !important;
    min-width: ${printWidthMm}mm !important;
    max-width: ${printWidthMm}mm !important;
    min-height: ${printHeightMm}mm !important;
    max-height: ${printHeightMm}mm !important;
    flex: 0 0 ${printWidthMm}mm !important;
    border-radius: 4mm !important;
    overflow: hidden !important;
    box-shadow: none !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    padding: 4mm !important;
    box-sizing: border-box !important;
    background-color: ${currentTheme.cardBg} !important;
    color: ${currentTheme.textPrimary} !important;
    border: 0.6mm solid ${effectiveBorderColor} !important;
  }

  .print-qr-box {
    width: ${isPortrait ? Math.round(printWidthMm * 0.52) : Math.round(printHeightMm * 0.42)}mm !important;
    height: ${isPortrait ? Math.round(printWidthMm * 0.52) : Math.round(printHeightMm * 0.42)}mm !important;
    padding: 1.5mm !important;
    border-radius: 2.5mm !important;
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

  .print-headline {
    font-size: ${isPortrait ? "4.5mm" : "3.8mm"} !important;
    line-height: ${isPortrait ? "5.2mm" : "4.4mm"} !important;
  }

  .print-accent {
    font-size: 2.4mm !important;
    line-height: 2.9mm !important;
  }

  .print-scan-label {
    font-size: 2.4mm !important;
    line-height: 2.9mm !important;
  }

  .print-footer-text {
    font-size: 2mm !important;
    line-height: 2.4mm !important;
  }

  .print-back-quote {
    font-size: 2.9mm !important;
    line-height: 3.5mm !important;
  }

  .print-back-disclaimer {
    font-size: 2mm !important;
    line-height: 2.5mm !important;
    padding: 1.8mm !important;
    border-radius: 2mm !important;
  }
}
`,
        }}
      />

      {/* Screen Header Bar */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-[#050505] tracking-tight">
              {portalMode ? "Printable QR Card Designer" : "Printable Card Template Designer"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20">
              {isPortrait ? activeFormat.portraitDimensionsMm : activeFormat.landscapeDimensionsMm} • {isPortrait ? "Portrait" : "Landscape"}
            </span>
          </div>
          <p className="text-xs text-[#050505]/60 mt-1">
            Choose Portrait Stand or Landscape Card, select dimension ratio, customize branding, and print to A4 sheets.
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={!currentCard || isPreparingPrint}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-sm shadow-md shadow-[#006B21]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isPreparingPrint ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Printer className="w-4 h-4 text-white" />
          )}
          <span>{isPreparingPrint ? "Preparing..." : "Print / Save PDF"}</span>
        </button>
      </div>

      {/* Exact Print Alignment Advice Banner */}
      <div className="print:hidden p-4 rounded-2xl bg-[#E9F8E9]/60 border border-[#006B21]/20 flex items-start gap-3 text-xs text-[#050505]/80">
        <Info className="w-4 h-4 text-[#006B21] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#006B21] block mb-0.5">
            Chrome Print / PDF Settings for Exact Physical Dimensions:
          </strong>
          In the Chrome Print dialog, ensure:{" "}
          <span className="font-semibold text-[#050505]">
            Layout: Landscape • Paper: A4 • Margins: None • Scale: 100% • Options: Background graphics [✓] Checked
          </span>
          .
        </div>
      </div>

      {/* Configuration Controls (Hidden in Print) */}
      <div className="print:hidden p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-5">
        {/* Row 1: Layout & Sheet Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
          {/* Card Orientation Toggle */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1.5 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-[#006B21]" />
              Card Orientation
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-[#E9F8E9]/40 p-1.5 rounded-2xl border border-[#006B21]/20">
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`py-2 px-2 rounded-xl text-center transition-all ${
                  isPortrait
                    ? "bg-[#006B21] text-white shadow-xs font-bold"
                    : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60 font-medium"
                }`}
              >
                <div className="text-[11px] leading-tight font-bold">Portrait Stand</div>
                <div className="text-[9px] opacity-80 leading-tight mt-0.5">Vertical ↕</div>
              </button>
              <button
                type="button"
                onClick={() => setOrientation("landscape")}
                className={`py-2 px-2 rounded-xl text-center transition-all ${
                  !isPortrait
                    ? "bg-[#006B21] text-white shadow-xs font-bold"
                    : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60 font-medium"
                }`}
              >
                <div className="text-[11px] leading-tight font-bold">Landscape</div>
                <div className="text-[9px] opacity-80 leading-tight mt-0.5">Horizontal ↔</div>
              </button>
            </div>
          </div>

          {/* Dimension Formats */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1.5 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#006B21]" />
              Dimension & Ratio Format
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#E9F8E9]/40 p-1.5 rounded-2xl border border-[#006B21]/20">
              {CARD_FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`py-2 px-1 rounded-xl text-center transition-all ${
                    selectedFormat === fmt.id
                      ? "bg-[#006B21] text-white shadow-xs font-bold"
                      : "text-[#050505]/70 hover:text-[#050505] hover:bg-white/60 font-medium"
                  }`}
                >
                  <div className="text-[10px] leading-tight font-bold">
                    {isPortrait ? fmt.portraitDimensionsMm : fmt.landscapeDimensionsMm}
                  </div>
                  <div className="text-[8px] opacity-80 leading-tight mt-0.5">
                    {fmt.ratioLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Print Sheet Layout Mode (Both, Front, Back) */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#006B21]" />
              Print Sides
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#E9F8E9]/40 p-1.5 rounded-2xl border border-[#006B21]/20">
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

        {/* Row 2: Theme Palettes (7 Total) & Border Color Customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-2xs">
          {/* Column 1: Card Themes (7 Palettes) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#050505] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#006B21]" />
                Card Color Theme (7 Palettes)
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Primary: Emerald Mint
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CARD_THEMES) as CardThemeId[]).map((thmKey) => {
                const thm = CARD_THEMES[thmKey];
                const isSelected = selectedTheme === thmKey;
                return (
                  <button
                    key={thmKey}
                    type="button"
                    onClick={() => handleSelectTheme(thmKey)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? "border-[#006B21] bg-[#E9F8E9]/70 ring-1 ring-[#006B21] shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/60"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border shrink-0 shadow-2xs flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: thm.cardBg,
                        borderColor: thm.cardBorder,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: thm.cardBorder }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="text-[11px] font-bold text-[#050505] truncate">
                        {thm.shortName}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">
                        {thm.badgeLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Custom Border Color Palette Picker */}
          <div className="lg:col-span-5 space-y-2 border-t lg:border-t-0 lg:border-l lg:pl-4 pt-3 lg:pt-0 border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#050505] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#006B21]" />
                Border Color Customizer
              </label>
              <button
                type="button"
                onClick={() => setCustomBorderColor(currentTheme.cardBorder)}
                className="text-[10px] text-[#006B21] hover:underline font-bold"
              >
                Reset to Theme Default
              </button>
            </div>

            {/* Interactive Color Swatch + Hex Input */}
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div
                  className="w-9 h-9 rounded-xl border-2 border-slate-300 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: effectiveBorderColor }}
                  title="Click to open full color palette"
                >
                  <Palette className="w-4 h-4 text-white drop-shadow-md pointer-events-none" />
                </div>
                <input
                  type="color"
                  value={effectiveBorderColor}
                  onChange={(e) => setCustomBorderColor(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  title="Choose border color from palette"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 focus-within:border-[#006B21] focus-within:ring-1 focus-within:ring-[#006B21]">
                  <span className="text-slate-400 text-xs font-mono mr-1">#</span>
                  <input
                    type="text"
                    value={effectiveBorderColor.replace("#", "")}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setCustomBorderColor(val.startsWith("#") ? val : `#${val}`);
                    }}
                    placeholder="22C55E"
                    maxLength={7}
                    className="w-full text-xs font-mono font-bold text-[#050505] bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Preset Color Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] font-semibold text-slate-500 mr-1">Presets:</span>
              {PRESET_BORDER_COLORS.map((clr) => (
                <button
                  key={clr.name}
                  type="button"
                  onClick={() => setCustomBorderColor(clr.hex)}
                  title={clr.name}
                  className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-115 ${
                    effectiveBorderColor.toLowerCase() === clr.hex.toLowerCase()
                      ? "ring-2 ring-offset-1 ring-[#006B21] scale-110 border-white shadow-xs"
                      : "border-white shadow-2xs"
                  }`}
                  style={{ backgroundColor: clr.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Card Customization Inputs */}
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
                  {c.cardCode} {c.label ? `(${c.label})` : ""} {c.business?.name ? `- ${c.business.name}` : ""}
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
              placeholder="e.g. GrowBroo"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-bold focus:outline-none"
            />
          </div>

          {/* Tagline under Logo */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Tagline Under Logo
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. More Reviews • More Growth"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Main Headline Line 1 */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Headline Top Line
            </label>
            <input
              type="text"
              value={headlineTop}
              onChange={(e) => setHeadlineTop(e.target.value)}
              placeholder="e.g. Scan to"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>
        </div>

        {/* Row 4: Headline Main, Subline, Rating Subtitle & Bottom Quote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main Headline Line 2 */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Headline Main Words
            </label>
            <input
              type="text"
              value={headlineMain}
              onChange={(e) => setHeadlineMain(e.target.value)}
              placeholder="e.g. Review Us"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-black focus:outline-none"
            />
          </div>

          {/* Sub-headline */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Sub-headline Under Review
            </label>
            <input
              type="text"
              value={subline}
              onChange={(e) => setSubline(e.target.value)}
              placeholder="e.g. Your feedback helps us grow"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Rating Subtitle */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Rating Callout Subtitle
            </label>
            <input
              type="text"
              value={ratingSubtitle}
              onChange={(e) => setRatingSubtitle(e.target.value)}
              placeholder="e.g. Share your honest experience."
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
            />
          </div>

          {/* Bottom Custom Quote / Hospitality Message */}
          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Bottom Quote / Message
            </label>
            <input
              type="text"
              value={bottomQuote}
              onChange={(e) => setBottomQuote(e.target.value)}
              placeholder="e.g. Thanks for your visit! Welcome again"
              className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] font-semibold focus:outline-none"
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
              Selected Ratio:{" "}
              <strong>
                {isPortrait ? activeFormat.portraitDimensionsMm : activeFormat.landscapeDimensionsMm} ({activeFormat.ratioLabel})
              </strong>
            </div>
            <div>
              Orientation: <strong>{isPortrait ? "Portrait Vertical Stand" : "Landscape Horizontal Card"}</strong>
            </div>
            <div>
              Theme: <strong>{currentTheme.name}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 
        CARD ARTWORK CONTAINER
        Screen: Realistic display preview matching exact selected ratio and theme.
        Print: Exact .cr80-print-sheet (297mm x 210mm A4 landscape) with .cr80-card-frame (${printWidthMm}mm x ${printHeightMm}mm).
      */}
      <div className="cr80-print-sheet flex flex-col xl:flex-row items-center justify-center gap-8 py-6">
        {/* ==================== FRONT SIDE ==================== */}
        {(printMode === "both" || printMode === "front") && (
          <div className="flex flex-col items-center">
            <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
              Front Side ({isPortrait ? activeFormat.portraitDimensionsMm : activeFormat.landscapeDimensionsMm})
            </span>

            <div
              className="cr80-card-frame rounded-[24px] p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden transition-all"
              style={{
                width: `${previewWidthPx}px`,
                height: `${previewHeightPx}px`,
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                borderColor: effectiveBorderColor,
                borderWidth: "2.5px",
                borderStyle: "solid",
              }}
            >
              {/* Organic Soft Mint Curved Wave Arcs (from reference image) */}
              <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none transition-all"
                style={{ backgroundColor: currentTheme.cornerArcBg }}
              />
              <div
                className="absolute -top-7 -right-7 w-28 h-28 rounded-full border-[1.5px] pointer-events-none transition-all"
                style={{ borderColor: currentTheme.cornerArcBorder }}
              />

              <div
                className="absolute -bottom-14 -right-14 w-40 h-40 rounded-full pointer-events-none transition-all"
                style={{ backgroundColor: currentTheme.cornerArcBg }}
              />
              <div
                className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full border-[1.5px] pointer-events-none transition-all"
                style={{ borderColor: currentTheme.cornerArcBorder }}
              />

              {/* ----------------- PORTRAIT VERTICAL LAYOUT ----------------- */}
              {isPortrait ? (
                <>
                  {/* Top Branding Section */}
                  <div className="text-center pt-1 z-10">
                    <div className="inline-flex items-center justify-center gap-1 font-black text-xl sm:text-2xl tracking-tight leading-none">
                      {businessName.toLowerCase() === "growbroo" ? (
                        <span>
                          Grow<span style={{ color: effectiveBorderColor }}>Broo</span>
                        </span>
                      ) : (
                        <span>{businessName}</span>
                      )}
                    </div>
                    <div
                      className="text-[10px] sm:text-[11px] font-semibold tracking-wide mt-1"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      {tagline}
                    </div>
                  </div>

                  {/* Headline Hero Section */}
                  <div className="text-center py-1.5 z-10 my-auto">
                    <h2 className="print-headline text-xl sm:text-2xl font-black leading-tight tracking-tight">
                      <span>{headlineTop}</span>
                      <br />
                      <span>{headlineMain.split(" ")[0]}</span>{" "}
                      <span style={{ color: effectiveBorderColor }}>
                        {headlineMain.split(" ").slice(1).join(" ") || "Us"}
                      </span>
                    </h2>
                    <p
                      className="text-[11px] sm:text-xs font-medium mt-1 leading-snug"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      {subline}
                    </p>
                  </div>

                  {/* QR Code Container with Vibrant Green Camera Brackets */}
                  <div className="relative inline-block mx-auto p-2.5 z-10 my-auto">
                    {/* Viewfinder 4 Corner Brackets */}
                    <div
                      className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] rounded-tl-xl pointer-events-none"
                      style={{ borderColor: effectiveBorderColor }}
                    />
                    <div
                      className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] rounded-tr-xl pointer-events-none"
                      style={{ borderColor: effectiveBorderColor }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] rounded-bl-xl pointer-events-none"
                      style={{ borderColor: effectiveBorderColor }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] rounded-br-xl pointer-events-none"
                      style={{ borderColor: effectiveBorderColor }}
                    />

                    {/* QR Code Canvas */}
                    <div className="print-qr-box w-28 h-28 sm:w-36 sm:h-36 bg-white p-2 rounded-2xl shadow-md border border-slate-200/60 flex items-center justify-center relative">
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

                  {/* Google Rating Wordmark & Stars */}
                  <div className="text-center z-10 pt-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm tracking-tight flex items-center">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                      </span>
                      <span
                        className="font-bold text-xs sm:text-sm tracking-wider text-[#FBBC04]"
                      >
                        ★★★★★
                      </span>
                    </div>
                    <p
                      className="text-[10px] sm:text-[11px] font-medium mt-0.5"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      {ratingSubtitle}
                    </p>
                  </div>

                  {/* Bottom Customizable Quote / Hospitality Message */}
                  <div
                    className="text-center z-10 pt-2 border-t mt-auto"
                    style={{ borderColor: currentTheme.dividerColor }}
                  >
                    <p
                      className="print-scan-label text-xs sm:text-[13px] font-bold tracking-wide leading-tight"
                      style={{ color: effectiveBorderColor }}
                    >
                      {bottomQuote}
                    </p>
                  </div>
                </>
              ) : (
                /* ----------------- LANDSCAPE HORIZONTAL LAYOUT ----------------- */
                <>
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
                          {businessName}
                        </div>
                        <div
                          className="text-[10px] sm:text-[11px] print-subtitle leading-tight truncate mt-0.5"
                          style={{ color: currentTheme.textSecondary }}
                        >
                          {tagline}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Content: Headline & QR */}
                  <div className="flex items-center justify-between gap-4 z-10 my-auto">
                    <div className="flex-1 space-y-1.5 min-w-0 pr-1">
                      <h3 className="print-headline text-base sm:text-lg font-black leading-tight tracking-tight">
                        {headlineTop} {headlineMain}
                      </h3>
                      <p
                        className="print-subtitle text-[11px] sm:text-xs leading-snug"
                        style={{ color: currentTheme.textSecondary }}
                      >
                        {subline}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="font-bold text-xs tracking-tight flex items-center">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                        </span>
                        <span
                          className="font-bold text-xs tracking-wider text-[#FBBC04]"
                        >
                          ★★★★★
                        </span>
                      </div>
                    </div>

                    {/* QR Code Box with Corner Brackets */}
                    <div className="relative p-1.5 shrink-0">
                      <div
                        className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 rounded-tl-lg pointer-events-none"
                        style={{ borderColor: effectiveBorderColor }}
                      />
                      <div
                        className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 rounded-tr-lg pointer-events-none"
                        style={{ borderColor: effectiveBorderColor }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 rounded-bl-lg pointer-events-none"
                        style={{ borderColor: effectiveBorderColor }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 rounded-br-lg pointer-events-none"
                        style={{ borderColor: effectiveBorderColor }}
                      />

                      <div className="print-qr-box p-1.5 bg-white rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center">
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
                  </div>

                  {/* Divider */}
                  <div
                    className="border-t my-1 print:my-[1.2mm]"
                    style={{ borderColor: currentTheme.dividerColor }}
                  />

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between text-xs leading-none z-10 pt-0.5">
                    <span
                      className="print-scan-label tracking-wide text-[11px] sm:text-xs font-bold"
                      style={{ color: effectiveBorderColor }}
                    >
                      {bottomQuote}
                    </span>
                    <span
                      className="print-footer-text text-[10px] sm:text-[11px] font-semibold"
                      style={{ color: currentTheme.footerTextColor }}
                    >
                      {footerNote}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ==================== BACK SIDE ==================== */}
        {(printMode === "both" || printMode === "back") && (
          <div className="flex flex-col items-center">
            <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
              Back Side ({isPortrait ? activeFormat.portraitDimensionsMm : activeFormat.landscapeDimensionsMm})
            </span>

            <div
              className="cr80-card-frame rounded-[24px] p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden transition-all"
              style={{
                width: `${previewWidthPx}px`,
                height: `${previewHeightPx}px`,
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                borderColor: effectiveBorderColor,
                borderWidth: "2.5px",
                borderStyle: "solid",
              }}
            >
              {/* Organic Soft Mint Curved Wave Arcs */}
              <div
                className="absolute -top-12 -left-12 w-36 h-36 rounded-full pointer-events-none"
                style={{ backgroundColor: currentTheme.cornerArcBg }}
              />
              <div
                className="absolute -bottom-14 -left-14 w-40 h-40 rounded-full pointer-events-none"
                style={{ backgroundColor: currentTheme.cornerArcBg }}
              />

              {/* Top Row: Authentic Customer Feedback */}
              <div className="flex items-center justify-between text-xs print-meta-text leading-none z-10">
                <span
                  className="font-bold tracking-wider uppercase text-[11px] print:text-[2.2mm]"
                  style={{ color: currentTheme.textSecondary }}
                >
                  Authentic Customer Feedback
                </span>
                <span
                  className="font-bold tracking-wider uppercase text-[11px] print:text-[2.2mm] text-[#FBBC04]"
                >
                  ★★★★★
                </span>
              </div>

              {/* Center Content: Back Message & Policy Compliance */}
              <div className="space-y-3 my-auto text-center px-3 z-10">
                <p className="print-back-quote text-sm sm:text-base font-bold leading-snug">
                  &ldquo;{backMessage}&rdquo;
                </p>
                <div
                  className="print-back-disclaimer p-2.5 rounded-xl text-[10px] sm:text-[11px] leading-relaxed font-normal shadow-2xs"
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
                className="text-center text-[10px] print-meta-text font-bold tracking-wide leading-none pt-1 z-10"
                style={{ color: effectiveBorderColor }}
              >
                {businessName ? `${businessName} • Verified Reviews` : "Authentic Customer Reviews"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
