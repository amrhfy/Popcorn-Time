const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const tmdbApi = {
    
    // Get playing now movies
    getNowPlaying: async (page = 1) => {
        const res = await fetch(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}&language=en-US`,
            {
                cache: 'force-cache'
            }
        );
        if (!res.ok) {
            throw new Error('Failed to fetch now playing movies');
        }
        return res.json();
    },

    // Get all movie genres
    getGenres: async () => {
        const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        if (!res.ok) {
            throw new Error('Failed to fetch movie genres');
        }
        const data = await res.json();
        return data.genres;
    },

    // Get movies with filtesrs
    discoverMovies: async ({ genre, rating, sortBy, page }) => {
        const params = new URLSearchParams({
            api_key: API_KEY,
            language: 'en-US',
            page: page || 1,
            'vote_average.gte': rating || 0,
            sort_by: sortBy || 'popularity.desc',
        });

        if (genre) {
            params.append('with_genres', genre);
        }

        const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);

        if (!res.ok) {
            throw new Error('Failed to fetch discovered movies');
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

    // Get movie details (alias for consistency)
    getMovieDetails: async (id) => {
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