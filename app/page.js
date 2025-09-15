import MovieGrid from "./components/MovieGrid";
import Filter from "./components/Filter";

async function Home({ searchParams }) {
  
  // Await searchParams before accessing its properties

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page) || 1;

  const filters = {
    page: parseInt(resolvedSearchParams.page) || 1,
    genre: resolvedSearchParams.genre || '',
    rating: resolvedSearchParams.rating || '0',
    sortBy: resolvedSearchParams.sortBy || 'popularity.desc',
  };
  
  return (
    <main className="container mx-auto p-10">
      <div className="mb-8 flex flex-col gap-4 text-center">
        <h1 className="text-3xl font-bold">Now Playing Movies</h1>
        <span className="text-gray-600">I like my site fast, not pretty.</span>
      </div>

      <Filter />
      <MovieGrid filters={filters} currentPage={page} />
    </main>
  );
}

export default Home;