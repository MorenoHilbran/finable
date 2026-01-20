"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { updateProfile } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/supabase/database.types";

const disabilityOptions = [
  { value: "", label: "Tidak ada / Tidak ingin menyebutkan" },
  { value: "tunanetra", label: "Tunanetra" },
  { value: "tunarungu", label: "Tunarungu" },
  { value: "disabilitas_daksa", label: "Disabilitas Daksa" },
  { value: "disabilitas_kognitif", label: "Disabilitas Kognitif" },
];

const accessibilityOptions = [
  { value: "high_contrast", label: "High Contrast Mode" },
  { value: "screen_reader", label: "Screen Reader" },
  { value: "dyslexic_friendly", label: "Dyslexic Friendly" },
  { value: "audio_learning", label: "Audio Learning" },
  { value: "sign_language", label: "Sign Language" },
  { value: "reduced_motion", label: "Reduced Motion" },
];

// Total badges available
const TOTAL_BADGES = 20;

// Badge data with names, descriptions, and tiers
const BADGE_DATA = [
  // Bronze Tier (1-5)
  { id: 1, name: "Langkah Pertama", description: "Selesaikan modul pertamamu", tier: "bronze" },
  { id: 2, name: "Mulai Beraksi", description: "Selesaikan 2 modul pembelajaran", tier: "bronze" },
  { id: 3, name: "Pelajar Aktif", description: "Selesaikan 3 modul pembelajaran", tier: "bronze" },
  { id: 4, name: "Semangat Belajar", description: "Selesaikan 4 modul pembelajaran", tier: "bronze" },
  { id: 5, name: "Bronze Achiever", description: "Raih 5 penyelesaian modul", tier: "bronze" },
  // Silver Tier (6-10)
  { id: 6, name: "Investor Pemula", description: "Selesaikan 6 modul pembelajaran", tier: "silver" },
  { id: 7, name: "Knowledge Seeker", description: "Selesaikan 7 modul pembelajaran", tier: "silver" },
  { id: 8, name: "Halfway Hero", description: "Selesaikan 8 modul pembelajaran", tier: "silver" },
  { id: 9, name: "Dedicated Learner", description: "Selesaikan 9 modul pembelajaran", tier: "silver" },
  { id: 10, name: "Silver Champion", description: "Raih 10 penyelesaian modul", tier: "silver" },
  // Gold Tier (11-15)
  { id: 11, name: "Financial Explorer", description: "Selesaikan 11 modul pembelajaran", tier: "gold" },
  { id: 12, name: "Investment Guru", description: "Selesaikan 12 modul pembelajaran", tier: "gold" },
  { id: 13, name: "Money Master", description: "Selesaikan 13 modul pembelajaran", tier: "gold" },
  { id: 14, name: "Wealth Builder", description: "Selesaikan 14 modul pembelajaran", tier: "gold" },
  { id: 15, name: "Gold Legend", description: "Raih 15 penyelesaian modul", tier: "gold" },
  // Platinum Tier (16-20)
  { id: 16, name: "Elite Investor", description: "Selesaikan 16 modul pembelajaran", tier: "platinum" },
  { id: 17, name: "Financial Genius", description: "Selesaikan 17 modul pembelajaran", tier: "platinum" },
  { id: 18, name: "Master Trader", description: "Selesaikan 18 modul pembelajaran", tier: "platinum" },
  { id: 19, name: "Wealth Wizard", description: "Selesaikan 19 modul pembelajaran", tier: "platinum" },
  { id: 20, name: "Ultimate Champion", description: "Selesaikan semua 20 modul!", tier: "platinum" },
];

// Tier colors and styles
const TIER_STYLES = {
  bronze: {
    gradient: "from-amber-600 to-amber-800",
    bg: "bg-gradient-to-br from-amber-100 to-amber-200",
    border: "border-amber-400",
    text: "text-amber-700",
    glow: "shadow-amber-300",
    icon: "🥉",
    label: "Bronze",
  },
  silver: {
    gradient: "from-gray-400 to-gray-600",
    bg: "bg-gradient-to-br from-gray-100 to-gray-200",
    border: "border-gray-400",
    text: "text-gray-600",
    glow: "shadow-gray-300",
    icon: "🥈",
    label: "Silver",
  },
  gold: {
    gradient: "from-yellow-400 to-yellow-600",
    bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    border: "border-yellow-400",
    text: "text-yellow-700",
    glow: "shadow-yellow-300",
    icon: "🥇",
    label: "Gold",
  },
  platinum: {
    gradient: "from-purple-400 to-indigo-600",
    bg: "bg-gradient-to-br from-purple-100 to-indigo-200",
    border: "border-purple-400",
    text: "text-purple-700",
    glow: "shadow-purple-300",
    icon: "💎",
    label: "Platinum",
  },
};

// Milestone values for celebrations
const MILESTONES = [1, 5, 10, 15, 20];

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [totalBadges, setTotalBadges] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState<typeof BADGE_DATA[0] | null>(null);
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const [newBadgeId, setNewBadgeId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        
        if (data) {
          setProfile(data as User);
          setSelectedAccessibility((data as User).accessibility_profile || []);
        } else {
          setProfile({
            user_id: 0,
            auth_id: user.id,
            full_name: user.user_metadata?.full_name || "",
            email: user.email || "",
            disability_type: null,
            accessibility_profile: null,
            role: "user",
            total_badges: 0,
            created_at: new Date().toISOString(),
          });
        }

        // Get completed MODULES count - a module is complete when all its lessons are done
        if (data) {
          const userData = data as User;
          
          // Get user's enrollments
          const { data: enrollments } = await supabase
            .from("user_enrollments")
            .select("module_id")
            .eq("user_id", userData.user_id);
          
          let completedCount = 0;
          
          if (enrollments && enrollments.length > 0) {
            // Check each module's completion status
            for (const enrollment of enrollments as { module_id: number }[]) {
              // Get all lessons for this module
              const { data: lessons } = await supabase
                .from("module_lessons")
                .select("id")
                .eq("module_id", enrollment.module_id)
                .eq("is_published", true);
              
              if (lessons && lessons.length > 0) {
                const lessonIds = (lessons as { id: number }[]).map(l => l.id);
                
                // Get completed lessons for this user in this module
                const { data: completedLessons } = await supabase
                  .from("user_lesson_progress")
                  .select("lesson_id")
                  .eq("user_id", userData.user_id)
                  .eq("is_completed", true)
                  .in("lesson_id", lessonIds);
                
                // Check if all lessons are completed
                const completedLessonIds = ((completedLessons || []) as { lesson_id: number }[]).map(cl => cl.lesson_id);
                const allCompleted = lessonIds.every(id => completedLessonIds.includes(id));
                
                if (allCompleted) {
                  completedCount++;
                }
              }
            }
          }
          
          setCompletedModules(completedCount);
          
          // Calculate badges based on completed MODULES (1 badge per module, max 20)
          const earnedBadges = Math.min(completedCount, TOTAL_BADGES);
          setTotalBadges(earnedBadges);

          // Save badge unlock dates
          if (earnedBadges > 0) {
            const storedDates = localStorage.getItem("finable_badge_unlock_dates");
            let dates: Record<string, string> = {};
            if (storedDates) {
              try { dates = JSON.parse(storedDates); } catch { /* ignore */ }
            }
            const now = new Date().toISOString();
            for (let i = 1; i <= earnedBadges; i++) {
              if (!dates[i.toString()]) {
                dates[i.toString()] = now;
              }
            }
            localStorage.setItem("finable_badge_unlock_dates", JSON.stringify(dates));
          }

          // Check for new badge (simulate - in production, compare with previous)
          const storedBadges = localStorage.getItem("finable_last_badges_count");
          const lastBadges = storedBadges ? parseInt(storedBadges) : 0;
          if (earnedBadges > lastBadges) {
            setNewBadgeId(earnedBadges);
            // Check for milestone
            if (MILESTONES.includes(earnedBadges)) {
              setShowMilestone(earnedBadges);
            }
          }
          localStorage.setItem("finable_last_badges_count", earnedBadges.toString());
        }
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  function toggleAccessibility(value: string) {
    setSelectedAccessibility((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setMessage(null);

    selectedAccessibility.forEach((value) => {
      formData.append("accessibilityProfile", value);
    });

    const result = await updateProfile(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      setIsEditing(false);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        if (data) {
          setProfile(data);
        }
      }
    }
    setIsSaving(false);
  }

  function formatJoinDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }

  // Get current tier based on badges
  function getCurrentTier() {
    if (totalBadges >= 16) return "platinum";
    if (totalBadges >= 11) return "gold";
    if (totalBadges >= 6) return "silver";
    return "bronze";
  }

  // Get progress to next badge
  function getNextBadgeProgress() {
    if (totalBadges >= TOTAL_BADGES) return { current: TOTAL_BADGES, next: TOTAL_BADGES, progress: 100 };
    const modulesNeeded = totalBadges + 1;
    const progress = (completedModules / modulesNeeded) * 100;
    return { current: completedModules, next: modulesNeeded, progress: Math.min(progress, 100) };
  }

  // Get badge unlock date from localStorage
  function getBadgeUnlockDate(badgeId: number): string {
    const storedDates = localStorage.getItem("finable_badge_unlock_dates");
    if (storedDates) {
      try {
        const dates = JSON.parse(storedDates) as Record<string, string>;
        if (dates[badgeId.toString()]) {
          return new Date(dates[badgeId.toString()]).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
      } catch {
        // Ignore parse errors
      }
    }
    return "Tanggal tidak tercatat";
  }

  // Save badge unlock dates when new badges are earned
  function saveBadgeUnlockDates(currentBadges: number) {
    const storedDates = localStorage.getItem("finable_badge_unlock_dates");
    let dates: Record<string, string> = {};
    if (storedDates) {
      try {
        dates = JSON.parse(storedDates);
      } catch {
        // Start fresh if corrupted
      }
    }
    
    // Add unlock date for any new badges
    const now = new Date().toISOString();
    for (let i = 1; i <= currentBadges; i++) {
      if (!dates[i.toString()]) {
        dates[i.toString()] = now;
      }
    }
    
    localStorage.setItem("finable_badge_unlock_dates", JSON.stringify(dates));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <img src="/icons/icon-loading.svg" alt="" className="w-12 h-12 animate-spin mb-4 mx-auto" />
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const tierStyle = TIER_STYLES[currentTier];
  const nextProgress = getNextBadgeProgress();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Milestone Celebration Modal */}
      {showMilestone && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in relative overflow-hidden"
            style={{ animation: "bounceIn 0.5s ease-out" }}
          >
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    backgroundColor: ["#FFD700", "#50D990", "#4E99CC", "#FF6B6B", "#A855F7"][i % 5],
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>

            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
              Selamat!
            </h2>
            <p className="text-gray-600 mb-4">
              Kamu telah mencapai <span className="font-bold text-[var(--brand-sage)]">{showMilestone} Badge</span>!
            </p>
            
            <div className="flex justify-center mb-6">
              <div 
                className={`w-24 h-24 rounded-2xl ${TIER_STYLES[BADGE_DATA[showMilestone - 1].tier as keyof typeof TIER_STYLES].bg} p-3 shadow-lg`}
              >
                <img
                  src={`/badge/badge-${showMilestone}.svg`}
                  alt={BADGE_DATA[showMilestone - 1].name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <p className="font-semibold text-lg mb-1">{BADGE_DATA[showMilestone - 1].name}</p>
            <p className="text-sm text-gray-500 mb-6">{BADGE_DATA[showMilestone - 1].description}</p>

            <button
              onClick={() => setShowMilestone(null)}
              className="btn btn-primary w-full"
            >
              Lanjutkan! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-32 h-32 mx-auto rounded-2xl ${TIER_STYLES[selectedBadge.tier as keyof typeof TIER_STYLES].bg} p-4 mb-4 ${selectedBadge.id <= totalBadges ? "shadow-lg" : ""}`}>
              <img
                src={`/badge/badge-${selectedBadge.id}.svg`}
                alt={selectedBadge.name}
                className={`w-full h-full object-contain ${selectedBadge.id > totalBadges ? "grayscale opacity-50" : ""}`}
              />
            </div>

            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-3 ${TIER_STYLES[selectedBadge.tier as keyof typeof TIER_STYLES].bg} ${TIER_STYLES[selectedBadge.tier as keyof typeof TIER_STYLES].text}`}>
              {TIER_STYLES[selectedBadge.tier as keyof typeof TIER_STYLES].icon} {TIER_STYLES[selectedBadge.tier as keyof typeof TIER_STYLES].label}
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--brand-dark-blue)" }}>
              {selectedBadge.name}
            </h3>
            <p className="text-gray-600 mb-4">{selectedBadge.description}</p>

            {selectedBadge.id <= totalBadges ? (
              <div className="p-3 rounded-xl bg-green-50 text-green-700">
                <div className="font-medium mb-1">✓ Badge Unlocked!</div>
                <div className="text-sm text-green-600">
                  Didapatkan pada: {getBadgeUnlockDate(selectedBadge.id)}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-gray-100 text-gray-500">
                🔒 Selesaikan {selectedBadge.id} modul untuk unlock
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-sage)" }}
        >
          <span>←</span>
          <span>Kembali ke Dashboard</span>
        </Link>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/dashboard"
                className="transition-colors hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                Dashboard
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li
              className="font-medium"
              style={{ color: "var(--brand-black)" }}
            >
              Profil
            </li>
          </ol>
        </nav>
      </div>

      {/* Message */}
      {message && (
        <div
          className="p-4 rounded-xl mb-6"
          style={{
            background: message.type === "success" 
              ? "rgba(70, 185, 131, 0.1)" 
              : "rgba(176, 24, 62, 0.1)",
            color: message.type === "success" 
              ? "var(--brand-sage)" 
              : "#dc2626",
          }}
        >
          <img src={message.type === "success" ? "/icons/icon-success.svg" : "/icons/icon-warning.svg"} alt="" className="w-5 h-5 mr-2 inline" />
          {message.text}
        </div>
      )}

      {/* Profile Header Card */}
      <div 
        className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--brand-sage) 0%, #3d9e6e 100%)" }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-white/20 backdrop-blur-sm border-4 border-white/30"
          >
            {profile?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          
          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {profile?.full_name || "User"}
            </h1>
            <p className="text-white/80 mb-2">{email}</p>
            <p className="text-white/60 text-sm">
              Bergabung sejak {profile?.created_at ? formatJoinDate(profile.created_at) : "-"}
            </p>
            {/* Current Tier Badge */}
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/20">
              <span>{tierStyle.icon}</span>
              <span className="text-sm font-medium">{tierStyle.label} Tier</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="text-center">
            <div>
              <div className="text-3xl font-bold">{completedModules}</div>
              <div className="text-white/70 text-sm">Modul Selesai</div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <img src="/icons/icon-edit.svg" alt="" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
          {isEditing ? "Batal" : "Edit Profil"}
        </button>
      </div>

      {/* Progress to Next Badge */}
      {totalBadges < TOTAL_BADGES && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: "var(--brand-dark-blue)" }}>
              Progress ke Badge Selanjutnya
            </h3>
            <span className="text-sm text-gray-500">
              {completedModules} / {nextProgress.next} modul
            </span>
          </div>

          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--brand-sage)] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${nextProgress.progress}%` }}
            />
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent rounded-full animate-shimmer"
              style={{ width: `${nextProgress.progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${TIER_STYLES[BADGE_DATA[totalBadges]?.tier as keyof typeof TIER_STYLES || 'bronze'].bg} p-1`}>
              <img
                src={`/badge/badge-${totalBadges + 1}.svg`}
                alt={BADGE_DATA[totalBadges]?.name}
                className="w-full h-full object-contain grayscale"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm" style={{ color: "var(--brand-dark-blue)" }}>
                {BADGE_DATA[totalBadges]?.name || "Badge Berikutnya"}
              </p>
              <p className="text-xs text-gray-500">
                {nextProgress.next - completedModules} modul lagi untuk unlock!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: "var(--brand-black)" }}>
            Koleksi Badges
          </h2>
          <span className="text-sm text-gray-500">
            {totalBadges} / {TOTAL_BADGES} badges
          </span>
        </div>

        {/* Tier Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TIER_STYLES).map(([key, style]) => (
            <div 
              key={key}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}
            >
              {style.icon} {style.label}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
          {BADGE_DATA.map((badge) => {
            const isEarned = badge.id <= totalBadges;
            const isNew = badge.id === newBadgeId;
            const tierStyle = TIER_STYLES[badge.tier as keyof typeof TIER_STYLES];
            
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative aspect-square rounded-xl p-2 transition-all hover:scale-105 cursor-pointer border-2 ${
                  isEarned 
                    ? `${tierStyle.bg} ${tierStyle.border} shadow-md hover:shadow-lg` 
                    : "bg-gray-100 border-gray-200 opacity-60 hover:opacity-80"
                } ${isNew ? "animate-pulse ring-2 ring-yellow-400 ring-offset-2" : ""}`}
                title={`${badge.name} - ${isEarned ? "Unlocked!" : "Locked"}`}
              >
                <img
                  src={`/badge/badge-${badge.id}.svg`}
                  alt={badge.name}
                  className={`w-full h-full object-contain ${!isEarned ? "grayscale" : ""}`}
                />
                {!isEarned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                    <img src="/icons/icon-lock.svg" alt="Locked" className="w-5 h-5 opacity-70" />
                  </div>
                )}
                {isNew && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                    ✨
                  </div>
                )}
                {/* Tier indicator */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs`}>
                  {tierStyle.icon}
                </div>
              </button>
            );
          })}
        </div>

        {totalBadges === 0 && (
          <p className="text-center text-gray-500 mt-6">
            Selesaikan modul pembelajaran untuk mendapatkan badges! 🎯
          </p>
        )}

        {totalBadges === TOTAL_BADGES && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 text-center">
            <span className="text-2xl">🏆</span>
            <p className="font-semibold text-purple-700 mt-2">Selamat! Kamu telah mengumpulkan semua badges!</p>
            <p className="text-sm text-purple-600">Kamu adalah Ultimate Champion!</p>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="card">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
            Edit Profil
          </h2>
          
          <form action={handleSubmit} className="space-y-6">
            {/* Email (readonly) */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 bg-gray-100 cursor-not-allowed"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Email tidak dapat diubah
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Nama Lengkap
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                defaultValue={profile?.full_name || ""}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-black)",
                }}
              />
            </div>

            {/* Disability Type */}
            <div>
              <label
                htmlFor="disabilityType"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Tipe Disabilitas
              </label>
              <select
                id="disabilityType"
                name="disabilityType"
                defaultValue={profile?.disability_type || ""}
                className="w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none bg-white"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--brand-dark-blue)",
                }}
              >
                {disabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility Profile */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                Preferensi Aksesibilitas
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Pilih fitur aksesibilitas yang Anda butuhkan
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {accessibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleAccessibility(option.value)}
                    className="p-3 rounded-xl border-2 text-left text-sm transition-all"
                    style={{
                      borderColor: selectedAccessibility.includes(option.value)
                        ? "var(--brand-sage)"
                        : "var(--border)",
                      background: selectedAccessibility.includes(option.value)
                        ? "rgba(80, 217, 144, 0.1)"
                        : "white",
                      color: "var(--brand-black)",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary flex-1"
                style={{ opacity: isSaving ? 0.7 : 1 }}
              >
                {isSaving ? (
                  <>
                    <img src="/icons/icon-loading.svg" alt="" className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Details Card (when not editing) */}
      {!isEditing && (
        <div className="card">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
            Informasi Profil
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Email</span>
              <span className="font-medium" style={{ color: "var(--brand-black)" }}>{email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Nama Lengkap</span>
              <span className="font-medium" style={{ color: "var(--brand-black)" }}>{profile?.full_name || "-"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Tipe Disabilitas</span>
              <span className="font-medium" style={{ color: "var(--brand-black)" }}>
                {disabilityOptions.find(o => o.value === profile?.disability_type)?.label || "Tidak ada"}
              </span>
            </div>
            <div className="py-3">
              <span className="text-gray-600 block mb-2">Preferensi Aksesibilitas</span>
              <div className="flex flex-wrap gap-2">
                {profile?.accessibility_profile && profile.accessibility_profile.length > 0 ? (
                  profile.accessibility_profile.map((pref) => (
                    <span
                      key={pref}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ background: "rgba(80, 217, 144, 0.1)", color: "var(--brand-sage)" }}
                    >
                      {accessibilityOptions.find(o => o.value === pref)?.label || pref}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Belum diatur</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-200px) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
