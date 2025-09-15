import MovieGrid from "./components/MovieGrid";

function Home() {
  return (
    <main className="container mx-auto p-10">
      <div className="mb-8 flex flex-col gap-4 text-center">
        <h1 className="text-3xl font-bold">Now Playing Movies</h1>
        <span className="text-gray-200">Data fetched from TMDB API</span>
      </div>

      <MovieGrid />
    </main>
  );
}

export default Home;