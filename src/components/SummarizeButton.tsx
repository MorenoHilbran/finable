"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SummarizeButtonProps {
    content: string;
}

export default function SummarizeButton({ content }: SummarizeButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async () => {
        setIsOpen(true);
        if (summary) return; // Already summarized

        setIsLoading(true);
        try {
            const response = await fetch("/api/owi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: `Tolong buatkan rangkuman poin-poin penting dari materi berikut ini dalam bahasa Indonesia yang mudah dipahami. Gunakan format bullet points:\n\n${content.substring(0, 3000)}` // Limit char count
                }),
            });

            const data = await response.json();
            if (data.message) {
                setSummary(data.message);
            }
        } catch (error) {
            setSummary("Maaf, gagal membuat rangkuman. Silakan coba lagi nanti.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleSummarize}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors font-medium text-sm"
            >
                <Sparkles size={18} />
                Rangkum dengan OWI
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative z-10 animate-in zoom-in-95">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">Rangkuman Materi by OWI</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500 animate-pulse">Sedang membaca dan merangkum materi...</p>
                                </div>
                            ) : (
                                <div className="prose prose-purple max-w-none">
                                    <ReactMarkdown>{summary}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                            <p className="text-xs text-center text-gray-500">
                                Rangkuman dibuat otomatis oleh AI (Artificial Intelligence). Selalu cek materi asli untuk detail lengkap.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
