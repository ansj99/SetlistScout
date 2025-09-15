"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SetlistPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ artist?: { name: string; mbid: string }; eventDate: string; venue?: { name: string; city?: { name: string } }; tour?: { name: string }; sets?: { set: { song?: { name?: string; info?: string }[] }[] }; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/setlist/${params.id}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ eventDate: "", error: "Fetch failed" }))
      .finally(() => setLoading(false));
  }, [params.id]);

  const sets = data?.sets?.set ?? [];
  const allSongs = sets.flatMap((setObj: { song?: { name?: string; info?: string }[] }) => (setObj.song ?? []));

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/artist/${data?.artist?.mbid || '#'}`}
            className="inline-flex items-center text-[#1DB954] hover:text-[#1ed760] transition-colors mb-4"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {data?.artist?.name || 'Artist'} Setlists
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
            <span className="ml-3 text-[#B3B3B3]">Loading setlist...</span>
          </div>
        )}

        {/* Error State */}
        {data?.error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center mb-8">
            <div className="text-red-400 font-medium">Error Loading Setlist</div>
            <div className="text-red-300 mt-1">{String(data.error)}</div>
          </div>
        )}

        {/* Setlist Content */}
        {data && !loading && !data?.error && (
          <motion.div 
            className="bg-[#191414] rounded-2xl shadow-lg border border-[#282828] overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] px-6 py-8 text-white">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {data.artist?.name || "Unknown Artist"}
              </h1>
              <div className="space-y-2 text-green-100">
                <div className="flex items-center text-lg">
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {data.eventDate}
                </div>
                <div className="flex items-center text-lg">
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {data.venue?.name || "Unknown Venue"}
                  {data.venue?.city?.name && ` • ${data.venue.city.name}`}
                </div>
                {data.tour?.name && (
                  <div className="flex items-center text-lg">
                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    {data.tour.name}
                  </div>
                )}
              </div>
            </div>

            {/* Songs Section */}
            <div className="p-6">
              {allSongs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-[#B3B3B3] mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No songs available</h3>
                  <p className="text-[#B3B3B3]">The setlist for this show is not available.</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Setlist</h2>
                    <p className="text-[#B3B3B3]">{allSongs.length} songs</p>
                  </div>
                  
                  <div className="space-y-3">
                    {allSongs.map((song: { name?: string; info?: string }, i: number) => (
                      <motion.div 
                        key={`${song?.name || "song"}-${i}`} 
                        className="flex items-center p-4 bg-[#282828] rounded-lg hover:bg-[#404040] transition-colors group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-[#1DB954] text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white group-hover:text-[#1DB954] transition-colors">
                            {song?.name || "Unknown Song"}
                          </h3>
                          {song?.info && (
                            <p className="text-sm text-[#B3B3B3] mt-1">{song.info}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
