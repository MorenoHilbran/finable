"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";
import Squares from "@/components/Squares";

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
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-white"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Squares
          direction="diagonal"
          speed={0.4}
          squareSize={45}
          borderColor="rgba(33, 33, 33, 0.06)"
          hoverFillColor="rgba(80, 217, 144, 0.08)"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-2xl font-bold mb-8 group"
          style={{ color: "var(--brand-black)" }}
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">💡</span>
          <span className="bg-clip-text">FINABLE</span>
        </Link>

        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="animate-float" style={{ animationDuration: "3s" }}><img src="/mascot/owi-mascot-1.svg" alt="OWI" className="w-20 h-20" /></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm" />
          </div>
        </div>

        {/* Login Card */}
        <div className="card bg-white/95 backdrop-blur-md shadow-2xl">
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{ color: "var(--brand-black)" }}
          >
            Selamat Datang Kembali
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Masuk ke akun Anda untuk melanjutkan belajar
          </p>

          {/* Success Message */}
          {registered && (
            <div
              className="p-4 rounded-xl mb-6 text-center flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(70, 185, 131, 0.15) 0%, rgba(72, 189, 208, 0.1) 100%)",
                color: "var(--brand-green)",
                border: "1px solid rgba(70, 185, 131, 0.3)",
              }}
            >
              <span className="text-lg">✅</span>
              <span>Registrasi berhasil! Silakan masuk.</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="p-4 rounded-xl mb-6 text-center flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(176, 24, 62, 0.1) 0%, rgba(252, 106, 25, 0.05) 100%)",
                color: "var(--brand-red)",
                border: "1px solid rgba(176, 24, 62, 0.2)",
              }}
            >
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-black)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-[#50d990] focus:shadow-lg focus:shadow-[#50d990]/20"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-black)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-black)" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-[#50d990] focus:shadow-lg focus:shadow-[#50d990]/20"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-black)",
                }}
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-3 mt-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="w-5 h-5 rounded-md border-2 accent-[#50d990] cursor-pointer transition-all"
                style={{ borderColor: "var(--border)" }}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm cursor-pointer select-none"
                style={{ color: "var(--brand-black)" }}
              >
                Tetap login
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-6 hover:scale-[1.02] transition-all"
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
              className="font-semibold transition-all hover:underline"
              style={{ color: "var(--brand-sage)" }}
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link
            href="/"
            className="transition-colors text-sm inline-flex items-center gap-2 hover:gap-3"
            style={{ color: "var(--brand-sage)" }}
          >
            <span>←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
