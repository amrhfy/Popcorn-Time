'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { tmdbApi } from '../services/tmdb/tmdbApi';
import Movie from './Movie';
import Modal from './Modal';


function MovieGrid({ currentPage, filters }) {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
          const data = await tmdbApi.discoverMovies({
            genre: filters.genre,
            rating: filters.rating,
            sortBy: filters.sortBy,
            page: filters.page,
          });
          setMovies(data.results);
          setTotalPages(Math.min(data.total_pages, 500));
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
    };

    fetchMovies();
    window.scrollTo(0, 0);
  }, [currentPage, filters]);

  const handlePageChange = (newPage) => {
    const current = new URLSearchParams(searchParams);
    current.set('page', newPage.toString());
    router.push(`${pathname}?${current.toString()}`);
  }

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-red-500 text-center">Error: {error}</div>;
  }


  return (
    <div>
      <div className="gap-3 sm:gap-4 lg:gap-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} onMovieClick={setSelectedMovie} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 sm:gap-4 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:hover:bg-gray-100 disabled:opacity-40 px-3 sm:px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <div className="flex items-center bg-gray-50 px-3 sm:px-4 py-2 rounded-lg">
          <span className="font-medium text-gray-600 text-sm">
            <span className="text-gray-900">{currentPage}</span>
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-gray-500">{totalPages || '...'}</span>
          </span>
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:hover:bg-gray-100 disabled:opacity-40 px-3 sm:px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {selectedMovie && (
        <Modal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>

  );
}

export default MovieGrid;