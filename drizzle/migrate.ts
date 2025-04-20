import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const db = drizzle(process.env.DATABASE_URL!);

const main = async () => {
  await migrate(db, {
    migrationsFolder: './drizzle/migrations',
  });
};

main();
