"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";

// ── Password rules ────────────────────────────────────────────────────────
const RULES = [
  { id: "len",     label: "At least 8 characters",          test: (p: string) => p.length >= 8 },
  { id: "upper",   label: "At least 1 uppercase letter",    test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",   label: "At least 1 lowercase letter",    test: (p: string) => /[a-z]/.test(p) },
  { id: "number",  label: "At least 1 number",              test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "At least 1 special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

function RuleItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <span style={{
        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: met ? "#f0fdf4" : "#f9fafb",
        border: `1px solid ${met ? "#86efac" : "#e5e7eb"}`,
        fontSize: 10, fontWeight: 700,
        color: met ? "#22c55e" : "#9ca3af",
        transition: "all 0.2s",
      }}>
        {met ? "✓" : "✕"}
      </span>
      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12,
        color: met ? "#15803d" : "#6b7280",
        transition: "color 0.2s",
      }}>
        {label}
      </span>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "0.5px solid #e2e1db",
  background: "#ffffff",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  fontWeight: 600 as const,
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: 6,
  display: "block",
};

export default function SettingsPage() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");

  // password reset state
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [pwdSaving, setPwdSaving]     = useState(false);
  const [pwdError, setPwdError]       = useState("");
  const [pwdSaved, setPwdSaved]       = useState(false);
  const [showPwd, setShowPwd]         = useState({ current: false, new: false, confirm: false });

  const allRulesMet = RULES.every(r => r.test(newPwd));
  const passwordsMatch = newPwd === confirmPwd && confirmPwd.length > 0;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (!allRulesMet) { setPwdError("New password doesn't meet all requirements."); return; }
    if (!passwordsMatch) { setPwdError("Passwords do not match."); return; }

    setPwdSaving(true);
    // Step 1: verify current password
    const verify = await fetch("/api/account/password-reset", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify-old-password", oldPassword: currentPwd }),
    });
    if (!verify.ok) {
      const d = await verify.json();
      setPwdError(d.error || "Current password is incorrect.");
      setPwdSaving(false);
      return;
    }
    // Step 2: reset password
    const reset = await fetch("/api/account/password-reset", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset-password", newPassword: newPwd }),
    });
    setPwdSaving(false);
    if (reset.ok) {
      setPwdSaved(true);
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setTimeout(() => setPwdSaved(false), 3000);
    } else {
      const d = await reset.json();
      setPwdError(d.error || "Failed to update password.");
    }
  };

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus === "unauthenticated") {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent("/settings")}`);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setError("");
    setLoading(true);

    fetch("/api/account/profile", { credentials: "include" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          const msg =
            r.status === 401
              ? "Session expired. Please sign in again."
              : typeof data.error === "string"
                ? data.error
                : `Could not load profile (${r.status}).`;
          throw new Error(msg);
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const parts = (data.name ?? "").split(" ");
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
        setEmail(data.email ?? "");
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Failed to save changes. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f4f0" }}>
      <FlagLinkSidebar
        collapsible
        user={{ name: [firstName, lastName].filter(Boolean).join(" ") || "Guest", email }}
        scansUsed={2}
        plan="free"
      />

      <main style={{ flex: 1, padding: "48px 6%" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700, fontSize: 28, color: "#0f172a",
              letterSpacing: "-0.02em", marginBottom: 6,
            }}>
              Account Settings
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#888" }}>
              Manage your personal details.
            </p>
          </div>

          {loading ? (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#9ca3af", padding: "40px 0" }}>
              Loading...
            </div>
          ) : (
            <form onSubmit={handleSave}>

              {/* Card */}
              <div style={{
                background: "#ffffff", border: "0.5px solid #e2e1db",
                borderRadius: 16, padding: 28, marginBottom: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11,
                  fontWeight: 700, color: "#4f46e5", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 20,
                }}>
                  Personal Info
                </p>

                {/* First + Last name row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="John"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#4f46e5")}
                      onBlur={e => (e.target.style.borderColor = "#e2e1db")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Doe"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#4f46e5")}
                      onBlur={e => (e.target.style.borderColor = "#e2e1db")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#4f46e5")}
                    onBlur={e => (e.target.style.borderColor = "#e2e1db")}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>
                    Phone Number
                    <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#4f46e5")}
                    onBlur={e => (e.target.style.borderColor = "#e2e1db")}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: "10px 14px", background: "#fef2f2",
                  border: "0.5px solid #fecaca", borderRadius: 10,
                  fontFamily: "'Inter', sans-serif", fontSize: 13,
                  color: "#ef4444", marginBottom: 16,
                }}>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: "#4f46e5", color: "#ffffff",
                    border: "none", cursor: saving ? "not-allowed" : "pointer",
                    padding: "10px 24px", borderRadius: 50,
                    fontFamily: "'Inter', sans-serif", fontSize: 13,
                    fontWeight: 600, opacity: saving ? 0.7 : 1,
                    transition: "background 0.15s",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/scan")}
                  style={{
                    background: "transparent", color: "#555",
                    border: "0.5px solid #e2e1db", cursor: "pointer",
                    padding: "10px 20px", borderRadius: 50,
                    fontFamily: "'Inter', sans-serif", fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>

                {saved && (
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 13,
                    color: "#22c55e", fontWeight: 500,
                  }}>
                    ✓ Saved successfully
                  </span>
                )}
              </div>

            </form>
          )}

          {/* ── Password Reset Card ── */}
          {!loading && (
            <form onSubmit={handlePasswordReset} style={{ marginTop: 24 }}>
              <div style={{
                background: "#ffffff", border: "0.5px solid #e2e1db",
                borderRadius: 16, padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11,
                  fontWeight: 700, color: "#4f46e5", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: 20,
                }}>
                  Change Password
                </p>

                {/* Current password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Current Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPwd.current ? "text" : "password"}
                      value={currentPwd}
                      onChange={e => setCurrentPwd(e.target.value)}
                      placeholder="Enter current password"
                      style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={e => (e.target.style.borderColor = "#4f46e5")}
                      onBlur={e => (e.target.style.borderColor = "#e2e1db")}
                    />
                    <button type="button" onClick={() => setShowPwd(s => ({ ...s, current: !s.current }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12 }}>
                      {showPwd.current ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div style={{ marginBottom: 8 }}>
                  <label style={labelStyle}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPwd.new ? "text" : "password"}
                      value={newPwd}
                      onChange={e => setNewPwd(e.target.value)}
                      placeholder="Enter new password"
                      style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={e => (e.target.style.borderColor = "#4f46e5")}
                      onBlur={e => (e.target.style.borderColor = "#e2e1db")}
                    />
                    <button type="button" onClick={() => setShowPwd(s => ({ ...s, new: !s.new }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12 }}>
                      {showPwd.new ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Live rules — only shown when typing */}
                {newPwd.length > 0 && (
                  <div style={{
                    background: "#f9fafb", border: "0.5px solid #e5e7eb",
                    borderRadius: 10, padding: "12px 14px", marginBottom: 16,
                  }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 13 }}>ⓘ</span> Password requirements
                    </p>
                    {RULES.map(r => <RuleItem key={r.id} label={r.label} met={r.test(newPwd)} />)}
                  </div>
                )}

                {/* Confirm password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Confirm New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPwd.confirm ? "text" : "password"}
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      placeholder="Re-enter new password"
                      style={{
                        ...inputStyle, paddingRight: 44,
                        borderColor: confirmPwd.length > 0
                          ? passwordsMatch ? "#86efac" : "#fca5a5"
                          : "#e2e1db",
                      }}
                      onFocus={e => (e.target.style.borderColor = confirmPwd.length > 0 ? (passwordsMatch ? "#86efac" : "#fca5a5") : "#4f46e5")}
                      onBlur={e => (e.target.style.borderColor = confirmPwd.length > 0 ? (passwordsMatch ? "#86efac" : "#fca5a5") : "#e2e1db")}
                    />
                    <button type="button" onClick={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12 }}>
                      {showPwd.confirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {confirmPwd.length > 0 && (
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, marginTop: 5, color: passwordsMatch ? "#22c55e" : "#ef4444" }}>
                      {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                    </p>
                  )}
                </div>

                {/* Error */}
                {pwdError && (
                  <div style={{
                    padding: "10px 14px", background: "#fef2f2",
                    border: "0.5px solid #fecaca", borderRadius: 10,
                    fontFamily: "'Inter', sans-serif", fontSize: 13,
                    color: "#ef4444", marginBottom: 16,
                  }}>
                    {pwdError}
                  </div>
                )}

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button
                    type="submit"
                    disabled={pwdSaving || !allRulesMet || !passwordsMatch || !currentPwd}
                    style={{
                      background: "#4f46e5", color: "#ffffff", border: "none",
                      cursor: (pwdSaving || !allRulesMet || !passwordsMatch || !currentPwd) ? "not-allowed" : "pointer",
                      padding: "10px 24px", borderRadius: 50,
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      opacity: (pwdSaving || !allRulesMet || !passwordsMatch || !currentPwd) ? 0.5 : 1,
                      transition: "opacity 0.15s",
                    }}
                  >
                    {pwdSaving ? "Updating..." : "Update Password"}
                  </button>

                  {pwdSaved && (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#22c55e", fontWeight: 500 }}>
                      ✓ Password updated
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
