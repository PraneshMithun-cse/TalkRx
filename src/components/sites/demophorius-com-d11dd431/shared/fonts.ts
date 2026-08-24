import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const triviaSans = localFont({
  src: [
    {
      path: "../../../../../public/sites/demophorius-com-d11dd431/root-8a5edab2/fonts/TriviaSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../../public/sites/demophorius-com-d11dd431/root-8a5edab2/fonts/TriviaSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-trivia-sans",
  display: "swap",
});

export const atOsmose = localFont({
  src: [
    {
      path: "../../../../../public/sites/demophorius-com-d11dd431/root-8a5edab2/fonts/Osmose-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-at-osmose",
  display: "swap",
});
