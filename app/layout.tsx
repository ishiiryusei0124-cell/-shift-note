import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./charge-intro.css";
import ChargeIntro from "./charge-intro";

export const metadata: Metadata = {
  title: "アルバイト",
  description: "シフトを記録し、月の実働時間と給与を自動集計。",
  manifest: "/manifest.webmanifest",
  applicationName: "アルバイト",
  appleWebApp: { capable: true, title: "アルバイト", statusBarStyle: "default" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#254fd3" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased"><ChargeIntro />{children}</body>
    </html>
  );
}
