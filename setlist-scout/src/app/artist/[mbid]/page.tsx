"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtistPage({ params }: { params: { mbid: string } }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ setlist: { id: string; venue?: { name: string; city?: { name: string } }; eventDate: string; tour?: { name: string } }[]; total: number; page: number; itemsPerPage: number; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/artist/${params.mbid}/setlists?p=${page}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ setlist: [], total: 0, page: 1, itemsPerPage: 20, error: "Fetch failed" }))
      .finally(() => setLoading(false));
  }, [params.mbid, page]);

  const sets = data?.setlist ?? [];
  const artistName = "Artist"; // Will be updated when data loads

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#1DB954] hover:text-[#1ed760] transition-colors mb-4"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {artistName} Setlists
          </h1>
          <p className="text-[#B3B3B3]">
            Discover concert setlists from {artistName}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
            <span className="ml-3 text-[#B3B3B3]">Loading setlists...</span>
          </div>
        )}

        {/* Error State */}
        {data?.error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center mb-8">
            <div className="text-red-400 font-medium">Error Loading Setlists</div>
            <div className="text-red-300 mt-1">{String(data.error)}</div>
          </div>
        )}

        {/* Setlists Grid */}
        {!loading && sets.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-[#B3B3B3]">
                Showing {sets.length} of {data?.total || 0} setlists
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sets.map((s: { id: string; venue?: { name: string; city?: { name: string } }; eventDate: string; tour?: { name: string } }) => (
                <motion.div 
                  key={s.id} 
                  className="bg-[#191414] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-[#282828] hover:border-[#1DB954]/50 group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1DB954] transition-colors">
                      {s.venue?.name || "Unknown Venue"}
                    </h3>
                    <div className="space-y-1 text-sm text-[#B3B3B3]">
                      <div className="flex items-center">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {s.eventDate}
                      </div>
                      {s.venue?.city?.name && (
                        <div className="flex items-center">
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {s.venue.city.name}
                        </div>
                      )}
                      {s.tour?.name && (
                        <div className="flex items-center">
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          {s.tour.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/setlist/${s.id}`}
                    className="inline-flex items-center px-4 py-2 bg-[#1DB954] text-white font-medium rounded-lg hover:bg-[#1ed760] transition-colors duration-200"
                  >
                    View Setlist
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
                disabled={sets.length === 0} 
                onClick={() => setPage(p => p + 1)} 
                className="px-4 py-2 border border-[#404040] rounded-lg hover:bg-[#282828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && sets.length === 0 && !data?.error && (
          <div className="text-center py-12">
            <div className="text-[#B3B3B3] mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No setlists found</h3>
            <p className="text-[#B3B3B3]">This artist doesn&apos;t have any setlists available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
