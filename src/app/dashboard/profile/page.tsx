"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateProfile } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/supabase/database.types";

const disabilityOptions = [
  { value: "", label: "Tidak ada / Tidak ingin menyebutkan" },
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

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        
        if (data) {
          setProfile(data);
          setSelectedAccessibility(data.accessibility_profile || []);
        } else {
          // No profile yet, set defaults from auth metadata
          setProfile({
            user_id: 0,
            auth_id: user.id,
            full_name: user.user_metadata?.full_name || "",
            email: user.email || "",
            disability_type: null,
            accessibility_profile: null,
            created_at: new Date().toISOString(),
          });
        }
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  function toggleAccessibility(value: string) {
    setSelectedAccessibility((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setMessage(null);

    // Add accessibility profiles to form data
    selectedAccessibility.forEach((value) => {
      formData.append("accessibilityProfile", value);
    });

    const result = await updateProfile(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
    }
    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Back Button - Top Left */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-cyan)" }}
        >
          <span>←</span>
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Breadcrumb - Top Right */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/dashboard"
                className="transition-colors hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                Dashboard
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li
              className="font-medium"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              Edit Profil
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: "var(--brand-dark-blue)" }}
        >
          👤 Edit Profil
        </h1>
        <p className="text-gray-600">
          Perbarui informasi profil dan preferensi aksesibilitas Anda.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className="p-4 rounded-xl mb-6"
          style={{
            background: message.type === "success" 
              ? "rgba(70, 185, 131, 0.1)" 
              : "rgba(176, 24, 62, 0.1)",
            color: message.type === "success" 
              ? "var(--brand-green)" 
              : "var(--brand-red)",
          }}
        >
          <span className="text-lg mr-2">
            {message.type === "success" ? "✅" : "⚠️"}
          </span>
          {message.text}
        </div>
      )}

      {/* Profile Form */}
      <div className="card">
        <form action={handleSubmit} className="space-y-6">
          {/* Email (readonly) */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border-2 bg-gray-100 cursor-not-allowed"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Email tidak dapat diubah
            </p>
          </div>

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
              defaultValue={profile?.full_name || ""}
              placeholder="Masukkan nama lengkap"
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
              defaultValue={profile?.disability_type || ""}
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
              Preferensi Aksesibilitas
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Pilih fitur aksesibilitas yang Anda butuhkan
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard"
              className="btn btn-secondary flex-1"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary flex-1"
              style={{ opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
