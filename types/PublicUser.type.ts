import { User } from '../prisma/prisma-client';

export type PublicUser = Omit<User, 'password'>;
