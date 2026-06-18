import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "PutsBoludo 2026",
  description:
    "Bolão da Copa do Mundo 2026 — palpites, resultados e ranking entre amigos.",
  applicationName: "PutsBoludo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PutsBoludo",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "PutsBoludo 2026",
    description: "Bolão da Copa do Mundo 2026 entre amigos.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a7a4b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
