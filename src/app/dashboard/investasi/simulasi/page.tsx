"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
    inputUnit: "gram",
    inputLabel: "Jumlah (gram)",
  },
  {
    id: "stock",
    name: "Saham",
    icon: "/icons/icon-saham.svg",
    color: "#3B82F6",
    description: "Kepemilikan bagian dari perusahaan",
    inputUnit: "lot",
    inputLabel: "Jumlah (lot)",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: "/icons/icon-crypto.svg",
    color: "#F7931A",
    description: "Aset digital terdesentralisasi",
    inputUnit: "dual", // Special: IDR or koin
    inputLabel: "Jumlah",
  },
  {
    id: "mutual-fund",
    name: "Reksa Dana",
    icon: "/icons/icon-reksadana.svg",
    color: "#10B981",
    description: "Investasi kolektif yang dikelola profesional",
    inputUnit: "idr",
    inputLabel: "Jumlah Investasi (IDR)",
  },
];

export default function SimulasiPage() {
  const [selectedCategory, setSelectedCategory] = useState(investmentCategories[0]);
  const [selectedAsset, setSelectedAsset] = useState<AssetPrice | null>(null);
  
  // Input states for different input types
  const [inputUnit, setInputUnit] = useState(""); // gram, lot, koin, idr
  const [inputIdr, setInputIdr] = useState(""); // For IDR input
  const [inputQuantity, setInputQuantity] = useState(""); // For unit input (gram, lot, koin)
  
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

  // Reset inputs when category changes
  useEffect(() => {
    setInputIdr("");
    setInputQuantity("");
    setShowResults(false);
  }, [selectedCategory]);

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

  const getAssetsForCategory = useCallback((categoryId: string): AssetPrice[] => {
    if (!marketData) return [];
    switch (categoryId) {
      case "gold": return marketData.gold;
      case "stock": return marketData.stocks;
      case "crypto": return marketData.crypto;
      case "mutual-fund": return marketData.mutualFunds;
      default: return [];
    }
  }, [marketData]);

  // Handle IDR input change (for crypto dual input)
  const handleIdrChange = (value: string) => {
    setInputIdr(value);
    if (selectedAsset && value) {
      const idrAmount = parseFloat(value);
      if (!isNaN(idrAmount) && idrAmount > 0) {
        const quantity = idrAmount / selectedAsset.price;
        setInputQuantity(quantity.toFixed(8));
      }
    } else {
      setInputQuantity("");
    }
  };

  // Handle quantity input change (for crypto dual input)
  const handleQuantityChange = (value: string) => {
    setInputQuantity(value);
    if (selectedAsset && value) {
      const quantity = parseFloat(value);
      if (!isNaN(quantity) && quantity > 0) {
        const idrAmount = quantity * selectedAsset.price;
        setInputIdr(Math.round(idrAmount).toString());
      }
    } else {
      setInputIdr("");
    }
  };

  // Get investment amount in IDR based on category type
  const getInvestmentAmount = (): number => {
    if (!selectedAsset) return 0;
    
    if (selectedCategory.inputUnit === "idr") {
      // Reksa Dana: input is already in IDR
      return parseFloat(inputIdr) || 0;
    } else if (selectedCategory.inputUnit === "dual") {
      // Crypto: use IDR input
      return parseFloat(inputIdr) || 0;
    } else {
      // Gold & Stock: convert quantity to IDR
      const quantity = parseFloat(inputQuantity) || 0;
      return quantity * selectedAsset.price;
    }
  };

  // Get quantity based on category type
  const getQuantity = (): number => {
    if (!selectedAsset) return 0;
    
    if (selectedCategory.inputUnit === "idr") {
      // Reksa Dana: calculate units from IDR
      const idr = parseFloat(inputIdr) || 0;
      return idr / selectedAsset.price;
    } else if (selectedCategory.inputUnit === "dual") {
      // Crypto: use quantity input
      return parseFloat(inputQuantity) || 0;
    } else {
      // Gold & Stock: use quantity input directly
      return parseFloat(inputQuantity) || 0;
    }
  };

  // Simulate investment calculation
  const calculateSimulation = () => {
    const amount = getInvestmentAmount();
    const quantity = getQuantity();
    const months = parseInt(investmentPeriod);

    if (!amount || amount <= 0 || !months || !selectedAsset) {
      alert("Mohon isi semua field dengan benar");
      return;
    }

    setUnits(quantity);
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
      maximumFractionDigits: 8,
    }).format(value);
  };

  const resetSimulation = () => {
    setInputIdr("");
    setInputQuantity("");
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

  // Render input based on category type
  const renderInvestmentInput = () => {
    if (!selectedAsset) return null;

    if (selectedCategory.id === "gold" || selectedCategory.id === "stock") {
      // Emas: gram, Saham: lot
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedCategory.inputLabel} *
          </label>
          <input
            type="number"
            value={inputQuantity}
            onChange={(e) => setInputQuantity(e.target.value)}
            placeholder={`Contoh: ${selectedCategory.id === "gold" ? "5" : "10"}`}
            min="0"
            step={selectedCategory.id === "gold" ? "0.01" : "1"}
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--brand-sage)] focus:outline-none"
          />
          {inputQuantity && (
            <p className="text-sm text-gray-600 mt-2">
              = {formatCurrency(parseFloat(inputQuantity || "0") * selectedAsset.price)}
            </p>
          )}
        </div>
      );
    }

    if (selectedCategory.id === "crypto") {
      // Crypto: IDR atau Koin (dual input)
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah (IDR)
            </label>
            <input
              type="number"
              value={inputIdr}
              onChange={(e) => handleIdrChange(e.target.value)}
              placeholder="Contoh: 10000000"
              min="0"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--brand-sage)] focus:outline-none"
            />
          </div>
          <div className="text-center text-sm text-gray-500 font-medium">atau</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah ({selectedAsset.unit})
            </label>
            <input
              type="number"
              value={inputQuantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="Contoh: 0.001"
              min="0"
              step="0.00000001"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--brand-sage)] focus:outline-none"
            />
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>Tip:</strong> Isi salah satu, yang lain akan terisi otomatis.
          </div>
        </div>
      );
    }

    if (selectedCategory.id === "mutual-fund") {
      // Reksa Dana: IDR
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedCategory.inputLabel} *
          </label>
          <input
            type="number"
            value={inputIdr}
            onChange={(e) => setInputIdr(e.target.value)}
            placeholder="Contoh: 10000000"
            min="0"
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--brand-sage)] focus:outline-none"
          />
          {inputIdr && (
            <p className="text-sm text-gray-600 mt-2">
              = {formatNumber(parseFloat(inputIdr || "0") / selectedAsset.price)} {selectedAsset.unit}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 relative z-10">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/investasi"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-sage)" }}
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
              Simulasi
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
          Simulasi Investasi
        </h1>
        <p className="text-gray-600">
          Latih kemampuan investasi Anda dengan simulator berbasis harga pasar real-time.
        </p>
        {lastUpdated && (
          <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-green-50 rounded-full text-sm text-green-700">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Data terakhir: {formatDate(lastUpdated)}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loadingPrices && (
        <div className="card text-center py-12">
          <img src="/icons/icon-loading.svg" alt="" className="w-12 h-12 mb-4 mx-auto animate-spin" style={{ animationDuration: "2s" }} />
          <p className="text-gray-500">Memuat data pasar...</p>
        </div>
      )}

      {/* Main Content */}
      {!loadingPrices && (
        <div className="space-y-6">
          {/* Investment Categories */}
          <div className="card">
            <h2 className="font-semibold mb-4" style={{ color: "var(--brand-dark-blue)" }}>
              Pilih Jenis Investasi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {investmentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowResults(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedCategory.id === category.id
                      ? "border-[var(--brand-sage)] bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={category.icon} alt="" className="w-8 h-8 mb-2" />
                  <div className="font-semibold text-sm" style={{ color: "var(--brand-dark-blue)" }}>
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500">{category.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset Selector */}
          {marketData && (
            <div className="card">
              <h2 className="font-semibold mb-4" style={{ color: "var(--brand-dark-blue)" }}>
                Pilih Aset {selectedCategory.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getAssetsForCategory(selectedCategory.id).map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setInputIdr("");
                      setInputQuantity("");
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedAsset?.id === asset.id
                        ? "border-[var(--brand-sage)] bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold" style={{ color: selectedCategory.color }}>
                        {asset.symbol}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          asset.priceChange24h >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {asset.priceChange24h >= 0 ? "+" : ""}
                        {asset.priceChange24h}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{asset.name}</div>
                    <div className="font-semibold text-sm">
                      {formatCurrency(asset.price)}
                      <span className="text-xs text-gray-500 ml-1">/{asset.unit}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="card">
            <h2 className="font-semibold mb-4" style={{ color: "var(--brand-dark-blue)" }}>
              Parameter Simulasi
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Dynamic Investment Input */}
              {renderInvestmentInput()}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jangka Waktu (Bulan)
                </label>
                <select
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--brand-sage)] focus:outline-none"
                >
                  <option value="6">6 Bulan</option>
                  <option value="12">12 Bulan (1 Tahun)</option>
                  <option value="24">24 Bulan (2 Tahun)</option>
                  <option value="36">36 Bulan (3 Tahun)</option>
                  <option value="60">60 Bulan (5 Tahun)</option>
                </select>
              </div>
            </div>

            {/* Risk Profile */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profil Risiko</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "conservative", label: "Konservatif", desc: "6-8%" },
                  { value: "moderate", label: "Moderat", desc: "10-15%" },
                  { value: "aggressive", label: "Agresif", desc: "15-25%" },
                ].map((profile) => (
                  <button
                    key={profile.value}
                    onClick={() => setRiskProfile(profile.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      riskProfile === profile.value
                        ? "border-[var(--brand-sage)] bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-sm">{profile.label}</div>
                    <div className="text-xs text-gray-500">Return {profile.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={calculateSimulation}
                disabled={!selectedAsset || (getInvestmentAmount() <= 0)}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--brand-sage)" }}
              >
                Jalankan Simulasi
              </button>
              {showResults && (
                <button
                  onClick={resetSimulation}
                  className="px-4 py-3 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "var(--brand-dark-blue)", color: "var(--brand-dark-blue)" }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {showResults && simulationData.length > 0 && selectedAsset && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="card text-center">
                  <div className="text-xs text-gray-500 mb-1">Total Investasi</div>
                  <div className="font-bold" style={{ color: "var(--brand-dark-blue)" }}>
                    {formatCurrency(totalInvested)}
                  </div>
                </div>
                <div className="card text-center">
                  <div className="text-xs text-gray-500 mb-1">Estimasi Nilai Akhir</div>
                  <div className="font-bold" style={{ color: "var(--brand-sage)" }}>
                    {formatCurrency(estimatedReturn)}
                  </div>
                </div>
                <div className="card text-center">
                  <div className="text-xs text-gray-500 mb-1">Potensi Keuntungan</div>
                  <div className="font-bold text-amber-600">
                    {formatCurrency(estimatedReturn - totalInvested)}
                  </div>
                  <div className="text-xs text-green-600">
                    +{(((estimatedReturn - totalInvested) / totalInvested) * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="card text-center">
                  <div className="text-xs text-gray-500 mb-1">{selectedAsset.symbol}</div>
                  <div className="font-bold" style={{ color: selectedCategory.color }}>
                    {formatNumber(units)}
                  </div>
                  <div className="text-xs text-gray-500">{selectedAsset.unit}</div>
                </div>
              </div>

              {/* Chart */}
              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: "var(--brand-dark-blue)" }}>
                  Proyeksi Pertumbuhan
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={simulationData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#50D990" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#50D990" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
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
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#50D990"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      name="Nilai Investasi"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Disclaimer */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                }}
              >
                <div className="flex items-start gap-3">
                  <img src="/icons/icon-warning.svg" alt="" className="w-6 h-6" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Disclaimer</h4>
                    <p className="text-sm text-amber-700">
                      Hasil simulasi ini hanya untuk tujuan edukasi dan tidak menjamin keuntungan aktual.
                      Investasi mengandung risiko kerugian modal.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
