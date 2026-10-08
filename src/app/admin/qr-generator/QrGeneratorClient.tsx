"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  Download,
  Printer,
  CreditCard,
  Building2,
  CheckCircle,
  ExternalLink,
  Loader2,
  Filter,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import QRCode from "qrcode";

export function QrGeneratorClient() {
  const { success, error: toastError } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hostMode, setHostMode] = useState<"network" | "localhost">("network");
  const networkHost = "http://192.168.88.40:3000";

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cards");
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
        if (data.cards?.length > 0) {
          setSelectedCardId(data.cards[0].id);
        }
      }
    } catch {
      toastError("Failed to fetch cards list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (!selectedCardId || cards.length === 0) return;
    const card = cards.find((c) => c.id === selectedCardId);
    if (!card) return;

    setIsGenerating(true);
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const host = isLocal ? (hostMode === "network" ? networkHost : window.location.origin) : window.location.origin;
    const targetUrl = `${host}/r/${card.publicToken}`;

    Promise.all([
      QRCode.toString(targetUrl, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      }),
      QRCode.toDataURL(targetUrl, {
        errorCorrectionLevel: "H",
        width: 800,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      }),
    ])
      .then(([svg, dataUrl]) => {
        setQrSvg(svg);
        setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("QR Generation failed:", err);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [selectedCardId, cards]);

  const activeCard = cards.find((c) => c.id === selectedCardId);

  const downloadPng = () => {
    if (!qrDataUrl || !activeCard) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${activeCard.cardCode}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("PNG downloaded successfully!");
  };

  const downloadSvg = () => {
    if (!qrSvg || !activeCard) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeCard.cardCode}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success("SVG downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#050505] tracking-tight">
          QR Code Asset Generator
        </h1>
        <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
          Generate, preview, and download ultra-sharp, high-scannability QR vectors for GrowBroo card printing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Selector Panel */}
        <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#050505]/80">
            Select Card from Inventory
          </h2>

          {loading ? (
            <div className="py-12 flex justify-center text-[#050505]/50">
              <Loader2 className="w-6 h-6 animate-spin text-[#006B21]" />
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
              {cards.map((card) => {
                const isSelected = card.id === selectedCardId;
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#E9F8E9] border-[#006B21]/50 text-[#050505]"
                        : "bg-[#E9F8E9]/30 border-[#006B21]/15 hover:bg-[#E9F8E9]/60 text-[#050505]/80"
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-[#050505]">{card.cardCode}</div>
                      <div className="text-[11px] text-[#050505]/60 mt-0.5 truncate max-w-[170px]">
                        {card.business ? card.business.name : "Unassigned"}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        card.status === "ASSIGNED"
                          ? "bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/30 font-bold"
                          : card.status === "DISABLED"
                          ? "bg-rose-50 text-rose-700 border border-rose-200 font-bold"
                          : "bg-[#E9F8E9]/50 text-[#050505]/60 border border-[#006B21]/20 font-bold"
                      }`}
                    >
                      {card.status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live QR Code Display & Export Actions */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm flex flex-col items-center justify-center text-center">
          {activeCard ? (
            <div className="max-w-md w-full space-y-6">
              {/* Host Mode Selector for Mobile vs Desktop */}
              <div className="max-w-xs mx-auto mb-4 p-1 rounded-xl bg-[#E9F8E9]/60 border border-[#006B21]/20 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setHostMode("network")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    hostMode === "network"
                      ? "bg-[#006B21] text-white shadow-sm"
                      : "text-[#050505]/60 hover:text-[#050505]"
                  }`}
                >
                  <span>📱 Phone Scanner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHostMode("localhost")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    hostMode === "localhost"
                      ? "bg-[#006B21] text-white shadow-sm"
                      : "text-[#050505]/60 hover:text-[#050505]"
                  }`}
                >
                  <span>💻 Desktop</span>
                </button>
              </div>

              {/* White Canvas Card Preview */}
              <div className="p-8 bg-white rounded-3xl shadow-xl border border-[#006B21]/15 mx-auto max-w-xs flex flex-col items-center">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#050505] mb-1">
                  GrowBroo Review Card
                </div>
                <div className="text-[11px] text-[#050505]/60 mb-4 font-bold">
                  Scan to leave a Google Review
                </div>

                <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center relative">
                  {isGenerating ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#006B21]" />
                  ) : qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code ${activeCard.cardCode}`}
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>

                <div className="mt-4 font-mono font-black text-sm text-[#050505]">
                  {activeCard.cardCode}
                </div>
                <div className="text-[10px] text-[#050505]/50 font-mono mt-0.5">
                  /r/{activeCard.publicToken}
                </div>
              </div>

              {/* Destination Metadata */}
              <div className="p-4 rounded-2xl bg-[#E9F8E9]/60 border border-[#006B21]/20 text-left text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#050505]/60">Assigned Destination:</span>
                  <span className="font-bold text-[#050505]">
                    {activeCard.business ? activeCard.business.name : "Unassigned"}
                  </span>
                </div>
                {activeCard.business && (
                  <div className="text-[11px] text-[#006B21] font-mono font-bold truncate">
                    {activeCard.business.googleReviewUrl}
                  </div>
                )}
              </div>

              {/* Download & Print Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadPng}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-white" />
                  Download PNG
                </button>

                <button
                  onClick={downloadSvg}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9] hover:bg-[#E9F8E9]/80 text-[#050505] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#006B21]" />
                  Download SVG
                </button>

                <Link
                  href={`/admin/printable?cardId=${activeCard.id}`}
                  className="py-3 px-4 rounded-xl bg-[#006B21] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#005219] transition-opacity"
                >
                  <Printer className="w-4 h-4 text-white" />
                  Print Card
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#050505]/50">Please select a card to preview QR code.</div>
          )}
        </div>
      </div>
    </div>
  );
}
