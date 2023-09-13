export interface Movie {
  id: string;
  title: string;
  description: string,
  genres: string[];
  director?: string;
  runtime: number;
  actors?: string;
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