"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Phone,
  Mail,
  Zap,
  Sparkles,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  MessageCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function InquiriesClient() {
  const { success, error: toastError } = useToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/api/inquiries?status=${statusFilter}`
        : "/api/inquiries";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch {
      toastError("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        success(`Status updated to ${newStatus}`);
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      } else {
        toastError("Failed to update status");
      }
    } catch {
      toastError("Network error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete inquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Inquiry deleted");
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      } else {
        toastError("Failed to delete inquiry");
      }
    } catch {
      toastError("Network error");
    }
  };

  const cleanPhone = (p: string) => p.replace(/[^0-9]/g, "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#050505] tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-[#006B21]" />
            Customer Inquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-[#050505]/60 mt-1 font-medium">
            Website contact form submissions from prospective business clients.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#006B21]/20 bg-white text-xs font-semibold text-[#050505] shadow-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New Inquiries</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#006B21]/15 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#050505]/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#006B21]" />
            <span className="text-xs font-medium">Loading customer inquiries...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center text-[#050505]/50 space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-[#006B21]" />
            <div className="text-sm font-bold text-[#050505]">No inquiries found</div>
            <div className="text-xs text-[#050505]/60 font-medium">
              When prospective clients submit the Contact Us form, they will appear here.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E9F8E9] text-[#006B21] uppercase tracking-wider font-bold border-b border-[#006B21]/15">
                <tr>
                  <th className="py-3.5 px-4">Client & Business</th>
                  <th className="py-3.5 px-4">Selected Plan</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Message / Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/10">
                {inquiries.map((inq) => {
                  const phoneNum = cleanPhone(inq.phone);
                  return (
                    <tr key={inq.id} className="hover:bg-[#E9F8E9]/40 transition-colors">
                      {/* Client details */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#050505] text-sm">
                          {inq.name}
                        </div>
                        <div className="text-xs text-[#006B21] font-semibold flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-[#006B21]" />
                          {inq.businessName || "Business not specified"}
                        </div>
                        <div className="text-[10px] text-[#050505]/50 mt-1 font-mono">
                          {new Date(inq.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4">
                        {inq.plan === "PREMIUM" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#006B21] text-white border border-[#006B21]/30 shadow-sm">
                            <Sparkles className="w-3 h-3 text-[#E9F8E9]" />
                            PREMIUM PLAN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E9F8E9] text-[#050505] border border-[#006B21]/20">
                            <Zap className="w-3 h-3 text-[#006B21]" />
                            BASIC PLAN
                          </span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#050505] font-mono text-xs font-semibold">
                            {inq.phone}
                          </span>
                          {phoneNum && (
                            <a
                              href={`https://wa.me/${phoneNum}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md bg-[#E9F8E9] hover:bg-[#006B21] text-[#006B21] hover:text-white transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#050505]/70 font-mono font-medium">
                          <Mail className="w-3 h-3 text-[#006B21]" />
                          <a
                            href={`mailto:${inq.email}`}
                            className="hover:underline hover:text-[#006B21]"
                          >
                            {inq.email}
                          </a>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="py-4 px-4 max-w-xs">
                        {inq.message ? (
                          <p className="text-xs text-[#050505]/80 truncate font-medium" title={inq.message}>
                            {inq.message}
                          </p>
                        ) : (
                          <span className="text-[#050505]/40 italic text-xs font-medium">No notes</span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none transition-colors shadow-sm ${
                            inq.status === "NEW"
                              ? "bg-amber-50 border-amber-200 text-amber-800"
                              : inq.status === "CONTACTED"
                              ? "bg-[#E9F8E9] border-[#006B21]/30 text-[#006B21]"
                              : "bg-[#006B21] border-[#006B21]/40 text-white"
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/admin/users`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#006B21] hover:bg-[#005219] text-white text-xs font-bold shadow-sm transition-all"
                            title="Generate User Account for this lead"
                          >
                            <UserPlus className="w-3 h-3 text-white" />
                            <span>Create Account</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(inq.id, inq.name)}
                            className="p-1.5 rounded-lg text-[#050505]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
}
