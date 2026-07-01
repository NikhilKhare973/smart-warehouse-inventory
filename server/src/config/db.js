const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Get the connection string from the environment
const connectionString = process.env.DATABASE_URL;

// 2. Create a connection pool using the native pg library
const pool = new Pool({ connectionString });

// 3. Wrap the pool in the Prisma Postgres adapter
const adapter = new PrismaPg(pool);

// 4. Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;