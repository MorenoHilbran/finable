"use client";

import { useAccessibility } from "@/providers/AccessibilityProvider";
import { Volume2, StopCircle } from "lucide-react";

interface ListenButtonProps {
    text?: string;
    title?: string;
    variant?: "full" | "icon";
}

export default function ListenButton({ text, title, variant = "full" }: ListenButtonProps) {
    const { isReading, setIsReading, speak, readingText } = useAccessibility();

    // Determine if THIS specific text is being read
    const isReadingThis = isReading && (text ? readingText === text : true);

    const handleClick = () => {
        if (isReadingThis) {
            setIsReading(false);
        } else {
            if (text) {
                speak(text, title);
            } else {
                // Fallback or toggle global reading state if no text provided
                // But ideally this button should always be provided with text
                setIsReading(!isReading);
            }
        }
    };

    if (variant === "icon") {
        return (
            <button
                onClick={handleClick}
                className={`p-2 rounded-full transition-colors ${isReadingThis ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                aria-label={isReadingThis ? "Berhenti mendengarkan" : "Dengarkan"}
                title={title ? `Dengarkan ${title}` : "Dengarkan"}
            >
                {isReadingThis ? <StopCircle size={18} /> : <Volume2 size={18} />}
            </button>
        )
    }

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-medium text-sm ${isReadingThis ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
            aria-label={isReadingThis ? "Berhenti mendengarkan" : "Dengarkan materi ini"}
        >
            {isReadingThis ? <StopCircle size={18} /> : <Volume2 size={18} />}
            {isReadingThis ? "Berhenti" : "Dengarkan Materi"}
        </button>
    );
}
