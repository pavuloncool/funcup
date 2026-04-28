'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useRoasterProfile } from '@/src/hooks/useRoasterProfile';
import { authScreenStyles } from '@/src/theme/authScreenStyles';

type Tile = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function RoasterHubPage() {
  const router = useRouter();
  const { loading, exists, complete, profile, error } = useRoasterProfile();

  useEffect(() => {
    if (loading) return;
    if (!exists || !complete) {
      router.replace('/roaster-profile');
    }
  }, [complete, exists, loading, router]);

  if (loading) {
    return (
      <div className={`${authScreenStyles.page} pb-12`}>
        <div className="mx-auto w-full max-w-4xl px-4 pt-4">
          <p className="text-sm text-[#444]">Ładowanie roaster hub…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${authScreenStyles.page} pb-12`}>
        <div className="mx-auto w-full max-w-4xl px-4 pt-4">
          <p className="text-sm text-[#b00020]">Błąd: {error}</p>
        </div>
      </div>
    );
  }

  if (!exists || !complete) {
    return (
      <div className={`${authScreenStyles.page} pb-12`}>
        <div className="mx-auto w-full max-w-4xl px-4 pt-4">
          <p className="text-sm text-[#444]">Przekierowanie do profilu palarni…</p>
        </div>
      </div>
    );
  }

  const tiles: Tile[] = [
    {
      label: 'Dodaj kawę',
      onClick: () => router.push('/tag'),
    },
    {
      label: 'Lista kaw (CRUD)',
      onClick: () => router.push('/roaster-hub/coffees'),
    },
    {
      label: 'Profil palarni',
      onClick: () => router.push('/roaster-profile'),
    },
    {
      label: 'Coffee Bank',
      onClick: () => router.push('/coffee-bank'),
    },
    {
      label: 'Analytics',
      disabled: true,
    },
  ];

  const shortName = profile?.roaster_short_name || 'Roaster';

  return (
    <div className={`${authScreenStyles.page} pb-12`}>
      <div className="mx-auto w-full max-w-4xl px-4 pt-2">
        <h1 className="mb-2 mt-2 text-[22px] font-bold text-[#111]">{shortName}</h1>
        <p className="mb-6 text-sm text-[#444]">Wybierz sekcję palarni</p>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          {tiles.map((tile) => (
            <button
              key={tile.label}
              type="button"
              className={`${authScreenStyles.socialButton} mb-0 h-24 w-full rounded-[10px] border-2 text-left ${
                tile.disabled ? 'cursor-not-allowed opacity-55' : 'hover:bg-[#e8e8e8]'
              }`}
              onClick={tile.onClick}
              disabled={tile.disabled}
              aria-disabled={tile.disabled}
            >
              <span className="px-2 text-[17px] font-semibold text-[#171717]">{tile.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
