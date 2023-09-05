import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // 👇️ Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    
    // 👇️ Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// 👇️ If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // 👇️ Log the request
  logger.info(`Request: ${req.method} ${req.path}, Headers: ${JSON.stringify(req.headers)}, Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}`);
  
  if (res.locals && res.locals.errorMessage) {
    logger.error(`Error: ${res.locals.errorMessage}`);
  }

  // 👇️ Log the response
  res.on('finish', () => {
    logger.info(`Response: ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
  });

  // 👇️ Pass control to the next middleware function
  next();
};
