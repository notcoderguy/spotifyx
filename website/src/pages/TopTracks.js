// src/components/TopTracks.js
import React, { useEffect, useState } from 'react';
import { fetchTopTracks } from '../utils/data';

function TopTracks() {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        fetchTopTracks().then(data => {
            setTracks(data.items);
        }).catch(console.error);
    }, []);

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
            {tracks ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {tracks.map((track, index) => (
                        <div key={index} className="bg-base-200 rounded-lg p-4 shadow flex flex-col items-center relative">
                            <a href={track.uri} target="_blank" rel="noopener noreferrer">
                                <img src={track.album.images[1].url} alt="Album cover" className="w-full h-40 object-cover rounded-md mb-2" />
                            </a>
                            <div className="text-center">
                                <a href={track.external_urls.spotify} className="text-sm font-semibold hover:text-green-500" target="_blank" rel="noopener noreferrer">{track.name}</a>
                                <p className="text-xs text-gray-500 pb-8">
                                    {track.artists.map((artist, index) => (
                                        <React.Fragment key={artist.id}>
                                            {index > 0 && ', '}
                                            <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-green-700">
                                                {artist.name}
                                            </a>
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                            {track.preview_url && (
                                <div className='absolute w-full rounded-lg bottom-0'>
                                    <audio controls src={track.preview_url} loop className="mt-2 w-full">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 50 }, (_, i) => <SkeletonCard key={i} />)}
                </div>
            )}
        </div>
    );
}

export default TopTracks;
