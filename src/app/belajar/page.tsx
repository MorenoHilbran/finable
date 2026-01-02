"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LearningModuleCard from "@/components/LearningModuleCard";
import Link from "next/link";

export default function BelajarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [showMyClasses, setShowMyClasses] = useState(false);

  // All learning modules
  const allModules = [
    {
      id: 1,
      category: "Cryptocurrency",
      title: "Bitcoin & Blockchain Fundamentals",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-red-orange)",
      level: "Pemula",
      duration: "4 minggu",
      enrolled: true,
    },
    {
      id: 2,
      category: "Saham",
      title: "Analisis Saham Indonesia untuk Pemula",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-blue-blue)",
      level: "Pemula",
      duration: "6 minggu",
      enrolled: true,
    },
    {
      id: 3,
      category: "Emas",
      title: "Investasi Emas & Logam Mulia",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-green)",
      level: "Menengah",
      duration: "3 minggu",
      enrolled: false,
    },
    {
      id: 4,
      category: "Reksa Dana",
      title: "Strategi Reksa Dana Jangka Panjang",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-pink-magenta)",
      level: "Menengah",
      duration: "5 minggu",
      enrolled: false,
    },
    {
      id: 5,
      category: "Obligasi",
      title: "Obligasi & Surat Utang Negara",
      image: "https://images.unsplash.com/photo-1554224311-beee460ae6fb?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-cta)",
      level: "Lanjutan",
      duration: "4 minggu",
      enrolled: false,
    },
    {
      id: 6,
      category: "Properti",
      title: "Real Estate Investment Trust (REIT)",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-green)",
      level: "Lanjutan",
      duration: "6 minggu",
      enrolled: true,
    },
    {
      id: 7,
      category: "Saham",
      title: "Analisis Teknikal Trading Saham",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-blue-blue)",
      level: "Lanjutan",
      duration: "8 minggu",
      enrolled: false,
    },
    {
      id: 8,
      category: "Cryptocurrency",
      title: "DeFi & NFT Investment Guide",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop",
      accentColor: "var(--gradient-red-orange)",
      level: "Lanjutan",
      duration: "5 minggu",
      enrolled: false,
    },
  ];

  // Filter categories and levels
  const categories = ["Cryptocurrency", "Saham", "Emas", "Reksa Dana", "Obligasi", "Properti"];
  const levels = ["Pemula", "Menengah", "Lanjutan"];

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
  const filteredModules = allModules.filter((module) => {
    const matchesSearch =
      searchQuery === "" ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(module.category);

    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(module.level);

    const matchesEnrolled = !showMyClasses || module.enrolled;

    return matchesSearch && matchesCategory && matchesLevel && matchesEnrolled;
  });

  const myClassesCount = allModules.filter((m) => m.enrolled).length;

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section
          className="py-16 text-white text-center"
          style={{ background: "var(--brand-dark-blue)" }}
        >
          <div className="container px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
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
                  style={{ background: "var(--brand-cyan)", color: "white" }}
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
                  {/* My Classes Toggle */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3
                      className="font-bold text-lg mb-4"
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      Kelas Saya
                    </h3>
                    <button
                      onClick={() => setShowMyClasses(!showMyClasses)}
                      className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
                        showMyClasses
                          ? "text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={{
                        background: showMyClasses
                          ? "var(--brand-cyan)"
                          : undefined,
                        color: showMyClasses ? "white" : "var(--brand-dark-blue)",
                      }}
                    >
                      Kelas Diambil ({myClassesCount})
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3
                      className="font-bold text-lg mb-4"
                      style={{ color: "var(--brand-dark-blue)" }}
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
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3
                      className="font-bold text-lg mb-4"
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      Tingkat Kesulitan
                    </h3>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                          />
                          <span className="text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategories.length > 0 ||
                    selectedLevels.length > 0 ||
                    showMyClasses) && (
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedLevels([]);
                        setShowMyClasses(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl font-medium border-2 transition-colors"
                      style={{
                        borderColor: "var(--brand-dark-blue)",
                        color: "var(--brand-dark-blue)",
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
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      {showMyClasses ? "Kelas yang Diambil" : "Semua Kelas"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {filteredModules.length} modul ditemukan
                    </p>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button className="lg:hidden px-4 py-2 rounded-xl bg-white shadow-sm border-2 border-gray-200 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Filter</span>
                  </button>
                </div>

                {/* Course Grid */}
                {filteredModules.length > 0 ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    {filteredModules.map((module) => (
                      <div key={module.id} className="relative">
                        {module.enrolled && (
                          <div
                            className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ background: "var(--brand-green)" }}
                          >
                            ✓ Terdaftar
                          </div>
                        )}
                        <LearningModuleCard
                          category={module.category}
                          title={module.title}
                          image={module.image}
                          accentColor={module.accentColor}
                          level={module.level}
                          duration={module.duration}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      Tidak ada modul ditemukan
                    </h3>
                    <p className="text-gray-600">
                      Coba ubah filter atau kata kunci pencarian Anda
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
