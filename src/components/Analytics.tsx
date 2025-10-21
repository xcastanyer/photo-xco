'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as gtag from '@/lib/gtag';

export default function Analytics() {
  const [isClient, setIsClient] = useState(false);

  // Activamos solo en cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isClient) return; // nunca ejecutar en SSR

    // Construimos la URL completa con query string si existe
    const queryString = searchParams.toString();
    const url = pathname + (queryString ? '?' + queryString : '');

    // Llamada a Google Analytics
    gtag.pageview(url);
  }, [isClient, pathname, searchParams]);

  return null; // componente invisible
}
