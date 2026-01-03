"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { logout } from "@/app/(auth)/actions";

export default function LogoutButton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal = showConfirm && mounted ? (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 99999,
      }}
      onClick={() => setShowConfirm(false)}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
        style={{ zIndex: 100000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">🦉</div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: "var(--brand-black)" }}
        >
          Yakin ingin keluar?
        </h3>
        <p className="text-gray-600 mb-6">
          Anda akan keluar dari akun dan kembali ke halaman utama.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="btn btn-secondary flex-1"
          >
            Batal
          </button>
          <form action={logout} className="flex-1">
            <button
              type="submit"
              className="btn w-full"
              style={{
                background: "#dc2626",
                color: "white",
              }}
            >
              Ya, Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className={className}
        style={style}
      >
        <span className="text-xl">🚪</span>
        <span>Keluar</span>
      </button>

      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}
