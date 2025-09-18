'use client';

import { useState, useEffect } from 'react';
import MovieGrid from "./components/MovieGrid";
import Filter from "./components/Filter";
import Modal from "./components/Modal";
import SearchModal from "./components/SearchModal";

function Home({ searchParams }) {
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle searchParams (they might be a promise in some Next.js versions)
  const resolvedSearchParams = typeof searchParams?.then === 'function'
    ? {} // Fallback for async searchParams
    : searchParams || {};

  const page = parseInt(resolvedSearchParams.page) || 1;

  const filters = {
    page: parseInt(resolvedSearchParams.page) || 1,
    genre: resolvedSearchParams.genre || '',
    rating: resolvedSearchParams.rating || '0',
    sortBy: resolvedSearchParams.sortBy || 'popularity.desc',
    search: resolvedSearchParams.search || '',
  };
  
  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-8 text-center bg-white bordered-card rounded-lg p-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            Now Playing Movies
          </h1>
          <p className="text-gray-600 mb-3">Discover the latest movies in theaters</p>
          <div className="text-sm text-gray-500">
            Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors border-b border-blue-600 hover:border-blue-700">TMDb</a>
          </div>
        </header>

        <div className="bg-white bordered-card rounded-lg p-6 mb-8">
          <Filter onSearchClick={() => setIsSearchModalOpen(true)} />
        </div>

        <MovieGrid filters={filters} currentPage={page} />

        {selectedMovie && (
          <Modal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}

        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onMovieClick={setSelectedMovie}
        />
      </div>
    </main>
  );
}

export default Home;