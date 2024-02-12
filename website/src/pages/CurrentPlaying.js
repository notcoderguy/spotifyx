import React, { useEffect, useState } from 'react';
import { fetchCurrentPlaying } from '../utils/data';

import ProgressTracker from '../components/ProgressTracker';

function CurrentPlaying() {
    const [song, setSong] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

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
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    return (
        <div className="text-center">
            {song ? (
                <div className="mt-4 h-screen flex flex-col">
                    <div className="flex-1 grid place-items-center">
                        <div className="p-8 rounded-lg bg-base-200 w-full max-w-sm mx-auto grid gap-4 items-center relative">
                            <div className="absolute top-0 right-0 pr-3 pt-4">
                                <span className={`text-xs font-semibold py-1 px-4 rounded-full ${song.isPlaying ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                    {song.isPlaying ? 'Now Playing' : 'Last Listened'}
                                </span>
                            </div>
                            <div className="w-full aspect-square overflow-hidden rounded-lg">
                                <a href={song.uri} target="_blank" rel="noopener noreferrer">
                                    <img src={song.albumImage} alt="Album cover" className="object-cover w-full h-full" style={{ aspectRatio: '400 / 400', objectFit: 'cover' }} />
                                </a>
                            </div>
                            <div className="text-center">
                                <a href={song.external_urls.spotify} className="text-lg font-semibold leading-none hover:text-green-500" target="_blank" rel="noopener noreferrer">{song.trackName}</a>
                                <p className="text-sm text-gray-500">
                                    {song.artists.map((artist, index) => (
                                        <React.Fragment key={artist.id}>
                                            {index > 0 && ', '}
                                            <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-green-700">
                                                {artist.name}
                                            </a>
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                            {song.isPlaying ? (
                                <div className="mt-4">
                                    <p className="text-xs text-gray-500">{formatDuration(song.progressMs)} / {formatDuration(song.duration_ms)}</p>
                                </div>
                            ) : null}
                            <div className="grid gap-2">
                                {song.isPlaying ? (
                                    <ProgressTracker progress={song.progressMs} duration={song.durationMs} />
                                ) : null}
                                {song.previewUrl && (
                                    <div className="items-center hidden">
                                        <audio controls autoPlay loop className="w-full mt-4">
                                            <source src={song.previewUrl} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
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
