'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { tmdbApi } from '../services/tmdb/tmdbApi';

function Modal ({ movie, onClose }) {
    const [ details, setDetails ] = useState(null);
    const [ cast, setCast ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (movie) {
            setLoading(true);
            Promise.all([
                tmdbApi.getMovieDetails(movie.id),
                tmdbApi.getMovieCredits(movie.id)
            ])
                .then(([movieDetails, credits]) => {
                    setDetails(movieDetails);
                    setCast(credits.cast ? credits.cast.slice(0, 6) : []); // Get top 6 cast members
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
        className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
        onClick={onClose}
    >
        <div
            className="bg-white shadow-2xl border-2 border-gray-300 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-slideUp"
            onClick={handleContentClick}
        >
            {/* Header for all screen sizes */}
            <div className="top-0 z-10 sticky flex justify-between items-center bg-white p-4 sm:p-6 border-gray-200 border-b-2">
                <div>
                    <h2 className="mb-1 font-bold text-gray-900 text-xl sm:text-2xl">{movie.title}</h2>
                    <p className="text-gray-500 text-sm">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                >
                    ×
                </button>
            </div>

            <div className="flex lg:flex-row flex-col flex-1 overflow-hidden">
                {/* Image section */}
                <div className="relative flex-shrink-0 w-full lg:w-1/3 h-64 lg:h-auto">
                    <Image
                        src={imageUrl}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="w-full h-full object-cover"
                        priority
                    />
                    {/* Rating overlay on image */}
                    <div className="top-4 right-4 absolute flex items-center gap-2 bg-white/95 px-3 py-2 border-2 border-gray-300 rounded-lg">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-bold text-gray-900">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    </div>
                </div>

                {/* Content section */}
                <div className="flex-1 p-4 sm:p-6 lg:border-gray-200 lg:border-l-2 w-full lg:w-2/3 overflow-y-auto">

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="border-b-2 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                        </div>
                    ) : details ? (
                        <div className="space-y-6">

                            {/* Movie info cards */}
                            <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
                                <div className="bg-gray-50 p-3 border-2 border-gray-200 rounded-lg text-center">
                                    <p className="mb-1 text-gray-500 text-xs">Release Date</p>
                                    <p className="font-semibold text-gray-800">{details.release_date}</p>
                                </div>
                                <div className="bg-gray-50 p-3 border-2 border-gray-200 rounded-lg text-center">
                                    <p className="mb-1 text-gray-500 text-xs">Runtime</p>
                                    <p className="font-semibold text-gray-800">{details.runtime} min</p>
                                </div>
                                <div className="bg-yellow-50 p-3 border-2 border-yellow-200 rounded-lg text-center">
                                    <p className="mb-1 text-yellow-600 text-xs">Rating</p>
                                    <div className="flex justify-center items-center gap-1">
                                        <span className="font-bold text-gray-800">{details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}/10</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 border-2 border-green-200 rounded-lg text-center">
                                    <p className="mb-1 text-green-600 text-xs">Status</p>
                                    <p className="font-semibold text-gray-800">{details.status || 'Released'}</p>
                                </div>
                            </div>

                            {/* Genres */}
                            {details.genres && details.genres.length > 0 && (
                                <div>
                                    <h3 className="mb-3 font-semibold text-gray-900">Genres</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {details.genres.map(genre => (
                                            <span
                                                key={genre.id}
                                                className="bg-stone-700 px-4 py-2 border-2 border-gray-300 rounded-md font-medium text-white text-sm"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Overview */}
                            <div>
                                <h3 className="mb-3 font-semibold text-gray-900">Overview</h3>
                                <div className="bg-gray-50 p-4 border-2 border-gray-200 rounded-lg">
                                    <p className="text-gray-700 leading-relaxed">
                                        {details.overview}
                                    </p>
                                </div>
                            </div>

                            {/* Cast */}
                            {cast.length > 0 && (
                                <div>
                                    <h3 className="mb-3 font-semibold text-gray-900">Main Cast</h3>
                                    <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {cast.map(actor => (
                                            <div key={actor.id} className="bg-white p-3 border-2 border-gray-200 hover:border-gray-300 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={actor.profile_path
                                                            ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                                                            : 'https://via.placeholder.com/92x138?text=No+Image'}
                                                        alt={actor.name}
                                                        width={50}
                                                        height={75}
                                                        className="flex-shrink-0 border-2 border-gray-200 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate">{actor.name}</p>
                                                        <p className="text-gray-600 text-sm truncate">{actor.character}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="py-8 text-red-500 text-center">Could not load movie details.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}

export default Modal;