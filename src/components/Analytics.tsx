// src/components/Analytics.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as gtag from '@/lib/gtag';

export default function Analytics() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isClient) return; // solo ejecutar en cliente
    const url = pathname + searchParams.toString();
    gtag.pageview(url);
  }, [isClient, pathname, searchParams]);

  return null;
}
