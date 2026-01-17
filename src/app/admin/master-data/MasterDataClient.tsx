"use client";

import { useState, useEffect } from "react";
import type { Category, DifficultyLevelData, DurationUnit, ContentTypeData } from "@/lib/supabase/database.types";

type TabType = "categories" | "difficulty_levels" | "duration_units" | "content_types";

interface MasterDataItem {
  id: number;
  name: string;
  code?: string;
  description?: string | null;
  icon?: string | null;
  color_class?: string | null;
  order_index: number;
  is_active: boolean;
}

export default function MasterDataClient() {
  const [activeTab, setActiveTab] = useState<TabType>("categories");
  const [data, setData] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "categories", label: "Kategori", icon: "📁" },
    { key: "difficulty_levels", label: "Tingkat Kesulitan", icon: "📊" },
    { key: "duration_units", label: "Satuan Durasi", icon: "⏱️" },
    { key: "content_types", label: "Tipe Konten", icon: "📝" },
  ];

  const apiEndpoints: Record<TabType, string> = {
    categories: "/api/master-data/categories",
    difficulty_levels: "/api/master-data/difficulty-levels",
    duration_units: "/api/master-data/duration-units",
    content_types: "/api/master-data/content-types",
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoints[activeTab]);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: Partial<MasterDataItem>) {
    setIsSubmitting(true);
    setError("");

    try {
      const endpoint = editingItem
        ? `${apiEndpoints[activeTab]}/${editingItem.id}`
        : apiEndpoints[activeTab];
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
      } else {
        const result = await res.json();
        setError(result.error || "Gagal menyimpan data");
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;

    try {
      const res = await fetch(`${apiEndpoints[activeTab]}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      } else {
        const result = await res.json();
        alert(result.error || "Gagal menghapus data");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(item: MasterDataItem) {
    setEditingItem(item);
    setError("");
    setIsModalOpen(true);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--brand-black)" }}>
            Master Data
          </h1>
          <p className="text-gray-600 mt-1">Kelola data referensi untuk modul pembelajaran</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:scale-105 shadow-lg"
          style={{ backgroundColor: "var(--brand-sage)" }}
        >
          + Tambah Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            style={activeTab === tab.key ? { backgroundColor: "var(--brand-sage)" } : {}}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">Belum ada data. Klik "Tambah Data" untuk menambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    {activeTab === "categories" ? "Nama" : "Kode"}
                  </th>
                  {activeTab !== "categories" && (
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Nama</th>
                  )}
                  {(activeTab === "categories" || activeTab === "content_types") && (
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Icon</th>
                  )}
                  {activeTab === "difficulty_levels" && (
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Warna</th>
                  )}
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Urutan</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium" style={{ color: "var(--brand-black)" }}>
                        {activeTab === "categories" ? item.name : item.code}
                      </span>
                    </td>
                    {activeTab !== "categories" && (
                      <td className="px-6 py-4 text-gray-600">{item.name}</td>
                    )}
                    {(activeTab === "categories" || activeTab === "content_types") && (
                      <td className="px-6 py-4 text-2xl">{item.icon || "-"}</td>
                    )}
                    {activeTab === "difficulty_levels" && (
                      <td className="px-6 py-4">
                        {item.color_class ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.color_class}`}>
                            Preview
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 text-center text-gray-600">{item.order_index}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MasterDataModal
          activeTab={activeTab}
          editingItem={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </div>
  );
}

// Modal Component
function MasterDataModal({
  activeTab,
  editingItem,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  activeTab: TabType;
  editingItem: MasterDataItem | null;
  onClose: () => void;
  onSubmit: (data: Partial<MasterDataItem>) => void;
  isSubmitting: boolean;
  error: string;
}) {
  const [formData, setFormData] = useState<Partial<MasterDataItem>>({
    name: editingItem?.name || "",
    code: editingItem?.code || "",
    description: editingItem?.description || "",
    icon: editingItem?.icon || "",
    color_class: editingItem?.color_class || "",
    order_index: editingItem?.order_index || 0,
    is_active: editingItem?.is_active ?? true,
  });

  const isEdit = !!editingItem;
  const showCode = activeTab !== "categories";
  const showDescription = activeTab === "categories";
  const showIcon = activeTab === "categories" || activeTab === "content_types";
  const showColorClass = activeTab === "difficulty_levels";

  const tabLabels: Record<TabType, string> = {
    categories: "Kategori",
    difficulty_levels: "Tingkat Kesulitan",
    duration_units: "Satuan Durasi",
    content_types: "Tipe Konten",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: "var(--brand-black)" }}>
            {isEdit ? "Edit" : "Tambah"} {tabLabels[activeTab]}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {showCode && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                Kode *
              </label>
              <input
                type="text"
                required
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="Contoh: basic"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
              Nama *
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              placeholder="Contoh: Cryptocurrency"
            />
          </div>

          {showDescription && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                Deskripsi
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Deskripsi singkat..."
              />
            </div>
          )}

          {showIcon && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="📁"
              />
            </div>
          )}

          {showColorClass && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                CSS Class Warna
              </label>
              <input
                type="text"
                value={formData.color_class || ""}
                onChange={(e) => setFormData({ ...formData, color_class: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="bg-green-100 text-green-700"
              />
              {formData.color_class && (
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.color_class}`}>
                    Preview
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-black)" }}>
                Urutan
              </label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-gray-300"
              />
              <label htmlFor="is_active" className="text-sm font-medium" style={{ color: "var(--brand-black)" }}>
                Aktif
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-4">
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
  );
}
