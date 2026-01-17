"use client";

import { AccessibilityProvider } from "@/providers/AccessibilityProvider";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import VoiceControl from "@/components/VoiceControl";
import { ReactNode } from "react";

export default function AccessibilityWrapper({ children }: { children: ReactNode }) {
    return (
        <AccessibilityProvider>
            {children}
            <AccessibilityWidget />
            <VoiceControl />
        </AccessibilityProvider>
    );
}
