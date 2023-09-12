export interface Movie {
  id: number;
  title: string;
  description: string,
  genres: string[];
  releaseDate: string;
  averageRating: number;
  moviePoster: string;
}

export interface Review {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
}