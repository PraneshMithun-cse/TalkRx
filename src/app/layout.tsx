import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { VaultProvider } from "@/components/talkrx/VaultContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalkRx — AI-Powered Patient Case-Taking and Health Passport Platform",
  description:
    "Smart India Hackathon (SIH26047) | Ministry of Ayush. TalkRx harvests 20 minutes of OPD patient waiting time into a structured, multilingual clinical history, Dashavidha Pariksha, and consent-driven Health Passport.",
};

import { MobileBottomNav } from "@/components/talkrx/MobileBottomNav";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-sans`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro Icons", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <body
        className="min-h-full flex flex-col antialiased text-neutral-900 selection:bg-neutral-900 selection:text-white pb-20 md:pb-0"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro Icons", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <ClerkProvider appearance={{ theme: shadcn }}>
          <SmoothScroll>
          <VaultProvider>
          {children}
          <MobileBottomNav />
          </VaultProvider>
          </SmoothScroll>
        </ClerkProvider>
      </body>
    </html>
  );
}