import { Request, Response } from 'express';
import { RedisClient } from '../types';

export const addReview = (client: RedisClient) => async (req: Request, res: Response) => {
  const { movieId, review } = req.body;

  try {
    const reply = await client.rPush(`reviews:${movieId}`, review.toString());

    return res.status(201).json({ message: 'Review added', count: reply }); 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getReviews = (client: RedisClient) => async (req: Request, res: Response) => {
  const { movieId } = req.params;

  try {
    const reply = await client.lRange(`reviews:${movieId}`, 0, -1);

    return res.status(200).json({ reviews: reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getReviewAverage = (client: RedisClient) => async (req: Request, res: Response) => {
  const { movieId } = req.params;

  try {
    const reply = await client.lRange(`reviews:${movieId}`, 0, -1);
    const reviews = reply.map(Number);

    const total = reviews.reduce((acc, val) => acc + val, 0);
    const average = total / reviews.length || 0;

    return res.status(200).json({ average });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
