"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import Squares from "@/components/Squares";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

const sidebarLinks: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: "/icons/icon-dashboard.svg" },
  { href: "/admin/modules", label: "Modul Pembelajaran", icon: "/icons/learn.svg" },
  { href: "/admin/master-data", label: "Master Data", icon: "/icons/icon-settings.svg" },
];

export default function AdminLayoutClient({
  children,
  userName,
  userEmail,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

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
            href="/admin"
            className="flex items-center gap-2 text-xl font-bold group"
            style={{ color: "var(--brand-black)" }}
          >
            <img src="/icons/logo-finable.svg" alt="Finable" className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span>
              F<span style={{ color: "#61a1ad" }}>i</span><span style={{ color: "#61a1ad" }}>n</span>able <span className="text-sm font-normal text-gray-500">Admin</span>
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
              href="/admin"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 hover:shadow-lg transition-all"
              style={{ background: "var(--brand-sage)" }}
            >
              {userName.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-md shadow-lg overflow-y-auto hidden md:block"
        style={{ borderRight: "1px solid rgba(226, 232, 240, 0.8)" }}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? "" : "hover:bg-gray-100"
                    }`}
                    style={{
                      ...(active && {
                        background: "var(--brand-sage)",
                        color: "white",
                        boxShadow: "0 4px 14px rgba(80, 217, 144, 0.3)",
                      }),
                      ...(!active && {
                        color: "var(--brand-black)",
                      }),
                    }}
                  >
                    <img src={link.icon} alt={link.label} className="w-5 h-5" style={{ filter: active ? 'brightness(0) invert(1)' : 'brightness(0)' }} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/80">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-gray-100 mb-2"
            style={{ color: "var(--brand-blue)" }}
          >
            <img src="/icons/icon-globe.svg" alt="" className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
            Ke Halaman Utama
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-gray-100 mb-2"
            style={{ color: "var(--brand-black)" }}
          >
            <img src="/icons/icon-user.svg" alt="" className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
            Dashboard User
          </Link>
          <LogoutButton
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-red-50 w-full"
            style={{ color: "var(--brand-red)" }}
          />
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around py-2">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                  active ? "" : "hover:bg-gray-100"
                }`}
                style={{
                  ...(active && { color: "var(--brand-sage)" }),
                  ...(!active && { color: "var(--brand-black)" }),
                }}
              >
                <img src={link.icon} alt={link.label} className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
                <span className="text-xs mt-1 font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pl-64 pb-20 md:pb-8">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
