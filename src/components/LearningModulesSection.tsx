"use client";

import { useEffect, useState } from "react";
import LearningModuleCard from "./LearningModuleCard";
import { createClient } from "@/lib/supabase/client";
import type { LearningModule } from "@/lib/supabase/database.types";

export default function LearningModulesSection() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("learning_modules")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true })
        .limit(6);
      
      if (data && !error) {
        setModules(data);
      }
      setLoading(false);
    }
    
    fetchModules();
  }, []);

  const accentColors = [
    "var(--brand-blue)",
    "var(--brand-sage)",
    "var(--brand-blue)",
    "var(--brand-sage)",
    "var(--brand-blue)",
    "var(--brand-sage)",
  ];

  return (
    <section id="learning" className="section">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Take your <span style={{ color: "var(--brand-blue)" }}>knowledge</span>
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
              a degree further
            </h2>
            <p className="text-gray-600 max-w-md">
              Tingkatkan literasi investasi Anda dengan modul pembelajaran yang terstruktur dan inklusif.
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Module Count */}
            <span className="px-4 py-2 rounded-full text-sm font-medium text-white" style={{ backgroundColor: "var(--brand-black)" }}>
              {modules.length} Modul Tersedia
            </span>
            
            {/* Slider Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const slider = document.getElementById('learning-slider');
                  const cardWidth = 360;
                  if (slider) slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img src="/icons/Left circle.svg" alt="Previous" className="w-10 h-10" />
              </button>
              <span className="text-sm text-gray-600 min-w-10 text-center">
                1/{Math.max(1, modules.length)}
              </span>
              <button
                onClick={() => {
                  const slider = document.getElementById('learning-slider');
                  const cardWidth = 360;
                  if (slider) slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img src="/icons/Right circle.svg" alt="Next" className="w-10 h-10" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {loading ? (
            <div className="flex gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-none w-[calc(33.333%-16px)] min-w-[320px] h-[280px] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : modules.length > 0 ? (
            <div id="learning-slider" className="flex gap-6 overflow-x-scroll pb-4 snap-x snap-mandatory scrollbar-hide">
              {modules.map((module, index) => (
                <div key={module.module_id} className="mt-5 flex-none w-[calc(33.333%-16px)] min-w-[320px] snap-start">
                  <LearningModuleCard
                    category={module.category || "Umum"}
                    title={module.title}
                    image={module.thumbnail_url || `https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop`}
                    accentColor={accentColors[index % accentColors.length]}
                    href={`/belajar/${module.module_id}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada modul pembelajaran yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
