'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { roleStyles } from './role.styles';

/** Odpowiednik `test-select-user.tsx` (Expo). */
export default function RoleSelectPage() {
  const router = useRouter();

  return (
    <div className={roleStyles.page}>
      <div className={roleStyles.screen}>
        <div className={roleStyles.topSection}>
          <h1 className={roleStyles.title}>funcup</h1>
          <p className={roleStyles.subtitle}>Wybierz ścieżkę (makieta)</p>

          <button
            type="button"
            data-testid="btn-add-coffee"
            className={roleStyles.socialButton}
            onClick={() => router.push('/roaster-hub')}
          >
            <span className={roleStyles.socialButtonText}>Roaster</span>
          </button>

          <button
            type="button"
            data-testid="btn-scan-coffee"
            className={roleStyles.socialButton}
            onClick={() => router.push('/scan')}
          >
            <span className={roleStyles.socialButtonText}>Consumer</span>
          </button>

          <div className={roleStyles.registerLinkWrapper}>
            <Link href="/login" className={roleStyles.registerLink}>
              Ekran logowania (opcjonalnie)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
