'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as gtag from '@/lib/gtag';

export default function Analytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!mounted) return; // aseguramos ejecución solo en cliente

    if (!pathname) return; // Next.js puede dar undefined en 404 automática

    const queryString = searchParams?.toString();
    const url = pathname + (queryString ? '?' + queryString : '');
    gtag.pageview(url);
  }, [mounted, pathname, searchParams]);

  return null;
}
