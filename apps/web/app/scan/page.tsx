import Link from 'next/link';

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <Link href="/" className="mb-6 inline-block text-sm text-stone-500 hover:text-stone-800">
        ← Start
      </Link>
      <h1 className="text-2xl font-bold text-stone-800">Skanuj kod QR</h1>
      <p className="mt-2 text-stone-600">Zeskanuj kod QR z opakowania kawy</p>
    </div>
  );
}
