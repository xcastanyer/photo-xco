// src/lib/gtag.ts

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      eventParams?: Record<string, string | number>
    ) => void;
  }
}


export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Registrar vistas de página
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Registrar eventos personalizados
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value ?? 0,
    });
  }
};
