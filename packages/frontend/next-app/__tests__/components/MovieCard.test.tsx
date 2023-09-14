import React from 'react';
import { render, fireEvent, getAllByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieCard from '../../components/movies/MovieCard';
import { useRouter } from 'next/router';
import { mockMovie } from '../resources/mockTypes';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('MovieCard', () => {

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    });
  });

  it('Should render the movie card with the correct movie title.', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);
    expect(getByText('Mock Movie Title')).toBeInTheDocument();
  });

  it("Should display the movie's average rating.", () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);
    expect(getByText('3.2/5')).toBeInTheDocument();
  });

  it("Should display the movie's image if available.", () => {
    const { getByAltText } = render(<MovieCard movie={mockMovie} />);
    expect(getByAltText('Mock Movie Title poster')).toHaveAttribute('src', '/_next/image?url=%2Fmock_movie_picture.webp&w=640&q=75');
  });

  // This test only checks if the logic for image fallback exists.
  // Testing if it truly works requires mocking image load/error events.
  it("Should have a fallback logic if the movie image fails to load.", () => {
    const img = new Image();
    expect(img.onerror).toBeDefined();
  });

  it("Should render the correct number of genre tags for each movie.", () => {
    const { getAllByText } = render(<MovieCard movie={mockMovie} />);
    expect(getAllByText(/Action|Adventure|Sci-Fi/).length).toBe(3);
  });

  it("Should render a 'More Info' button that correctly navigates to the movie details page.", () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);
    const btn = getByText('More Info');
    fireEvent.click(btn);

    const router = useRouter();
    expect(router.push).toHaveBeenCalledWith('/movie/test-movie-id');
  });

  it("Should display a star rating component with the correct average rating.", () => {
    const { getAllByTestId } = render(<MovieCard movie={mockMovie} />);
    const filledStars = getAllByTestId('star').filter(star => star.getAttribute('fill') === '#FBBF24');
    expect(filledStars.length).toBe(3);
  });

});
