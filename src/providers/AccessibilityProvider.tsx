"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
    fontSize: number;
    setFontSize: (size: number) => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
    isVoiceNavEnabled: boolean;
    toggleVoiceNav: () => void;
    isReading: boolean;
    setIsReading: (reading: boolean) => void;
    readingText: string;
    setReadingText: (text: string) => void;
    readingTitle: string;
    setReadingTitle: (title: string) => void;
    speak: (text: string, title?: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [fontSize, setFontSizeState] = useState(16); // Base font size in pixels
    const [isVoiceNavEnabled, setIsVoiceNavEnabled] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [readingText, setReadingText] = useState("");
    const [readingTitle, setReadingTitle] = useState("");

    const speak = (text: string, title: string = "") => {
        setReadingText(text);
        setReadingTitle(title);
        setIsReading(true);
    };

    // Load saved preferences
    useEffect(() => {
        const savedFontSize = localStorage.getItem("finable_font_size");
        const savedVoiceNav = localStorage.getItem("finable_voice_nav");

        if (savedFontSize) setFontSizeState(parseInt(savedFontSize));
        if (savedVoiceNav) setIsVoiceNavEnabled(savedVoiceNav === "true");
    }, []);

    const setFontSize = (size: number) => {
        const newSize = Math.max(12, Math.min(32, size)); // Clamp between 12px and 32px
        setFontSizeState(newSize);
        localStorage.setItem("finable_font_size", newSize.toString());

        // Apply to root for rem based calculation or custom property
        document.documentElement.style.setProperty('--dynamic-font-size', `${newSize}px`);
    };

    const increaseFontSize = () => setFontSize(fontSize + 2);
    const decreaseFontSize = () => setFontSize(fontSize - 2);
    const resetFontSize = () => setFontSize(16);

    const toggleVoiceNav = () => {
        setIsVoiceNavEnabled((prev) => {
            const newState = !prev;
            localStorage.setItem("finable_voice_nav", String(newState));
            return newState;
        });
    };

    useEffect(() => {
        // initialize css variable
        document.documentElement.style.setProperty('--dynamic-font-size', `${fontSize}px`);
    }, [fontSize]);

    return (
        <AccessibilityContext.Provider
            value={{
                fontSize,
                setFontSize,
                increaseFontSize,
                decreaseFontSize,
                resetFontSize,
                isVoiceNavEnabled,
                toggleVoiceNav,
                isReading,
                setIsReading,
                readingText,
                setReadingText,
                readingTitle,
                setReadingTitle,
                speak
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
}
