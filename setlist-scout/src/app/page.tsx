"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // simple debounce
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 400);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (!debounced) {
      setData(null);
      setPage(1);
      return;
    }
    setLoading(true);
    fetch(`/api/search-artists?name=${encodeURIComponent(debounced)}&p=${page}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ error: "Fetch failed" }))
      .finally(() => setLoading(false));
  }, [debounced, page]);

  const artists = useMemo(() => data?.artist ?? [], [data]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Setlist Scout</h1>
      <input
        className="w-full border rounded-xl px-4 py-2"
        placeholder="Search artist (exact words, no wildcards)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {loading && <p className="mt-4">Searching…</p>}
      {data?.error && <p className="mt-4 text-red-600">{String(data.error)}</p>}
      {!loading && artists.length > 0 && (
        <>
          <ul className="mt-6 space-y-2">
            {artists.map((a: any) => (
              <li key={a.mbid} className="border rounded-xl p-4 hover:bg-gray-50">
                <div className="font-medium">{a.name}</div>
                {a.disambiguation && <div className="text-sm text-gray-600">{a.disambiguation}</div>}
                <Link
                  href={`/artist/${a.mbid}`}
                  className="inline-block mt-2 underline"
                >
                  View setlists
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 mt-6">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
            <span>Page {data.page} / {Math.ceil((data.total||0)/(data.itemsPerPage||20))}</span>
            <button disabled={artists.length===0} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </>
      )}
    </main>
  );
}
