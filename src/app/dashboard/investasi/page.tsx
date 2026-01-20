"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

// Types
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

// Investment categories matching simulation
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

export default function InvestasiPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoadingMarket(true);
      const response = await fetch("/api/market-data");
      const data = await response.json();
      setMarketData(data);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    } finally {
      setLoadingMarket(false);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6 relative z-10">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-sage)" }}
        >
          <span>←</span>
          <span>Kembali ke Dashboard</span>
        </Link>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/dashboard" className="hover:underline" style={{ color: "var(--text-muted)" }}>
                Dashboard
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li className="font-medium" style={{ color: "var(--brand-dark-blue)" }}>
              Investasi
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
          Pusat Investasi
        </h1>
        <p className="text-gray-600">
          Simulasi investasi dan pantau portofolio Anda dengan harga pasar real-time.
        </p>
        {lastUpdated && (
          <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-green-50 rounded-full text-sm text-green-700">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Data terakhir: {formatDate(lastUpdated)}
          </div>
        )}
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/investasi/simulasi"
          className="card group hover:shadow-lg transition-all border-2 border-transparent hover:border-[var(--brand-sage)]"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(80, 217, 144, 0.1)" }}
            >
              <img src="/icons/icon-chart.svg" alt="" className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                Simulasi Investasi
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Latih strategi investasi dengan simulator berbasis harga pasar real-time.
              </p>
              <span className="text-sm font-medium group-hover:underline" style={{ color: "var(--brand-sage)" }}>
                Mulai Simulasi →
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/investasi/catatan"
          className="card group hover:shadow-lg transition-all border-2 border-transparent hover:border-[var(--brand-blue)]"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(78, 153, 204, 0.1)" }}
            >
              <img src="/icons/invest.svg" alt="" className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                Portofolio Saya
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Catat dan pantau investasi Anda dengan profit/loss real-time.
              </p>
              <span className="text-sm font-medium group-hover:underline" style={{ color: "var(--brand-blue)" }}>
                Kelola Portofolio →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Market Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--brand-dark-blue)" }}>
          Harga Pasar Terkini
        </h2>

        {loadingMarket ? (
          <div className="card text-center py-8">
            <img src="/icons/icon-loading.svg" alt="" className="w-10 h-10 mb-3 mx-auto animate-spin" style={{ animationDuration: "2s" }} />
            <p className="text-gray-500 text-sm">Memuat data pasar...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investmentCategories.map((category) => {
              const assets = getAssetsForCategory(category.id);
              if (assets.length === 0) return null;

              return (
                <div key={category.id} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${category.color}20` }}
                    >
                      <img src={category.icon} alt="" className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: "var(--brand-dark-blue)" }}>
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {assets.slice(0, 4).map((asset) => (
                      <div
                        key={asset.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm" style={{ color: category.color }}>
                            {asset.symbol}
                          </span>
                          <span
                            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                              asset.priceChange24h >= 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {asset.priceChange24h >= 0 ? "+" : ""}{asset.priceChange24h}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1 truncate">{asset.name}</div>
                        <div className="font-semibold text-sm">
                          {formatCurrency(asset.price)}
                          <span className="text-xs text-gray-400 ml-1">/{asset.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--brand-dark-blue)" }}>
          Fitur Investasi
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Simulasi Multi-Aset",
              description: "Simulasikan investasi emas, saham, crypto, dan reksa dana dengan data real-time.",
              icon: "/icons/icon-trending.svg",
              color: "var(--brand-sage)",
            },
            {
              title: "Pantau Portofolio",
              description: "Catat investasi Anda dan lihat profit/loss dengan harga pasar terkini.",
              icon: "/icons/invest.svg",
              color: "var(--brand-blue)",
            },
            {
              title: "Profil Risiko",
              description: "Pilih strategi konservatif, moderat, atau agresif sesuai tujuan Anda.",
              icon: "/icons/icon-chart.svg",
              color: "#F7931A",
            },
            {
              title: "Proyeksi Visual",
              description: "Lihat grafik proyeksi pertumbuhan investasi Anda.",
              icon: "/icons/icon-bar-chart.svg",
              color: "#10B981",
            },
          ].map((feature, index) => (
            <div key={index} className="card flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${feature.color}20` }}
              >
                <img src={feature.icon} alt="" className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="p-6 rounded-xl"
        style={{
          background: "rgba(245, 158, 11, 0.05)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        }}
      >
        <div className="flex items-start gap-4">
          <img src="/icons/icon-warning.svg" alt="" className="w-6 h-6" />
          <div>
            <h4 className="font-semibold mb-1" style={{ color: "var(--brand-dark-blue)" }}>
              Catatan Penting
            </h4>
            <p className="text-sm text-gray-600">
              Finable adalah platform <strong>edukasi</strong>, bukan platform transaksi investasi.
              Semua simulasi bersifat edukatif dan tidak merepresentasikan keuntungan nyata.
              Selalu konsultasikan dengan penasihat keuangan profesional sebelum berinvestasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
