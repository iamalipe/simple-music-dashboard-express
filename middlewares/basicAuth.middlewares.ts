import { Request, Response, NextFunction } from 'express';
import { BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME } from '../config/default';

/**
 * The above function is a basic authentication middleware in TypeScript that checks for authorization
 * headers, validates credentials, and sends appropriate responses.
 * @param {Request} req - The `req` parameter in the `basicAuth` function stands for the Request
 * object, which represents the HTTP request that the server receives from the client. It contains
 * information about the request such as headers, parameters, body, URL, and more. In this context,
 * `req` is used to
 * @param {Response} res - The `res` parameter in the `basicAuth` function is an object representing
 * the HTTP response that the server sends back to the client. It allows you to set headers, status
 * codes, and send data back to the client in response to a request.
 * @param {NextFunction} next - The `next` parameter in the `basicAuth` function is a callback function
 * that is used to pass control to the next middleware function in the stack. When called, it will
 * execute the next middleware function in the chain. This is commonly used in Express.js middleware to
 * move to the next middleware function
 * @returns The function `basicAuth` returns either a 401 status with a message "Authentication
 * required" if there is no authorization header present in the request, or a 401 status with a message
 * "Invalid credentials" if the provided credentials do not match the expected `BASIC_AUTH_USERNAME`
 * and `BASIC_AUTH_PASSWORD`. If the credentials are valid, the function calls the `next()` function to
 * proceed
 */
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
