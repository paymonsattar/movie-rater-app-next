import { Request, Response, NextFunction } from 'express';
import { requestLogger as logger } from '../../src/index';
import * as winston from 'winston';

const winstonLogger = winston.createLogger()

const mockInfo = winstonLogger.info;
const mockError = winstonLogger.error;

// Mock winston logger methods
jest.mock("winston", () => {
  const winston = jest.requireActual("winston");
  return {
    ...winston,
    createLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      add: jest.fn(),  // Mock the 'add' method
    }),
  };
});

describe('Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      path: '/test-path',
      headers: {},
      body: {},
      query: {},
    };
    mockResponse = {
      locals: {},
      status: jest.fn().mockReturnValue({}),
      json: jest.fn().mockReturnValue({}),
      on: jest.fn(),
      get: jest.fn(),
    };
  });

  it('should correctly log incoming requests', () => {
    logger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockInfo).toHaveBeenCalledWith(expect.stringContaining('Request: GET /test-path'));
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should correctly log outgoing responses', () => {
    logger(mockRequest as Request, mockResponse as Response, nextFunction);

    // Simulate the 'finish' event
    (mockResponse.on as jest.Mock).mock.calls[0][1]();

    expect(mockInfo).toHaveBeenCalledWith(expect.stringContaining('Response:'));
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should correctly log errors', () => {
    const errorMessage = 'Some error';
    mockResponse.locals!.errorMessage = errorMessage;

    logger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockError).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    expect(nextFunction).toHaveBeenCalled();
  });
});
