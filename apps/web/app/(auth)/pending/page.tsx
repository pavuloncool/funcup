import Link from 'next/link';

export default function PendingPage() {
  return (
    <main style={{ maxWidth: 620, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>Account pending</h1>
      <p>
        If your project requires email verification, check your inbox and confirm the
        account. Then return to login.
      </p>
      <p>
        <Link href="/login">Go to login</Link>
      </p>
    </main>
  );
}
