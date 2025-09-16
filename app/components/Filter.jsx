'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { tmdbApi } from '../services/tmdb/tmdbApi';

const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'vote_average.desc', label: 'Rated' },
    { value: 'release_date.desc', label: 'Latest' },
    { value: 'title.asc', label: 'Title (A-Z)' },
    { value: 'title.desc', label: 'Title (Z-A)' },
];

function Filter() {
    const [genres, setGenres] = useState([]);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [alphaSort, setAlphaSort] = useState(
        searchParams.get('sortBy') === 'title.asc' ? 'asc' :
        searchParams.get('sortBy') === 'title.desc' ? 'desc' : null
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== (searchParams.get('search') || '')) {
                handleFilterChange('search', searchInput);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        tmdbApi.getGenres().then(setGenres).catch(console.error);
    }, []);

    useEffect(() => {
        const sortBy = searchParams.get('sortBy');
        if (sortBy === 'title.asc') {
            setAlphaSort('asc');
        } else if (sortBy === 'title.desc') {
            setAlphaSort('desc');
        } else {
            setAlphaSort(null);
        }
    }, [searchParams]);

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

    const toggleAlphaSort = () => {
        let newSort;
        if (alphaSort === 'asc') {
            newSort = 'title.desc';
            setAlphaSort('desc');
        } else {
            newSort = 'title.asc';
            setAlphaSort('asc');
        }
        handleFilterChange('sortBy', newSort);
    };

    const hasActiveFilters = searchParams.get('genre') ||
        searchParams.get('search') ||
        (searchParams.get('rating') && searchParams.get('rating') !== '0') ||
        (searchParams.get('sortBy') && searchParams.get('sortBy') !== 'popularity.desc');

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">

        {/* Search */}
        <input 
            type="text"
            placeholder='Search movies...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-gray-800/80 px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 w-full max-w-xs text-white text-sm"
            />

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

        {/* Alphabetical Sort Button */}
        <button
            onClick={toggleAlphaSort}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
                alphaSort
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-800/80 text-white hover:bg-gray-700'
            }`}
        >
            A-Z {alphaSort === 'asc' ? '↑' : alphaSort === 'desc' ? '↓' : ''}
        </button>

        {/* Clear - only show when filters are active */}
        {hasActiveFilters && (
            <button
            onClick={() => {
                setSearchInput('');
                router.push(pathname);
            }}
            className="ml-2 px-2 py-1 rounded text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
            ×
            </button>
        )}
        </div>
    );
}

export default Filter;