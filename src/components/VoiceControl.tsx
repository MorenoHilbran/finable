"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAccessibility } from "@/providers/AccessibilityProvider";
// import { useRouter } from "next/navigation"; // If needed for navigation

// Extend Window interface for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function VoiceControl() {
    const { isVoiceNavEnabled, toggleVoiceNav, setIsReading } = useAccessibility();
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    // const router = useRouter();

    const handleResult = useCallback((event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("Voice Command:", transcript);

        // Simple command mapping
        if (transcript.includes("turun") || transcript.includes("scroll down") || transcript.includes("bawah")) {
            window.scrollBy({ top: 300, behavior: "smooth" });
        } else if (transcript.includes("naik") || transcript.includes("scroll up") || transcript.includes("atas")) {
            window.scrollBy({ top: -300, behavior: "smooth" });
        } else if (transcript.includes("kembali") || transcript.includes("back")) {
            window.history.back();
        } else if (transcript.includes("baca") || transcript.includes("read") || transcript.includes("suara")) {
            // Trigger reading logic if available. We set a flag in context or dispatch event.
            // For now, let's assume we toggle the 'isReading' state which the reader component watches
            setIsReading(true);
        } else if (transcript.includes("stop") || transcript.includes("berhenti")) {
            setIsReading(false);
            window.speechSynthesis.cancel();
        }
    }, [setIsReading]);

    useEffect(() => {
        if (!isVoiceNavEnabled) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                setIsListening(false);
            }
            return;
        }

        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            console.warn("Browser does not support speech recognition.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "id-ID"; // Indonesian language

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
            // Auto restart if it was supposed to be running
            if (isVoiceNavEnabled) {
                try {
                    recognition.start();
                } catch (e) {
                    // ignore error if already started
                }
            } else {
                setIsListening(false);
            }
        };
        recognition.onresult = handleResult;
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (e) {
            console.error(e);
        }

        return () => {
            recognition.stop();
        };
    }, [isVoiceNavEnabled, handleResult]);

    if (!isVoiceNavEnabled) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm backdrop-blur-sm animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Mendengarkan... ("Turun", "Naik", "Baca", "Stop")
        </div>
    );
}
