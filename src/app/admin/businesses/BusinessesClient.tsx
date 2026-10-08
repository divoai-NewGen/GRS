"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  Filter,
  ExternalLink,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  CreditCard,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function BusinessesClient() {
  const { success, error: toastError } = useToast();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessType: "RESTAURANT",
    description: "",
    logoUrl: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    googleBusinessName: "",
    googleReviewUrl: "",
    status: "ACTIVE",
    planType: "BASIC",
  });

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/businesses?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.businesses || []);
      }
    } catch {
      toastError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [typeFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBusinesses();
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || "Failed to create business");
        setSubmitting(false);
        return;
      }

      success("Business created successfully!");
      setCreateModalOpen(false);
      setFormData({
        name: "",
        businessType: "RESTAURANT",
        description: "",
        logoUrl: "",
        phone: "",
        email: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "USA",
        googleBusinessName: "",
        googleReviewUrl: "",
        status: "ACTIVE",
        planType: "BASIC",
      });
      fetchBusinesses();
    } catch {
      toastError("Network error while creating business");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBusiness = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? Assigned cards will become unassigned.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/businesses/${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Business removed successfully");
        fetchBusinesses();
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to delete");
      }
    } catch {
      toastError("Network error while deleting");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Businesses
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Manage participating client businesses and their official Google Review destinations.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#39E900]" />
          Add Business
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#050505] border border-[#006B21]/30 shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-[#39E900] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name, city, email..."
            className="w-full pl-10 pr-4 py-2 bg-[#10251A] border border-[#006B21]/30 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#39E900]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#10251A] border border-[#006B21]/30 rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="SALON">Salon</option>
            <option value="RESTAURANT">Restaurant</option>
            <option value="CAFE">Cafe</option>
            <option value="HOTEL">Hotel</option>
            <option value="GYM">Gym</option>
            <option value="CLINIC">Clinic</option>
            <option value="DENTIST">Dentist</option>
            <option value="RETAIL">Retail</option>
            <option value="AUTO_SERVICE">Auto Service</option>
            <option value="REAL_ESTATE">Real Estate</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#10251A] border border-[#006B21]/30 rounded-xl text-xs text-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#050505] rounded-2xl border border-[#006B21]/30 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
            <span className="text-xs">Loading businesses...</span>
          </div>
        ) : businesses.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Building2 className="w-12 h-12 text-[#39E900] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">
              No businesses yet
            </h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto mt-1 mb-6">
              Create your first client business to start assigning dynamic QR cards.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-[#006B21] hover:bg-[#005219] text-white rounded-xl text-xs font-bold"
            >
              Add Business
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10251A] text-[#39E900] uppercase tracking-wider font-bold border-b border-[#006B21]/20">
                <tr>
                  <th className="py-3.5 px-4">Business</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Assigned Cards</th>
                  <th className="py-3.5 px-4">Total Scans</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/20">
                {businesses.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[#10251A]/60 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#10251A] flex items-center justify-center font-bold text-white shrink-0 border border-[#006B21]/30 overflow-hidden">
                          {b.logoUrl ? (
                            <img src={b.logoUrl} alt={b.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-[#39E900]" />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/businesses/${b.id}`}
                            className="font-bold text-white hover:text-[#39E900] transition-colors"
                          >
                            {b.name}
                          </Link>
                          <div className="text-[11px] text-white/50 flex items-center gap-2">
                            <span>{b.city ? `${b.city}, ${b.country}` : "Location not set"}</span>
                            {b.owner && (
                              <span>• Owner: {b.owner.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-white/80">
                      <span className="px-2 py-0.5 rounded-md bg-[#10251A] border border-[#006B21]/30 text-[11px]">
                        {b.businessType}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#006B21]/30 border border-[#006B21]/40 text-[#39E900] font-bold font-mono text-xs">
                        <CreditCard className="w-3.5 h-3.5" />
                        {b._count?.cards || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10251A] border border-[#006B21]/40 text-white font-bold font-mono text-xs">
                        <Eye className="w-3.5 h-3.5 text-[#39E900]" />
                        {b._count?.scans || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {b.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#006B21]/40 text-[#39E900] border border-[#39E900]/30">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-300 border border-rose-800">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}

                        {b.planType === "PREMIUM" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-[#006B21] text-[#39E900] border border-[#39E900]/40">
                            ⭐ PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10251A] text-white/60 border border-[#006B21]/30">
                            BASIC
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-white/50 font-mono">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/businesses/${b.id}`}
                          className="p-1.5 rounded-lg text-white/60 hover:text-[#39E900] hover:bg-[#10251A] transition-colors"
                          title="View Business"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteBusiness(b.id, b.name)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Business"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Business Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#050505] rounded-3xl shadow-2xl border border-[#006B21]/40 overflow-hidden flex flex-col max-h-[90vh] text-white">
            <div className="p-6 border-b border-[#006B21]/30 flex items-center justify-between bg-[#10251A]/60">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Add New Business
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Configure official Google Review link and business credentials.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 rounded-xl text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Salon"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#39E900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Business Category *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none"
                  >
                    <option value="SALON">Salon / Spa</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="CAFE">Cafe / Bakery</option>
                    <option value="HOTEL">Hotel / Hospitality</option>
                    <option value="GYM">Gym / Fitness</option>
                    <option value="CLINIC">Clinic / Healthcare</option>
                    <option value="DENTIST">Dentist</option>
                    <option value="RETAIL">Retail Store</option>
                    <option value="AUTO_SERVICE">Auto Service</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="OTHER">Other Local Business</option>
                  </select>
                </div>
              </div>

              {/* CRITICAL: Google Review URL */}
              <div className="p-4 rounded-2xl bg-[#10251A] border border-[#006B21]/50">
                <label className="block text-xs font-bold text-[#39E900] mb-1">
                  Google Review Request URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.googleReviewUrl}
                  onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/60 bg-[#050505] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#39E900] font-mono"
                />
                <p className="text-[11px] text-white/70 mt-2">
                  ℹ️ Enter the business official Google review request link. Do not generate or assume a URL.
                </p>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Subscription Plan & QR Flow *
                </label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none"
                >
                  <option value="BASIC">Basic Plan (Direct 307 Redirect to Google)</option>
                  <option value="PREMIUM">Premium Plan (Smart Review Assistant + Feedback Filter)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@business.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. New York"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. NY"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="USA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white"
                />
              </div>

              <div className="pt-4 border-t border-[#006B21]/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#006B21]/40 text-xs font-medium text-white/70 hover:bg-[#10251A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/30 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#39E900]" />}
                  Create Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
