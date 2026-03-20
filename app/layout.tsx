import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Familjen Klingsten/Tongring – Vardagsplanerare",
  description:
    "High-end vardagsplanerare för familjen Klingsten/Tongring. Hantera uppgifter, måltider och familjeschema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="h-full antialiased">
      <body className="min-h-full flex bg-slate-950 text-slate-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
      </body>
    </html>
  );
}
