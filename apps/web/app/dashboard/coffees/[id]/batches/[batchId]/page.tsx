import Link from 'next/link';

import QRDownloadButton from './QRDownloadButton';

type Props = {
  params: Promise<{ id: string; batchId: string }>;
};

export default async function BatchDetailsPage({ params }: Props) {
  const { id, batchId } = await params;

  return (
    <main style={{ maxWidth: 760, margin: '30px auto', fontFamily: 'system-ui' }}>
      <h1>Batch details</h1>
      <p>
        <strong>Coffee:</strong> {id}
      </p>
      <p>
        <strong>Batch:</strong> {batchId}
      </p>
      <QRDownloadButton batchId={batchId} />
      <p>
        <Link href={`/dashboard/coffees/${id}`}>Back to coffee</Link>
      </p>
    </main>
  );
}
