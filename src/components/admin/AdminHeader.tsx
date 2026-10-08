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
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  adminName?: string;
  adminEmail?: string;
}

export function AdminHeader({
  onToggleMobileMenu,
  adminName = "Shahbaz Admin",
  adminEmail = "admin@revio.app",
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
      <header className="sticky top-0 z-30 h-16 bg-[#050505]/95 backdrop-blur-md border-b border-[#006B21]/30 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/admin" className="flex items-center gap-2 lg:hidden mr-1">
            <div className="w-8 h-8 rounded-xl bg-[#006B21] flex items-center justify-center font-black text-xs text-[#39E900] shadow-sm border border-[#39E900]/30">
              GB
            </div>
            <span className="font-black text-xs tracking-tight text-white hidden xs:inline">
              Grow<span className="text-[#39E900]">Broo</span>
            </span>
          </Link>

          {/* Quick Search trigger button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#10251A] hover:bg-[#153322] text-white/60 text-xs font-medium border border-[#006B21]/30 transition-all w-48 sm:w-64"
          >
            <Search className="w-3.5 h-3.5 text-[#39E900]" />
            <span className="flex-1 text-left truncate text-white/70">Search businesses, cards...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#050505] border border-[#006B21]/40 rounded text-[#39E900]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right tools & user dropdown */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10251A] hover:bg-[#006B21] text-xs font-semibold text-[#39E900] hover:text-white border border-[#006B21]/50 transition-all shadow-sm"
            title="Preview Client Business Portal"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Business Portal</span>
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-[#006B21]/30">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">
                {adminName}
              </span>
              <span className="text-[10px] text-white/50">{adminEmail}</span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#006B21] text-[#39E900] flex items-center justify-center font-bold text-xs shadow-sm border border-[#39E900]/30">
              {adminName[0]}
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-white/50 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-20">
          <div className="w-full max-w-xl bg-[#050505] rounded-2xl shadow-2xl border border-[#006B21]/40 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="p-4 border-b border-[#006B21]/30 flex items-center gap-3 bg-[#10251A]/60">
              <Search className="w-5 h-5 text-[#39E900]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses (Royal Salon), cards (CARD0001), or tokens..."
                className="flex-1 bg-transparent border-0 text-white placeholder-white/40 focus:outline-none text-sm"
              />
              {isSearching && <Loader2 className="w-4 h-4 text-[#39E900] animate-spin" />}
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {!searchQuery && (
                <div className="text-center py-8 text-xs text-white/40">
                  Type to search across businesses, cards, and team members...
                </div>
              )}

              {/* Businesses */}
              {searchResults.businesses.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#39E900] mb-2">
                    Businesses
                  </div>
                  <div className="space-y-1">
                    {searchResults.businesses.map((b) => (
                      <Link
                        key={b.id}
                        href={`/admin/businesses/${b.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#10251A] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#006B21]/30 flex items-center justify-center text-[#39E900]">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-[#39E900]">
                              {b.name}
                            </div>
                            <div className="text-[10px] text-white/50">
                              {b.businessType} • {b._count?.cards || 0} cards • {b._count?.scans || 0} scans
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#39E900]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards */}
              {searchResults.cards.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#39E900] mb-2">
                    Cards
                  </div>
                  <div className="space-y-1">
                    {searchResults.cards.map((c) => (
                      <Link
                        key={c.id}
                        href={`/admin/cards/${c.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#10251A] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#006B21]/30 flex items-center justify-center text-[#39E900]">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold font-mono text-white group-hover:text-[#39E900]">
                              {c.cardCode}
                            </div>
                            <div className="text-[10px] text-white/50">
                              {c.business ? c.business.name : "Unassigned"} • {c._count?.scans || 0} scans
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#39E900]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {searchResults.users.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#39E900] mb-2">
                    Users
                  </div>
                  <div className="space-y-1">
                    {searchResults.users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#10251A] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#006B21]/30 flex items-center justify-center text-[#39E900]">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-white/50">
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
                  <div className="text-center py-6 text-xs text-white/40">
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
