'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authScreenStyles } from '@/src/theme/authScreenStyles';

/** Odpowiednik `test-select-user.tsx` (Expo). */
export default function RoleSelectPage() {
  const router = useRouter();

  return (
    <div className={authScreenStyles.page}>
      <div className={authScreenStyles.screen}>
        <div className={authScreenStyles.topSection}>
          <h1 className={authScreenStyles.title}>funcup</h1>
          <p className={authScreenStyles.subtitle}>Wybierz ścieżkę (makieta)</p>

          <button
            type="button"
            data-testid="btn-add-coffee"
            className={authScreenStyles.socialButton}
            onClick={() => router.push('/tag')}
          >
            <span className={authScreenStyles.socialButtonText}>Roaster</span>
          </button>

          <button
            type="button"
            data-testid="btn-scan-coffee"
            className={authScreenStyles.socialButton}
            onClick={() => router.push('/scan')}
          >
            <span className={authScreenStyles.socialButtonText}>Consumer</span>
          </button>

          <div className="mt-6 mb-12">
            <Link href="/login" className={authScreenStyles.registerLink}>
              Ekran logowania (opcjonalnie)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
