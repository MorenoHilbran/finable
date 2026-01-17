"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LearningModule, MasterData, Category, DifficultyLevelData, ContentTypeData, DurationUnit } from "@/lib/supabase/database.types";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module?: LearningModule | null;
  onSuccess: () => void;
}

export default function ModuleModal({ isOpen, onClose, module, onSuccess }: ModuleModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState(true);
  const [error, setError] = useState("");
  
  // Master data state
  const [masterData, setMasterData] = useState<MasterData>({
    categories: [],
    difficultyLevels: [],
    durationUnits: [],
    contentTypes: [],
  });
  
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
    // New fields
    category_id: null as number | null,
    difficulty_level_id: null as number | null,
    content_type_id: null as number | null,
    duration_value: null as number | null,
    duration_unit_id: null as number | null,
  });
  
  // Fetch master data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMasterData();
    }
  }, [isOpen]);
  
  async function fetchMasterData() {
    setIsLoadingMasterData(true);
    try {
      const res = await fetch("/api/master-data");
      if (res.ok) {
        const data = await res.json();
        setMasterData(data);
        
        // Set default values from master data if creating new module
        if (!module && data.difficultyLevels.length > 0 && data.contentTypes.length > 0) {
          const defaultLevel = data.difficultyLevels.find((l: DifficultyLevelData) => l.code === "basic");
          const defaultType = data.contentTypes.find((t: ContentTypeData) => t.code === "text");
          
          setFormData(prev => ({
            ...prev,
            difficulty_level_id: defaultLevel?.id || data.difficultyLevels[0].id,
            content_type_id: defaultType?.id || data.contentTypes[0].id,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    } finally {
      setIsLoadingMasterData(false);
    }
  }
  
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
        category_id: module.category_id,
        difficulty_level_id: module.difficulty_level_id,
        content_type_id: module.content_type_id,
        duration_value: module.duration_value,
        duration_unit_id: module.duration_unit_id,
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
        category_id: null,
        difficulty_level_id: null,
        content_type_id: null,
        duration_value: null,
        duration_unit_id: null,
      });
    }
    setError("");
  }, [module, isOpen]);
  
  // Update legacy fields when master data IDs change
  useEffect(() => {
    if (formData.difficulty_level_id) {
      const level = masterData.difficultyLevels.find(l => l.id === formData.difficulty_level_id);
      if (level) {
        setFormData(prev => ({ ...prev, difficulty_level: level.code as "basic" | "intermediate" | "advanced" }));
      }
    }
  }, [formData.difficulty_level_id, masterData.difficultyLevels]);
  
  useEffect(() => {
    if (formData.content_type_id) {
      const type = masterData.contentTypes.find(t => t.id === formData.content_type_id);
      if (type) {
        setFormData(prev => ({ ...prev, content_type: type.code as "text" | "audio" | "visual" | "mixed" }));
      }
    }
  }, [formData.content_type_id, masterData.contentTypes]);
  
  useEffect(() => {
    if (formData.category_id) {
      const cat = masterData.categories.find(c => c.id === formData.category_id);
      if (cat) {
        setFormData(prev => ({ ...prev, category: cat.name }));
      }
    }
  }, [formData.category_id, masterData.categories]);
  
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
            <img src="/icons/icon-close.svg" alt="" className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoadingMasterData ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : (
            <>
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
                        value={formData.category_id || ""}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Pilih Kategori</option>
                        {masterData.categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                        Durasi
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          value={formData.duration_value || ""}
                          onChange={(e) => setFormData({ ...formData, duration_value: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-20 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                          placeholder="0"
                        />
                        <select
                          value={formData.duration_unit_id || ""}
                          onChange={(e) => setFormData({ ...formData, duration_unit_id: e.target.value ? parseInt(e.target.value) : null })}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Satuan</option>
                          {masterData.durationUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Level & Content Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                        Tingkat Kesulitan *
                      </label>
                      <select
                        value={formData.difficulty_level_id || ""}
                        onChange={(e) => setFormData({ ...formData, difficulty_level_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Pilih Tingkat</option>
                        {masterData.difficultyLevels.map((level) => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                        Tipe Konten *
                      </label>
                      <select
                        value={formData.content_type_id || ""}
                        onChange={(e) => setFormData({ ...formData, content_type_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Pilih Tipe</option>
                        {masterData.contentTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.icon} {type.name}
                          </option>
                        ))}
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
            </>
          )}
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
            disabled={isSubmitting || isLoadingMasterData}
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
