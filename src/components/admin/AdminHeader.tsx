"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Search,
  LogOut,
  Building2,
  CreditCard,
  User as UserIcon,
  X,
  Loader2,
  ExternalLink,
  Store,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  adminName?: string;
  adminEmail?: string;
}

export function AdminHeader({
  onToggleMobileMenu,
  adminName = "GrowBroo Admin",
  adminEmail = "growbroo.info@gmail.com",
}: AdminHeaderProps) {
  const router = useRouter();
  const { success } = useToast();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    businesses: any[];
    cards: any[];
    users: any[];
  }>({ businesses: [], cards: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ businesses: [], cards: [], users: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-[16px] border-b border-[#E5EEE6] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3] lg:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2 lg:hidden mr-1">
            <div className="w-8 h-8 rounded-xl bg-[#006B21] flex items-center justify-center font-bold text-xs text-white shadow-xs">
              GB
            </div>
            <span className="font-extrabold text-xs tracking-tight text-[#050505] hidden xs:inline">
              Grow<span className="text-[#006B21]">Broo</span>
            </span>
          </Link>

          {/* Quick Search trigger button - Pill style exactly matching screenshot */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F4F7F5] hover:bg-[#EDF3EF] focus:outline-none focus:ring-2 focus:ring-[#39E900]/30 text-[#52606D] text-xs font-medium border border-[#E2EBE4] transition-all duration-200 w-52 sm:w-80 shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-[#718096]" />
            <span className="flex-1 text-left truncate text-[#718096]">Search businesses, cards, ...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-sans bg-white border border-[#DCEBDD] rounded-md text-[#718096] font-medium shadow-2xs">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right tools & user dropdown */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EBF7EE] hover:bg-[#DEF0E4] text-xs font-semibold text-[#006B21] border border-[#CDE9D4] transition-all duration-200 shadow-xs"
            title="Preview Client Business Portal"
          >
            <Store className="w-3.5 h-3.5 text-[#006B21]" />
            <span>Business Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#006B21]/80" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0B3B24] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              G
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#050505] leading-tight">
                {adminName || "GrowBroo Admin"}
              </span>
              <span className="text-[10px] text-[#718096] leading-tight mt-0.5">
                {adminEmail || "growbroo.info@gmail.com"}
              </span>
            </div>

            {/* Notification bell with green badge */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3] transition-colors ml-1"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#39E900] ring-2 ring-white" />
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-[#52606D] hover:text-[#050505] hover:bg-[#F2F8F3] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-20">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#DCEBDD] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#050505]">
            <div className="p-4 border-b border-[#E5EEE6] flex items-center gap-3 bg-[#F7FBF7]">
              <Search className="w-5 h-5 text-[#006B21]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses (Royal Salon), cards (CARD0001), or tokens..."
                className="flex-1 bg-transparent border-0 text-[#050505] placeholder-[#52606D]/60 focus:outline-none focus:ring-1 focus:ring-[#39E900]/30 rounded-lg px-1.5 py-0.5 text-sm"
              />
              {isSearching && <Loader2 className="w-4 h-4 text-[#006B21] animate-spin" />}
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-[#52606D] hover:text-[#050505]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {!searchQuery && (
                <div className="text-center py-8 text-xs text-[#52606D]">
                  Type to search across businesses, cards, and team members...
                </div>
              )}

              {/* Businesses */}
              {searchResults.businesses.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#006B21] mb-2">
                    Businesses
                  </div>
                  <div className="space-y-1">
                    {searchResults.businesses.map((b) => (
                      <Link
                        key={b.id}
                        href={`/admin/businesses/${b.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F2F8F3] transition-colors duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E9F8E9] flex items-center justify-center text-[#006B21]">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#050505] group-hover:text-[#006B21] transition-colors">
                              {b.name}
                            </div>
                            <div className="text-[10px] text-[#52606D]">
                              {b.businessType} • {b._count?.cards || 0} cards • {b._count?.scans || 0} scans
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#52606D] group-hover:text-[#006B21] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards */}
              {searchResults.cards.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#006B21] mb-2">
                    Cards
                  </div>
                  <div className="space-y-1">
                    {searchResults.cards.map((c) => (
                      <Link
                        key={c.id}
                        href={`/admin/cards/${c.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F2F8F3] transition-colors duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E9F8E9] flex items-center justify-center text-[#006B21]">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold font-mono text-[#050505] group-hover:text-[#006B21] transition-colors">
                              {c.cardCode}
                            </div>
                            <div className="text-[10px] text-[#52606D]">
                              {c.business ? c.business.name : "Unassigned"} • {c._count?.scans || 0} scans
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#52606D] group-hover:text-[#006B21] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {searchResults.users.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#006B21] mb-2">
                    Users
                  </div>
                  <div className="space-y-1">
                    {searchResults.users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F2F8F3] transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E9F8E9] flex items-center justify-center text-[#006B21]">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#050505]">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-[#52606D]">
                              {u.email} • {u.role}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery &&
                searchResults.businesses.length === 0 &&
                searchResults.cards.length === 0 &&
                searchResults.users.length === 0 &&
                !isSearching && (
                  <div className="text-center py-6 text-xs text-[#52606D]">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
