'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { supabaseBrowser } from '@/src/lib/supabase/browserClient';
import { useRoasterCoffees } from '@/src/hooks/useRoasterCoffees';

import { hubCrudStyles } from '../hub-crud.styles';

const LOGIN_NEXT = '/login?next=' + encodeURIComponent('/roaster-hub/coffees');

export default function CoffeesPage() {
  const { data: coffees = [], error, isLoading } = useRoasterCoffees();

  useEffect(() => {
    async function ensureAuth() {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) {
        window.location.href = LOGIN_NEXT;
      }
    }
    void ensureAuth();
  }, []);

  const errorMessage =
    error instanceof Error
      ? error.message === 'AUTH_REQUIRED'
        ? null
        : error.message
      : null;

  const needsRoasterSetup =
    typeof errorMessage === 'string' &&
    errorMessage.includes('No roaster profile linked to this account.');

  return (
    <main className={hubCrudStyles.main760}>
      <p className="mb-4">
        <Link href="/roaster-hub" className={hubCrudStyles.navBack}>
          ← Roaster hub
        </Link>
      </p>
      <h1 className={hubCrudStyles.pageHeading}>Roaster coffees</h1>
      <p>
        <Link href="/roaster-hub/coffees/new" className={hubCrudStyles.actionLink}>
          + New coffee
        </Link>
      </p>
      {isLoading ? <p className={hubCrudStyles.muted}>Loading...</p> : null}
      {errorMessage ? <p className={hubCrudStyles.error}>{errorMessage}</p> : null}
      {needsRoasterSetup ? (
        <p className="mt-3">
          <Link href="/roaster-hub/setup" className={hubCrudStyles.linkStrong}>
            Utwórz profil palarni
          </Link>
        </p>
      ) : null}
      {!isLoading && coffees.length === 0 ? <p className={hubCrudStyles.muted}>No coffees yet.</p> : null}
      <ul className={hubCrudStyles.list}>
        {coffees.map(coffee => (
          <li key={coffee.id}>
            <Link href={`/roaster-hub/coffees/${coffee.id}`} className={hubCrudStyles.link}>
              {coffee.name} ({coffee.status})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
