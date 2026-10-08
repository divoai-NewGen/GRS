"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Eye,
  CreditCard,
  Building2,
  Smartphone,
  Globe,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ScanHistoryClient() {
  const { error: toastError } = useToast();
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const fetchScans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scans?limit=150");
      if (res.ok) {
        const data = await res.json();
        setScans(data.scans || []);
      }
    } catch {
      toastError("Failed to fetch scan history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const filteredScans = scans.filter((s) => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    return (
      s.card?.cardCode?.toLowerCase().includes(term) ||
      s.business?.name?.toLowerCase().includes(term) ||
      s.deviceType?.toLowerCase().includes(term) ||
      s.browser?.toLowerCase().includes(term) ||
      s.os?.toLowerCase().includes(term) ||
      s.city?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Scan Activity Log
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Auditable telemetry of physical card scans and dynamic redirect dispatches.
          </p>
        </div>

        <button
          onClick={fetchScans}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] hover:bg-[#153322] text-xs font-bold text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#39E900]" : ""}`} />
          Refresh Log
        </button>
      </div>

      {/* Search filter */}
      <div className="p-4 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter scans by card code, business, browser, location..."
            className="w-full pl-10 pr-4 py-2 bg-[#10251A] border border-[#006B21]/40 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#39E900]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#050505] rounded-2xl border border-[#006B21]/30 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
            <span className="text-xs">Loading scan stream...</span>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="py-16 text-center text-xs text-white/40">
            No scans match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10251A] text-white/60 uppercase tracking-wider font-semibold border-b border-[#006B21]/30">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Card</th>
                  <th className="py-3 px-4">Assigned Business</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Client Software</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Hashed IP Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/20">
                {filteredScans.map((s) => (
                  <tr key={s.id} className="hover:bg-[#10251A]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-white/70">
                      {new Date(s.scannedAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      <Link href={`/admin/cards/${s.cardId}`} className="hover:text-[#39E900]">
                        {s.card?.cardCode || "Unknown"}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <Link href={`/admin/businesses/${s.businessId}`} className="hover:text-[#39E900] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#39E900]" />
                        {s.business?.name || "Unknown"}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-[#10251A] border border-[#006B21]/30 font-medium text-[11px] text-white">
                        {s.deviceType || "Mobile"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white/60">
                      {s.browser} • {s.os}
                    </td>
                    <td className="py-3.5 px-4 text-white/50">
                      {s.city ? `${s.city}, ${s.country}` : "Global"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white/40">
                      {s.ipHash ? s.ipHash.slice(0, 14) + "…" : "anonymized"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
