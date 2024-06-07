import React, { useEffect, useState, useRef } from "react";
import { fetchCurrentPlaying } from "../utils/data";

import ProgressTracker from "../components/ProgressTracker";

function CurrentPlaying() {
  const [song, setSong] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCurrentPlaying();
      if (data && data.item) {
        setSong({
          ...data.item,
          isPlaying: data.is_playing,
          progressMs: data.progress_ms,
          albumImage: data.item.album.images[1].url,
          artistName: data.item.artists[0].name,
          trackName: data.item.name,
          previewUrl: data.item.preview_url,
          durationMs: data.item.duration_ms,
        });
      }
    };

    fetchData();

    // Set interval to update progress every second
    const progressInterval = setInterval(() => {
      setSong((currentSong) => {
        if (currentSong && currentSong.isPlaying) {
          const updatedProgress = currentSong.progressMs + 1000;
          // If progress exceeds duration, trigger a refresh
          if (updatedProgress >= currentSong.durationMs) {
            setRefreshTrigger((prev) => !prev); // Toggle to trigger useEffect
            return { ...currentSong, progressMs: 0 }; // Reset progress
          }
          return { ...currentSong, progressMs: updatedProgress };
        }
        return currentSong;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [refreshTrigger]); // Depend on refreshTrigger to re-fetch data

  useEffect(() => {
    // Triggered every 10 seconds to refresh data
    const refreshDataInterval = setInterval(() => {
      setRefreshTrigger((prev) => !prev);
    }, 10000);

    return () => clearInterval(refreshDataInterval);
  }, []);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="relative text-center h-screen bg-black">
      {song ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className={`w-[350px] h-[480px] ${
              song.isPlaying ? "bg-green-500" : "bg-gray-500"
            } opacity-50 blur-3xl animate-pulse-slow`}
          ></div>
        </div>
      ) : null}
      {song ? (
        <div className="mt-4 h-screen flex flex-col">
          <div className="flex-1 grid place-items-center">
            <div className="p-8 rounded-lg bg-base-200 w-full max-w-sm mx-auto grid gap-4 items-center relative">
              <div className="absolute top-0 right-0 pr-3 pt-4">
                <span
                  className={`text-xs font-semibold py-1 px-4 rounded-full ${
                    song.isPlaying
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {song.isPlaying ? "Now Playing" : "Last Listened"}
                </span>
              </div>
              <div className="w-full aspect-square overflow-hidden rounded-lg">
                <a href={song.uri} target="_blank" rel="noopener noreferrer">
                  <img
                    src={song.albumImage}
                    alt="Album cover"
                    className="object-cover w-full h-full"
                    style={{ aspectRatio: "400 / 400", objectFit: "cover" }}
                  />
                </a>
              </div>
              <div className="text-center">
                <a
                  href={song.external_urls.spotify}
                  className="text-lg font-semibold leading-none hover:text-green-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {song.trackName}
                </a>
                <p className="text-sm text-gray-500">
                  {song.artists.map((artist, index) => (
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
              {song.isPlaying ? (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    {formatDuration(song.progressMs)} /{" "}
                    {formatDuration(song.duration_ms)}
                  </p>
                </div>
              ) : null}
              <div className="flex justify-between gap-2">
                  {song.isPlaying ? (
                    <ProgressTracker
                      progress={song.progressMs}
                      duration={song.durationMs}
                    />
                  ) : null}
                {song.previewUrl && (
                  <div className="items-center">
                    <audio
                      ref={audioRef}
                      controls
                      autoPlay
                      loop
                      className="w-full mt-4 hidden"
                    >
                      <source src={song.previewUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      onClick={handleMuteClick}
                      className="ml-4 p-2 bg-black rounded-full text-white hover:bg-primary focus:outline-none focus:ring"
                    >
                      {isMuted ? (
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
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 h-screen flex flex-col">
          <div className="flex-1 grid place-items-center">
            <div className="p-4 rounded-lg border border-gray-200 w-full max-w-sm mx-auto grid gap-4 items-center">
              <div className="animate-pulse space-y-4">
                <div className="h-64 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentPlaying;
