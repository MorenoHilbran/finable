"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EnrollButtonProps {
  moduleId: number;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}

export default function EnrollButton({ moduleId, isEnrolled, isLoggedIn }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_id: moduleId }),
      });

      if (res.ok) {
        setEnrolled(true);
        // Redirect to learning page
        router.push(`/dashboard/belajar/${moduleId}`);
      } else {
        console.error("Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push(`/dashboard/belajar/${moduleId}`);
  };

  if (enrolled) {
    return (
      <button
        onClick={handleContinue}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all hover:opacity-90"
        style={{ 
          backgroundColor: "var(--brand-blue)",
          boxShadow: "0 4px 14px rgba(78, 153, 204, 0.4)"
        }}
      >
        Lanjutkan Belajar →
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-70"
      style={{ 
        backgroundColor: loading ? "#9CA3AF" : "var(--brand-sage)",
        boxShadow: loading ? "none" : "0 4px 14px rgba(80, 217, 144, 0.4)"
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <img src="/icons/icon-loading.svg" alt="" className="w-5 h-5 animate-spin" />
          Memproses...
        </span>
      ) : isLoggedIn ? (
        <><img src="/icons/icon-rocket.svg" alt="" className="w-5 h-5 inline mr-2" /> Ambil Kelas Gratis</>
      ) : (
        <><img src="/icons/icon-lock.svg" alt="" className="w-5 h-5 inline mr-2" /> Login untuk Mengambil Kelas</>
      )}
    </button>
  );
}
