import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TrackingInitializer } from "@/components/providers/TrackingInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PediAi Admin - Gerenciamento de Restaurantes",
  description: "Painel administrativo premium para parceiros PediAi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TrackingInitializer />
        {children}
      </body>
    </html>
  );
}
