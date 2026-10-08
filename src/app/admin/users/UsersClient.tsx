"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  ShieldCheck,
  Store,
  Mail,
  Calendar,
  Loader2,
  X,
  CheckCircle,
  Copy,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Building,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function UsersClient() {
  const { success, error: toastError } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUSINESS_OWNER");
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Success summary modal
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    pass: string;
    role: string;
  } | null>(null);

  // Reset Password Modal
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [uRes, bRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/businesses"),
      ]);

      if (uRes.ok) {
        const data = await uRes.json();
        setUsers(data.users || []);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setBusinesses(bData.businesses || []);
      }
    } catch {
      toastError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Generate random password helper
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    const specials = "@#$!";
    let generated = "GB";
    for (let i = 0; i < 4; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generated += specials.charAt(Math.floor(Math.random() * specials.length));
    for (let i = 0; i < 3; i++) {
      generated += Math.floor(Math.random() * 10).toString();
    }
    return generated;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          businessId: selectedBusinessId || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success(`User account for ${name} created successfully!`);
        setCreatedCredentials({
          name,
          email,
          pass: password,
          role,
        });
        setCreateModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setSelectedBusinessId("");
        fetchUsers();
      } else {
        toastError(data.error || "Failed to create user");
      }
    } catch {
      toastError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !newPassword) return;
    setResetting(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetModalUser.id,
          password: newPassword,
        }),
      });

      if (res.ok) {
        success(`Password updated for ${resetModalUser.name}`);
        setCreatedCredentials({
          name: resetModalUser.name,
          email: resetModalUser.email,
          pass: newPassword,
          role: resetModalUser.role,
        });
        setResetModalUser(null);
        setNewPassword("");
        fetchUsers();
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to update password");
      }
    } catch {
      toastError("Failed to update password");
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteUser = async (userToDelete: any) => {
    if (
      !confirm(
        `Are you sure you want to delete user account "${userToDelete.name}" (${userToDelete.email})?`
      )
    )
      return;

    try {
      const res = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        success(`User ${userToDelete.name} deleted`);
        fetchUsers();
      } else {
        const data = await res.json();
        toastError(data.error || "Failed to delete user");
      }
    } catch {
      toastError("Error deleting user");
    }
  };

  const copyCredentialsText = (cred: { email: string; pass: string; name: string }) => {
    const loginUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "/login";
    const text = `🌟 GrowBroo Business Portal Login Credentials:\n\n👤 Name: ${cred.name}\n🔗 Login URL: ${loginUrl}\n📧 Email: ${cred.email}\n🔑 Password: ${cred.pass}\n\nPlease keep these credentials secure.`;
    navigator.clipboard.writeText(text);
    success("Login credentials copied to clipboard! Ready to share with client.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            User Accounts & Client Access
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Generate and manage login ID and passwords for Business Owners.
          </p>
        </div>

        <button
          onClick={() => {
            setPassword(generateRandomPassword());
            setCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#39E900]" />
          Generate Business Owner Login
        </button>
      </div>

      <div className="bg-[#050505] rounded-2xl border border-[#006B21]/30 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
            <span className="text-xs">Loading user accounts...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10251A] text-white/60 uppercase tracking-wider font-semibold border-b border-[#006B21]/30">
                <tr>
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Assigned Business</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006B21]/20">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#10251A]/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">
                        {u.name}
                      </div>
                      <div className="text-xs text-white/60 font-mono mt-0.5">
                        {u.email}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#10251A] text-[#39E900] border border-[#006B21]/50">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#39E900]" />
                          System Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#006B21]/30 text-[#39E900] border border-[#39E900]/40">
                          <Store className="w-3.5 h-3.5 text-[#39E900]" />
                          Business Owner
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {u.businesses?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {u.businesses.map((b: any) => (
                            <span
                              key={b.id}
                              className="px-2.5 py-1 rounded-lg bg-[#10251A] border border-[#006B21]/40 text-xs font-semibold text-white flex items-center gap-1.5"
                            >
                              <Building className="w-3 h-3 text-[#39E900]" />
                              {b.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-white/40 italic text-xs">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-white/50 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {u.role !== "ADMIN" && (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setNewPassword(generateRandomPassword());
                              setResetModalUser(u);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#10251A] hover:bg-[#006B21] text-[#39E900] hover:text-white border border-[#006B21]/40 transition-all text-xs font-medium"
                            title="Reset Password"
                          >
                            <Key className="w-3 h-3" />
                            <span>Reset Pass</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800 transition-all"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generated Credentials Copy Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#050505] rounded-3xl p-6 shadow-2xl border border-[#39E900]/50 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#006B21]/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#39E900]" />
                <h3 className="text-base font-bold text-white">
                  Credentials Generated!
                </h3>
              </div>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-white/70">
              Aapne ye login credentials generate kiye hain. Inhe copy karke Business Owner ke saath WhatsApp ya Email par share karein:
            </p>

            <div className="bg-[#10251A] p-4 rounded-2xl border border-[#006B21]/40 space-y-2.5 font-mono text-xs">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Business Owner</span>
                <span className="text-white font-bold">{createdCredentials.name}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Login Email / ID</span>
                <span className="text-[#39E900] font-bold">{createdCredentials.email}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Password</span>
                <span className="text-[#39E900] font-bold">{createdCredentials.pass}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => copyCredentialsText(createdCredentials)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/30 flex items-center justify-center gap-2 transition-all"
              >
                <Copy className="w-4 h-4 text-[#39E900]" />
                Copy Details for Client
              </button>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="py-2.5 px-4 rounded-xl bg-[#10251A] hover:bg-[#10251A]/80 text-white/80 font-medium text-xs border border-[#006B21]/40"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#050505] rounded-3xl p-6 shadow-2xl border border-[#006B21]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#006B21]/30">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#39E900]" />
                Reset Password for {resetModalUser.name}
              </h3>
              <button
                onClick={() => setResetModalUser(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-white/80">
                    New Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] text-[#39E900] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-[#39E900] font-mono focus:outline-none focus:border-[#39E900]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {resetting && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#39E900]" />}
                  Update & Copy Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#050505] rounded-3xl p-6 shadow-2xl border border-[#006B21]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#006B21]/30">
              <div>
                <h3 className="text-base font-black text-white">
                  Generate User Login
                </h3>
                <p className="text-[11px] text-white/60 mt-0.5">
                  Business Owner ke liye ID aur Password generate karein
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  Business Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel / Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none focus:border-[#39E900]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  Email Address (Login ID) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. owner@royalsalon.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none focus:border-[#39E900]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-white/80">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(generateRandomPassword())}
                    className="text-[11px] text-[#39E900] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto Generate Strong Pass
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter or generate password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white font-mono focus:outline-none focus:border-[#39E900]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-[#39E900]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  Assign to Business (Optional)
                </label>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none focus:border-[#39E900]"
                >
                  <option value="">-- None (Assign Later) --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city || "No City"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#006B21]/40 bg-[#10251A] text-xs text-white focus:outline-none focus:border-[#39E900]"
                >
                  <option value="BUSINESS_OWNER">Business Owner (Portal Access)</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-[#10251A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-xs shadow-md shadow-[#006B21]/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#39E900]" />}
                  Create & Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
