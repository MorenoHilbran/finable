"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LearningModule } from "@/lib/supabase/database.types";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module?: LearningModule | null;
  onSuccess: () => void;
}

export default function ModuleModal({ isOpen, onClose, module, onSuccess }: ModuleModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const isEdit = !!module;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty_level: "basic",
    content_type: "text",
    thumbnail_url: "",
    category: "",
    duration: "",
    content: "",
    is_published: false,
    order_index: 0,
  });
  
  // Reset form when module changes
  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title,
        description: module.description,
        difficulty_level: module.difficulty_level,
        content_type: module.content_type,
        thumbnail_url: module.thumbnail_url || "",
        category: module.category || "",
        duration: module.duration || "",
        content: module.content || "",
        is_published: module.is_published,
        order_index: module.order_index,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        difficulty_level: "basic",
        content_type: "text",
        thumbnail_url: "",
        category: "",
        duration: "",
        content: "",
        is_published: false,
        order_index: 0,
      });
    }
    setError("");
  }, [module, isOpen]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const url = isEdit ? `/api/modules/${module?.module_id}` : "/api/modules";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        onSuccess();
        onClose();
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || `Gagal ${isEdit ? "memperbarui" : "membuat"} modul`);
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const categories = ["Cryptocurrency", "Saham", "Emas", "Reksa Dana", "Obligasi", "Properti"];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: "var(--brand-black)" }}>
            {isEdit ? "Edit Modul" : "Tambah Modul Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} id="module-form">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                  Judul Modul *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Analisis Saham untuk Pemula"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                  Deskripsi Singkat *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Deskripsi singkat tentang modul ini..."
                />
              </div>
              
              {/* Category & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Contoh: 4 minggu"
                  />
                </div>
              </div>
              
              {/* Level & Content Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Tingkat Kesulitan *
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="basic">Pemula</option>
                    <option value="intermediate">Menengah</option>
                    <option value="advanced">Lanjutan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Tipe Konten *
                  </label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="text">Teks</option>
                    <option value="audio">Audio</option>
                    <option value="visual">Visual</option>
                    <option value="mixed">Campuran</option>
                  </select>
                </div>
              </div>
              
              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                  URL Thumbnail
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                  Konten Modul
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                  placeholder="Tulis konten modul di sini... (Mendukung Markdown)"
                />
              </div>
              
              {/* Order & Published */}
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-gray-300"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium" style={{ color: "var(--brand-black)" }}>
                    Publikasikan
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-medium border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)" }}
          >
            Batal
          </button>
          <button
            type="submit"
            form="module-form"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-sage)" }}
          >
            {isSubmitting ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Simpan Modul")}
          </button>
        </div>
      </div>
    </div>
  );
}
