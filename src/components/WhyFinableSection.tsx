"use client";

import React from "react";
import Squares from "./Squares";

const reasons = [
    {
        title: "Edukasi Investasi Ramah Disabilitas",
        subtitle: "Inklusifitas Adaptif",
        description: "Tampilan yang otomatis menyesuaikan diri dengan kondisi fisik Anda. Bukan Anda yang harus beradaptasi.",
        color: "var(--brand-sage)",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        visual: (
            <div className="relative w-32 h-32 transform transition-transform duration-500 hover:scale-110">
                {/* Abstract Isometric Layers */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-emerald-400 rounded-xl transform rotate-45  opacity-80 animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-20 h-20 bg-emerald-300 rounded-xl transform rotate-45  opacity-90"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] w-20 h-20 bg-white border-2 border-emerald-500 rounded-xl transform rotate-45  flex items-center justify-center z-10 transition-transform hover:-translate-y-10">
                    {/* Stickman Accessibility Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {/* Head */}
                        <circle cx="12" cy="4" r="2" fill="currentColor" />
                        {/* Body */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6" />
                        {/* Arms */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8" />
                        {/* Legs */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l-3 6M12 12l3 6" />
                    </svg>
                </div>
            </div>
        )
    },
    {
        title: "Konsultan Inklusif Berbasis AI",
        subtitle: "Ruang Belajar Tanpa Penghakiman",
        description: "Bersama OWI, tidak ada pertanyaan bodoh. Tanyakan hal paling dasar sekalipun tanpa rasa malu, kapan saja.",
        color: "var(--brand-blue)",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        visual: (
            <div className="relative w-32 h-32">
                {/* Floating Owl Head Block */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 rounded-lg transform rotate-45 animate-float"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-20 h-20 bg-white border-4 border-blue-500 rounded-lg transform rotate-45 flex items-center justify-center z-10 animate-float" style={{ animationDelay: '0.1s' }}>
                    <img src="/mascot/owi-mascot-1.svg" alt="OWI" className="w-12 h-12 transform -rotate-45" />
                </div>
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>
        )
    },
    {
        title: "Simulasi Sebelum Terjun",
        subtitle: "Latihan Mentalitas Investor",
        description: "Melatih keputusan dan emosi tanpa risiko. Praktekkan strategi investasi Anda dalam simulasi nyata.",
        color: "var(--brand-sage)",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        visual: (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/animations/simulasi.webm" type="video/webm" />
                </video>
            </div>
        )
    },
    {
        title: "Pencatatan Portofolio Investasi",
        subtitle: "Pantau Aset Anda",
        description: "Catat dan pantau seluruh investasi Anda dalam satu tempat. Visualisasi portofolio yang mudah dipahami untuk semua orang.",
        color: "var(--brand-blue)",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        visual: (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/animations/pencatatan_investasi.webm" type="video/webm" />
                </video>
            </div>
        )
    }
];

export default function WhyFinableSection() {
    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            {/* Background Decorative */}


            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--brand-black)]">
                        Kenapa <span className="text-[var(--brand-blue)]">Finable?</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Aksesibilitas dan teknologi bersatu untuk menciptakan pengalaman belajar investasi yang setara bagi semua.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="group relative rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                            style={{
                                background: "rgba(255, 255, 255, 0.6)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.8)",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                            }}
                        >
                            {/* Inner glow on hover */}
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)" }}></div>

                            {/* Visual Area */}
                            <div className="h-40 w-full flex items-center justify-center mb-6 rounded-2xl transition-colors relative z-10" style={{ background: "rgba(248, 250, 252, 0.5)" }}>
                                {reason.visual}
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[var(--brand-blue)] transition-colors">
                                    {reason.title}
                                </h3>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${reason.iconBg} ${reason.iconColor}`}>
                                    {reason.subtitle}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
