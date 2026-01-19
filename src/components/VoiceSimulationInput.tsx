"use client";

import { useState, useEffect, useCallback } from "react";

interface VoiceSimulationInputProps {
    onVoiceCommand: (command: VoiceCommand) => void;
    isListening?: boolean;
}

export interface VoiceCommand {
    investmentType?: string; // gold, stock, crypto, mutual-fund
    assetId?: string; // specific asset like bbri, btc, etc.
    amount?: number;
    period?: number; // months
    riskProfile?: string; // conservative, moderate, aggressive
    rawText: string;
}

// Keyword mappings for parsing voice commands
const investmentTypeKeywords: Record<string, string[]> = {
    gold: ["emas", "gold", "logam mulia", "antam"],
    stock: ["saham", "stock", "stocks", "bri", "bca", "telkom", "astra"],
    crypto: ["crypto", "cryptocurrency", "bitcoin", "btc", "ethereum", "eth", "kripto"],
    "mutual-fund": ["reksadana", "reksa dana", "mutual fund", "dana investasi"],
};

const stockKeywords: Record<string, string[]> = {
    bbri: ["bri", "bbri", "bank rakyat", "rakyat indonesia"],
    bbca: ["bca", "bbca", "bank central", "central asia"],
    tlkm: ["telkom", "tlkm", "telekomunikasi"],
    asii: ["astra", "asii", "astra international"],
    unvr: ["unilever", "unvr"],
    goto: ["goto", "gojek", "tokopedia"],
    buka: ["bukalapak", "buka"],
};

const cryptoKeywords: Record<string, string[]> = {
    btc: ["bitcoin", "btc"],
    eth: ["ethereum", "eth"],
    bnb: ["binance", "bnb"],
    sol: ["solana", "sol"],
    xrp: ["ripple", "xrp"],
};

const riskKeywords: Record<string, string[]> = {
    conservative: ["konservatif", "conservative", "aman", "rendah", "low"],
    moderate: ["moderat", "moderate", "sedang", "medium"],
    aggressive: ["agresif", "aggressive", "tinggi", "high", "berani"],
};

export default function VoiceSimulationInput({ onVoiceCommand }: VoiceSimulationInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(true);
    const [recognition, setRecognition] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setIsSupported(false);
                return;
            }

            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = "id-ID"; // Indonesian

            recognitionInstance.onresult = (event: any) => {
                const current = event.resultIndex;
                const result = event.results[current];
                const text = result[0].transcript;
                setTranscript(text);

                if (result.isFinal) {
                    parseVoiceCommand(text);
                }
            };

            recognitionInstance.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setError(`Error: ${event.error}`);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }
    }, []);

    const parseVoiceCommand = (text: string) => {
        const lowerText = text.toLowerCase();
        const command: VoiceCommand = { rawText: text };

        // Detect investment type
        for (const [type, keywords] of Object.entries(investmentTypeKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                command.investmentType = type;
                break;
            }
        }

        // Detect specific stock
        if (command.investmentType === "stock") {
            for (const [stockId, keywords] of Object.entries(stockKeywords)) {
                if (keywords.some(keyword => lowerText.includes(keyword))) {
                    command.assetId = stockId;
                    break;
                }
            }
        }

        // Detect specific crypto
        if (command.investmentType === "crypto") {
            for (const [cryptoId, keywords] of Object.entries(cryptoKeywords)) {
                if (keywords.some(keyword => lowerText.includes(keyword))) {
                    command.assetId = cryptoId;
                    break;
                }
            }
        }

        // Detect amount (numbers followed by juta/ribu/rupiah)
        const amountPatterns = [
            /(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/i,
            /(\d+(?:[.,]\d+)?)\s*(?:ribu|rb)/i,
            /(\d+(?:[.,]\d+)?)\s*(?:rupiah|rp)/i,
            /rp\.?\s*(\d+(?:[.,]\d+)?)/i,
        ];

        for (const pattern of amountPatterns) {
            const match = lowerText.match(pattern);
            if (match) {
                let amount = parseFloat(match[1].replace(",", "."));
                if (lowerText.includes("juta") || lowerText.includes("jt")) {
                    amount *= 1000000;
                } else if (lowerText.includes("ribu") || lowerText.includes("rb")) {
                    amount *= 1000;
                }
                command.amount = amount;
                break;
            }
        }

        // Detect period (months/years)
        const periodPatterns = [
            /(\d+)\s*(?:bulan|bln)/i,
            /(\d+)\s*(?:tahun|thn)/i,
        ];

        for (const pattern of periodPatterns) {
            const match = lowerText.match(pattern);
            if (match) {
                let months = parseInt(match[1]);
                if (lowerText.includes("tahun") || lowerText.includes("thn")) {
                    months *= 12;
                }
                command.period = months;
                break;
            }
        }

        // Detect risk profile
        for (const [profile, keywords] of Object.entries(riskKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                command.riskProfile = profile;
                break;
            }
        }

        onVoiceCommand(command);
        setTranscript("");
    };

    const toggleListening = useCallback(() => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            setError(null);
            setTranscript("");
            recognition.start();
            setIsListening(true);
        }
    }, [recognition, isListening]);

    if (!isSupported) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <div className="flex items-center gap-2">
                    <img src="/icons/icon-warning.svg" alt="" className="w-5 h-5" />
                    <span>Browser Anda tidak mendukung input suara. Silakan gunakan Chrome atau Edge.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening
                                ? "bg-red-500 animate-pulse"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        <button
                            onClick={toggleListening}
                            className="w-full h-full flex items-center justify-center"
                            aria-label={isListening ? "Berhenti mendengarkan" : "Mulai input suara"}
                        >
                            {isListening ? (
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <rect x="6" y="6" width="12" height="12" strokeWidth={2} fill="currentColor" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Input Suara</h4>
                        <p className="text-sm text-gray-600">
                            {isListening ? "Mendengarkan..." : "Klik untuk mulai berbicara"}
                        </p>
                    </div>
                </div>

                {isListening && (
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="w-2 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></span>
                        <span className="w-2 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></span>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                )}
            </div>

            {transcript && (
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Anda berkata:</p>
                    <p className="text-gray-900 font-medium">{transcript}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 rounded-xl p-3 text-sm text-red-700 mb-4">
                    {error}
                </div>
            )}

            <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium mb-2">Contoh perintah suara:</p>
                <ul className="space-y-1 text-sm">
                    <li>• "Saya ingin investasi saham BRI 10 juta dengan risiko moderat"</li>
                    <li>• "Simulasi bitcoin 5 juta selama 12 bulan agresif"</li>
                    <li>• "Investasi emas 20 juta 2 tahun konservatif"</li>
                    <li>• "Beli reksadana 15 juta risiko sedang"</li>
                </ul>
            </div>
        </div>
    );
}
