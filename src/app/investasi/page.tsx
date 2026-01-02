"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Investment categories
const investmentCategories = [
  {
    id: "gold",
    name: "Emas",
    icon: "🏆",
    color: "#FFD700",
    unit: "gram",
    description: "Logam mulia sebagai aset safe haven",
    currentPrice: 1050000, // per gram dalam IDR
    priceChange: 2.5,
  },
  {
    id: "stock",
    name: "Saham",
    icon: "📈",
    color: "#3B82F6",
    unit: "lot",
    description: "Kepemilikan bagian dari perusahaan",
    currentPrice: 4500, // per saham dalam IDR
    priceChange: 1.8,
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: "₿",
    color: "#F7931A",
    unit: "koin",
    description: "Aset digital terdesentralisasi",
    currentPrice: 650000000, // Bitcoin in IDR
    priceChange: -0.5,
  },
  {
    id: "mutual-fund",
    name: "Reksa Dana",
    icon: "💼",
    color: "#10B981",
    unit: "unit",
    description: "Investasi kolektif yang dikelola profesional",
    currentPrice: 1500, // per unit
    priceChange: 1.2,
  },
];

export default function SimulasiPage() {
  const [selectedCategory, setSelectedCategory] = useState(investmentCategories[0]);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("12");
  const [riskProfile, setRiskProfile] = useState("moderate");
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [totalInvested, setTotalInvested] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [units, setUnits] = useState(0);

  // Simulate investment calculation
  const calculateSimulation = () => {
    const amount = parseFloat(investmentAmount);
    const months = parseInt(investmentPeriod);

    if (!amount || amount <= 0 || !months) {
      alert("Mohon isi semua field dengan benar");
      return;
    }

    // Calculate units purchased
    const purchasedUnits = amount / selectedCategory.currentPrice;
    setUnits(purchasedUnits);
    setTotalInvested(amount);

    // Risk-adjusted return rates (annual %)
    const returnRates: Record<string, number> = {
      conservative: 0.06,
      moderate: 0.12,
      aggressive: 0.20,
    };

    const annualReturn = returnRates[riskProfile];
    const monthlyReturn = annualReturn / 12;

    // Generate projection data
    const data = [];
    let currentValue = amount;

    for (let i = 0; i <= months; i++) {
      // Add volatility based on risk profile
      const volatility = riskProfile === "aggressive" ? 0.15 : riskProfile === "moderate" ? 0.08 : 0.03;
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;

      if (i > 0) {
        currentValue = currentValue * (1 + monthlyReturn) * randomFactor;
      }

      data.push({
        month: i,
        value: Math.round(currentValue),
        invested: amount,
        profit: Math.round(currentValue - amount),
      });
    }

    setSimulationData(data);
    setEstimatedReturn(data[data.length - 1].value);
    setShowResults(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const resetSimulation = () => {
    setInvestmentAmount("");
    setInvestmentPeriod("12");
    setRiskProfile("moderate");
    setShowResults(false);
    setSimulationData([]);
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section
          className="py-16 text-white"
          style={{ background: "var(--brand-dark-blue)" }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simulasi Investasi Real-Time
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Pelajari potensi keuntungan investasi Anda dengan simulator berbasis
                harga pasar real-time
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              {/* Investment Categories */}
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: "var(--brand-dark-blue)" }}
                >
                  Pilih Jenis Investasi
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {investmentCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowResults(false);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                        selectedCategory.id === category.id
                          ? "border-cyan-500 bg-cyan-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-4xl">{category.icon}</span>
                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded ${
                            category.priceChange >= 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.priceChange >= 0 ? "+" : ""}
                          {category.priceChange}%
                        </span>
                      </div>
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: "var(--brand-dark-blue)" }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
                      <div className="text-sm">
                        <span className="text-gray-500">Harga saat ini:</span>
                        <div className="font-bold text-lg mt-1" style={{ color: category.color }}>
                          {formatCurrency(category.currentPrice)}
                          <span className="text-xs text-gray-500 ml-1">
                            /{category.unit}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: "var(--brand-dark-blue)" }}
                >
                  Parameter Simulasi
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Investment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Investasi Awal (IDR)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Contoh: 10000000"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Minimal: {formatCurrency(1000000)}
                    </p>
                  </div>

                  {/* Investment Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jangka Waktu Investasi (Bulan)
                    </label>
                    <select
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none text-lg"
                    >
                      <option value="6">6 Bulan</option>
                      <option value="12">12 Bulan (1 Tahun)</option>
                      <option value="24">24 Bulan (2 Tahun)</option>
                      <option value="36">36 Bulan (3 Tahun)</option>
                      <option value="60">60 Bulan (5 Tahun)</option>
                    </select>
                  </div>

                  {/* Risk Profile */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profil Risiko
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "conservative", label: "Konservatif", desc: "Risiko rendah, return 6-8%" },
                        { value: "moderate", label: "Moderat", desc: "Risiko sedang, return 10-15%" },
                        { value: "aggressive", label: "Agresif", desc: "Risiko tinggi, return 15-25%" },
                      ].map((profile) => (
                        <button
                          key={profile.value}
                          onClick={() => setRiskProfile(profile.value)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            riskProfile === profile.value
                              ? "border-cyan-500 bg-cyan-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="font-semibold text-gray-900 mb-1">
                            {profile.label}
                          </div>
                          <div className="text-xs text-gray-600">{profile.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={calculateSimulation}
                    className="flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ background: "var(--brand-cyan)" }}
                  >
                    🎯 Jalankan Simulasi
                  </button>
                  {showResults && (
                    <button
                      onClick={resetSimulation}
                      className="px-6 py-4 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50"
                      style={{ borderColor: "var(--brand-dark-blue)", color: "var(--brand-dark-blue)" }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              {showResults && simulationData.length > 0 && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <div className="text-sm text-gray-600 mb-1">Total Investasi</div>
                      <div className="text-2xl font-bold" style={{ color: "var(--brand-dark-blue)" }}>
                        {formatCurrency(totalInvested)}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <div className="text-sm text-gray-600 mb-1">Estimasi Nilai Akhir</div>
                      <div className="text-2xl font-bold" style={{ color: "#10B981" }}>
                        {formatCurrency(estimatedReturn)}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <div className="text-sm text-gray-600 mb-1">Potensi Keuntungan</div>
                      <div className="text-2xl font-bold" style={{ color: "#F59E0B" }}>
                        {formatCurrency(estimatedReturn - totalInvested)}
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        +{(((estimatedReturn - totalInvested) / totalInvested) * 100).toFixed(2)}%
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <div className="text-sm text-gray-600 mb-1">Unit Dibeli</div>
                      <div className="text-2xl font-bold" style={{ color: selectedCategory.color }}>
                        {formatNumber(units)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{selectedCategory.unit}</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h3
                      className="text-xl font-bold mb-6"
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      Proyeksi Pertumbuhan Investasi
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={simulationData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#48BDD0" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#48BDD0" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          label={{ value: "Bulan ke-", position: "insideBottom", offset: -5 }}
                          stroke="#6B7280"
                        />
                        <YAxis
                          tickFormatter={(value: number) => `${(value / 1000000).toFixed(1)}jt`}
                          stroke="#6B7280"
                        />
                        <Tooltip
                          formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "12px",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="invested"
                          stroke="#94A3B8"
                          fillOpacity={1}
                          fill="url(#colorInvested)"
                          name="Modal Awal"
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#48BDD0"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                          name="Nilai Investasi"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h4 className="font-bold text-yellow-900 mb-2">
                          Disclaimer Penting
                        </h4>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                          Hasil simulasi ini hanya untuk tujuan edukasi dan tidak menjamin
                          keuntungan aktual. Investasi mengandung risiko kerugian modal.
                          Selalu lakukan riset mendalam dan konsultasi dengan penasihat
                          keuangan sebelum berinvestasi. Harga dan return yang ditampilkan
                          adalah estimasi berbasis data historis dan asumsi pasar.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review & Kesimpulan */}
                  <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h3
                      className="text-2xl font-bold mb-6 flex items-center gap-3"
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      <span className="text-3xl">📊</span>
                      Review & Kesimpulan Simulasi
                    </h3>

                    <div className="space-y-6">
                      {/* Investment Summary */}
                      <div className="bg-blue-50 rounded-2xl p-6">
                        <h4 className="font-bold text-lg mb-4" style={{ color: "var(--brand-dark-blue)" }}>
                          Ringkasan Investasi
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <span className="text-gray-600">Jenis Investasi:</span>
                            <span className="font-semibold flex items-center gap-2">
                              <span>{selectedCategory.icon}</span>
                              {selectedCategory.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <span className="text-gray-600">Modal Awal:</span>
                            <span className="font-semibold">{formatCurrency(totalInvested)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <span className="text-gray-600">Periode:</span>
                            <span className="font-semibold">{investmentPeriod} Bulan</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <span className="text-gray-600">Profil Risiko:</span>
                            <span className="font-semibold capitalize">{riskProfile === "conservative" ? "Konservatif" : riskProfile === "moderate" ? "Moderat" : "Agresif"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Performance Analysis */}
                      <div>
                        <h4 className="font-bold text-lg mb-4" style={{ color: "var(--brand-dark-blue)" }}>
                          Analisis Performa
                        </h4>
                        <div className="space-y-3">
                          {/* ROI Analysis */}
                          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                            <span className="text-2xl">💰</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">Return on Investment (ROI)</div>
                              <div className="text-sm text-gray-600">
                                Investasi Anda berpotensi menghasilkan keuntungan sebesar{" "}
                                <span className="font-bold text-green-700">
                                  {formatCurrency(estimatedReturn - totalInvested)}
                                </span>
                                {" "}atau{" "}
                                <span className="font-bold text-green-700">
                                  {(((estimatedReturn - totalInvested) / totalInvested) * 100).toFixed(2)}%
                                </span>
                                {" "}dalam {investmentPeriod} bulan.
                              </div>
                            </div>
                          </div>

                          {/* Risk Assessment */}
                          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                            <span className="text-2xl">⚡</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">Penilaian Risiko</div>
                              <div className="text-sm text-gray-600">
                                {riskProfile === "conservative" && (
                                  <>Dengan profil <span className="font-bold">konservatif</span>, investasi ini cocok untuk pemula yang ingin risiko minimal dengan return stabil sekitar 6-8% per tahun.</>
                                )}
                                {riskProfile === "moderate" && (
                                  <>Profil <span className="font-bold">moderat</span> menawarkan keseimbangan antara risiko dan return, cocok untuk investor dengan pengalaman menengah yang menargetkan 10-15% return per tahun.</>
                                )}
                                {riskProfile === "aggressive" && (
                                  <>Profil <span className="font-bold">agresif</span> memiliki potensi return tinggi (15-25% per tahun) namun dengan volatilitas dan risiko kerugian yang lebih besar. Cocok untuk investor berpengalaman.</>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Time Horizon */}
                          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                            <span className="text-2xl">⏰</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">Horizon Waktu</div>
                              <div className="text-sm text-gray-600">
                                {parseInt(investmentPeriod) <= 12 && (
                                  <>Investasi jangka pendek (≤1 tahun) cocok untuk tujuan finansial mendesak, namun potensi pertumbuhan terbatas.</>
                                )}
                                {parseInt(investmentPeriod) > 12 && parseInt(investmentPeriod) <= 36 && (
                                  <>Investasi jangka menengah (1-3 tahun) memberikan waktu cukup untuk pertumbuhan dengan risiko yang lebih terkelola.</>
                                )}
                                {parseInt(investmentPeriod) > 36 && (
                                  <>Investasi jangka panjang (&gt;3 tahun) memberikan potensi compound interest maksimal dan dapat meredam volatilitas pasar.</>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Category Specific Insight */}
                          <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-xl">
                            <span className="text-2xl">🎯</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">Insight untuk {selectedCategory.name}</div>
                              <div className="text-sm text-gray-600">
                                {selectedCategory.id === "gold" && (
                                  <>Emas adalah safe haven asset yang cenderung stabil di masa krisis. Cocok untuk diversifikasi portofolio dan lindung nilai inflasi.</>
                                )}
                                {selectedCategory.id === "stock" && (
                                  <>Saham menawarkan potensi pertumbuhan tinggi melalui capital gain dan dividen. Lakukan riset fundamental dan teknikal sebelum membeli.</>
                                )}
                                {selectedCategory.id === "crypto" && (
                                  <>Cryptocurrency sangat volatile dengan potensi return tinggi. Investasi hanya dengan dana yang siap hilang dan pahami teknologi blockchain.</>
                                )}
                                {selectedCategory.id === "mutual-fund" && (
                                  <>Reksa dana dikelola profesional dan cocok untuk investor pasif. Perhatikan expense ratio dan track record manajer investasi.</>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="border-t-2 border-gray-100 pt-6">
                        <h4 className="font-bold text-lg mb-4" style={{ color: "var(--brand-dark-blue)" }}>
                          📌 Rekomendasi Langkah Selanjutnya
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-blue-700">1</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              Pelajari lebih dalam tentang {selectedCategory.name} melalui modul pembelajaran kami
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-blue-700">2</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              Konsultasikan dengan OWI AI Assistant untuk strategi investasi personal
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-blue-700">3</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              Diversifikasi portofolio dengan mencoba simulasi di kategori investasi lain
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-blue-700">4</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              Mulai dengan jumlah kecil dan tingkatkan seiring bertambahnya pengetahuan
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <a
                          href="/belajar"
                          className="flex-1 min-w-50 py-3 px-6 rounded-xl font-semibold text-center transition-all hover:shadow-lg"
                          style={{ background: "var(--brand-dark-blue)", color: "white" }}
                        >
                          📚 Pelajari Lebih Lanjut
                        </a>
                        <a
                          href="#owi"
                          className="flex-1 min-w-50 py-3 px-6 rounded-xl font-semibold text-center border-2 transition-all hover:bg-gray-50"
                          style={{ borderColor: "var(--brand-dark-blue)", color: "var(--brand-dark-blue)" }}
                        >
                          🦉 Tanya OWI
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
