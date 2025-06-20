// import { PrismaClient } from '@prisma/client';

// declare global {
//     var prisma: PrismaClient | undefined;
// }

// export const db = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') global.prisma = db;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
