"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Printer,
  QrCode,
  Sparkles,
  Wifi,
  Download,
  Loader2,
  CheckCircle,
  HelpCircle,
  Layers,
} from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/components/ui/Toast";

export function PrintableClient() {
  const searchParams = useSearchParams();
  const initialCardId = searchParams.get("cardId") || "";
  const { success } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Template customizations
  const [headline, setHeadline] = useState("Scan to Review Us");
  const [subline, setSubline] = useState("Your honest feedback helps us improve");
  const [backMessage, setBackMessage] = useState("Thank you for supporting our local business.");

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch("/api/cards");
        if (res.ok) {
          const data = await res.json();
          setCards(data.cards || []);
          if (!selectedCardId && data.cards?.length > 0) {
            setSelectedCardId(data.cards[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  const currentCard = cards.find((c) => c.id === selectedCardId);

  useEffect(() => {
    if (!currentCard) return;
    const host = window.location.hostname === "localhost" ? "http://192.168.88.40:3000" : window.location.origin;
    const url = `${host}/r/${currentCard.publicToken}`;

    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      width: 700,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [currentCard]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#050505] tracking-tight">
            Printable Card Template Designer
          </h1>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
            Standard CR-80 physical card preview with neutral, policy-compliant feedback messaging.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-white" />
          Print / Save PDF
        </button>
      </div>

      {/* Configuration Controls (Hidden in Print) */}
      <div className="print:hidden p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#050505]/80 mb-1">
            Selected Card
          </label>
          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cardCode} {c.business ? `(${c.business.name})` : "(Unassigned)"}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label className="block text-xs font-bold text-[#050505]/80 mb-1">
            Card Subtitle
          </label>
          <input
            type="text"
            value={subline}
            onChange={(e) => setSubline(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none"
          />
        </div>
      </div>

      {/* Card Preview Grid (Standard Credit Card Aspect Ratio) */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-6">
        {/* FRONT SIDE */}
        <div className="flex flex-col items-center">
          <span className="print:hidden text-xs font-bold uppercase tracking-wider text-[#050505]/60 mb-3">
            Card Front (Customer Facing)
          </span>

          <div className="w-[340px] h-[215px] sm:w-[380px] sm:h-[240px] rounded-2xl bg-[#10251A] text-white p-6 shadow-2xl border border-[#006B21]/50 relative flex flex-col justify-between overflow-hidden">
            {/* Background subtle watermark */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#006B21]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top row */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#006B21] flex items-center justify-center shadow-sm">
                  <QrCode className="w-4 h-4 text-[#39E900]" />
                </div>
                <span className="text-sm font-black tracking-tight">
                  Grow<span className="text-[#39E900]">Broo</span>
                </span>
              </div>

              {/* NFC Wireless Wave Indicator */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/90 backdrop-blur-sm border border-[#006B21]/30">
                <Wifi className="w-3 h-3 text-[#39E900] rotate-90" />
                <span>NFC + QR</span>
              </div>
            </div>

            {/* Center Content */}
            <div className="flex items-center justify-between gap-4 z-10 my-auto">
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-black leading-tight text-white tracking-tight">
                  {headline}
                </h3>
                <p className="text-[11px] text-white/80 leading-snug">
                  {subline}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                  <span>★ ★ ★ ★ ★</span>
                  <span className="text-white/70 ml-1">Google Reviews</span>
                </div>
              </div>

              {/* High Contrast QR Code Canvas */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-1.5 rounded-xl shadow-lg shrink-0 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Physical card QR"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Loader2 className="w-6 h-6 animate-spin text-[#006B21]" />
                )}
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between text-[10px] text-white/50 z-10 pt-2 border-t border-[#006B21]/30">
              <span className="font-mono font-bold text-[#39E900]">
                {currentCard?.cardCode || "CARD0001"}
              </span>
              <span>Tap with phone or scan QR</span>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="flex flex-col items-center">
          <span className="print:hidden text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
            Card Back (Policy Compliant)
          </span>

          <div className="w-[340px] h-[215px] sm:w-[380px] sm:h-[240px] rounded-2xl bg-[#050505] text-white p-6 shadow-2xl border border-[#006B21]/50 relative flex flex-col justify-between overflow-hidden">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60">Authentic Feedback</span>
              <span className="text-[10px] font-mono text-[#39E900]">
                {currentCard?.publicToken ? `/r/${currentCard.publicToken}` : ""}
              </span>
            </div>

            {/* Center Content */}
            <div className="space-y-3 my-auto text-center px-4">
              <p className="text-sm font-bold text-white">
                &quot;{backMessage}&quot;
              </p>
              <div className="p-2.5 rounded-xl bg-[#10251A] border border-[#006B21]/30 text-[11px] text-white/70">
                We believe in honest, authentic customer feedback. Your genuine review helps others find great local businesses.
              </div>
            </div>

            {/* Bottom row */}
            <div className="text-center text-[10px] text-[#39E900] font-bold">
              Powered by GrowBroo • Dynamic Review Network
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
