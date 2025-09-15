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
        className="z-50 fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 p-2 sm:p-4"
        onClick={onClose}
    >
        <div
            className="flex flex-col bg-white rounded-lg w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={handleContentClick}
        >
            {/* Mobile header with close button */}
            <div className="flex sm:hidden justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h2 className="font-bold text-lg truncate pr-4">{movie.title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 text-2xl p-1 flex-shrink-0"
                >
                    &times;
                </button>
            </div>

            <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                {/* Image section */}
                <div className="w-full sm:w-1/3 h-48 sm:h-auto flex-shrink-0">
                    <Image
                        src={imageUrl}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>

                {/* Content section */}
                <div className="relative p-4 sm:p-6 w-full sm:w-2/3 overflow-y-auto flex-1">
                    {/* Desktop close button */}
                    <button
                        onClick={onClose}
                        className="hidden sm:block top-4 right-4 absolute text-gray-500 hover:text-gray-800 text-2xl"
                    >
                        &times;
                    </button>

                    {/* Desktop title */}
                    <h2 className="hidden sm:block mb-2 font-bold text-2xl lg:text-3xl">{movie.title}</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : details ? (
                        <>
                            {details.tagline && (
                                <p className="mb-3 sm:mb-4 text-gray-600 text-sm sm:text-base italic">{details.tagline}</p>
                            )}

                            {/* Movie info */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-gray-500 text-xs sm:text-sm">
                                <span>{details.release_date}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{details.runtime} min</span>
                                <span className="hidden sm:inline">•</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-amber-500">★</span>
                                    <span className="font-medium text-gray-700">
                                        {details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Genres */}
                            {details.genres && details.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    {details.genres.map(genre => (
                                        <span
                                            key={genre.id}
                                            className="bg-gray-200 px-2 sm:px-2.5 py-0.5 rounded-full font-semibold text-gray-800 text-xs"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Overview */}
                            <h3 className="mb-2 font-semibold text-base sm:text-lg">Overview</h3>
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {details.overview}
                            </p>
                        </>
                    ) : (
                        <p className="text-red-500 text-center py-8">Could not load movie details.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}

export default Modal;