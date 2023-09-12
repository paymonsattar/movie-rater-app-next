import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Movie } from '../../app/types';
import MovieDetailComponent from '../../components/movies/MovieDetail';
import RatingComponent from '../../components/movies/RatingComponent';
import { getMovie } from '../../app/api/movies';

const MovieDetail = () => {
  const [movie, setMovie] = useState<Movie>();
  const router = useRouter();

  // Use optional chaining and nullish coalescing to safely extract and convert id to string
  const id = useMemo(() => {
    return router.query?.id?.toString?.() ?? "";
  }, [router.query?.id]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        console.log(`error with ${id}`)
        return;
      }

      try {
        const fetchedMovie = await getMovie(id);
        setMovie(fetchedMovie);
      } catch (err) {
        console.error(`Error fetching movie: ${id}`, err);
      }
    };

    fetchMovie();
  }, [id]);
  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="container mx-auto px-4 dark:bg-gray-800">
      <Head>
        <title>{movie.title}</title>
      </Head>

      <div className="flex flex-col md:flex-row mt-8">
        <MovieDetailComponent movie={movie} />
      </div>
      
      <div className="mt-8">
        <RatingComponent submitRating={() => {console.log('submitted' )}} />
      </div>
    </div>
  );
};

export default MovieDetail;
