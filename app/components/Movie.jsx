import React from 'react';
import Image from 'next/image';

function Movie({ movie, onMovieClick }) {

  if (!movie) {
      return null;
  }

  // Construct the full image URL
  const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image"; // Fallback image

  return (
      <div
      className="group bg-white bordered-card rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onMovieClick(movie)}
      >
        <div className="relative border-gray-200 border-b-2 aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            width={500}
            height={750}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          <div className="top-3 right-3 absolute flex items-center gap-1 bg-white px-2 py-1 border-2 border-gray-200 rounded-lg">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold text-gray-900 text-sm">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }</span>
          </div>
        </div>

        <div className="p-4">
          <h2 className="mb-3 font-semibold text-gray-900 text-lg line-clamp-2">
            {movie.title}
          </h2>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">{new Date(movie.release_date).getFullYear()}</span>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200 rounded-full">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-gray-800 text-sm">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }</span>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Movie;