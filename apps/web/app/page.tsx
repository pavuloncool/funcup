'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Po zakończeniu AnimatedSplash (AppOpenGate) — jak mobile `/(auth)/login`:
 * natychmiastowy przejazd do wyboru roli.
 */
export default function RootEntryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/role');
  }, [router]);

  return (
    <div
      className="min-h-screen bg-[#e9e9e9]"
      aria-hidden
    />
  );
}
