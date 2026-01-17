"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { useCallback, useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Math/Special Characters data
const SPECIAL_CHARACTERS = [
  { category: "Math Operators", chars: ["+", "−", "×", "÷", "=", "≠", "≈", "≤", "≥", "<", ">", "±", "∓", "√", "∛", "∞"] },
  { category: "Greek Letters", chars: ["α", "β", "γ", "δ", "ε", "θ", "λ", "μ", "π", "σ", "φ", "ω", "Δ", "Σ", "Ω"] },
  { category: "Fractions", chars: ["½", "⅓", "¼", "⅕", "⅙", "⅛", "⅔", "¾", "⅖", "⅗", "⅘", "⅚", "⅝", "⅞"] },
  { category: "Arrows", chars: ["→", "←", "↑", "↓", "↔", "⇒", "⇐", "⇑", "⇓", "⇔", "↗", "↘", "↙", "↖"] },
  { category: "Sets & Logic", chars: ["∈", "∉", "⊂", "⊃", "⊆", "⊇", "∪", "∩", "∅", "∀", "∃", "∧", "∨", "¬", "⊕"] },
  { category: "Currency", chars: ["$", "€", "£", "¥", "₹", "₽", "₩", "฿", "₿", "¢"] },
  { category: "Other", chars: ["°", "′", "″", "‰", "‱", "†", "‡", "§", "¶", "©", "®", "™", "•", "◦", "■", "□"] },
];

// Toolbar Button Component
function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        isActive
          ? "bg-gray-200 text-gray-900"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

// Image Upload Modal Component
function ImageUploadModal({
  isOpen,
  onClose,
  onInsert,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onInsert(imageUrl.trim());
      setImageUrl("");
      onClose();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData and upload to API
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onInsert(data.url);
        onClose();
      } else {
        // Fallback: convert to base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          onInsert(base64);
          onClose();
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      // Fallback: convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onInsert(base64);
        onClose();
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--brand-black)" }}>
          Tambah Gambar
        </h3>

        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Dari URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUrlInsert}
              disabled={!imageUrl.trim()}
              className="px-4 py-2 rounded-xl text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: "var(--brand-sage)" }}
            >
              Sisipkan
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">atau</span>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Upload dari Perangkat
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors text-gray-600 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">⏳</span>
                Mengupload...
              </>
            ) : (
              <>
                <span>📁</span>
                Pilih File Gambar
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Maksimal 5MB • Format: JPG, PNG, GIF, WebP
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Special Characters Modal Component
function SpecialCharsModal({
  isOpen,
  onClose,
  onInsert,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (char: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--brand-black)" }}>
          Karakter Khusus & Rumus
        </h3>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SPECIAL_CHARACTERS.map((cat, idx) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedCategory(idx)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === idx
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-2 bg-gray-50 rounded-xl">
          {SPECIAL_CHARACTERS[selectedCategory].chars.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => {
                onInsert(char);
              }}
              className="w-10 h-10 flex items-center justify-center text-xl rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
              title={`Insert ${char}`}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Superscript/Subscript Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            <strong>Tips:</strong> Gunakan tombol x² untuk superscript (pangkat) 
            dan x₂ untuk subscript (indeks) di toolbar.
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Toolbar Component
function Toolbar({ editor }: { editor: Editor | null }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCharsModalOpen, setIsCharsModalOpen] = useState(false);

  const insertImage = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertChar = useCallback((char: string) => {
    if (editor) {
      editor.chain().focus().insertContent(char).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL link:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <span className="font-bold text-sm">B</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <span className="italic text-sm">I</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <span className="underline text-sm">U</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <span className="line-through text-sm">S</span>
          </ToolbarButton>
        </div>

        {/* Superscript/Subscript */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            title="Superscript (Pangkat)"
          >
            <span className="text-sm">x<sup className="text-xs">2</sup></span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            title="Subscript (Indeks)"
          >
            <span className="text-sm">x<sub className="text-xs">2</sub></span>
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <span className="text-sm font-bold">H1</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <span className="text-sm font-bold">H2</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <span className="text-sm font-bold">H3</span>
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <span className="text-sm">⬅</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <span className="text-sm">⬌</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <span className="text-sm">➡</span>
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <span className="text-sm">•</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <span className="text-sm">1.</span>
          </ToolbarButton>
        </div>

        {/* Insert */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title="Insert Link">
            <span className="text-sm">🔗</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => setIsImageModalOpen(true)} title="Insert Image">
            <span className="text-sm">🖼️</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => setIsCharsModalOpen(true)} title="Special Characters & Math">
            <span className="text-sm">Ω</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <span className="text-sm">—</span>
          </ToolbarButton>
        </div>

        {/* Blockquote & Code */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            <span className="text-sm">"</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <span className="text-sm font-mono">&lt;/&gt;</span>
          </ToolbarButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <span className="text-sm">↩️</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <span className="text-sm">↪️</span>
          </ToolbarButton>
        </div>
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={insertImage}
      />
      <SpecialCharsModal
        isOpen={isCharsModalOpen}
        onClose={() => setIsCharsModalOpen(false)}
        onInsert={insertChar}
      />
    </>
  );
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Tulis konten di sini...",
      }),
      Underline,
      TextStyle,
      Color,
      Superscript,
      Subscript,
    ],
    content,
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none p-4 min-h-[300px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
