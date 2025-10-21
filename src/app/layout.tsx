// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";

import { Suspense } from 'react';
import Analytics from "@/components/Analytics";

export const metadata = {
  title: "PhotoXco",
  description: "Photography portfolio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {GA_TRACKING_ID && (
          <>
            {/* Carga del script de Google Analytics */}
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-black text-white">{children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        </body>
    </html>
  );
}
