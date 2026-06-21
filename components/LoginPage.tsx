"use client";

import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("9749897650");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Admin ID or password is incorrect.");
      return;
    }

    const data = (await response.json()) as { token: string };
    localStorage.setItem("adminToken", data.token);
    router.push("/admin/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4 text-[var(--text)]">
      <form className="login-panel" onSubmit={login}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[var(--line)]">
          <Lock size={24} />
        </div>
        <div className="text-center">
          <p className="eyebrow">Secure Admin</p>
          <h1 className="text-3xl font-black">Sandip Portfolio Dashboard</h1>
        </div>
        <label>
          Admin ID
          <input onChange={(event) => setId(event.target.value)} required value={id} />
        </label>
        <label>
          Password
          <input
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button w-full justify-center" disabled={loading}>
          <LogIn size={18} />
          {loading ? "Signing in..." : "Login"}
        </button>
        <a className="text-center text-sm font-semibold text-[var(--muted)]" href="/">
          Back to portfolio
        </a>
      </form>
    </main>
  );
}
