"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Types
interface InvestmentNote {
  id: string;
  title: string;
  content: string;
  type: "insight" | "strategy" | "simulation" | "mistake" | "question";
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

type NoteType = InvestmentNote["type"];

const NOTE_TYPES: { value: NoteType; label: string; icon: string; color: string }[] = [
  { value: "insight", label: "Insight", icon: "/icons/icon-insight.svg", color: "var(--brand-yellow)" },
  { value: "strategy", label: "Strategi", icon: "/icons/icon-target.svg", color: "var(--brand-cyan)" },
  { value: "simulation", label: "Simulasi", icon: "/icons/icon-bar-chart.svg", color: "var(--brand-green)" },
  { value: "mistake", label: "Kesalahan", icon: "/icons/icon-warning.svg", color: "var(--brand-orange)" },
  { value: "question", label: "Pertanyaan", icon: "/icons/icon-question.svg", color: "var(--brand-magenta)" },
];

const STORAGE_KEY = "finable_investment_notes";

export default function CatatanPage() {
  const [notes, setNotes] = useState<InvestmentNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<InvestmentNote | null>(null);
  const [filterType, setFilterType] = useState<NoteType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "insight" as NoteType,
    tags: "",
    source: "",
  });

  // Load notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch {
        setNotes([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes: InvestmentNote[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  // Create/Update note
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t);

    if (editingNote) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? {
              ...note,
              title: formData.title,
              content: formData.content,
              type: formData.type,
              tags: tagsArray,
              source: formData.source,
              updatedAt: now,
            }
          : note
      );
      saveNotes(updatedNotes);
    } else {
      // Create new note
      const newNote: InvestmentNote = {
        id: crypto.randomUUID(),
        title: formData.title,
        content: formData.content,
        type: formData.type,
        tags: tagsArray,
        source: formData.source,
        createdAt: now,
        updatedAt: now,
      };
      saveNotes([newNote, ...notes]);
    }

    resetForm();
  };

  // Delete note
  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      saveNotes(notes.filter(note => note.id !== id));
    }
  };

  // Edit note
  const handleEdit = (note: InvestmentNote) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      type: note.type,
      tags: note.tags.join(", "),
      source: note.source,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "insight",
      tags: "",
      source: "",
    });
    setEditingNote(null);
    setShowForm(false);
  };

  // Filter and search notes
  const filteredNotes = notes.filter(note => {
    const matchesType = filterType === "all" || note.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Get type info
  const getTypeInfo = (type: NoteType) => {
    return NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[0];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/investasi"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-cyan)" }}
        >
          <span>←</span>
          <span>Kembali ke Investasi</span>
        </Link>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/dashboard" className="hover:underline" style={{ color: "var(--text-muted)" }}>
                Dashboard
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li>
              <Link href="/dashboard/investasi" className="hover:underline" style={{ color: "var(--text-muted)" }}>
                Investasi
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li className="font-medium" style={{ color: "var(--brand-dark-blue)" }}>
              Catatan
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
            📝 Catatan Pembelajaran
          </h1>
          <p className="text-gray-600">
            Catat insight, strategi, dan pembelajaran dari perjalanan investasi Anda.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex-shrink-0"
        >
          <span>+</span>
          Tambah Catatan
        </button>
      </div>

      {/* Filter & Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <img src="/icons/icon-search.svg" alt="" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "all" ? "text-white" : "hover:bg-gray-100"
              }`}
              style={{
                background: filterType === "all" ? "var(--gradient-cta)" : "transparent",
                color: filterType === "all" ? "white" : "var(--brand-dark-blue)",
              }}
            >
              Semua
            </button>
            {NOTE_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterType === type.value ? "" : "hover:bg-gray-100"
                }`}
                style={{
                  background: filterType === type.value ? `${type.color}20` : "transparent",
                  color: filterType === type.value ? type.color : "var(--brand-dark-blue)",
                  border: filterType === type.value ? `1px solid ${type.color}` : "1px solid transparent",
                }}
              >
                <span>{type.icon}</span>
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark-blue)" }}>
                  {editingNote ? "Edit Catatan" : "Tambah Catatan Baru"}
                </h2>
                <button
                  onClick={resetForm}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <img src="/icons/icon-close.svg" alt="Close" className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                    Judul *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400"
                    placeholder="Judul catatan..."
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-dark-blue)" }}>
                    Tipe Catatan *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {NOTE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
                        style={{
                          background: formData.type === type.value ? `${type.color}20` : "transparent",
                          color: formData.type === type.value ? type.color : "var(--text-muted)",
                          border: formData.type === type.value ? `2px solid ${type.color}` : "2px solid var(--border)",
                        }}
                      >
                        <span>{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                    Isi Catatan *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400 resize-none"
                    placeholder="Tuliskan catatan Anda..."
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                    Sumber (opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400"
                    placeholder="Contoh: Kelas Investasi Dasar, Buku XYZ..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                    Tags (opsional, pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400"
                    placeholder="saham, analisis teknikal, pemula..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary flex-1"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    {editingNote ? "Simpan Perubahan" : "Tambah Catatan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {isLoading ? (
        <div className="card text-center py-12">
          <img src="/icons/icon-loading.svg" alt="" className="w-12 h-12 mb-4 mx-auto animate-spin" style={{ animationDuration: "2s" }} />
          <p className="text-gray-500">Memuat catatan...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div
          className="card text-center py-12"
          style={{ background: "linear-gradient(135deg, rgba(72, 189, 208, 0.05) 0%, rgba(70, 185, 131, 0.05) 100%)" }}
        >
          <img src="/icons/icon-note.svg" alt="" className="w-16 h-16 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
            {notes.length === 0 ? "Belum Ada Catatan" : "Tidak Ada Hasil"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {notes.length === 0
              ? "Mulai catat pembelajaran investasi Anda untuk referensi di masa depan."
              : "Coba ubah filter atau kata kunci pencarian Anda."}
          </p>
          {notes.length === 0 && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              + Buat Catatan Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const typeInfo = getTypeInfo(note.type);
            return (
              <div key={note.id} className="card">
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${typeInfo.color}20` }}
                  >
                    {typeInfo.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold" style={{ color: "var(--brand-dark-blue)" }}>
                        {note.title}
                      </h3>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                        style={{ background: `${typeInfo.color}20`, color: typeInfo.color }}
                      >
                        {typeInfo.label}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">
                      {note.content}
                    </p>

                    {/* Source */}
                    {note.source && (
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <img src="/icons/learn.svg" alt="" className="w-3 h-3" /> Sumber: {note.source}
                      </p>
                    )}

                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                        {note.createdAt !== note.updatedAt && " (diedit)"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                          style={{ color: "var(--brand-cyan)" }}
                        >
                          <img src="/icons/icon-edit.svg" alt="" className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                          style={{ color: "var(--brand-red)" }}
                        >
                          <img src="/icons/icon-trash.svg" alt="" className="w-4 h-4" /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      <div
        className="mt-8 p-6 rounded-xl"
        style={{
          background: "rgba(242, 178, 12, 0.05)",
          border: "1px solid rgba(242, 178, 12, 0.2)",
        }}
      >
        <div className="flex items-start gap-4">
          <img src="/icons/icon-insight.svg" alt="" className="w-8 h-8" />
          <div>
            <h4 className="font-semibold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
              Tips Membuat Catatan Efektif
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Catat <strong>insight</strong> baru segera setelah Anda mempelajarinya</li>
              <li>• Gunakan tipe <strong>kesalahan</strong> untuk belajar dari simulasi yang gagal</li>
              <li>• Tambahkan <strong>tags</strong> untuk memudahkan pencarian di kemudian hari</li>
              <li>• Catat <strong>sumber</strong> pembelajaran untuk referensi lebih lanjut</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
