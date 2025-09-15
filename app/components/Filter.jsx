'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { tmdbApi } from '../services/tmdb/tmdbApi';

const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'vote_average.desc', label: 'Rated' },
    { value: 'release_date.desc', label: 'Latest' },
];

function Filter() {
    const [genres, setGenres] = useState([]);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        tmdbApi.getGenres().then(setGenres).catch(console.error);
    }, []);

    const handleFilterChange = (key, value) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (value) {
            current.set(key, value);
        } else {
            current.delete(key);
        }
        current.set('page', '1');
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
    }

    const hasActiveFilters = searchParams.get('genre') ||
        (searchParams.get('rating') && searchParams.get('rating') !== '0') ||
        (searchParams.get('sortBy') && searchParams.get('sortBy') !== 'popularity.desc');

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
        {/* Genre */}
        <select
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            value={searchParams.get('genre') || ''}
            className="bg-gray-800/80 px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 text-white text-sm"
        >
            <option value="">Genre</option>
            {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
        </select>

        {/* Rating */}
        <select
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            value={searchParams.get('rating') || '0'}
            className="bg-gray-800/80 px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 text-white text-sm"
        >
            <option value="0">Rating</option>
            <option value="5">5+ ★</option>
            <option value="6">6+ ★</option>
            <option value="7">7+ ★</option>
            <option value="8">8+ ★</option>
            <option value="9">9+ ★</option>
        </select>

        {/* Sort */}
        <select
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            value={searchParams.get('sortBy') || 'popularity.desc'}
            className="bg-gray-800/80 px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 text-white text-sm"
        >
            {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>

        {/* Clear - only show when filters are active */}
        {hasActiveFilters && (
            <button
            onClick={() => router.push(pathname)}
            className="ml-2 px-2 py-1 rounded text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
            ×
            </button>
        )}
        </div>
    );
}

export default Filter;