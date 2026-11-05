export type Language = 'typescript' | 'javascript' | 'python' | 'java' | 'go';
export type Framework = 'express' | 'fastify' | 'nestjs' | 'fastapi' | 'django' | 'spring-boot' | 'gin' | 'fiber';
export type Architecture = 'mvc' | 'clean' | 'layered' | 'modular';
export type Database = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'none';
export type ORM = 'prisma' | 'drizzle' | 'typeorm' | 'sqlalchemy' | 'hibernate' | 'gorm' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface ProjectConfig {
  projectName: string;
  language: Language;
  framework: Framework;
  architecture: Architecture;
  database: Database;
  orm: ORM;
  packageManager: PackageManager;
  docker: boolean;
  dockerCompose: boolean;
  git: boolean;
  testing: boolean;
  apiDocs: boolean;
  auth: 'jwt' | 'none';
  linting: boolean;
  dryRun?: boolean | undefined;
}