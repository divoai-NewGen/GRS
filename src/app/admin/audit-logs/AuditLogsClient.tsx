"use client";

import React, { useState, useEffect } from "react";
import {
  ScrollText,
  Filter,
  User,
  Clock,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function AuditLogsClient() {
  const { error: toastError } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      if (entityFilter) params.set("entityType", entityFilter);

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      toastError("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#050505] tracking-tight">
            System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
            Immutable log of all administrative actions, card reassignments, and URL destination changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#006B21]/20 bg-white hover:bg-[#E9F8E9] text-xs font-bold text-[#050505] shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#006B21]" : "text-[#006B21]"}`} />
          Refresh Audit Trail
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#006B21]/15 shadow-sm flex flex-wrap gap-3 items-center">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
        >
          <option value="">All Actions</option>
          <option value="CARD_ASSIGNED">CARD_ASSIGNED</option>
          <option value="CARD_REASSIGNED">CARD_REASSIGNED</option>
          <option value="CARD_DISABLED">CARD_DISABLED</option>
          <option value="CARD_CREATED">CARD_CREATED</option>
          <option value="BUSINESS_CREATED">BUSINESS_CREATED</option>
          <option value="BUSINESS_UPDATED">BUSINESS_UPDATED</option>
          <option value="GOOGLE_REVIEW_URL_UPDATED">GOOGLE_REVIEW_URL_UPDATED</option>
          <option value="SETTINGS_UPDATED">SETTINGS_UPDATED</option>
        </select>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/40 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
        >
          <option value="">All Entities</option>
          <option value="CARD">CARD</option>
          <option value="BUSINESS">BUSINESS</option>
          <option value="USER">USER</option>
          <option value="SETTING">SETTING</option>
        </select>
      </div>

      {/* Audit Log Feed */}
      <div className="bg-white rounded-2xl border border-[#006B21]/15 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#050505]/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#006B21]" />
            <span className="text-xs">Loading audit events...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#050505]/40">
            No audit records match your filters.
          </div>
        ) : (
          <div className="divide-y divide-[#006B21]/10">
            {logs.map((log) => {
              let badgeColor = "bg-[#E9F8E9]/50 text-[#050505]/70 border border-[#006B21]/20";
              if (log.action.includes("ASSIGN")) {
                badgeColor = "bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/30 font-bold";
              } else if (log.action.includes("DISABLE")) {
                badgeColor = "bg-rose-50 text-rose-700 border border-rose-200 font-bold";
              } else if (log.action.includes("URL")) {
                badgeColor = "bg-[#006B21]/10 text-[#006B21] border border-[#006B21]/20 font-bold";
              } else if (log.action.includes("CREATE")) {
                badgeColor = "bg-[#E9F8E9] text-[#006B21] border border-[#006B21]/30 font-bold";
              }

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-[#E9F8E9]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${badgeColor}`}>
                        {log.action}
                      </span>
                      <span className="font-bold text-[#050505]">
                        {log.user?.name || "Automated System"}
                      </span>
                      <span className="text-[#050505]/50">({log.user?.email || "system"})</span>
                    </div>

                    <div className="font-mono text-[11px] text-[#050505]/80 bg-[#E9F8E9]/40 p-2.5 rounded-xl border border-[#006B21]/15">
                      {log.metadata || "No metadata recorded."}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="font-mono text-[#050505]/60 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#050505]/50 mt-0.5">
                      Entity: <span className="text-[#006B21] font-mono font-bold">{log.entityType}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
