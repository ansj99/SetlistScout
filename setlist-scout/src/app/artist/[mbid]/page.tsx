"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArtistPage({ params }: { params: { mbid: string } }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/artist/${params.mbid}/setlists?p=${page}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ error: "Fetch failed" }))
      .finally(() => setLoading(false));
  }, [params.mbid, page]);

  const sets = data?.setlist ?? [];

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Setlists</h1>
      {loading && <p>Loading…</p>}
      {data?.error && <p className="text-red-600">{String(data.error)}</p>}
      {!loading && sets.length > 0 && (
        <>
          <ul className="space-y-2">
            {sets.map((s: any) => (
              <li key={s.id} className="border rounded-xl p-4">
                <div className="font-medium">{s.artist?.name}</div>
                <div className="text-sm text-gray-600">
                  {s.eventDate} — {s.venue?.name} {s.venue?.city?.name ? `• ${s.venue.city.name}` : ""} {s.tour?.name ? `• ${s.tour.name}` : ""}
                </div>
                <Link className="underline mt-2 inline-block" href={`/setlist/${s.id}`}>View details</Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 mt-6">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
            <span>Page {data.page} / {Math.ceil((data.total||0)/(data.itemsPerPage||20))}</span>
            <button onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </>
      )}
    </main>
  );
}
