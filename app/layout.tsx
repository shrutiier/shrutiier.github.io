import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { IBM_Plex_Serif, Manrope } from "next/font/google";
import { getImagePath } from "@/utils/getImagePath";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ibm-plex-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "shrutiier",
  description: "Shruti Iyer's Portfolio",
  icons: {
    icon: getImagePath("/favicon-new.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSerif.variable} ${manrope.variable}`}>
      <body>
        <ThemeProvider>
          <div className="pointer-events-none fixed inset-y-0 left-[24%] z-10 hidden w-px bg-[#222121] xl:block" />
          <div className="pointer-events-none fixed inset-y-0 right-[24%] z-10 hidden w-px bg-[#222121] xl:block" />
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
