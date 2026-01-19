"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceSimulationInput, { VoiceCommand } from "@/components/VoiceSimulationInput";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Asset price type
interface AssetPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  unit: string;
  lastUpdated: string;
}

interface MarketData {
  gold: AssetPrice[];
  stocks: AssetPrice[];
  crypto: AssetPrice[];
  mutualFunds: AssetPrice[];
  lastUpdated: string;
}

// Investment categories
const investmentCategories = [
  {
    id: "gold",
    name: "Emas",
    icon: "/icons/icon-emas.svg",
    color: "#FFD700",
    description: "Logam mulia sebagai aset safe haven",
  },
  {
    id: "stock",
    name: "Saham",
    icon: "/icons/icon-saham.svg",
    color: "#3B82F6",
    description: "Kepemilikan bagian dari perusahaan",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: "/icons/icon-crypto.svg",
    color: "#F7931A",
    description: "Aset digital terdesentralisasi",
  },
  {
    id: "mutual-fund",
    name: "Reksa Dana",
    icon: "/icons/icon-reksadana.svg",
    color: "#10B981",
    description: "Investasi kolektif yang dikelola profesional",
  },
];

export default function SimulasiPage() {
  const [selectedCategory, setSelectedCategory] = useState(investmentCategories[0]);
  const [selectedAsset, setSelectedAsset] = useState<AssetPrice | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("12");
  const [riskProfile, setRiskProfile] = useState("moderate");
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [totalInvested, setTotalInvested] = useState(0);
  const [estimatedReturn, setEstimatedReturn] = useState(0);
  const [units, setUnits] = useState(0);

  // Market data state
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch market data on mount
  useEffect(() => {
    fetchMarketData();
  }, []);

  // Update selected asset when category or market data changes
  useEffect(() => {
    if (marketData) {
      const assets = getAssetsForCategory(selectedCategory.id);
      if (assets.length > 0) {
        setSelectedAsset(assets[0]);
      }
    }
  }, [selectedCategory, marketData]);

  const fetchMarketData = async () => {
    try {
      setLoadingPrices(true);
      const response = await fetch("/api/market-data");
      const data = await response.json();
      setMarketData(data);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    } finally {
      setLoadingPrices(false);
    }
  };

  const getAssetsForCategory = (categoryId: string): AssetPrice[] => {
    if (!marketData) return [];
    switch (categoryId) {
      case "gold": return marketData.gold;
      case "stock": return marketData.stocks;
      case "crypto": return marketData.crypto;
      case "mutual-fund": return marketData.mutualFunds;
      default: return [];
    }
  };

  // Handle voice command
  const handleVoiceCommand = useCallback((command: VoiceCommand) => {
    // Set investment type
    if (command.investmentType) {
      const category = investmentCategories.find(c => c.id === command.investmentType);
      if (category) {
        setSelectedCategory(category);

        // Set specific asset if mentioned
        if (command.assetId && marketData) {
          const assets = getAssetsForCategory(command.investmentType);
          const asset = assets.find(a => a.id === command.assetId);
          if (asset) {
            setSelectedAsset(asset);
          }
        }
      }
    }

    // Set amount
    if (command.amount) {
      setInvestmentAmount(command.amount.toString());
    }

    // Set period
    if (command.period) {
      setInvestmentPeriod(command.period.toString());
    }

    // Set risk profile
    if (command.riskProfile) {
      setRiskProfile(command.riskProfile);
    }
  }, [marketData]);

  // Simulate investment calculation
  const calculateSimulation = () => {
    const amount = parseFloat(investmentAmount);
    const months = parseInt(investmentPeriod);

    if (!amount || amount <= 0 || !months || !selectedAsset) {
      alert("Mohon isi semua field dengan benar");
      return;
    }

    // Calculate units purchased
    const purchasedUnits = amount / selectedAsset.price;
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

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section
          className="py-16"
          style={{ background: "var(--brand-black)" }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: "var(--brand-sage)" }}>
                Simulasi Investasi Real-Time
              </h1>
              <p className="text-lg md:text-xl mb-6"
                style={{ color: "var(--brand-white)" }}>
                Pelajari potensi keuntungan investasi Anda dengan simulator berbasis
                harga pasar real-time
              </p>
              {lastUpdated && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Data terakhir diperbarui: {formatDate(lastUpdated)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">

              {/* Voice Input Section */}
              <div className="mb-8">
                <VoiceSimulationInput onVoiceCommand={handleVoiceCommand} />
              </div>

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
                      className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${selectedCategory.id === category.id
                          ? "border-cyan-500 bg-cyan-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <img src={category.icon} alt="" className="w-10 h-10" />
                      </div>
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: "var(--brand-black)" }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Selector */}
              {!loadingPrices && marketData && (
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ color: "var(--brand-dark-blue)" }}
                  >
                    Pilih Aset {selectedCategory.name}
                  </h2>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getAssetsForCategory(selectedCategory.id).map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${selectedAsset?.id === asset.id
                            ? "border-cyan-500 bg-cyan-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg" style={{ color: selectedCategory.color }}>
                            {asset.symbol}
                          </span>
                          <span
                            className={`text-sm font-semibold px-2 py-1 rounded ${asset.priceChange24h >= 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {asset.priceChange24h >= 0 ? "+" : ""}
                            {asset.priceChange24h}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{asset.name}</div>
                        <div className="font-bold text-gray-900">
                          {formatCurrency(asset.price)}
                          <span className="text-xs text-gray-500 ml-1">/{asset.unit}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                          className={`p-4 rounded-xl border-2 transition-all text-left ${riskProfile === profile.value
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
                    disabled={!selectedAsset}
                    className="flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "var(--brand-sage)" }}
                  >
                    Jalankan Simulasi
                  </button>
                  {showResults && (
                    <button
                      onClick={resetSimulation}
                      className="px-6 py-4 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50"
                      style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)" }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              {showResults && simulationData.length > 0 && selectedAsset && (
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
                      <div className="text-sm text-gray-600 mb-1">Unit {selectedAsset.symbol}</div>
                      <div className="text-2xl font-bold" style={{ color: selectedCategory.color }}>
                        {formatNumber(units)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{selectedAsset.unit}</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h3
                      className="text-xl font-bold mb-6"
                      style={{ color: "var(--brand-black)" }}
                    >
                      Proyeksi Pertumbuhan Investasi {selectedAsset.symbol}
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
                      <img src="/icons/icon-warning.svg" alt="" className="w-8 h-8" />
                      <div>
                        <h4 className="font-bold text-yellow-900 mb-2">
                          Disclaimer Penting
                        </h4>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                          Hasil simulasi ini hanya untuk tujuan edukasi dan tidak menjamin
                          keuntungan aktual. Investasi mengandung risiko kerugian modal.
                          Selalu lakukan riset mendalam dan konsultasi dengan penasihat
                          keuangan sebelum berinvestasi. Harga {selectedAsset.symbol} yang ditampilkan
                          ({formatCurrency(selectedAsset.price)}/{selectedAsset.unit}) adalah data per {lastUpdated ? formatDate(lastUpdated) : "hari ini"}.
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
                      <img src="/icons/icon-chart.svg" alt="" className="w-10 h-10" />
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
                            <span className="text-gray-600">Aset:</span>
                            <span className="font-semibold">
                              {selectedAsset.name} ({selectedAsset.symbol})
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <span className="text-gray-600">Harga per {selectedAsset.unit}:</span>
                            <span className="font-semibold">{formatCurrency(selectedAsset.price)}</span>
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
                          <div className="flex justify-between items-center py-2 border-b border-blue-100">
                            <span className="text-gray-600">Jumlah {selectedAsset.unit}:</span>
                            <span className="font-semibold">{formatNumber(units)}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <a
                          href="/belajar"
                          className="flex-1 min-w-50 py-3 px-6 rounded-xl font-semibold text-center transition-all hover:shadow-lg"
                          style={{ background: "var(--brand-blue)", color: "white" }}
                        >
                          Pelajari {selectedCategory.name}
                        </a>
                        <a
                          href="/owi"
                          className="flex-1 min-w-50 py-3 px-6 rounded-xl font-semibold text-center border-2 transition-all hover:bg-gray-50"
                          style={{ borderColor: "var(--brand-dark-blue)", color: "var(--brand-dark-blue)" }}
                        >
                          Tanya OWI
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
