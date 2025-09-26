import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "PhotoXco",
  description: "Photography portfolio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
