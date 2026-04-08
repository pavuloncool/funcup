export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <h1 className="text-3xl font-bold text-stone-800">funcup</h1>
      <p className="text-stone-600 mt-2">Twój przewodnik po świecie kawy</p>
      <div className="mt-8 flex gap-4">
        <a href="/scan" className="px-4 py-2 bg-amber-600 text-white rounded-lg">
          Skanuj QR
        </a>
        <a href="/hub" className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg">
          Kawiarnia
        </a>
        <a href="/profile" className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg">
          Profil
        </a>
      </div>
    </div>
  );
}