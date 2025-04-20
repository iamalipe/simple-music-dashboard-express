import { User } from '../prisma/prisma';

export type PublicUser = Omit<User, 'password'>;
