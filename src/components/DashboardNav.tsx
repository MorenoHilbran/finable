"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

interface NavLink {
  href: string;
  label: string;
  icon: string;
  subLinks?: { href: string; label: string; icon: string }[];
}

const sidebarLinks: NavLink[] = [
  { href: "/dashboard", label: "Beranda", icon: "/icons/icon-home.svg" },
  { href: "/dashboard/kelas-saya", label: "Kelas Saya", icon: "/icons/learn.svg" },
  {
    href: "/dashboard/investasi",
    label: "Investasi",
    icon: "/icons/invest.svg",
    subLinks: [
      { href: "/dashboard/investasi/simulasi", label: "Simulasi", icon: "/icons/icon-target.svg" },
      { href: "/dashboard/investasi/catatan", label: "Portofolio", icon: "/icons/icon-note.svg" },
    ],
  },
  { href: "/dashboard/profile", label: "Profile", icon: "/icons/icon-user.svg" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  function isParentActive(link: NavLink) {
    if (isActive(link.href)) return true;
    if (link.subLinks) {
      return link.subLinks.some((sub) => isActive(sub.href));
    }
    return false;
  }

  function toggleDropdown(href: string) {
    setOpenDropdown(openDropdown === href ? null : href);
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-md shadow-lg overflow-y-auto hidden md:block"
        style={{ borderRight: "1px solid rgba(226, 232, 240, 0.8)" }}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const active = isParentActive(link);
              const hasSubLinks = link.subLinks && link.subLinks.length > 0;
              const isOpen = openDropdown === link.href || (hasSubLinks && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  {hasSubLinks ? (
                    // Parent with dropdown
                    <div>
                      <div
                        className={`flex items-center rounded-xl transition-all ${active ? '' : 'hover:bg-gray-100'}`}
                        style={{
                          ...(active && {
                            background: "var(--brand-sage)",
                            boxShadow: "0 4px 14px rgba(80, 217, 144, 0.3)",
                          }),
                        }}
                      >
                        <Link
                          href={link.href}
                          className="flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                          style={{
                            color: active ? "white" : "var(--brand-black)",
                          }}
                        >
                          <img src={link.icon} alt={link.label} className="w-5 h-5" style={{ filter: active ? 'brightness(0) invert(1)' : 'brightness(0)' }} />
                          {link.label}
                        </Link>
                        <button
                          onClick={() => toggleDropdown(link.href)}
                          className="px-3 py-3 transition-colors"
                          style={{
                            color: active ? "white" : "var(--brand-black)",
                          }}
                          aria-label={`Toggle ${link.label} submenu`}
                        >
                          <span
                            className="text-xs transition-transform duration-200 inline-block"
                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                          >
                            <img src="/icons/icon-chevron-down.svg" alt="" className="w-3 h-3" style={{ filter: active ? 'brightness(0) invert(1)' : 'brightness(0)' }} />
                          </span>
                        </button>
                      </div>
                      {/* Dropdown submenu */}
                      <div
                        className="overflow-hidden transition-all duration-200"
                        style={{
                          maxHeight: isOpen ? "200px" : "0",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                          {link.subLinks?.map((subLink) => {
                            const subActive = isActive(subLink.href);
                            return (
                              <li key={subLink.href}>
                                <Link
                                  href={subLink.href}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${subActive ? '' : 'hover:bg-gray-100'}`}
                                  style={{
                                    color: subActive ? "var(--brand-sage)" : "var(--brand-black)",
                                    fontWeight: subActive ? 600 : 400,
                                    background: subActive ? "rgba(80, 217, 144, 0.1)" : "transparent",
                                  }}
                                >
                                  <img src={subLink.icon} alt={subLink.label} className="w-4 h-4" style={{ filter: 'brightness(0)' }} />
                                  {subLink.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    // Regular link without dropdown
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? '' : 'hover:bg-gray-100'}`}
                      style={{
                        color: active ? "white" : "var(--brand-black)",
                        ...(active && {
                          background: "var(--brand-sage)",
                          boxShadow: "0 4px 14px rgba(80, 217, 144, 0.3)",
                        }),
                      }}
                    >
                      <img src={link.icon} alt={link.label} className="w-5 h-5" style={{ filter: active ? 'brightness(0) invert(1)' : 'brightness(0)' }} />
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/80">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-blue-50 mb-2"
            style={{ color: "var(--brand-blue)" }}
          >
            <img src="/icons/icon-globe.svg" alt="Ke Halaman Utama" className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
            Ke Halaman Utama
          </Link>
          <LogoutButton
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-red-50 w-full"
            style={{ color: "var(--brand-red)" }}
          />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg md:hidden z-50"
        style={{ borderTop: "1px solid rgba(226, 232, 240, 0.8)" }}
      >
        <div className="flex justify-around items-center h-16">
          {sidebarLinks.slice(0, 3).map((link) => {
            const active = isParentActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all"
                style={{
                  color: active ? "var(--brand-sage)" : "var(--brand-black)",
                  background: active ? "rgba(80, 217, 144, 0.1)" : "transparent",
                }}
              >
                <img src={link.icon} alt={link.label} className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
          <LogoutButton
            className="flex flex-col items-center gap-1 py-2 px-4"
            style={{ color: "var(--brand-red)" }}
          />
        </div>
      </nav>
    </>
  );
}
