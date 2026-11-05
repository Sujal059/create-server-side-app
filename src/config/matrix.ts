import type { Language, Framework, ORM } from '../types/index.js';

export const compatibilityMatrix: Record<Language, { frameworks: Framework[], orms: ORM[] }> = {
  typescript: {
    frameworks: ['express', 'fastify', 'nestjs'],
    orms: ['prisma', 'drizzle', 'typeorm']
  },
  javascript: {
    frameworks: ['express', 'fastify'],
    orms: ['prisma', 'typeorm']
  },
  python: {
    frameworks: ['fastapi', 'django'],
    orms: ['sqlalchemy', 'none']
  },
  java: {
    frameworks: ['spring-boot'],
    orms: ['hibernate', 'none']
  },
  go: {
    frameworks: ['gin', 'fiber'],
    orms: ['gorm', 'none']
  }
};