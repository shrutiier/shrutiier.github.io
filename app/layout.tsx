import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/NavBar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { getImagePath } from "@/utils/getImagePath";

export const metadata: Metadata = {
  title: "shrutiier",
  description: "Shruti Iyer's Portfolio",
  icons: {
    icon: getImagePath("/favicon-new.ico"),
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
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
