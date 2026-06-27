import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Cursor from '@/Components/cursor';
import ChatbotWidget from "@/Components/ChatbotWidget";

export const metadata: Metadata = {
  title: "Agrivest",
  description: "Agrivest is a platform that connects farmers with investors to support sustainable agriculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=sentient@400,500,700&f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full ">
        <Cursor/>
        <Navbar  />
        {children}
        <ChatbotWidget />
        </body>
    </html>
  );
}
