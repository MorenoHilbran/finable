"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-8"
        >
          <span className="text-3xl">💡</span>
          <span>FINABLE</span>
        </Link>

        {/* Login Card */}
        <div className="card">
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{ color: "var(--brand-dark-blue)" }}
          >
            Selamat Datang Kembali
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Masuk ke akun Anda untuk melanjutkan belajar
          </p>

          {/* Success Message */}
          {registered && (
            <div
              className="p-4 rounded-xl mb-6 text-center"
              style={{
                background: "rgba(70, 185, 131, 0.1)",
                color: "var(--brand-green)",
              }}
            >
              <span className="text-lg mr-2">✅</span>
              Registrasi berhasil! Silakan masuk dengan akun Anda.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="p-4 rounded-xl mb-6 text-center"
              style={{
                background: "rgba(176, 24, 62, 0.1)",
                color: "var(--brand-red)",
              }}
            >
              <span className="text-lg mr-2">⚠️</span>
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-dark-blue)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-dark-blue)",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-6"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Memproses...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "var(--brand-cyan)" }}
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
