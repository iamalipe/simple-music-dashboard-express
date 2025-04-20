import * as schema from '../drizzle/schema';

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!, {
  schema: schema,
  logger: true,
});

export default db;
