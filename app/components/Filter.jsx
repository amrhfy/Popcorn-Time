'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const sortOptions = [
    { value: 'popularity.desc', label: 'Popular' },
    { value: 'vote_average.desc', label: 'Rated' },
    { value: 'release_date.desc', label: 'Latest' },
    { value: 'title.asc', label: 'Title (A-Z)' },
    { value: 'title.desc', label: 'Title (Z-A)' },
];

function Filter({ onSearchClick }) {
    const [genres, setGenres] = useState([]);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [alphaSort, setAlphaSort] = useState(
        searchParams.get('sortBy') === 'title.asc' ? 'asc' :
        searchParams.get('sortBy') === 'title.desc' ? 'desc' : null
    );


    useEffect(() => {
        const { tmdbApi } = require('../services/tmdb/tmdbApi');
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
        (searchParams.get('rating') && searchParams.get('rating') !== '0') ||
        (searchParams.get('sortBy') && searchParams.get('sortBy') !== 'popularity.desc');

    return (
        <div className="flex flex-wrap justify-center items-center gap-4">

        {/* Search Icon */}
        <button
            onClick={onSearchClick}
            className="bg-white bordered-button px-4 py-2.5 rounded-lg text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
            title="Search movies (Ctrl+K)"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline font-medium">Search</span>
            <span className="hidden lg:inline text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300">Ctrl+K</span>
        </button>

        {/* Genre */}
        <select
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            value={searchParams.get('genre') || ''}
            className="bg-white bordered-input px-4 py-2.5 rounded-lg text-gray-900 cursor-pointer"
        >
            <option value="">All Genres</option>
            {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
        </select>

        {/* Rating */}
        <select
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            value={searchParams.get('rating') || '0'}
            className="bg-white bordered-input px-4 py-2.5 rounded-lg text-gray-900 cursor-pointer"
        >
            <option value="0">Any Rating</option>
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
            className="bg-white bordered-input px-4 py-2.5 rounded-lg text-gray-900 cursor-pointer"
        >
            {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>

        {/* Alphabetical Sort Button */}
        <button
            onClick={toggleAlphaSort}
            className={`px-4 py-2.5 rounded-lg font-medium ${
                alphaSort
                ? 'bordered-button-primary'
                : 'bg-white bordered-button text-gray-700'
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
            className="px-4 py-2.5 rounded-lg bg-white bordered-button text-gray-600 text-sm font-medium"
            title="Clear all filters"
            >
            Clear
            </button>
        )}
        </div>
    );
}

export default Filter;