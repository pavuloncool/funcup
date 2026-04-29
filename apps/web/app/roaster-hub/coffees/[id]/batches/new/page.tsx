'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { useCreateBatch } from '@/src/hooks/useCreateBatch';

import { hubCrudStyles } from '../../../../hub-crud.styles';

export default function NewBatchPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const createBatch = useCreateBatch();
  const [lotNumber, setLotNumber] = useState('');
  const [roastDate, setRoastDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const created = await createBatch.mutateAsync({
        coffeeId: params.id,
        lotNumber,
        roastDate,
      });
      router.push(`/roaster-hub/coffees/${params.id}/batches/${created.id}`);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Unable to create batch.';
      setError(message);
      return;
    }
  }

  return (
    <main className={hubCrudStyles.main760}>
      <h1 className={hubCrudStyles.pageHeading}>Create batch</h1>
      <form onSubmit={handleSubmit} className={hubCrudStyles.formGrid}>
        <input
          className={hubCrudStyles.input}
          placeholder="Lot number"
          value={lotNumber}
          onChange={event => setLotNumber(event.target.value)}
          required
        />
        <input
          className={hubCrudStyles.input}
          type="date"
          value={roastDate}
          onChange={event => setRoastDate(event.target.value)}
          required
        />
        <button type="submit" className={hubCrudStyles.submitBtn} disabled={createBatch.isPending}>
          {createBatch.isPending ? 'Creating...' : 'Create batch'}
        </button>
      </form>
      {error ? <p className={hubCrudStyles.error}>{error}</p> : null}
    </main>
  );
}
