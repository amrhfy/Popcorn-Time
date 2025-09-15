const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const tmdbApi = {
    
    // Get playing now movies
    getNowPlaying: async () => {
        const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
        if (!res.ok) {
            throw new Error('Failed to fetch now playing movies');
        }
        return res.json();
    },

    // Get movie details
    getMovie: async (id) => {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
        if (!res.ok) {
            throw new Error(`Failed to fetch movie with id ${id}`);
        }
        return res.json();
    },

    // Search movies
    searchMovies: async (query) => {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
        if (!res.ok) {
            throw new Error(`Failed to search movies with query ${query}`);
        }
        return res.json();
    }
}

export default tmdbApi;