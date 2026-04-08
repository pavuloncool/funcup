import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>funcup (web)</h1>
      <p>US2 flow playground.</p>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
        <li>
          <Link href="/dashboard/coffees">Coffees dashboard</Link>
        </li>
      </ul>
    </main>
  );
}

