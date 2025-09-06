"use client";
import { useEffect, useState } from "react";

export default function SetlistPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/setlist/${params.id}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ error: "Fetch failed" }))
      .finally(() => setLoading(false));
  }, [params.id]);

  const sets = data?.sets?.set ?? [];

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2">Setlist</h1>
      {loading && <p>Loading…</p>}
      {data?.error && <p className="text-red-600">{String(data.error)}</p>}
      {data && !loading && (
        <>
          <div className="text-sm text-gray-600 mb-4">
            {data.artist?.name} — {data.eventDate} @ {data.venue?.name}
          </div>
          {sets.length === 0 && <p>No songs available.</p>}
          <ol className="list-decimal ml-6 space-y-1">
            {sets.flatMap((setObj: any) => (setObj.song ?? [])).map((song: any, i: number) => (
              <li key={`${song?.name || "song"}-${i}`}>{song?.name}</li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
