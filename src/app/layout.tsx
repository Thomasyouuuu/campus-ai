import type { Metadata } from "next";
import { ProfilePreviewButton } from "@/components/navigation/ProfilePreviewButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus AI",
  description: "AI campus workspace for schedules, profiles, tags, and sync discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ProfilePreviewButton />
      </body>
    </html>
  );
}
