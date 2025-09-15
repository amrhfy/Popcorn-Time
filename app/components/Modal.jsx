'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { tmdbApi } from '../services/tmdb/tmdbApi';

function Modal ({ movie, onClose }) {
    const [ details, setDetails ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (movie) {
            setLoading(true);
            tmdbApi.getMovieDetails(movie.id)
                .then(data => {
                    setDetails(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [movie]);

    if (!movie) {
        return null;
    }

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image"; // Fallback image

return (
    <div
        className="z-50 fixed inset-0 flex justify-center items-center backdrop-blur-md bg-black/30 p-4"
        onClick={onClose}
    >
        <div 
            className="flex sm:flex-row flex-col bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={handleContentClick}
        >
            <div className="w-full sm:w-1/3">
                <Image 
                    src={imageUrl} 
                    alt={movie.title} 
                    width={500}
                    height={750}
                    className="w-full h-full object-cover" 
                />
            </div>
            <div className="relative p-6 w-full sm:w-2/3 overflow-y-auto">
                <button onClick={onClose} className="top-4 right-4 absolute text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="mb-2 font-bold text-3xl">{movie.title}</h2>
                
                {loading ? (
                    <p>Loading details...</p>
                ) : details ? (
                    <>
                        <p className="mb-4 text-gray-600">{details.tagline}</p>
                        <div className="flex items-center mb-4 text-gray-500 text-sm">
                            <span>{details.release_date}</span>
                            <span className="mx-2">•</span>
                            <span>{details.runtime} min</span>
                            <span className="mx-2">•</span>
                            <div className="flex items-center gap-1">
                                <span className="text-amber-500">★</span>
                                <span className="font-medium text-gray-700">{details.vote_average ? details.vote_average.toFixed(1) : 'N/A' }</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {details.genres.map(genre => (
                                <span key={genre.id} className="bg-gray-200 px-2.5 py-0.5 rounded-full font-semibold text-gray-800 text-xs">{genre.name}</span>
                            ))}
                        </div>
                        <h3 className="mb-2 font-semibold text-lg">Overview</h3>
                        <p className="text-gray-700">{details.overview}</p>
                    </>
                ) : (
                    <p className="text-red-500">Could not load movie details.</p>
                )}
            </div>
        </div>
    </div>
    );
}

export default Modal;