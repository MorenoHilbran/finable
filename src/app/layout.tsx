import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import OWIChat from "@/components/OWIChat";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finable — Platform Edukasi Investasi Inklusif",
  description:
    "Platform edukasi investasi berbasis web untuk penyandang disabilitas. Belajar investasi dengan AI Assistant OWI yang adaptif dan aksesibel.",
  keywords: [
    "edukasi investasi",
    "literasi keuangan",
    "penyandang disabilitas",
    "aksesibilitas",
    "OWI AI",
    "inklusif",
  ],
  authors: [{ name: "Finable Team" }],
  openGraph: {
    title: "Finable — Platform Edukasi Investasi Inklusif",
    description:
      "Platform edukasi investasi untuk penyandang disabilitas dengan AI Assistant OWI",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finable — Platform Edukasi Investasi Inklusif",
    description:
      "Platform edukasi investasi untuk penyandang disabilitas dengan AI Assistant OWI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Main Content
        </a>
        {children}
        <OWIChat />
      </body>
    </html>
  );
}
