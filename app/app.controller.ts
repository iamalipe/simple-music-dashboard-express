import { Request, Response } from 'express';

export const rootController = async (req: Request, res: Response) => {
  res.send('Hello World');
};
export const healthCheckController = async (req: Request, res: Response) => {
  const ip1 = req.ip;
  const ip2 = req.headers['x-forwarded-for'];
  const ip3 = req.connection.remoteAddress;
  console.log('ip1', ip1);
  console.log('ip2', ip2);
  console.log('ip3', ip3);

  res.sendStatus(200);
};
