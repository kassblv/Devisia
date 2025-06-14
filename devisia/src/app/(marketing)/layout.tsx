import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextAuthSessionProvider from "@/components/auth/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "../globals.css";
import "../../styles/dark-mode-fixes.css";
import { HeroHeader } from "@/components/ui/HeroHeader";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Footer } from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devisia - Créez des devis professionnels",
  description: "Générez des devis professionnels avec des estimations précises et des descriptions détaillées grâce à notre IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full `}
      >
        <ThemeProvider>
          <NextAuthSessionProvider>
            <div className="flex flex-col h-full w-full">
              <HeroHeader />
              {children}
              <Footer />  
            </div>
            <BackgroundBeams />
            <Toaster position="top-right" richColors closeButton />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
  );
}
