"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  CheckSquare,
  Square,
  Building2,
  ExternalLink,
  QrCode,
  ShieldAlert,
  CheckCircle,
  Eye,
  Loader2,
  X,
  AlertTriangle,
  RefreshCw,
  Printer,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function CardsClient() {
  const { success, error: toastError } = useToast();

  const [cards, setCards] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // Selection for bulk actions
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Modal sub-states
  const [selectedCardForAction, setSelectedCardForAction] = useState<any>(null);
  const [cardToDelete, setCardToDelete] = useState<any>(null);
  const [targetBusinessId, setTargetBusinessId] = useState("");
  const [batchCount, setBatchCount] = useState(10);
  const [batchPrefix, setBatchPrefix] = useState("CARD");
  const [batchStartNum, setBatchStartNum] = useState<string>("");
  const [batchDigits, setBatchDigits] = useState(3);
  const [csvText, setCsvText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getBatchPreview = () => {
    let p = (batchPrefix || "CARD").trim().toUpperCase();
    p = p.replace(/^O+(?=\d)/, "0").replace(/O(?=\d)/g, "0");
    let basePrefix = "CARD";
    let start: number | null = null;
    let digits = batchDigits || 3;

    if (batchStartNum !== "" && !isNaN(Number(batchStartNum)) && Number(batchStartNum) > 0) {
      start = Number(batchStartNum);
    }

    if (/^\d+$/.test(p)) {
      basePrefix = "CARD";
      if (start === null) start = parseInt(p, 10);
      digits = Math.max(3, p.length);
    } else {
      const match = p.match(/^([A-Z\-_]+?)(\d+)$/);
      if (match) {
        basePrefix = match[1];
        if (start === null) start = parseInt(match[2], 10);
        digits = Math.max(3, match[2].length);
      } else {
        basePrefix = p;
      }
    }

    if (start === null) {
      let maxNum = 0;
      const regex = new RegExp(`^${basePrefix}(\\d+)$`, "i");
      for (const c of cards) {
        const m = c.cardCode.match(regex);
        if (m && m[1]) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      }
      start = maxNum + 1;
    }

    const count = Math.min(Number(batchCount) || 1, 500);
    const first = `${basePrefix}${start.toString().padStart(digits, "0")}`;
    const second = count > 1 ? `${basePrefix}${(start + 1).toString().padStart(digits, "0")}` : null;
    const last = count > 2 ? `${basePrefix}${(start + count - 1).toString().padStart(digits, "0")}` : null;

    if (count === 1) return first;
    if (count === 2) return `${first}, ${second}`;
    return `${first}, ${second}, ... ${last}`;
  };

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);

      const [cRes, bRes] = await Promise.all([
        fetch(`/api/cards?${params.toString()}`),
        fetch("/api/businesses"),
      ]);

      if (cRes.ok) {
        const cData = await cRes.json();
        setCards(cData.cards || []);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setBusinesses(bData.businesses || []);
      }
    } catch {
      toastError("Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [statusFilter, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCards();
  };

  const handleSelectAll = () => {
    if (selectedCardIds.length === cards.length) {
      setSelectedCardIds([]);
    } else {
      setSelectedCardIds(cards.map((c) => c.id));
    }
  };

  const toggleSelectCard = (id: string) => {
    setSelectedCardIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Batch Generation
  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: Number(batchCount),
          prefix: batchPrefix.toUpperCase().trim(),
          startNumber: batchStartNum !== "" ? Number(batchStartNum) : undefined,
          digits: Number(batchDigits),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success(`Successfully generated ${data.count} new cards!`);
        setCreateModalOpen(false);
        setBatchStartNum("");
        fetchCards();
      } else {
        toastError(data.error || "Failed to generate cards");
      }
    } catch {
      toastError("Network error while generating cards");
    } finally {
      setSubmitting(false);
    }
  };

  // Reassign Card Single
  const handleConfirmReassign = async () => {
    if (!selectedCardForAction || !targetBusinessId) return;
    setSubmitting(true);
    try {
      const endpoint = selectedCardForAction.businessId
        ? `/api/cards/${selectedCardForAction.id}/reassign`
        : `/api/cards/${selectedCardForAction.id}/assign`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: targetBusinessId }),
      });

      if (res.ok) {
        success(`Card ${selectedCardForAction.cardCode} reassigned successfully!`);
        setReassignModalOpen(false);
        setSelectedCardForAction(null);
        setTargetBusinessId("");
        fetchCards();
      } else {
        const data = await res.json();
        toastError(data.error || "Reassign failed");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // Disable / Enable Single
  const handleToggleCardStatus = async (card: any) => {
    try {
      const endpoint =
        card.status === "DISABLED"
          ? `/api/cards/${card.id}/enable`
          : `/api/cards/${card.id}/disable`;

      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        success(`Card ${card.cardCode} ${card.status === "DISABLED" ? "enabled" : "disabled"}`);
        fetchCards();
      } else {
        toastError("Action failed");
      }
    } catch {
      toastError("Network error");
    }
  };

  // Bulk Assign
  const handleBulkAssign = async () => {
    if (!targetBusinessId || selectedCardIds.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/cards/bulk-assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardIds: selectedCardIds,
          businessId: targetBusinessId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        success(`Assigned ${data.updatedCount} cards to ${data.businessName}!`);
        setBulkAssignModalOpen(false);
        setSelectedCardIds([]);
        setTargetBusinessId("");
        fetchCards();
      } else {
        const data = await res.json();
        toastError(data.error || "Bulk assign failed");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // Single Card Delete
  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cards/${cardToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        success(`Card ${cardToDelete.cardCode} deleted successfully!`);
        setDeleteModalOpen(false);
        setCardToDelete(null);
        setSelectedCardIds((prev) => prev.filter((id) => id !== cardToDelete.id));
        fetchCards();
      } else {
        toastError(data.error || "Failed to delete card");
      }
    } catch {
      toastError("Network error while deleting card");
    } finally {
      setDeleting(false);
    }
  };

  // Bulk Card Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedCardIds.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/cards/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardIds: selectedCardIds }),
      });
      const data = await res.json();
      if (res.ok) {
        success(`Successfully deleted ${data.deletedCount} cards!`);
        setBulkDeleteModalOpen(false);
        setSelectedCardIds([]);
        fetchCards();
      } else {
        toastError(data.error || "Failed to delete cards");
      }
    } catch {
      toastError("Network error while deleting cards");
    } finally {
      setDeleting(false);
    }
  };

  // CSV Import
  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setSubmitting(true);
    try {
      const lines = csvText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.toLowerCase().includes("cardcode"));

      const res = await fetch("/api/cards/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardCodes: lines }),
      });

      const data = await res.json();
      if (res.ok) {
        success(
          `Imported ${data.importedCount} cards! (${data.skippedCount} skipped as duplicates)`
        );
        setImportModalOpen(false);
        setCsvText("");
        fetchCards();
      } else {
        toastError(data.error || "Import failed");
      }
    } catch {
      toastError("Network error importing CSV");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#050505] tracking-tight">
            Cards Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
            Physical QR cards pre-printed with permanent redirect tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-xs font-bold text-[#050505] shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4 text-[#006B21]" />
            Import CSV
          </button>

          <Link
            href="/admin/printable"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-xs font-bold text-[#050505] shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-[#006B21]" />
            Print Template
          </Link>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            Generate Cards
          </button>
        </div>
      </div>

      {/* Filter, Search, Bulk Actions Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-[#006B21] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by CARD001, token, business name, or label..."
            className="w-full pl-10 pr-4 py-2 bg-[#E9F8E9]/60 border border-[#006B21]/20 rounded-xl text-xs text-[#050505] placeholder-[#050505]/40 focus:outline-none focus:border-[#006B21] focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {selectedCardIds.length > 0 && (
            <>
              <button
                onClick={() => setBulkAssignModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-white" />
                Assign ({selectedCardIds.length}) to Business
              </button>

              <button
                onClick={() => setBulkDeleteModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Delete ({selectedCardIds.length})
              </button>
            </>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#006B21]/20 rounded-xl text-xs text-[#050505] font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ASSIGNED">Assigned Only</option>
            <option value="UNASSIGNED">Unassigned Only</option>
            <option value="DISABLED">Disabled Only</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-white border border-[#006B21]/20 rounded-xl text-xs text-[#050505] font-medium focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_scans">Most Scans</option>
            <option value="least_scans">Least Scans</option>
            <option value="code_asc">Card Code (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-2xl border border-[#006B21]/15 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#050505]/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#006B21]" />
            <span className="text-xs">Loading cards inventory...</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="py-20 text-center px-4">
            <CreditCard className="w-12 h-12 text-[#006B21] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#050505]">
              No cards created yet
            </h3>
            <p className="text-xs text-[#050505]/60 max-w-sm mx-auto mt-1 mb-6">
              Generate a batch of physical card codes to begin assigning them to local businesses.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-[#006B21] hover:bg-[#005219] text-white rounded-xl text-xs font-bold"
            >
              Generate Batch Cards
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E9F8E9]/80 text-[#050505]/75 uppercase tracking-wider font-bold border-b border-[#006B21]/15">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={handleSelectAll} className="text-[#050505]/40 hover:text-[#006B21]">
                      {selectedCardIds.length === cards.length ? (
                        <CheckSquare className="w-4 h-4 text-[#006B21]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Card Code</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Business</th>
                  <th className="py-3.5 px-4">Public URL</th>
                  <th className="py-3.5 px-4">Scans</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/10">
                {cards.map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  let badge = "bg-gray-100 text-gray-700 border border-gray-200";
                  if (card.status === "ASSIGNED") {
                    badge = "bg-[#006B21]/10 text-[#006B21] border border-[#006B21]/30 font-bold";
                  } else if (card.status === "DISABLED") {
                    badge = "bg-rose-50 text-rose-700 border border-rose-200 font-bold";
                  }

                  return (
                    <tr
                      key={card.id}
                      className={`hover:bg-[#E9F8E9]/40 transition-colors ${
                        isSelected ? "bg-[#E9F8E9]/80" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleSelectCard(card.id)}
                          className="text-[#050505]/40 hover:text-[#006B21]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#006B21]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#050505]">
                          <Link href={`/admin/cards/${card.id}`} className="hover:text-[#006B21]">
                            {card.cardCode}
                          </Link>
                        </div>
                        <div className="text-[11px] text-[#050505]/50">
                          {card.label || "No label"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${badge}`}>
                          {card.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {card.business ? (
                          <Link
                            href={`/admin/businesses/${card.business.id}`}
                            className="font-bold text-[#050505] hover:text-[#006B21] flex items-center gap-1.5"
                          >
                            <Building2 className="w-3.5 h-3.5 text-[#006B21]" />
                            {card.business.name}
                          </Link>
                        ) : (
                          <span className="text-[#050505]/40 italic">None (Unassigned)</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#050505]/60">
                        <a
                          href={`/r/${card.publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#006B21] hover:underline flex items-center gap-1"
                        >
                          /r/{card.publicToken}
                          <ExternalLink className="w-3 h-3 text-[#050505]/40" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/20 font-mono font-bold text-xs">
                          <Eye className="w-3 h-3" />
                          {card._count?.scans || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#050505]/60">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/cards/${card.id}`}
                            className="p-1.5 rounded-lg text-[#050505]/50 hover:text-[#006B21] hover:bg-[#E9F8E9] transition-colors"
                            title="Inspect QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </Link>

                          {/* Reassign / Assign Button */}
                          <button
                            onClick={() => {
                              setSelectedCardForAction(card);
                              setTargetBusinessId(card.businessId || "");
                              setReassignModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#E9F8E9] hover:bg-[#006B21] hover:text-white border border-[#006B21]/25 text-[11px] font-bold text-[#006B21] transition-colors"
                          >
                            {card.businessId ? "Reassign" : "Assign"}
                          </button>

                          {/* Enable/Disable Toggle */}
                          <button
                            onClick={() => handleToggleCardStatus(card)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              card.status === "DISABLED"
                                ? "text-[#006B21] hover:bg-[#E9F8E9]"
                                : "text-[#050505]/40 hover:text-amber-600 hover:bg-amber-50"
                            }`}
                            title={card.status === "DISABLED" ? "Enable Card" : "Disable Card"}
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          {/* Delete Card */}
                          <button
                            onClick={() => {
                              setCardToDelete(card);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#050505]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Create Cards Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <h3 className="text-base font-black text-[#050505]">
              Generate Batch QR Cards
            </h3>
            <p className="text-xs text-[#050505]/60">
              Creates physical QR card records with permanent public redirect tokens ready for factory printing.
            </p>

            <form onSubmit={handleBatchGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs text-[#050505] focus:outline-none focus:border-[#006B21] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                    Card Prefix *
                  </label>
                  <input
                    type="text"
                    required
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value)}
                    placeholder="CARD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs text-[#050505] uppercase font-mono focus:outline-none focus:border-[#006B21] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                    Start Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={batchStartNum}
                    onChange={(e) => setBatchStartNum(e.target.value)}
                    placeholder="Auto (Next available)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs text-[#050505] placeholder-[#050505]/35 focus:outline-none focus:border-[#006B21] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                    Code Padding
                  </label>
                  <select
                    value={batchDigits}
                    onChange={(e) => setBatchDigits(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs text-[#050505] focus:outline-none focus:border-[#006B21] focus:bg-white"
                  >
                    <option value={3}>3 Digits (CARD001, CARD002)</option>
                    <option value={4}>4 Digits (CARD0001, CARD0002)</option>
                    <option value={2}>2 Digits (CARD01, CARD02)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-[#E9F8E9] border border-[#006B21]/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#006B21] tracking-wider">
                    Generated Codes Preview
                  </span>
                  <span className="text-[10px] text-[#050505]/45">
                    Total {batchCount || 0} cards
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-[#006B21] tracking-wide truncate">
                  {getBatchPreview()}
                </div>
                <div className="text-[10px] text-[#050505]/50">
                  Cards will be generated in clean sequential order: CARD001, CARD002, CARD003...
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/60 hover:text-[#050505] hover:bg-[#E9F8E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  Generate Cards
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign / Assign Modal with Explicit Notice */}
      {reassignModalOpen && selectedCardForAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/25 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#006B21]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#050505]">
                  {selectedCardForAction.businessId ? "Reassign QR Card" : "Assign QR Card"}
                </h3>
                <p className="text-xs text-[#050505]/60 mt-0.5">
                  Card Code: <span className="font-mono font-bold text-[#006B21]">{selectedCardForAction.cardCode}</span>
                </p>
              </div>
            </div>

            {selectedCardForAction.businessId && (
              <div className="p-3 bg-[#E9F8E9] border border-[#006B21]/25 rounded-xl text-xs text-[#050505]/80">
                ⚠️ <strong className="text-[#006B21]">Important Notice:</strong> Customers scanning this physical QR card will be redirected to the new business after reassignment. The physical QR code remains unchanged.
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="text-xs">
                <span className="text-[#050505]/50">Current Business: </span>
                <span className="font-bold text-[#050505]">
                  {selectedCardForAction.business ? selectedCardForAction.business.name : "Unassigned"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                  Select New Business Destination *
                </label>
                <select
                  required
                  value={targetBusinessId}
                  onChange={(e) => setTargetBusinessId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs text-[#050505] focus:outline-none focus:border-[#006B21] focus:bg-white"
                >
                  <option value="">Choose a destination business...</option>
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
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/60 hover:text-[#050505] hover:bg-[#E9F8E9]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !targetBusinessId}
                onClick={handleConfirmReassign}
                className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {bulkAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <h3 className="text-base font-black text-[#050505]">
              Bulk Assign {selectedCardIds.length} Cards
            </h3>
            <p className="text-xs text-[#050505]/60">
              Assign all {selectedCardIds.length} selected physical QR cards to a single business destination.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Target Business *
              </label>
              <select
                required
                value={targetBusinessId}
                onChange={(e) => setTargetBusinessId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs text-[#050505] focus:outline-none focus:border-[#006B21] focus:bg-white"
              >
                <option value="">Choose a business...</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.businessType})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#006B21]/15">
              <button
                type="button"
                onClick={() => setBulkAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/60 hover:text-[#050505] hover:bg-[#E9F8E9]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !targetBusinessId}
                onClick={handleBulkAssign}
                className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                Confirm Bulk Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#006B21]/20 space-y-4 text-[#050505]">
            <h3 className="text-base font-black text-[#050505]">
              Import Cards (CSV)
            </h3>
            <p className="text-xs text-[#050505]/60">
              Paste card codes line by line. System will reject duplicates and validate existing inventory.
            </p>

            <form onSubmit={handleImportCsv} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                  Card Codes (One per line)
                </label>
                <textarea
                  rows={6}
                  required
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={"CARD001\nCARD002\nCARD003"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/25 bg-[#E9F8E9]/50 text-xs font-mono text-[#050505] focus:outline-none focus:border-[#006B21] focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/60 hover:text-[#050505] hover:bg-[#E9F8E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  Import and Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Card Delete Confirmation Modal */}
      {deleteModalOpen && cardToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4 text-[#050505]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#050505]">Delete QR Card</h3>
                <p className="text-xs text-[#050505]/60">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Card Code:</span>
                <span className="font-mono font-bold text-[#050505]">{cardToDelete.cardCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Public Token:</span>
                <span className="font-mono font-bold text-[#006B21]">/r/{cardToDelete.publicToken}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Assigned Business:</span>
                <span className="text-[#050505] font-medium">
                  {cardToDelete.business?.name || "None (Unassigned)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#050505]/60">Total Scans:</span>
                <span className="text-[#050505] font-bold">{cardToDelete._count?.scans || 0}</span>
              </div>
            </div>

            <p className="text-xs text-rose-700 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200">
              ⚠️ Warning: Deleting this card will permanently wipe its redirect routing and all recorded scan analytics. Any physical card already printed with this QR code will stop working.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setCardToDelete(null);
                }}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/60 hover:text-[#050505] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4 text-[#050505]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#050505]">Bulk Delete Cards</h3>
                <p className="text-xs text-[#050505]/60">
                  Delete {selectedCardIds.length} selected card{selectedCardIds.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <p className="text-xs text-rose-700 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200">
              ⚠️ Are you sure you want to permanently delete all{" "}
              <strong className="text-rose-900">{selectedCardIds.length}</strong> selected QR cards? All redirect tokens and scan history records will be erased immediately. Physical cards with these tokens will cease to function.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setBulkDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#050505]/60 hover:text-[#050505] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete {selectedCardIds.length} Cards
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
