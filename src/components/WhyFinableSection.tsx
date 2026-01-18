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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-20 h-20 bg-emerald-300 rounded-xl transform rotate-45  opacity-90 shadow-lg"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] w-20 h-20 bg-white border-2 border-emerald-500 rounded-xl transform rotate-45  flex items-center justify-center shadow-2xl z-10 transition-transform hover:-translate-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600 transform -rotate-45 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 rounded-lg transform rotate-45 shadow-xl animate-float"></div>
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
            <div className="relative w-32 h-32">
                {/* Rising Bar Chart Isometric */}
                <div className="absolute bottom-6 left-6 w-6 h-12 bg-teal-300 transform  border-r border-b border-teal-500 origin-bottom transition-all hover:h-16"></div>
                <div className="absolute bottom-4 left-14 w-6 h-20 bg-teal-400 transform  border-r border-b border-teal-600 origin-bottom shadow-md transition-all hover:h-24"></div>
                <div className="absolute bottom-2 left-22 w-6 h-28 bg-teal-500 transform  border-r border-b border-teal-700 origin-bottom shadow-xl transition-all hover:h-32"></div>

                {/* Ground */}
                <div className="absolute bottom-4 left-0 w-32 h-20 bg-gray-100 rounded-full transform scale-y-50 -z-10 opacity-50"></div>
            </div>
        )
    },
    {
        title: "Financial Freedom untuk Semua",
        subtitle: "Efisiensi Waktu Belajar",
        description: "Materi kompleks disaring menjadi intisari. Paham konsep investasi dalam 5 menit, bukan 5 jam seminar.",
        color: "var(--brand-blue)",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        visual: (
            <div className="relative w-32 h-32 group">
                {/* Funnel / Filter Metaphor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-indigo-200 rounded-t-lg transform opacity-80"></div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-16 bg-indigo-400 transform border-x-2 border-indigo-300"></div>
                {/* Gold Coin Dropping */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg animate-bounce transform skew-x-12 z-10 flex items-center justify-center">
                    <span className="text-yellow-800 text-sm font-bold">$</span>
                </div>
            </div>
        )
    }
];

export default function WhyFinableSection() {
    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute -left-20 top-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
                <div className="absolute -right-20 bottom-20 w-96 h-96 bg-yellow-100 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
            </div>

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
                            className="group bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col items-center text-center overflow-hidden relative"
                        >
                            {/* Top Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-sage)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Visual Area */}
                            <div className="h-40 w-full flex items-center justify-center mb-6 bg-gray-50/50 rounded-2xl group-hover:bg-white transition-colors">
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

                            {/* Bottom Decorative Curve */}
                            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
