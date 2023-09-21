import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Rating from '../../components/movies/RatingComponent'; // Adjust the import path accordingly
import { mockMovie, nockCORSHeaders } from '../resources/mockTypes';
import nock from 'nock';

jest.mock('../../app/api/reviews', () => ({
  mockOnRatingSubmit: jest.fn(() => Promise.resolve()),
  addReview: jest.fn(() => Promise.resolve()),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockOnRatingSubmit = require('../../app/api/reviews').mockOnRatingSubmit;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockAddReview = require('../../app/api/reviews').addReview;

describe('Rating Component', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    // Only localhost connections can now be made
    nock.enableNetConnect('127.0.0.1');
  });

  beforeEach(() => {
    render(<Rating movie={mockMovie} onRatingSubmit={mockOnRatingSubmit} />);
  });

  afterAll(() => {
    nock.restore();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should render a list of clickable star icons.', () => {
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
  });

  it('Should fill in the stars up to the current rating.', () => {
    const firstStar = screen.getAllByTestId('star-icon')[0];
    userEvent.click(firstStar);
    expect(firstStar).toHaveClass('text-yellow-300');
  });

  it('Should update the hover rating when a star is hovered over.', async () => {
    const thirdStar = screen.getAllByTestId('star-icon')[2];
    await act(async () => userEvent.hover(thirdStar));
    expect(thirdStar).toHaveClass('text-yellow-500');
  });

  it('Should update the selected rating when a star is clicked.', async () => {
    const secondStar = screen.getAllByTestId('star-icon')[1];
    await act(async () => userEvent.click(secondStar));
    expect(secondStar).toHaveClass('text-yellow-300');
  });

  it('Should reset the selected rating and comment when the Reset button is clicked.', () => {
    const resetButton = screen.getByText(/Reset/i);
    userEvent.click(resetButton);

    const stars = screen.getAllByTestId('star-icon');
    stars.forEach((star, index) => {
      if (index > 0) {
        expect(star).toHaveClass('text-gray-200');
      }
    });

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('Should trigger an update in the backend when the Submit button is clicked.', async () => {
    nock('http://localhost:3002')
      .defaultReplyHeaders(nockCORSHeaders)
      .post('/reviews/', {
        movieId: 'test-movie-id',
        rating: 1,
        comment: '',
      })
      .reply(200, {});

    const submitButton = screen.getByText(/Submit/i);
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnRatingSubmit).toHaveBeenCalled();
      expect(mockAddReview).toHaveBeenCalled();
    });
  });

  it('Should render a text area for adding comments.', () => {
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('Should update the comment state when text is entered in the text area.', async () => {
    const textarea = screen.getByRole('textbox');
    await act(async () => userEvent.type(textarea, 'Great movie!'));
    expect(textarea).toHaveValue('Great movie!');
  });
});
