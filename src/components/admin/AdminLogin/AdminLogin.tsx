"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // The password box stays read-only until you click it, so Chrome does not open its saved-passwords list there
  const [pwLocked, setPwLocked] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        // Full page load so the new cookie is read from scratch (no manual refresh needed)
        window.location.assign(data?.role === "employee" ? "/employee" : "/admin");
        return; // keep the button disabled while the page is changing
      }

      setError(data?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Could not reach the server. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Image src="/logo.png" alt="Logo" width={64} height={64} priority />
        </div>
        <h1 className="login-title">Bahrawy Planet</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-field">
            <span>ID</span>
            <div className="login-input-wrap">
              <User size={18} />
              <input
                type="text"
                name="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ID"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-input-wrap">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                readOnly={pwLocked}
                onFocus={() => setTimeout(() => setPwLocked(false), 100)}
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Show or hide password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}