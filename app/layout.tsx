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
    // The ?v= is a cache-buster. Browsers hold onto favicons far longer than
    // ordinary assets, so without it a colour change can go unseen for days.
    // Bump this number whenever the icon artwork changes.
    icon: `${getImagePath("/favicon-new.png")}?v=5`,
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
