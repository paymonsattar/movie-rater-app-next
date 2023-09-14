import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Movie, Review } from '../../app/types';
import MovieDetailComponent from '../../components/movies/MovieDetail';
import { getMovie } from '../../app/api/movies';
import { getReviews } from '../../app/api/reviews';
import Layout from '../layout';

const MovieDetail = () => {
  const [movie, setMovie] = useState<Movie>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();

  // Use optional chaining and nullish coalescing to
  // safely extract and convert id to string
  const id = useMemo(() => {
    return router.query?.id?.toString?.() ?? '';
  }, [router.query?.id]);

  useEffect(() => {
    fetchMovie();
    fetchReviews();
  }, [id]);

  const fetchMovie = async () => {
    if (!id) {
      console.log(`error with ${id}`);
      return;
    }

    try {
      const fetchedMovie = await getMovie(id);
      setMovie(fetchedMovie);
    } catch (err) {
      console.error(`Error fetching movie: ${id}`, err);
    }
  };

  const fetchReviews = async () => {
    if (!id) {
      return;
    }

    try {
      const fetchedReviews = await getReviews(id);
      
      setReviews(fetchedReviews.filter(review => review.comment));
    } catch (err) {
      console.error(`Error fetching reviews: ${id}`, err);
    }
  };

  const onRatingSubmit = async () => {
    fetchMovie();
    fetchReviews();
  };

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 dark:bg-gray-800">
        <Head>
          <title>{movie.title}</title>
        </Head>

        <div className="flex flex-col md:flex-row mt-8">
          <MovieDetailComponent movie={movie} onRatingSubmit={onRatingSubmit} />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Reviews:</h2>
          <ul>
            {reviews.length === 0 ? (
              <p>No reviews with comments available.</p>
            ) : (
              reviews.map((review, index) => (
                <li key={index} className="border-b border-gray-200 py-4">
                  <div>
                    <strong>Rating:</strong> {review.rating}
                  </div>
                  <div>
                    <strong>Comment:</strong> {review.comment}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetail;
