import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Squares from "@/components/Squares";
import Link from "next/link";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: module, error } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("module_id", id)
    .eq("is_published", true)
    .single();
  
  if (error || !module) {
    notFound();
  }
  
  const getLevelLabel = (level: string) => {
    switch (level) {
      case "basic": return "Pemula";
      case "intermediate": return "Menengah";
      case "advanced": return "Lanjutan";
      default: return level;
    }
  };
  
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "text": return "📖 Teks";
      case "audio": return "🎧 Audio";
      case "visual": return "🎬 Visual";
      case "mixed": return "📦 Campuran";
      default: return type;
    }
  };
  
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section
          className="py-12 text-white"
          style={{ backgroundColor: "var(--brand-black)" }}
        >
          <div className="container px-6">
            <Link 
              href="/belajar" 
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              ← Kembali ke Daftar Modul
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                {module.category && (
                  <span 
                    className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
                    style={{ backgroundColor: "var(--brand-blue)" }}
                  >
                    {module.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--brand-sage)" }}>
                  {module.title}
                </h1>
                <p className="text-lg text-gray-200 mb-6">
                  {module.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    module.difficulty_level === "basic"
                      ? "bg-green-500/20 text-green-300"
                      : module.difficulty_level === "intermediate"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {getLevelLabel(module.difficulty_level)}
                  </span>
                  {module.duration && (
                    <span className="px-4 py-2 rounded-full text-sm bg-white/10">
                      ⏱️ {module.duration}
                    </span>
                  )}
                  <span className="px-4 py-2 rounded-full text-sm bg-white/10">
                    {getContentTypeLabel(module.content_type)}
                  </span>
                </div>
              </div>
              
              <div className="hidden lg:block">
                {module.thumbnail_url ? (
                  <img
                    src={module.thumbnail_url}
                    alt={module.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-64 bg-white/10 rounded-2xl flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-12 relative overflow-hidden">
          {/* Squares Background inside section */}
          <div className="absolute inset-0 -z-10">
            <Squares
              direction="diagonal"
              speed={0.3}
              squareSize={50}
              borderColor="rgba(33, 33, 33, 0.08)"
              hoverFillColor="rgba(80, 217, 144, 0.05)"
            />
          </div>
          
          <div className="container px-6">
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl p-8 shadow-sm overflow-hidden">
                <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
                  Konten Pembelajaran
                </h2>
                
                {module.content ? (
                  <div 
                    className="prose prose-lg max-w-none"
                    style={{ 
                      color: "var(--brand-black)",
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}
                  >
                    {/* Simple markdown-like rendering */}
                    {module.content.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 break-words">{line.slice(2)}</h2>;
                      }
                      if (line.startsWith('## ')) {
                        return <h3 key={index} className="text-xl font-bold mt-6 mb-3 break-words">{line.slice(3)}</h3>;
                      }
                      if (line.startsWith('### ')) {
                        return <h4 key={index} className="text-lg font-bold mt-4 mb-2 break-words">{line.slice(4)}</h4>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={index} className="ml-4 break-words">{line.slice(2)}</li>;
                      }
                      if (line.trim() === '') {
                        return <br key={index} />;
                      }
                      return <p key={index} className="mb-4 leading-relaxed break-words whitespace-pre-wrap">{line}</p>;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p>Konten modul sedang dalam pengembangan</p>
                  </div>
                )}
              </div>
              
              {/* Navigation */}
              <div className="mt-8 flex justify-start">
                <Link
                  href="/belajar"
                  className="px-6 py-3 rounded-xl font-medium border-2 transition-all hover:bg-gray-100"
                  style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)" }}
                >
                  ← Kembali ke Daftar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
