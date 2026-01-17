"use client";

import Link from "next/link";

interface LessonNavigationProps {
  moduleId: number;
  prevLesson?: { id: number; title: string } | null;
  nextLesson?: { id: number; title: string } | null;
  onComplete?: () => void;
  isCompleting?: boolean;
}

export default function LessonNavigation({
  moduleId,
  prevLesson,
  nextLesson,
  onComplete,
  isCompleting = false,
}: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* Previous Button */}
      {prevLesson ? (
        <Link
          href={`/dashboard/belajar/${moduleId}/lesson/${prevLesson.id}`}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group flex-1 max-w-xs"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <div className="text-left min-w-0">
            <p className="text-xs text-gray-500">Sebelumnya</p>
            <p className="text-sm font-medium truncate" style={{ color: "var(--brand-black)" }}>
              {prevLesson.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1 max-w-xs" />
      )}

      {/* Next Button */}
      {nextLesson ? (
        <Link
          href={`/dashboard/belajar/${moduleId}/lesson/${nextLesson.id}`}
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-white transition-all group flex-1 max-w-xs justify-end"
          style={{ 
            backgroundColor: "var(--brand-sage)",
            boxShadow: "0 4px 14px rgba(80, 217, 144, 0.3)"
          }}
        >
          <div className="text-right min-w-0">
            <p className="text-xs text-white/80">Selanjutnya</p>
            <p className="text-sm font-medium truncate">
              {nextLesson.title}
            </p>
          </div>
          <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      ) : (
        <button
          onClick={onComplete}
          disabled={isCompleting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all flex-1 max-w-xs justify-center font-medium"
          style={{ 
            backgroundColor: isCompleting ? "#9CA3AF" : "var(--brand-sage)",
            boxShadow: isCompleting ? "none" : "0 4px 14px rgba(80, 217, 144, 0.3)"
          }}
        >
          {isCompleting ? (
            <>
              <span className="animate-spin">⏳</span>
              Menyimpan...
            </>
          ) : (
            <>
              <span>🎉</span>
              Selesaikan Kelas
            </>
          )}
        </button>
      )}
    </div>
  );
}
