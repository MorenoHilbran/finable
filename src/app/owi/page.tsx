"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function OWIPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message;
    if (!messageToSend.trim() || isLoading) return;

    setShowWelcome(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/owi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi nanti.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Apa itu investasi dan bagaimana cara memulainya?",
    "Bagaimana cara memilih reksa dana yang tepat?",
    "Apa perbedaan saham dan obligasi?",
    "Tips menabung untuk pemula",
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-28 pb-16 min-h-screen bg-linear-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-3">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "var(--brand-sage)" }}
              >
                <img src="/mascot/owi-mascot-3.svg" alt="OWI" className="w-10 h-10" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold" style={{ color: "var(--brand-black)" }}>
                  OWI Assistant
                </h1>
                <p className="text-sm text-gray-500">AI Edukasi Investasi</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Messages Area */}
            <div className="h-125 overflow-y-auto">
              {showWelcome && messages.length === 0 ? (
                /* Welcome Screen */
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: "var(--brand-sage)" }}
                  >
                    <img src="/mascot/owi-mascot-4.svg" alt="OWI" className="w-12 h-12" />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: "var(--brand-black)" }}>
                    Halo! Saya OWI
                  </h2>
                  <p className="text-gray-500 text-center max-w-md mb-8">
                    Open Wisdom Intelligence — asisten AI yang membantu Anda belajar investasi dengan cara yang mudah dipahami.
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="w-full max-w-lg space-y-2">
                    <p className="text-sm text-gray-400 text-center mb-3">Coba tanyakan:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(question)}
                          className="p-3 text-left text-sm rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all"
                          style={{ color: "var(--brand-black)" }}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="p-6 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        {msg.role === "assistant" && (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: "var(--brand-sage)" }}
                          >
                            <img src="/mascot/owi-mascot-5.svg" alt="OWI" className="w-6 h-6" />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user" ? "text-white" : "text-gray-700"
                          }`}>
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "var(--brand-blue)" }}
                        >
                          <img src="/mascot/owi-mascot-6.svg" alt="OWI" className="w-6 h-6" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4 bg-gray-50/50">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pertanyaan Anda..."
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none resize-none text-sm bg-white"
                    rows={1}
                    disabled={isLoading}
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !message.trim()}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 hover:shadow-lg shrink-0"
                  style={{ background: "var(--brand-cyan)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                OWI adalah asisten edukasi, bukan penasihat keuangan berlisensi
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600">
              <span>🎯</span>
              <span>Edukasi Inklusif</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600">
              <span>🧠</span>
              <span>Mudah Dipahami</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600">
              <span>♿</span>
              <span>Aksesibel</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600">
              <span>🔒</span>
              <span>Aman & Privat</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
