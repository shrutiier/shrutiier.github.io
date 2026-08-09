import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { getImagePath } from "@/utils/getImagePath";

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
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="pointer-events-none fixed inset-y-0 left-[24%] z-10 hidden w-px bg-[#1F1F1F] xl:block" />
          <div className="pointer-events-none fixed inset-y-0 right-[24%] z-10 hidden w-px bg-[#1F1F1F] xl:block" />
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
