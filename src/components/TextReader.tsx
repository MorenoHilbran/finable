"use client";

import { useEffect, useState, useRef } from "react";
import { useAccessibility } from "@/providers/AccessibilityProvider";
import { Play, Pause, Square, Volume2 } from "lucide-react";

export default function TextReader() {
    const { isReading, setIsReading, readingText, readingTitle } = useAccessibility();
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Helper to strip markdown (basic)
    const cleanText = (md: string) => {
        if (!md) return "";
        return md
            .replace(/#{1,6} /g, "") // Remove headers
            .replace(/\*\*/g, "")    // Remove bold
            .replace(/\*/g, "")      // Remove italic
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links, keep text
            .replace(/`/g, "")       // Remove code ticks
            .replace(/- /g, "")      // Remove list markers
            .replace(/\n\n/g, ". "); // Replace double newlines with pauses
    };

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            setIsReading(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        // If text changes while reading, restart
        if (isReading) {
            startReading();
        }
    }, [readingText]);

    useEffect(() => {
        if (isReading && !utteranceRef.current) {
            startReading();
        } else if (!isReading) {
            cancelReading();
        }
    }, [isReading]);

    const startReading = () => {
        if (!("speechSynthesis" in window)) {
            alert("Text to speech tidak didukung di browser ini.");
            setIsReading(false);
            return;
        }

        window.speechSynthesis.cancel(); // Clear any pending

        const textToRead = (readingTitle ? readingTitle + ". " : "") + cleanText(readingText);
        if (!textToRead.trim()) return;

        const utterance = new SpeechSynthesisUtterance(textToRead);

        utterance.lang = "id-ID"; // Indonesian
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            setIsReading(false);
            utteranceRef.current = null;
            setIsPaused(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        utterance.onerror = (e) => {
            // Ignore "interrupted" and "canceled" errors as they're normal
            // when user stops or switches text
            if (e.error === "interrupted" || e.error === "canceled") {
                return;
            }

            // Only log actual errors
            if (e.error && (e.error as any) !== "interrupted" && (e.error as any) !== "canceled") {
                console.error("TTS Error:", e.error, e);
            }

            setIsReading(false);
            utteranceRef.current = null;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        utteranceRef.current = utterance;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        window.speechSynthesis.speak(utterance);
        setIsPaused(false);

        // Workaround for Chrome bug where speech stops after ~15 seconds
        // Keep the speech synthesis alive
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                clearInterval(intervalRef.current!);
            } else if (window.speechSynthesis.paused) {
                // Don't do anything when paused
            } else {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            }
        }, 10000);
    };

    const cancelReading = () => {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
        setIsPaused(false);
    };

    const togglePause = () => {
        if (!window.speechSynthesis) return;

        if (isPaused) {
            // Resume
            window.speechSynthesis.resume();
            setIsPaused(false);

            // Workaround for browsers where resume doesn't work
            // Check if it's actually speaking after a short delay
            setTimeout(() => {
                if (window.speechSynthesis.paused) {
                    // Still paused, force resume again
                    window.speechSynthesis.resume();
                }
            }, 100);
        } else {
            // Pause
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    if (!isReading) return null;

    return (
        <div className="fixed bottom-20 right-4 z-40 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 w-80 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Volume2 size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Membacakan Materi</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{readingTitle || "Sedang membaca..."}</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={togglePause}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    {isPaused ? <Play size={20} className="ml-1" /> : <Pause size={20} />}
                </button>
                <button
                    onClick={() => setIsReading(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                    <Square size={20} />
                </button>
            </div>
        </div>
    );
}
