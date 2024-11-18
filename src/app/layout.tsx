import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "@/sytles/globals.css"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Markdown to PDF Converter',
  description: 'Convert your Markdown files to beautiful PDFs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased")}
      >
        {children}
      </body>
    </html>
  );
}
