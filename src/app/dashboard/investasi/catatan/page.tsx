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

interface PortfolioItem {
  id: string;
  assetId: string;
  assetName: string;
  symbol: string;
  type: "gold" | "stock" | "crypto" | "mutual-fund";
  purchaseDate: string;
  quantity: number;
  purchasePrice: number;
  unit: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

type InvestmentType = PortfolioItem["type"];

const INVESTMENT_TYPES: { value: InvestmentType; label: string; icon: string; color: string }[] = [
  { value: "gold", label: "Emas", icon: "/icons/icon-emas.svg", color: "#FFD700" },
  { value: "stock", label: "Saham", icon: "/icons/icon-saham.svg", color: "#3B82F6" },
  { value: "crypto", label: "Cryptocurrency", icon: "/icons/icon-crypto.svg", color: "#F7931A" },
  { value: "mutual-fund", label: "Reksa Dana", icon: "/icons/icon-reksadana.svg", color: "#10B981" },
];

const STORAGE_KEY = "finable_portfolio_v2";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [filterType, setFilterType] = useState<InvestmentType | "all">("all");
  
  // Market data
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "stock" as InvestmentType,
    assetId: "",
    purchaseDate: "",
    quantity: "",
    purchasePrice: "",
    notes: "",
  });

  // Fetch market data
  useEffect(() => {
    fetchMarketData();
  }, []);

  // Load portfolio from localStorage after market data is loaded
  useEffect(() => {
    if (!loadingMarket) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setPortfolio(JSON.parse(stored));
        } catch {
          setPortfolio([]);
        }
      }
      setIsLoading(false);
    }
  }, [loadingMarket]);

  // Update selected asset when type changes
  useEffect(() => {
    if (marketData) {
      const assets = getAssetsForType(formData.type);
      if (assets.length > 0 && !formData.assetId) {
        setFormData(prev => ({ ...prev, assetId: assets[0].id }));
      }
    }
  }, [formData.type, marketData]);

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

  const getAssetsForType = useCallback((type: InvestmentType): AssetPrice[] => {
    if (!marketData) return [];
    switch (type) {
      case "gold": return marketData.gold;
      case "stock": return marketData.stocks;
      case "crypto": return marketData.crypto;
      case "mutual-fund": return marketData.mutualFunds;
      default: return [];
    }
  }, [marketData]);

  const getAssetById = useCallback((type: InvestmentType, assetId: string): AssetPrice | null => {
    const assets = getAssetsForType(type);
    return assets.find(a => a.id === assetId) || null;
  }, [getAssetsForType]);

  // Get current price for a portfolio item
  const getCurrentPrice = useCallback((item: PortfolioItem): number => {
    const asset = getAssetById(item.type, item.assetId);
    return asset?.price || item.purchasePrice;
  }, [getAssetById]);

  // Save portfolio to localStorage
  const savePortfolio = (newPortfolio: PortfolioItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPortfolio));
    setPortfolio(newPortfolio);
  };

  // Create/Update item
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedAsset = getAssetById(formData.type, formData.assetId);
    if (!selectedAsset) {
      alert("Mohon pilih aset terlebih dahulu");
      return;
    }

    const now = new Date().toISOString();

    if (editingItem) {
      // Update existing item
      const updatedPortfolio = portfolio.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              assetId: formData.assetId,
              assetName: selectedAsset.name,
              symbol: selectedAsset.symbol,
              type: formData.type,
              purchaseDate: formData.purchaseDate,
              quantity: parseFloat(formData.quantity) || 0,
              purchasePrice: parseFloat(formData.purchasePrice) || selectedAsset.price,
              unit: selectedAsset.unit,
              notes: formData.notes,
              updatedAt: now,
            }
          : item
      );
      savePortfolio(updatedPortfolio);
    } else {
      // Create new item
      const newItem: PortfolioItem = {
        id: crypto.randomUUID(),
        assetId: formData.assetId,
        assetName: selectedAsset.name,
        symbol: selectedAsset.symbol,
        type: formData.type,
        purchaseDate: formData.purchaseDate,
        quantity: parseFloat(formData.quantity) || 0,
        purchasePrice: parseFloat(formData.purchasePrice) || selectedAsset.price,
        unit: selectedAsset.unit,
        notes: formData.notes,
        createdAt: now,
        updatedAt: now,
      };
      savePortfolio([newItem, ...portfolio]);
    }

    resetForm();
  };

  // Delete item
  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      savePortfolio(portfolio.filter(item => item.id !== id));
    }
  };

  // Edit item
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      assetId: item.assetId,
      purchaseDate: item.purchaseDate,
      quantity: item.quantity.toString(),
      purchasePrice: item.purchasePrice.toString(),
      notes: item.notes,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    const assets = getAssetsForType("stock");
    setFormData({
      type: "stock",
      assetId: assets.length > 0 ? assets[0].id : "",
      purchaseDate: "",
      quantity: "",
      purchasePrice: "",
      notes: "",
    });
    setEditingItem(null);
    setShowForm(false);
  };

  // Filter portfolio
  const filteredPortfolio = portfolio.filter(item => {
    return filterType === "all" || item.type === filterType;
  });

  // Get type info
  const getTypeInfo = (type: InvestmentType) => {
    return INVESTMENT_TYPES.find(t => t.value === type) || INVESTMENT_TYPES[0];
  };

  // Calculate totals with real-time prices
  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);
  const totalCurrentValue = portfolio.reduce((sum, item) => sum + (getCurrentPrice(item) * item.quantity), 0);
  const totalProfitLoss = totalCurrentValue - totalInvestment;
  const profitLossPercentage = totalInvestment > 0 ? ((totalProfitLoss / totalInvestment) * 100) : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatLastUpdated = (isoString: string) => {
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  // Get selected asset in form
  const selectedFormAsset = getAssetById(formData.type, formData.assetId);

  return (
    <div className="p-6">
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
              Portofolio
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
            Portofolio Investasi
          </h1>
          <p className="text-gray-600">
            Pantau dan kelola portofolio investasi Anda dengan harga real-time.
          </p>
          {lastUpdated && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-green-50 rounded-full text-sm text-green-700">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Data terakhir: {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            const assets = getAssetsForType("stock");
            setFormData({
              type: "stock",
              assetId: assets.length > 0 ? assets[0].id : "",
              purchaseDate: "",
              quantity: "",
              purchasePrice: "",
              notes: "",
            });
            setShowForm(true);
          }}
          className="btn btn-primary flex-shrink-0"
        >
          <span>+</span>
          Tambah Investasi
        </button>
      </div>

      {/* Summary Cards */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Total Investasi</div>
            <div className="text-xl font-bold" style={{ color: "var(--brand-dark-blue)" }}>
              {formatCurrency(totalInvestment)}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Nilai Saat Ini</div>
            <div className="text-xl font-bold" style={{ color: "var(--brand-dark-blue)" }}>
              {formatCurrency(totalCurrentValue)}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Profit/Loss</div>
            <div 
              className="text-xl font-bold"
              style={{ color: totalProfitLoss >= 0 ? "var(--brand-sage)" : "#dc2626" }}
            >
              {totalProfitLoss >= 0 ? "+" : ""}{formatCurrency(totalProfitLoss)}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-500 mb-1">Persentase</div>
            <div 
              className="text-xl font-bold"
              style={{ color: profitLossPercentage >= 0 ? "var(--brand-sage)" : "#dc2626" }}
            >
              {profitLossPercentage >= 0 ? "+" : ""}{profitLossPercentage.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Filter by Type */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filterType === "all" ? "" : "hover:bg-gray-100"
            }`}
            style={{
              background: filterType === "all" ? "var(--brand-sage)" : "transparent",
              color: filterType === "all" ? "white" : "var(--brand-dark-blue)",
            }}
          >
            Semua
          </button>
          {INVESTMENT_TYPES.map((type) => (
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
              <img src={type.icon} alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && marketData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: "var(--brand-dark-blue)" }}>
                  {editingItem ? "Edit Investasi" : "Tambah Investasi Baru"}
                </h2>
                <button
                  onClick={resetForm}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <img src="/icons/icon-close.svg" alt="Close" className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-dark-blue)" }}>
                    Jenis Investasi *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INVESTMENT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          const assets = getAssetsForType(type.value);
                          setFormData({ 
                            ...formData, 
                            type: type.value, 
                            assetId: assets.length > 0 ? assets[0].id : "" 
                          });
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
                        style={{
                          background: formData.type === type.value ? `${type.color}20` : "transparent",
                          color: formData.type === type.value ? type.color : "var(--text-muted)",
                          border: formData.type === type.value ? `2px solid ${type.color}` : "2px solid var(--border)",
                        }}
                      >
                        <img src={type.icon} alt="" className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Asset Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--brand-dark-blue)" }}>
                    Pilih Aset *
                  </label>
                  <select
                    value={formData.assetId}
                    onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-sage)]"
                  >
                    {getAssetsForType(formData.type).map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.symbol} - {asset.name} ({formatCurrency(asset.price)}/{asset.unit})
                      </option>
                    ))}
                  </select>
                  {selectedFormAsset && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{selectedFormAsset.symbol}</div>
                        <div className="text-xs text-gray-500">{selectedFormAsset.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(selectedFormAsset.price)}</div>
                        <div className={`text-xs ${selectedFormAsset.priceChange24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {selectedFormAsset.priceChange24h >= 0 ? "+" : ""}{selectedFormAsset.priceChange24h}% (24h)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                    Tanggal Beli
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-sage)]"
                  />
                </div>

                {/* Quantity and Purchase Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                      Jumlah (Lot) *
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-sage)]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                      Harga Beli *
                    </label>
                    <input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-sage)]"
                      placeholder={selectedFormAsset ? selectedFormAsset.price.toString() : "0"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Harga saat beli (per {selectedFormAsset?.unit || "unit"})
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--brand-dark-blue)" }}>
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--brand-sage)] resize-none"
                    placeholder="Catatan tambahan..."
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
                    {editingItem ? "Simpan Perubahan" : "Tambah Investasi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio List */}
      {isLoading || loadingMarket ? (
        <div className="card text-center py-12">
          <img src="/icons/icon-loading.svg" alt="" className="w-12 h-12 mb-4 mx-auto animate-spin" style={{ animationDuration: "2s" }} />
          <p className="text-gray-500">Memuat portofolio dan harga pasar...</p>
        </div>
      ) : filteredPortfolio.length === 0 ? (
        <div
          className="card text-center py-12"
          style={{ background: "linear-gradient(135deg, rgba(80, 217, 144, 0.05) 0%, rgba(78, 153, 204, 0.05) 100%)" }}
        >
          <img src="/icons/invest.svg" alt="" className="w-20 h-20 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
            {portfolio.length === 0 ? "Belum Ada Investasi" : "Tidak Ada Hasil"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {portfolio.length === 0
              ? "Mulai catat investasi Anda untuk melacak kinerja portofolio dengan harga real-time."
              : "Coba ubah filter untuk melihat investasi lainnya."}
          </p>
          {portfolio.length === 0 && (
            <button 
              onClick={() => {
                const assets = getAssetsForType("stock");
                setFormData({
                  type: "stock",
                  assetId: assets.length > 0 ? assets[0].id : "",
                  purchaseDate: "",
                  quantity: "",
                  purchasePrice: "",
                  notes: "",
                });
                setShowForm(true);
              }} 
              className="btn btn-primary"
            >
              + Tambah Investasi Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPortfolio.map((item) => {
            const typeInfo = getTypeInfo(item.type);
            const currentPrice = getCurrentPrice(item);
            const itemValue = currentPrice * item.quantity;
            const itemInvestment = item.purchasePrice * item.quantity;
            const itemProfitLoss = itemValue - itemInvestment;
            const itemProfitLossPercent = itemInvestment > 0 ? ((itemProfitLoss / itemInvestment) * 100) : 0;
            const priceChange = getAssetById(item.type, item.assetId)?.priceChange24h || 0;

            return (
              <div key={item.id} className="card">
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${typeInfo.color}20` }}
                  >
                    <img src={typeInfo.icon} alt="" className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: "var(--brand-dark-blue)" }}>
                          {item.symbol}
                        </h3>
                        <div className="text-sm text-gray-500">{item.assetName}</div>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: `${typeInfo.color}20`, color: typeInfo.color }}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold" style={{ color: "var(--brand-dark-blue)" }}>
                          {formatCurrency(itemValue)}
                        </div>
                        <div 
                          className="text-sm font-medium"
                          style={{ color: itemProfitLoss >= 0 ? "var(--brand-sage)" : "#dc2626" }}
                        >
                          {itemProfitLoss >= 0 ? "+" : ""}{formatCurrency(itemProfitLoss)} ({itemProfitLossPercent >= 0 ? "+" : ""}{itemProfitLossPercent.toFixed(2)}%)
                        </div>
                        <div className={`text-xs ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {priceChange >= 0 ? "↑" : "↓"} {Math.abs(priceChange)}% (24h)
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                      <div>
                        <span className="text-gray-400">Jumlah:</span> {item.quantity} <span className="text-gray-400">{item.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Harga Beli:</span> {formatCurrency(item.purchasePrice)}
                      </div>
                      <div>
                        <span className="text-gray-400">Harga Sekarang:</span> {formatCurrency(currentPrice)}
                      </div>
                      <div>
                        <span className="text-gray-400">Tanggal Beli:</span> {formatDate(item.purchaseDate)}
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-sm text-gray-500 mb-2">{item.notes}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                        style={{ color: "var(--brand-sage)" }}
                      >
                        <img src="/icons/icon-edit.svg" alt="" className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                        style={{ color: "#dc2626" }}
                      >
                        <img src="/icons/icon-trash.svg" alt="" className="w-4 h-4" /> Hapus
                      </button>
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
          background: "rgba(80, 217, 144, 0.05)",
          border: "1px solid rgba(80, 217, 144, 0.2)",
        }}
      >
        <div className="flex items-start gap-4">
          <img src="/icons/icon-insight.svg" alt="" className="w-8 h-8" />
          <div>
            <h4 className="font-semibold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
              Tips Mengelola Portofolio
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Harga real-time</strong> diperbarui secara otomatis dari data pasar</li>
              <li>• <strong>Diversifikasi</strong> investasi Anda ke berbagai jenis aset</li>
              <li>• Gunakan <strong>catatan</strong> untuk mencatat alasan dan strategi investasi</li>
              <li>• Pantau <strong>profit/loss</strong> untuk mengevaluasi keputusan investasi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
