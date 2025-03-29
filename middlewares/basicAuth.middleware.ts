import { Request, Response, NextFunction } from 'express';

const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || 'admin';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'password';

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Authentication required');
    return;
  }

  // Get credentials from header
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');
  const username = auth[0];
  const password = auth[1];

  // Validate credentials
  if (username === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
    // req.user = username; // Optional: attach user to request for later use
    next();
    return;
  }

  res.setHeader('WWW-Authenticate', 'Basic');
  res.status(401).send('Invalid credentials');
};
