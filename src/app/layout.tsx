import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Universities Courses App",
  description: "Universities Courses Web App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-100 to-sky-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
