import type { Metadata } from "next";
import { ThemeProvider } from "@/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "JNotes - Бесплатный аналог Jnotes",
  description: "Бесплатный аналог Jnotes с полным паритетом функций, построенный на принципах офлайн-first, приватности и локального шифрования",
  keywords: "заметки, рукописный ввод, PDF аннотации, AI, блокнот",
  authors: [{ name: "JNotes Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#4caf50",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
