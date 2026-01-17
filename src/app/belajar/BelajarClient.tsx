"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { LearningModule } from "@/lib/supabase/database.types";

interface BelajarClientProps {
  modules: LearningModule[];
}

export default function BelajarClient({ modules }: BelajarClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Get unique categories from modules
  const categories = [...new Set(modules.map(m => m.category).filter(Boolean))];
  const levels = [
    { value: "basic", label: "Pemula" },
    { value: "intermediate", label: "Menengah" },
    { value: "advanced", label: "Lanjutan" },
  ];

  // Toggle filter functions
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  // Filter modules
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      searchQuery === "" ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (module.category && module.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategories.length === 0 ||
      (module.category && selectedCategories.includes(module.category));

    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(module.difficulty_level);

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelLabel = (level: string) => {
    const found = levels.find(l => l.value === level);
    return found ? found.label : level;
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section
          className="py-16 text-white text-center"
          style={{ backgroundColor: "var(--brand-black)" }}
        >
          <div className="container px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4"
            style={{color: "var(--brand-sage)"}}>
              Modul Pembelajaran Investasi
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Tingkatkan literasi investasi Anda dengan modul pembelajaran yang
              terstruktur, mudah dipahami, dan inklusif untuk semua.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul atau kategori modul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-5 pr-14 rounded-2xl bg-white text-gray-900 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-200 shadow-lg border-2 border-transparent focus:border-cyan-300"
                  aria-label="Cari modul pembelajaran"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--brand-sage)", color: "white" }}
                  aria-label="Cari"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gray-50">
          <div className="container px-6">
            <div className="flex gap-8">
              {/* Left Sidebar - Filter */}
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 space-y-6">
                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3
                        className="font-bold text-lg mb-4"
                        style={{ color: "var(--brand-black)" }}
                      >
                        Kategori
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category!)}
                              onChange={() => toggleCategory(category!)}
                              className="w-5 h-5 rounded border-2 border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Level Filter */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3
                      className="font-bold text-lg mb-4"
                      style={{ color: "var(--brand-black)" }}
                    >
                      Tingkat Kesulitan
                    </h3>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <label
                          key={level.value}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level.value)}
                            onChange={() => toggleLevel(level.value)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                          />
                          <span className="text-sm text-gray-700">{level.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategories.length > 0 || selectedLevels.length > 0) && (
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedLevels([]);
                      }}
                      className="w-full px-4 py-3 rounded-xl font-medium border-2 transition-colors"
                      style={{
                        borderColor: "var(--brand-black)",
                        color: "var(--brand-black)",
                      }}
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </aside>

              {/* Right Content - Course Grid */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--brand-black)" }}
                    >
                      Semua Kelas
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {filteredModules.length} modul ditemukan
                    </p>
                  </div>
                </div>

                {/* Course Grid */}
                {filteredModules.length > 0 ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    {filteredModules.map((module) => (
                      <Link 
                        key={module.module_id} 
                        href={`/belajar/${module.module_id}`}
                        className="block group"
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            {module.thumbnail_url ? (
                              <img
                                src={module.thumbnail_url}
                                alt={module.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <img src="/icons/learn.svg" alt="" className="w-12 h-12 opacity-50" />
                              </div>
                            )}
                            {module.category && (
                              <div 
                                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: "var(--brand-blue)" }}
                              >
                                {module.category}
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="p-6">
                            <h3 
                              className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors"
                              style={{ color: "var(--brand-black)" }}
                            >
                              {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {module.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                module.difficulty_level === "basic"
                                  ? "bg-green-100 text-green-700"
                                  : module.difficulty_level === "intermediate"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {getLevelLabel(module.difficulty_level)}
                              </span>
                              {module.duration && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <img src="/icons/icon-clock.svg" alt="" className="w-3 h-3" /> {module.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <img src="/icons/icon-search.svg" alt="" className="w-16 h-16 mb-4 mx-auto opacity-50" />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--brand-black)" }}
                    >
                      Tidak ada modul ditemukan
                    </h3>
                    <p className="text-gray-600">
                      {modules.length === 0 
                        ? "Belum ada modul yang dipublikasikan"
                        : "Coba ubah filter atau kata kunci pencarian Anda"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
