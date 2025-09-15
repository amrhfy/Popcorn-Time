import React from 'react';
import Image from 'next/image';

function Movie({ movie }) {

  if (!movie) {
      return null;
  }

  // Construct the full image URL
  const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image"; // Fallback image

  return (
      <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
        <div className="aspect-[2/3] overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={movie.title} 
            width={500}
            height={750}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="space-y-3 p-6">
          <h2 className="font-medium text-gray-900 text-lg line-clamp-2 leading-tight">
            {movie.title}
          </h2>
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span>{movie.release_date}</span>
            <div className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span className="font-medium text-gray-700">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }</span>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Movie;