"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [data, setData] = useState<{ artist: { mbid: string; name: string; disambiguation?: string }[]; total: number; page: number; itemsPerPage: number; error?: string } | null>(null);
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
      .catch(() => setData({ artist: [], total: 0, page: 1, itemsPerPage: 20, error: "Fetch failed" }))
      .finally(() => setLoading(false));
  }, [debounced, page]);

  const artists = useMemo(() => data?.artist ?? [], [data]);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="bg-[#191414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Concert
              <span className="text-[#1DB954]"> Setlists</span>
            </h1>
            <p className="text-xl text-[#B3B3B3] mb-12 max-w-2xl mx-auto">
              Search for your favorite artists and explore what songs they played at their concerts around the world.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  className="w-full px-6 py-4 text-lg bg-[#282828] border-2 border-[#404040] rounded-2xl focus:border-[#1DB954] focus:outline-none transition-colors shadow-lg text-white placeholder-[#B3B3B3]"
                  placeholder="Search for an artist..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1DB954]"></div>
                  ) : (
                    <svg className="h-6 w-6 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {data?.error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center mb-8">
            <div className="text-red-400 font-medium">Search Error</div>
            <div className="text-red-300 mt-1">{String(data.error)}</div>
          </div>
        )}

        {!loading && artists.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Search Results</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((a: { mbid: string; name: string; disambiguation?: string }) => (
                <motion.div 
                  key={a.mbid} 
                  className="bg-[#191414] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-[#282828] hover:border-[#1DB954]/50 group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1DB954] transition-colors">{a.name}</h3>
                    {a.disambiguation && (
                      <p className="text-sm text-[#B3B3B3]">{a.disambiguation}</p>
                    )}
                  </div>
                  <Link
                    href={`/artist/${a.mbid}`}
                    className="inline-flex items-center px-4 py-2 bg-[#1DB954] text-white font-medium rounded-lg hover:bg-[#1ed760] transition-colors duration-200"
                  >
                    View Setlists
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)} 
                className="px-4 py-2 border border-[#404040] rounded-lg hover:bg-[#282828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-[#B3B3B3]">
                Page {data?.page || 1} of {Math.ceil((data?.total || 0) / (data?.itemsPerPage || 20))}
              </span>
              <button 
                disabled={artists.length === 0} 
                onClick={() => setPage(p => p + 1)} 
                className="px-4 py-2 border border-[#404040] rounded-lg hover:bg-[#282828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {!loading && debounced && artists.length === 0 && !data?.error && (
          <div className="text-center py-12">
            <div className="text-[#B3B3B3] mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No artists found</h3>
            <p className="text-[#B3B3B3]">Try searching with a different name or check the spelling.</p>
          </div>
        )}

        {!debounced && (
          <div className="text-center py-12">
            <div className="text-[#B3B3B3] mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Start your search</h3>
            <p className="text-[#B3B3B3]">Enter an artist name above to discover their concert setlists.</p>
          </div>
        )}
      </div>
    </div>
  );
}
