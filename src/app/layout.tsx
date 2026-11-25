import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import SpaceBackground from "@/components/SpaceBackground/SpaceBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
// Arabic font (used only inside the Arabic version of the website)
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Bahrawy Planet",
  description: "Bahrawy Planet - discover your next favorite book",
};

// Runs before the page paints, so there is no flash of the wrong theme
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cairo.variable}`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <SpaceBackground />
        {children}
      </body>
    </html>
  );
}