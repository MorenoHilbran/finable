"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function OWIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo! Saya OWI, asisten edukasi investasi Anda. Saya siap membantu Anda belajar tentang dunia investasi dengan cara yang mudah dipahami. Ada yang ingin Anda pelajari hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/owi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: messages.filter((m) => m.id !== "welcome"),
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
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Maaf, OWI sedang mengalami gangguan 💤. Silakan coba lagi nanti.",
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

  const quickQuestions = [
    "Apa itu investasi?",
    "Cara mulai investasi pemula?",
    "Perbedaan saham & reksa dana?",
    "Apa itu diversifikasi?",
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
        style={{
          background: "var(--brand-white)",
        }}
        aria-label={isOpen ? "Tutup OWI Chat" : "Buka OWI Chat"}
      >
        {isOpen ? (
          <svg
            className="w-7 h-7 text-white"
            style={{ color: "var(--brand-black)", background: "var(--brand-white)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <span className="text-3xl"
          ><img src="/mascot/owi-mascot-1.svg" alt="OWI" className="w-10 h-10" /></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-95 max-w-[calc(100vw-48px)] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideUp"
        style={{background: "var(--brand-blue)"}}>
          {/* Header */}
          <div
            className="px-6 py-4 text-white"
            style={{
              background: "linear-gradient(135deg, var(--brand-black), var(--brand-sage))",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/mascot/owi-mascot-2.svg" alt="OWI" className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">OWI Assistant</h3>
                <p className="text-sm text-white/80">
                  Edukasi Investasi Inklusif
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Tutup chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-100 min-h-75 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white shadow-md rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/mascot/owi-mascot-3.svg" alt="OWI" className="w-5 h-5" />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "var(--brand-black)" }}
                      >
                        OWI
                      </span>
                    </div>
                  )}
                  <p
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {msg.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === "user" ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-md rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/mascot/owi-mascot-4.svg" alt="OWI" className="w-5 h-5" />
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "var(--brand-dark-blue)" }}
                    >
                      OWI
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "var(--brand-sage)", animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "var(--brand-sage)", animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "var(--brand-sage)", animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">💡 Pertanyaan populer:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessage(q);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="px-3 py-1.5 text-xs rounded-full border-2 transition-all hover:bg-cyan-50"
                    style={{
                      borderColor: "var(--brand-sage)",
                      color: "var(--brand-black)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanya OWI tentang investasi..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#50d990] focus:outline-none text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="px-4 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50 hover:opacity-90"
                style={{ background: "var(--brand-sage)" }}
                aria-label="Kirim pesan"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              OWI hanya untuk edukasi, bukan rekomendasi investasi
            </p>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
