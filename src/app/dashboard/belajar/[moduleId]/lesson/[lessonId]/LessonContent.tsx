"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LessonSidebar from "@/components/learning/LessonSidebar";
import LessonNavigation from "@/components/learning/LessonNavigation";
import type { LearningModule, ModuleLesson } from "@/lib/supabase/database.types";

interface LessonTreeItem {
  id: number;
  title: string;
  parent_id: number | null;
  children?: LessonTreeItem[];
  [key: string]: any;
}

interface LessonContentProps {
  module: LearningModule;
  lesson: ModuleLesson;
  lessonTree: LessonTreeItem[];
  completedLessonIds: number[];
  unlockedLessonIds: number[];
  prevLesson: { id: number; title: string } | null;
  nextLesson: { id: number; title: string } | null;
  progressPercentage: number;
  totalTopLevelMaterials: number;
  totalLessonsForProgress: number;
  completedCount: number;
}

export default function LessonContent({
  module,
  lesson,
  lessonTree,
  completedLessonIds,
  unlockedLessonIds,
  prevLesson,
  nextLesson,
  progressPercentage,
  totalTopLevelMaterials,
  totalLessonsForProgress,
  completedCount,
}: LessonContentProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completed, setCompleted] = useState(completedLessonIds);

  // Calculate current progress based on local state
  const getAllLessonIdsFromTree = (): number[] => {
    const ids: number[] = [];
    for (const parent of lessonTree) {
      ids.push(parent.id);
      if (parent.children && parent.children.length > 0) {
        ids.push(...parent.children.map((c: any) => c.id));
      }
    }
    return ids;
  };
  
  const allLessonIds = getAllLessonIdsFromTree();
  const currentCompletedCount = completed.filter((id) => allLessonIds.includes(id)).length;
  
  const currentProgress = totalLessonsForProgress > 0 
    ? Math.round((currentCompletedCount / totalLessonsForProgress) * 100) 
    : 0;

  const handleComplete = async () => {
    if (completed.includes(lesson.id)) return;
    
    setIsCompleting(true);
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
      });
      
      if (res.ok) {
        setCompleted([...completed, lesson.id]);
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNavigateNext = () => {
    handleComplete();
  };

  const handleFinishCourse = async () => {
    await handleComplete();
    router.push(`/dashboard/belajar/${module.module_id}`);
  };

  // Parse and render content
  const renderContent = (content: string | null) => {
    if (!content) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <p>Konten materi sedang dalam pengembangan</p>
        </div>
      );
    }

    // Check if content is HTML (from rich text editor)
    if (content.trim().startsWith('<')) {
      return (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            color: "var(--brand-black)",
          }}
        />
      );
    }

    // Simple markdown-like rendering for plain text
    return (
      <div className="prose prose-lg max-w-none" style={{ color: "var(--brand-black)" }}>
        {content.split('\n').map((line, index) => {
          if (line.startsWith('# ')) {
            return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.slice(2)}</h2>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{line.slice(3)}</h3>;
          }
          if (line.startsWith('### ')) {
            return <h4 key={index} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h4>;
          }
          if (line.startsWith('- ')) {
            return <li key={index} className="ml-4">{line.slice(2)}</li>;
          }
          if (line.trim() === '') {
            return <br key={index} />;
          }
          return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left: Back + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              ☰
            </button>
            <Link
              href={`/dashboard/belajar/${module.module_id}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand-sage)" }}
            >
              <span>←</span>
              <span className="hidden sm:inline">{module.title}</span>
            </Link>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${currentProgress}%`,
                    backgroundColor: "var(--brand-sage)"
                  }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="font-bold" style={{ color: "var(--brand-sage)" }}>
                  {currentProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Right: Exit */}
          <Link
            href="/dashboard/kelas-saya"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
            title="Keluar"
          >
            ✕
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with independent scroll */}
        <LessonSidebar
          lessonTree={lessonTree}
          currentLessonId={lesson.id}
          moduleId={module.module_id}
          completedLessonIds={completed}
          unlockedLessonIds={unlockedLessonIds}
          isOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(false)}
        />

        {/* Content Area with its own scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Lesson Title */}
            <div className="mb-6">
              <h1 
                className="text-xl sm:text-2xl md:text-3xl font-bold"
                style={{ color: "var(--brand-black)" }}
              >
                {lesson.title}
              </h1>
              {completed.includes(lesson.id) && (
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-green-600">
                  <span>✓</span> Selesai
                </span>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
              {renderContent(lesson.content)}
            </div>

            {/* Navigation */}
            <LessonNavigation
              moduleId={module.module_id}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onComplete={nextLesson ? handleNavigateNext : handleFinishCourse}
              isCompleting={isCompleting}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
