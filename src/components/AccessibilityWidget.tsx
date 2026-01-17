"use client";

import { useState } from "react";
import { useAccessibility } from "@/providers/AccessibilityProvider";
import { Settings, type LucideIcon, Minus, Plus, Mic, X, Accessibility, Volume2 } from "lucide-react";

export default function AccessibilityWidget() {
    const {
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        isVoiceNavEnabled,
        toggleVoiceNav,
        isReading,
        setIsReading
    } = useAccessibility();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed top-1/2 right-4 -translate-y-1/2 z-50 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 ${isOpen ? "translate-x-20 opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
                    }`}
                style={{ backgroundColor: "var(--brand-sage, #50D990)", color: "white" }}
                aria-label="Menu Aksesibilitas"
                title="Aksesibilitas"
            >
                <Accessibility size={24} />
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-4">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm pointer-events-auto relative animate-in slide-in-from-bottom-5 zoom-in-95">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Accessibility size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Aksesibilitas</h3>
                                <p className="text-sm text-gray-500">Sesuaikan tampilan & interaksi</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Font Size Control */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran Teks</label>
                                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                                    <button
                                        onClick={decreaseFontSize}
                                        className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-200 disabled:opacity-50"
                                        disabled={fontSize <= 12}
                                        aria-label="Perkecil teks"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <div className="flex-1 text-center font-bold text-gray-800">
                                        {Math.round((fontSize / 16) * 100)}%
                                    </div>
                                    <button
                                        onClick={increaseFontSize}
                                        className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-200 disabled:opacity-50"
                                        disabled={fontSize >= 32}
                                        aria-label="Perbesar teks"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Voice Nav Toggle */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Navigasi Suara</label>
                                    {isVoiceNavEnabled && <span className="text-xs text-green-600 font-bold animate-pulse">Aktif</span>}
                                </div>

                                <button
                                    onClick={toggleVoiceNav}
                                    className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${isVoiceNavEnabled
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Mic size={20} />
                                        {isVoiceNavEnabled ? "Nonaktifkan Suara" : "Aktifkan Navigasi Suara"}
                                    </span>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isVoiceNavEnabled ? "bg-white/30" : "bg-gray-300"}`}>
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isVoiceNavEnabled ? "left-6" : "left-1"}`} />
                                    </div>
                                </button>
                                <p className="text-xs text-gray-500 mt-2">
                                    Perintah: "Naik", "Turun", "Kembali", "Baca", "Stop"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
