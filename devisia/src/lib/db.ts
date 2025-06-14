import { PrismaClient } from '../generated/prisma'

// Empêcher la création de multiples instances de Prisma pendant le hot reloading
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const db = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db
}
