// src/components/TopTracks.js
import React, { useEffect, useState, useRef } from "react";
import { fetchTopTracks } from "../utils/data";

function TopTracks() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mutedTracks, setMutedTracks] = useState({});
  const audioRef = useRef(null);

  useEffect(() => {
    fetchTopTracks()
      .then((data) => {
        const filteredTracks = data.items.filter((track) => track.preview_url);
        setTracks(filteredTracks);
      })
      .catch(console.error);
  }, []);

  const handlePlayPauseClick = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.muted = mutedTracks[track.id] || false;
      }
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack?.preview_url || "";
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, isPlaying]);

  const handleMuteClick = (trackId) => {
    setMutedTracks((prevMutedTracks) => {
      const updatedMutedTracks = {
        ...prevMutedTracks,
        [trackId]: !prevMutedTracks[trackId],
      };
      if (audioRef.current && currentTrack?.id === trackId) {
        audioRef.current.muted = updatedMutedTracks[trackId];
      }
      return updatedMutedTracks;
    });
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-base-200 rounded-lg p-4 shadow flex flex-col items-center">
      <div className="w-full h-40 bg-gray-300 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="bg-base-200 rounded-lg p-4 shadow flex flex-col items-center relative"
            >
              <a href={track.uri} target="_blank" rel="noopener noreferrer">
                <img
                  src={track.album.images[1].url}
                  alt="Album cover"
                  className="w-full h-full object-cover rounded-md mb-2"
                  loading="lazy"
                />
              </a>
              <div className="text-center mt-3 mb-8">
                <a
                  href={track.external_urls.spotify}
                  className="text-md font-semibold hover:text-green-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {track.name}
                </a>
                <p className="text-sm text-gray-500 pb-8">
                  {track.artists.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                      {index > 0 && ", "}
                      <a
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-700"
                      >
                        {artist.name}
                      </a>
                    </React.Fragment>
                  ))}
                </p>
              </div>
              {track.preview_url && (
                <div className="bg-black border-primary rounded border absolute w-full bottom-0 flex justify-between items-center p-4">
                  <button
                    onClick={() => handlePlayPauseClick(track)}
                    className="text-white hover:text-gray-300"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleMuteClick(track.id)}
                    className="text-white hover:text-gray-300"
                  >
                    {mutedTracks[track.id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 50 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      <audio ref={audioRef} />
    </div>
  );
}

export default TopTracks;
