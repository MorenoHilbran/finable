"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "../actions";

const disabilityOptions = [
  { value: "", label: "Pilih tipe disabilitas (opsional)" },
  { value: "tunanetra", label: "👁️ Tunanetra" },
  { value: "tunarungu", label: "👂 Tunarungu" },
  { value: "disabilitas_daksa", label: "🦾 Disabilitas Daksa" },
  { value: "disabilitas_kognitif", label: "🧠 Disabilitas Kognitif" },
];

const accessibilityOptions = [
  { value: "high_contrast", label: "🎨 High Contrast Mode" },
  { value: "screen_reader", label: "🔊 Screen Reader" },
  { value: "dyslexic_friendly", label: "📖 Dyslexic Friendly" },
  { value: "audio_learning", label: "🎧 Audio Learning" },
  { value: "sign_language", label: "🤟 Sign Language" },
  { value: "reduced_motion", label: "🚫 Reduced Motion" },
];

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);

  function toggleAccessibility(value: string) {
    setSelectedAccessibility((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    // Validate password match
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    // Add accessibility profiles to form data
    selectedAccessibility.forEach((value) => {
      formData.append("accessibilityProfile", value);
    });

    const result = await signup(formData);

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

        {/* Register Card */}
        <div className="card max-h-[80vh] overflow-y-auto">
          <h1
            className="text-2xl font-bold text-center mb-2"
            style={{ color: "var(--brand-dark-blue)" }}
          >
            Buat Akun Baru
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Mulai perjalanan literasi investasi Anda
          </p>

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
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Nama Lengkap
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-dark-blue)",
                }}
              />
            </div>

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

            {/* Disability Type */}
            <div>
              <label
                htmlFor="disabilityType"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Tipe Disabilitas
              </label>
              <select
                id="disabilityType"
                name="disabilityType"
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none bg-white"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-dark-blue)",
                }}
              >
                {disabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility Profile */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Preferensi Aksesibilitas (opsional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {accessibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleAccessibility(option.value)}
                    className="p-3 rounded-xl border-2 text-left text-sm transition-all"
                    style={{
                      borderColor: selectedAccessibility.includes(option.value)
                        ? "var(--brand-cyan)"
                        : "var(--border)",
                      background: selectedAccessibility.includes(option.value)
                        ? "rgba(72, 189, 208, 0.1)"
                        : "white",
                      color: "var(--brand-dark-blue)",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
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
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-dark-blue)",
                }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Ulangi password"
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
                  <span>✨</span>
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "var(--brand-cyan)" }}
            >
              Masuk di sini
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
