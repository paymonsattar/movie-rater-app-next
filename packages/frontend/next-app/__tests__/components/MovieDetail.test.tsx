import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import nock from 'nock';
import '@testing-library/jest-dom';
import MovieDetail from '../../components/movies/MovieDetail';
import { mockMovie, nockCORSHeaders } from '../resources/mockTypes';

const mockOnRatingSubmit = jest.fn(() => Promise.resolve());

describe('MovieDetail', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    // Only localhost connections can now be made
    nock.enableNetConnect('127.0.0.1');

    nock('http://localhost:3000')
      .defaultReplyHeaders(nockCORSHeaders)
      .get('/movies/test-movie-id')
      .reply(200, {
        status: 'success',
        code: 200,
        body: {
          ...mockMovie,
        },
      });

    nock('http://localhost:3002')
      .defaultReplyHeaders(nockCORSHeaders)
      .get('/reviews/test-movie-id')
      .reply(200, {
        /* your mocked response object for reviews */
      });

    nock('http://localhost:3002')
      .defaultReplyHeaders(nockCORSHeaders)
      .post('/reviews/')
      .reply(200, {
        /* your mocked response object */
      });
  });

  afterAll(() => {
    nock.restore();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should display the movie title.', () => {
    const { getByText } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getByText('Mock Movie Title')).toBeInTheDocument();
  });

  it("Should display the movie's average rating.", () => {
    const { getByText } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getByText('Average rating: 3.2')).toBeInTheDocument();
  });

  it("Should display the movie's image.", () => {
    const { getByAltText } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getByAltText('Mock Movie Title poster')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fmock_movie_picture.webp&w=1080&q=75'
    );
  });

  // This test only checks if the logic for image fallback exists.
  // Testing if it truly works requires mocking image load/error events.
  it("Should display the movie's genres.", () => {
    const { getAllByText } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getAllByText(/Action|Adventure|Sci-Fi/).length).toBe(3);
  });

  it("Should display the movie's release date.", () => {
    const { getByText } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getByText(/1994/)).toBeInTheDocument();
  });

  it("Should display the movie's description.", () => {
    const { getByText } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getByText(/Mock movie description/)).toBeInTheDocument();
  });

  it('Should show a RatingsComponent to rate the movie.', () => {
    const { getByTestId } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    expect(getByTestId('ratings-component')).toBeInTheDocument();
  });

  it('Should invoke the onRatingSubmit function when a new rating is submitted.', async () => {
    const { getByTestId } = render(
      <MovieDetail movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />
    );
    const submitButton = getByTestId('submit-button');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnRatingSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
