import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BootLoader from "@/components/BootLoader";
import TopChrome from "@/components/TopChrome";
import { CursorTagProvider } from "@/components/CursorTag";
import { site } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} - ${site.role}`,
  description:
    "I build the system your business is missing: ERP and finance tooling, booking platforms, AI chatbots and RAG assistants, voice agents, and cloud infrastructure.",
  openGraph: {
    title: `${site.name} - ${site.role}`,
    description:
      "ERP and finance systems, booking platforms, AI chatbots, RAG assistants, voice agents and cloud pipelines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <BootLoader />
        <CursorTagProvider>
          <TopChrome />
          {children}
        </CursorTagProvider>
      </body>
    </html>
  );
}
