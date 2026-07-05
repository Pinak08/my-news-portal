"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-brand-navy mb-1 font-serif">
          TV10 Gujarat Admin
        </h1>
        <p className="text-sm text-gray-500 mb-6">પાસવર્ડ દાખલ કરો / Enter password</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue mb-3"
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue text-white py-2 rounded font-semibold hover:bg-brand-navy transition-colors disabled:opacity-60"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}
