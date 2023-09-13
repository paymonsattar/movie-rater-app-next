export interface Review {
  id: string;
  movieId: string;
  rating: number;
  comment?: string;
}

export interface AverageReview {
  movieId: string;
  averageReview: number;
}

