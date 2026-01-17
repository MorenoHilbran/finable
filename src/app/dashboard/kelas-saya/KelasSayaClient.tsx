"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Enrollment {
  id: number;
  module_id: number;
  enrolled_at: string;
  last_accessed_at: string;
  learning_modules: {
    module_id: number;
    title: string;
    description: string;
    thumbnail_url: string | null;
    difficulty_level: string;
    duration: string | null;
    category: string | null;
  };
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export default function KelasSayaClient() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("/api/enrollments");
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "basic": return "Pemula";
      case "intermediate": return "Menengah";
      case "advanced": return "Lanjutan";
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "basic": return { bg: "rgba(80, 217, 144, 0.1)", color: "var(--brand-sage)" };
      case "intermediate": return { bg: "rgba(78, 153, 204, 0.1)", color: "var(--brand-blue)" };
      case "advanced": return { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444" };
      default: return { bg: "rgba(107, 114, 128, 0.1)", color: "#6B7280" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <img src="/icons/icon-loading.svg" alt="" className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-sage)" }}
        >
          <span>←</span>
          <span>Kembali ke Dashboard</span>
        </Link>

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
            <li className="font-medium" style={{ color: "var(--brand-black)" }}>
              Kelas Saya
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
          Kelas Saya
        </h1>
        <p className="text-gray-600">
          Akses modul pembelajaran investasi yang telah Anda ambil.
        </p>
      </div>

      {enrollments.length > 0 ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-sm text-gray-500">Total Kelas</p>
              <p className="text-2xl font-bold" style={{ color: "var(--brand-black)" }}>
                {enrollments.length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Sedang Dipelajari</p>
              <p className="text-2xl font-bold" style={{ color: "var(--brand-sage)" }}>
                {enrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100).length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Selesai</p>
              <p className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
                {enrollments.filter(e => e.progress_percentage === 100).length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Belum Dimulai</p>
              <p className="text-2xl font-bold text-gray-400">
                {enrollments.filter(e => e.progress_percentage === 0).length}
              </p>
            </div>
          </div>

          {/* Enrolled Classes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const levelStyle = getLevelColor(enrollment.learning_modules.difficulty_level);
              
              return (
                <div key={enrollment.id} className="card group hover:shadow-xl">
                  {/* Thumbnail */}
                  <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                    {enrollment.learning_modules.thumbnail_url ? (
                      <img
                        src={enrollment.learning_modules.thumbnail_url}
                        alt={enrollment.learning_modules.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <img src="/icons/learn.svg" alt="" className="w-12 h-12" />
                      </div>
                    )}
                    {enrollment.learning_modules.category && (
                      <div 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: "var(--brand-blue)" }}
                      >
                        {enrollment.learning_modules.category}
                      </div>
                    )}
                    {enrollment.progress_percentage === 100 && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 
                    className="font-bold text-lg mb-2 line-clamp-2"
                    style={{ color: "var(--brand-black)" }}
                  >
                    {enrollment.learning_modules.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {enrollment.learning_modules.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span 
                        className="font-medium"
                        style={{ color: "var(--brand-sage)" }}
                      >
                        {enrollment.progress_percentage}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${enrollment.progress_percentage}%`,
                          backgroundColor: "var(--brand-sage)"
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {enrollment.completed_lessons}/{enrollment.total_lessons} materi selesai
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: levelStyle.bg, color: levelStyle.color }}
                    >
                      {getLevelLabel(enrollment.learning_modules.difficulty_level)}
                    </span>
                    {enrollment.learning_modules.duration && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <img src="/icons/icon-clock.svg" alt="" className="w-3 h-3" /> {enrollment.learning_modules.duration}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/dashboard/belajar/${enrollment.module_id}`}
                    className="block w-full text-center py-3 rounded-xl font-medium transition-all"
                    style={{ 
                      backgroundColor: enrollment.progress_percentage === 100 
                        ? "var(--brand-blue)" 
                        : "var(--brand-sage)",
                      color: "white",
                      boxShadow: `0 4px 14px ${enrollment.progress_percentage === 100 
                        ? "rgba(78, 153, 204, 0.3)" 
                        : "rgba(80, 217, 144, 0.3)"}`
                    }}
                  >
                    {enrollment.progress_percentage === 0 
                      ? "Mulai Belajar" 
                      : enrollment.progress_percentage === 100 
                        ? "Lihat Kembali" 
                        : "Lanjutkan Belajar"}
                  </Link>

                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Terakhir diakses: {formatDate(enrollment.last_accessed_at)}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Empty State */}
          <div
            className="card text-center py-16"
            style={{ background: "linear-gradient(135deg, rgba(78, 153, 204, 0.05) 0%, rgba(80, 217, 144, 0.05) 100%)" }}
          >
            <img src="/icons/learn.svg" alt="" className="w-16 h-16 mx-auto mb-4" />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              Belum Ada Kelas
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Anda belum mengambil kelas apapun. Jelajahi modul pembelajaran yang tersedia dan mulai perjalanan investasi Anda.
            </p>
            <Link
              href="/belajar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ 
                backgroundColor: "var(--brand-sage)",
                boxShadow: "0 4px 14px rgba(80, 217, 144, 0.3)"
              }}
            >
              Jelajahi Kelas
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
