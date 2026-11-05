#!/usr/bin/env node
import { Command } from 'commander';
import { runPrompts } from './prompts.js';
import { generateProject } from '../generators/project-generator.js';
import { green, red, cyan } from 'kolorist';
import { readFileSync, existsSync } from 'fs';

const program = new Command();

let version = '1.0.0';
try {
  const pkgInDist = new URL('../package.json', import.meta.url);
  const pkgInDev = new URL('../../package.json', import.meta.url);
  const pkgUrl = existsSync(pkgInDist) ? pkgInDist : pkgInDev;
  const pkg = JSON.parse(readFileSync(pkgUrl, 'utf-8'));
  version = pkg.version || '1.0.0';
} catch {
  // Use fallback
}

program
  .name('create-server-side-app')
  .description('Production-grade Backend Scaffolder for Node.js, Python, Go, and Java')
  .version(version)
  .argument('[project-name]', 'Name of the project to create')
  .option('--preset <preset>', 'Use a predefined configuration preset (e.g. node-api, express-ts, fastapi, gin, spring-boot)')
  .option('--dry-run', 'Show what would be generated without writing to disk')
  .option('-y, --yes', 'Skip prompts and use defaults for non-interactive environments')
  .action(async (projectName, options) => {
    try {
      console.log(`\n🚀 ${green('create-server-side-app')} v${version}\n`);
      
      const config = await runPrompts(projectName, options);
      await generateProject(config);
      
    } catch (error) {
      console.error(red(`\n❌ Error: ${(error as Error).message}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv);