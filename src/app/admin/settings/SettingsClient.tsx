"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Globe,
  Mail,
  Palette,
  Shield,
  Clock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function SettingsClient() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "GrowBroo",
    domain: "growbroo.com",
    supportEmail: "support@growbroo.com",
    primaryColor: "#006B21",
    secondaryColor: "#10251A",
    defaultCardText: "Scan to share your honest feedback",
    dataRetentionDays: 365,
    rateLimitPerMinute: 60,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) setFormData(data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        success("System settings saved successfully!");
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to update settings");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-[#050505]/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#006B21]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#050505] tracking-tight">
          Platform Configuration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#050505]/60 mt-1">
          Customize brand labels, default card copy, telemetry retention, and API security.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Brand Settings */}
        <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#050505]/80 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#006B21]" />
            General Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Platform Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Redirect Custom Domain
              </label>
              <input
                type="text"
                required
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs text-[#050505] focus:outline-none focus:border-[#006B21] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Support Email
            </label>
            <input
              type="email"
              required
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
            />
          </div>
        </div>

        {/* Card & Print Settings */}
        <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#050505]/80 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#006B21]" />
            Physical QR Card Defaults
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#050505]/80 mb-1">
              Default Card Feedback Copy (Neutral Google Policy Compliant)
            </label>
            <input
              type="text"
              required
              value={formData.defaultCardText}
              onChange={(e) => setFormData({ ...formData, defaultCardText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Primary Brand Color (Hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-9 h-9 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs font-mono text-[#050505] focus:outline-none focus:border-[#006B21]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Secondary Brand Color (Hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-9 h-9 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs font-mono text-[#050505] focus:outline-none focus:border-[#006B21]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Analytics Retention */}
        <div className="p-6 rounded-3xl bg-white border border-[#006B21]/15 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#050505]/80 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#006B21]" />
            Security & Retention
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Scan Rate Limit (Per IP Per Minute)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                required
                value={formData.rateLimitPerMinute}
                onChange={(e) =>
                  setFormData({ ...formData, rateLimitPerMinute: parseInt(e.target.value, 10) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
              />
              <span className="text-[10px] text-[#050505]/60 mt-1 block">
                Prevents bot loops and click fraud on QR redirects.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#050505]/80 mb-1">
                Telemetry Data Retention (Days)
              </label>
              <input
                type="number"
                min="30"
                max="1825"
                required
                value={formData.dataRetentionDays}
                onChange={(e) =>
                  setFormData({ ...formData, dataRetentionDays: parseInt(e.target.value, 10) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/20 bg-[#E9F8E9]/30 text-xs text-[#050505] focus:outline-none focus:border-[#006B21]"
              />
              <span className="text-[10px] text-[#050505]/60 mt-1 block">
                Automatic purging window for anonymized telemetry logs.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
