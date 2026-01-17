"use client";

import Link from "next/link";

interface LessonTreeItem {
  id: number;
  title: string;
  parent_id: number | null;
  children?: LessonTreeItem[];
  [key: string]: any;
}

interface LessonSidebarProps {
  lessonTree: LessonTreeItem[];
  currentLessonId: number;
  moduleId: number;
  completedLessonIds: number[];
  unlockedLessonIds: number[];
  onToggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function LessonSidebar({
  lessonTree,
  currentLessonId,
  moduleId,
  completedLessonIds,
  unlockedLessonIds,
  onToggleSidebar,
  isOpen = true,
}: LessonSidebarProps) {

  const getStatusIcon = (lessonId: number, isUnlocked: boolean) => {
    if (completedLessonIds.includes(lessonId)) {
      return (
        <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shrink-0">
          <img src="/icons/icon-check.svg" alt="" className="w-3 h-3 invert brightness-0" />
        </span>
      );
    }
    if (!isUnlocked) {
      return (
        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0">
          <img src="/icons/icon-lock.svg" alt="" className="w-3 h-3 opacity-50" />
        </span>
      );
    }
    if (lessonId === currentLessonId) {
      return (
        <span 
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0"
          style={{ backgroundColor: "var(--brand-sage)" }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </span>
      );
    }
    return (
      <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs shrink-0">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </span>
    );
  };

  const renderLesson = (
    lesson: LessonTreeItem, 
    displayNumber: string,
    isUnlocked: boolean,
    isParent: boolean = false
  ) => {
    const isActive = lesson.id === currentLessonId;
    const isCompleted = completedLessonIds.includes(lesson.id);

    if (!isUnlocked) {
      return (
        <div
          key={lesson.id}
          className="flex items-start gap-3 p-3 rounded-lg opacity-50 cursor-not-allowed"
        >
          {getStatusIcon(lesson.id, false)}
          <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-400 font-medium">{displayNumber}</span>
            <p className="text-sm leading-tight text-gray-400">
              {lesson.title}
            </p>
            {isParent && (
              <span className="text-xs text-gray-400">Pengantar</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={lesson.id}
        href={`/dashboard/belajar/${moduleId}/lesson/${lesson.id}`}
        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
          isActive 
            ? "bg-green-50" 
            : "hover:bg-gray-50"
        }`}
        style={{
          borderLeft: isActive ? "3px solid var(--brand-sage)" : "3px solid transparent",
        }}
      >
        {getStatusIcon(lesson.id, true)}
        <div className="flex-1 min-w-0">
          <span className="text-xs text-gray-400 font-medium">{displayNumber}</span>
          <p 
            className={`text-sm leading-tight ${
              isActive 
                ? "font-semibold" 
                : isCompleted 
                  ? "text-gray-500" 
                  : ""
            }`}
            style={{ color: isActive ? "var(--brand-sage)" : "var(--brand-black)" }}
          >
            {lesson.title}
          </p>
          {isParent && (
            <span className="text-xs text-gray-400">Pengantar</span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar with independent scroll */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen lg:h-auto w-72 bg-white shadow-xl lg:shadow-sm z-50 lg:z-auto transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile Header - Fixed */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b shrink-0">
          <h3 className="font-semibold" style={{ color: "var(--brand-black)" }}>
            Daftar Materi
          </h3>
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <img src="/icons/icon-close.svg" alt="" className="w-4 h-4" />
          </button>
        </div>

        {/* Lessons List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {lessonTree.map((parent, idx) => {
            const hasChildren = parent.children && parent.children.length > 0;
            const isParentUnlocked = unlockedLessonIds.includes(parent.id);
            
            return (
              <div key={parent.id}>
                {/* Parent Lesson */}
                <div className="mt-2">
                  {renderLesson(parent, `${idx + 1}`, isParentUnlocked, hasChildren)}
                </div>
                
                {/* Children */}
                {hasChildren && (
                  <div className="ml-4 pl-2 border-l-2 border-gray-200 space-y-1 mt-1">
                    {parent.children!.map((child, childIdx) => {
                      const isUnlocked = unlockedLessonIds.includes(child.id);
                      return (
                        <div key={child.id}>
                          {renderLesson(child, `${idx + 1}.${childIdx + 1}`, isUnlocked)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
