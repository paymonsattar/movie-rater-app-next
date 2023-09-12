export interface Review {
  id: string;
  movieId: number;
  rating: number;
  comment: string;
}

export interface AverageReview {
  movieId: string;
  averageReview: number;
}

