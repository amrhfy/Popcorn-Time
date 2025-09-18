'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { tmdbApi } from '../services/tmdb/tmdbApi';

function SearchModal({ isOpen, onClose, onMovieClick }) {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSearchInput('');
            setSearchResults([]);
            setSelectedIndex(-1);
            // Focus input when modal opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchInput.trim() && searchInput.length > 2) {
                setIsSearching(true);
                try {
                    const results = await tmdbApi.searchMovies(searchInput);
                    setSearchResults(results.results.slice(0, 8));
                    setSelectedIndex(-1);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setSelectedIndex(-1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < searchResults.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                handleMovieSelect(searchResults[selectedIndex]);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, searchResults, selectedIndex, onClose]);

    const handleMovieSelect = (movie) => {
        onClose();
        if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="relative p-6 border-b-2 border-gray-200">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for movies..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-12 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm mt-3">
                        Use ↑↓ to navigate, Enter to select, Esc to close
                    </p>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                    {searchInput.length > 0 && searchInput.length <= 2 && (
                        <div className="p-6 text-center text-gray-500">
                            Type at least 3 characters to search...
                        </div>
                    )}

                    {searchInput.length > 2 && searchResults.length === 0 && !isSearching && (
                        <div className="p-6 text-center text-gray-500">
                            No movies found for "{searchInput}"
                        </div>
                    )}

                    {searchResults.map((movie, index) => (
                        <div
                            key={movie.id}
                            onClick={() => handleMovieSelect(movie)}
                            className={`flex items-center gap-4 p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                                index === selectedIndex ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                            }`}
                        >
                            <Image
                                src={movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                    : 'https://via.placeholder.com/92x138?text=No+Image'}
                                alt={movie.title}
                                width={50}
                                height={75}
                                className="rounded-lg border-2 border-gray-200 object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate text-lg">{movie.title}</h4>
                                <p className="text-gray-600 truncate">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1">
                                        <span className="text-yellow-500 text-sm">⭐</span>
                                        <span className="text-sm font-medium text-gray-700">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                                    </div>
                                    {movie.overview && (
                                        <p className="text-gray-500 text-sm truncate flex-1">{movie.overview.substring(0, 80)}...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;