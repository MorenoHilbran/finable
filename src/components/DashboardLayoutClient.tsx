"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardNav from "@/components/DashboardNav";
import Squares from "@/components/Squares";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export default function DashboardLayoutClient({
  children,
  userName,
  userEmail,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Squares - like landing page */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <Squares
          direction="diagonal"
          speed={0.3}
          squareSize={50}
          borderColor="rgba(33, 33, 33, 0.04)"
          hoverFillColor="rgba(80, 217, 144, 0.03)"
        />
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white shadow-sm"
        }`}
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold group"
            style={{ color: "var(--brand-black)" }}
          >
            <img src="/icons/logo-finable.svg" alt="Finable" className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="bg-clip-text">
              FINABLE
            </span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div
                className="text-sm font-medium"
                style={{ color: "var(--brand-black)" }}
              >
                {userName}
              </div>
              <div className="text-xs text-gray-500">{userEmail}</div>
            </div>
            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 hover:shadow-lg transition-all"
              style={{ background: "var(--brand-sage)" }}
            >
              {userName.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation (Sidebar + Mobile Nav) */}
      <DashboardNav />

      {/* Main Content */}
      <main className="pt-16 md:pl-64 pb-20 md:pb-8">
        <div>{children}</div>
      </main>
    </div>
  );
}
