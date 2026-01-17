"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Check initial auth state and get user info
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User");
      } else {
        setUserEmail("");
        setUserName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout with page refresh
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    router.refresh();
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/belajar", label: "Belajar" },
    { href: "/investasi", label: "Simulasi" },
    { href: "/owi", label: "OWI" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm mt-0"
      role="navigation"
      aria-label="Navigasi utama"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold"
            style={{ color: "var(--brand-black)" }}
          >
            <img src="/icons/logo-finable.svg" alt="Finable" className="w-8 h-8 md:w-10 md:h-10" />
            <span>FINABLE</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--brand-black)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand-sage)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--brand-black)"}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {isLoggedIn ? (
              /* User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-gray-50"
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "var(--brand-sage)" }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  {/* Name & Email */}
                  <div className="text-left hidden lg:block">
                    <div
                      className="text-sm font-medium leading-tight"
                      style={{ color: "var(--brand-black)" }}
                    >
                      {userName}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight">
                      {userEmail}
                    </div>
                  </div>
                  {/* Arrow */}
                  <span
                    className="text-xs transition-transform duration-200"
                    style={{
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      color: "var(--brand-black)"
                    }}
                  >
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    style={{ zIndex: 100 }}
                  >
                    {/* User info in dropdown (for smaller screens) */}
                    <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                      <div className="text-sm font-medium" style={{ color: "var(--brand-black)" }}>
                        {userName}
                      </div>
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50"
                        style={{ color: "var(--brand-black)" }}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <img src="/icons/icon-dashboard.svg" alt="" className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50"
                        style={{ color: "var(--brand-black)" }}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <img src="/icons/icon-user.svg" alt="" className="w-5 h-5" />
                        Edit Profil
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm w-full transition-colors hover:bg-red-50 hover:cursor-pointer"
                        style={{ color: "var(--brand-red)" }}
                      >
                        <img src="/icons/icon-logout.svg" alt="" className="w-5 h-5" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary text-sm"
                style={{ backgroundColor: "var(--brand-sage)" }}
              >
                Mulai Belajar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--brand-black)" }}
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-gray-100"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium py-2 transition-colors hover:text-(--brand-sage)"
                  style={{ color: "var(--brand-black)" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  {/* User Profile Section for Mobile */}
                  <div className="flex items-center gap-3 py-3 border-t border-gray-100 mt-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: "var(--brand-sage)" }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--brand-black)" }}>
                        {userName}
                      </div>
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 py-2 text-base font-medium"
                    style={{ color: "var(--brand-black)" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img src="/icons/icon-dashboard.svg" alt="" className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 py-2 text-base font-medium"
                    style={{ color: "var(--brand-black)" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img src="/icons/icon-user.svg" alt="" className="w-5 h-5" />
                    Edit Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 rounded-xl transition-all hover:bg-red-50 mt-2"
                    style={{ color: "var(--brand-red)" }}
                  >
                    <img src="/icons/icon-logout.svg" alt="" className="w-5 h-5" />
                    <span>Keluar</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-primary mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mulai Belajar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

