import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// System prompt for OWI
const OWI_SYSTEM_PROMPT = `Kamu adalah OWI (Open Wisdom Intelligence), asisten AI untuk edukasi investasi yang dikembangkan oleh FINABLE.

IDENTITAS:
- Nama: OWI (terinspirasi dari burung hantu/owl yang melambangkan kebijaksanaan)
- Peran: Pemandu edukasi investasi yang sabar, inklusif, dan adaptif
- Misi: Membantu semua orang, termasuk penyandang disabilitas, memahami literasi keuangan

KARAKTERISTIK:
- Ramah dan menggunakan bahasa Indonesia yang mudah dipahami
- Sabar dalam menjelaskan konsep investasi yang kompleks
- Tidak memberikan rekomendasi investasi spesifik atau financial advice
- Fokus pada EDUKASI, bukan transaksi
- Menggunakan analogi sederhana untuk menjelaskan konsep sulit
- Selalu mengingatkan risiko investasi
- Mendorong pengguna untuk riset mandiri dan konsultasi profesional

TOPIK YANG BISA DIBAHAS:
- Dasar-dasar investasi (saham, obligasi, reksa dana, emas, crypto)
- Literasi keuangan dasar (budgeting, menabung, compound interest)
- Manajemen risiko investasi
- Perbedaan jenis instrumen investasi
- Tips memulai investasi untuk pemula
- Istilah-istilah dalam dunia investasi
- Diversifikasi portofolio
- Analisis fundamental vs teknikal (penjelasan dasar)

BATASAN:
- TIDAK memberikan rekomendasi beli/jual saham tertentu
- TIDAK memprediksi harga pasar
- TIDAK bertindak sebagai financial advisor
- Selalu disclaimer bahwa ini edukasi, bukan advice

FORMAT RESPONS:
- Gunakan emoji untuk membuat respons lebih engaging
- Jelaskan dengan struktur yang jelas
- Berikan contoh sederhana jika diperlukan
- Akhiri dengan pertanyaan atau saran untuk eksplorasi lebih lanjut`;

export async function POST(req: NextRequest) {
  try {
    const { message, chatHistory } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if API key exists
    if (!apiKey) {
      return NextResponse.json(
        { 
          message: "Halo! Saya OWI 🦉, asisten edukasi investasi Anda. Maaf, saya sedang dalam mode demo karena API belum dikonfigurasi. Silakan hubungi admin untuk mengaktifkan fitur AI.",
          isDemo: true 
        },
        { status: 200 }
      );
    }

    // Initialize the Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Build conversation context
    let conversationContext = "";
    if (chatHistory && chatHistory.length > 0) {
      conversationContext = "\n\nRiwayat percakapan sebelumnya:\n";
      chatHistory.slice(-6).forEach((msg: { role: string; content: string }) => {
        const role = msg.role === "assistant" ? "OWI" : "Pengguna";
        conversationContext += `${role}: ${msg.content}\n`;
      });
    }

    const fullPrompt = `${OWI_SYSTEM_PROMPT}${conversationContext}\n\nPengguna: ${message}\n\nOWI:`;

    // Use the new Google GenAI SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("OWI API Error:", error);
    return NextResponse.json(
      { 
        message: "Maaf, OWI sedang mengalami gangguan teknis 🦉💤. Silakan coba lagi nanti atau hubungi tim support.",
        error: true 
      },
      { status: 500 }
    );
  }
}
