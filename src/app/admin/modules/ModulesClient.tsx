"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { LearningModule } from "@/lib/supabase/database.types";
import ModuleModal from "./ModuleModal";

interface ModulesClientProps {
  modules: LearningModule[];
}

type SortField = "title" | "category" | "difficulty_level" | "is_published" | "order_index";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

export default function ModulesClient({ modules }: ModulesClientProps) {
  const router = useRouter();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; module: LearningModule | null }>({
    isOpen: false,
    module: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // DataTable states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("order_index");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // Filter and sort data
  const filteredAndSortedModules = useMemo(() => {
    let filtered = modules;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = modules.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          (m.category && m.category.toLowerCase().includes(query)) ||
          (m.description && m.description.toLowerCase().includes(query))
      );
    }
    
    // Sort
    return [...filtered].sort((a, b) => {
      let aVal: string | number | boolean = "";
      let bVal: string | number | boolean = "";
      
      switch (sortField) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "category":
          aVal = (a.category || "").toLowerCase();
          bVal = (b.category || "").toLowerCase();
          break;
        case "difficulty_level":
          const levelOrder = { basic: 1, intermediate: 2, advanced: 3 };
          aVal = levelOrder[a.difficulty_level as keyof typeof levelOrder] || 0;
          bVal = levelOrder[b.difficulty_level as keyof typeof levelOrder] || 0;
          break;
        case "is_published":
          aVal = a.is_published ? 1 : 0;
          bVal = b.is_published ? 1 : 0;
          break;
        case "order_index":
          aVal = a.order_index;
          bVal = b.order_index;
          break;
      }
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [modules, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedModules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedModules = filteredAndSortedModules.slice(startIndex, startIndex + itemsPerPage);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function openCreateModal() {
    setEditingModule(null);
    setIsModalOpen(true);
  }

  function openEditModal(module: LearningModule) {
    setEditingModule(module);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingModule(null);
  }

  function openDeleteModal(module: LearningModule) {
    setDeleteModal({ isOpen: true, module });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, module: null });
  }

  async function handleDelete() {
    if (!deleteModal.module) return;
    
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/modules/${deleteModal.module.module_id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        closeDeleteModal();
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus modul");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--brand-black)" }}>
            Modul Pembelajaran
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola modul pembelajaran Finable
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--brand-sage)" }}
        >
          + Tambah Modul
        </button>
      </div>

      {/* DataTable Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <input
              type="text"
              placeholder="Cari modul..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="text-left px-6 py-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("title")}
                >
                  Modul <SortIcon field="title" />
                </th>
                <th 
                  className="text-left px-6 py-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("category")}
                >
                  Kategori <SortIcon field="category" />
                </th>
                <th 
                  className="text-left px-6 py-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("difficulty_level")}
                >
                  Level <SortIcon field="difficulty_level" />
                </th>
                <th 
                  className="text-left px-6 py-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("is_published")}
                >
                  Status <SortIcon field="is_published" />
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedModules.length > 0 ? (
                paginatedModules.map((module) => (
                  <tr key={module.module_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {module.thumbnail_url ? (
                          <img
                            src={module.thumbnail_url}
                            alt={module.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            📷
                          </div>
                        )}
                        <div>
                          <div className="font-medium" style={{ color: "var(--brand-black)" }}>
                            {module.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {module.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {module.category || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          module.difficulty_level === "basic"
                            ? "bg-green-100 text-green-700"
                            : module.difficulty_level === "intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {module.difficulty_level === "basic"
                          ? "Pemula"
                          : module.difficulty_level === "intermediate"
                          ? "Menengah"
                          : "Lanjutan"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          module.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {module.is_published ? "Dipublikasi" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(module)}
                          className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "var(--brand-blue)" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(module)}
                          className="px-3 py-2 text-sm rounded-lg hover:bg-red-50 transition-colors"
                          style={{ color: "var(--brand-red)" }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? (
                      <>Tidak ada modul yang cocok dengan pencarian.</>
                    ) : (
                      <>
                        Belum ada modul.{" "}
                        <button
                          onClick={openCreateModal}
                          className="text-blue-600 hover:underline"
                        >
                          Tambah modul pertama
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAndSortedModules.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedModules.length)} dari {filteredAndSortedModules.length} modul
              {searchQuery && ` (filter dari ${modules.length} total)`}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                      style={currentPage === page ? { backgroundColor: "var(--brand-sage)" } : {}}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        module={editingModule}
        onSuccess={() => router.refresh()}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.module && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--brand-black)" }}>
                Hapus Modul?
              </h3>
              <p className="text-gray-600 mb-6">
                Anda yakin ingin menghapus modul{" "}
                <strong>"{deleteModal.module.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl font-medium border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-red)" }}
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
