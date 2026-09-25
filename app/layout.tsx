import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Counterlock",
  description: "An alphabetical index of Deadlock heroes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
