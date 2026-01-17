"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ModuleLesson, ModuleLessonWithChildren } from "@/lib/supabase/database.types";

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />,
});

interface LessonsClientProps {
  moduleId: string;
  moduleTitle: string;
}

export default function LessonsClient({ moduleId, moduleTitle }: LessonsClientProps) {
  const [lessons, setLessons] = useState<ModuleLesson[]>([]);
  const [tree, setTree] = useState<ModuleLessonWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ModuleLesson | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_published: true,
  });

  useEffect(() => {
    fetchLessons();
  }, [moduleId]);

  async function fetchLessons() {
    setLoading(true);
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
        setTree(data.tree || []);
      }
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal(parentId: number | null = null) {
    setEditingLesson(null);
    setSelectedParentId(parentId);
    setFormData({ title: "", content: "", is_published: true });
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(lesson: ModuleLesson) {
    setEditingLesson(lesson);
    setSelectedParentId(lesson.parent_id);
    setFormData({
      title: lesson.title,
      content: lesson.content || "",
      is_published: lesson.is_published,
    });
    setError("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const endpoint = editingLesson
        ? `/api/modules/${moduleId}/lessons/${editingLesson.id}`
        : `/api/modules/${moduleId}/lessons`;
      const method = editingLesson ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parent_id: selectedParentId,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLessons();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan");
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(lessonId: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus materi ini?")) return;

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchLessons();
      } else {
        alert("Gagal menghapus materi");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    }
  }

  // Render lesson tree recursively (max 2 levels)
  function renderLessonTree(items: ModuleLessonWithChildren[], level = 0) {
    return items.map((lesson, index) => (
      <div key={lesson.id} className={`${level > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}>
        <div className="bg-white rounded-xl p-4 shadow-sm mb-3 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono text-sm">
                  {level > 0 ? `↳` : `${index + 1}.`}
                </span>
                <h3 className="font-semibold" style={{ color: "var(--brand-black)" }}>
                  {lesson.title}
                </h3>
                {!lesson.is_published && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Draft
                  </span>
                )}
                {level > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                    Sub-materi
                  </span>
                )}
              </div>
              {lesson.content && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 ml-7">
                  {lesson.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Only show "+ Sub" button for parent lessons (level 0) */}
              {level === 0 && (
                <button
                  onClick={() => openAddModal(lesson.id)}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  + Sub
                </button>
              )}
              <button
                onClick={() => openEditModal(lesson)}
                className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
        {lesson.children && lesson.children.length > 0 && (
          <div className="mt-2">
            {renderLessonTree(lesson.children, level + 1)}
          </div>
        )}
      </div>
    ));
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/modules"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Kembali ke Daftar Modul
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: "var(--brand-black)" }}>
          Materi Modul
        </h1>
        <p className="text-gray-600 mt-1">{moduleTitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          {lessons.length} materi
        </div>
        <button
          onClick={() => openAddModal(null)}
          className="px-5 py-2 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:scale-105 shadow-lg"
          style={{ backgroundColor: "var(--brand-sage)" }}
        >
          + Tambah Materi
        </button>
      </div>

      {/* Lessons List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tree.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">📖</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--brand-black)" }}>
            Belum Ada Materi
          </h3>
          <p className="text-gray-500 mb-6">Mulai tambahkan materi untuk modul ini</p>
          <button
            onClick={() => openAddModal(null)}
            className="px-5 py-2 rounded-xl text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand-sage)" }}
          >
            + Tambah Materi Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {renderLessonTree(tree)}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold" style={{ color: "var(--brand-black)" }}>
                {editingLesson ? "Edit Materi" : "Tambah Materi"}
                {selectedParentId && !editingLesson && " (Sub-materi)"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Judul Materi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Contoh: Pengenalan Cryptocurrency"
                  />
                </div>

                {/* Content - Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Konten Materi
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                    placeholder="Tulis konten materi di sini..."
                  />
                </div>

                {/* Published Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium" style={{ color: "var(--brand-black)" }}>
                    Publikasikan materi ini
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl font-medium border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-sage)" }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
