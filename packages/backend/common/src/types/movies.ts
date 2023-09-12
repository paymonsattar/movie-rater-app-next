export interface Movie {
  id: string;
  title: string;
  description: string,
  genres: string[];
  releaseDate: string;
  averageRating?: number;
  moviePoster: string;
}
