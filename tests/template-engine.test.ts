import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { TemplateEngine } from '../src/core/template-engine.js';
import type { ProjectConfig } from '../src/types/index.js';

describe('TemplateEngine', () => {
  let tmpDir: string;
  let sourceDir: string;
  let targetDir: string;

  const mockConfig: ProjectConfig = {
    projectName: 'test-api',
    language: 'typescript',
    framework: 'express',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true,
    testing: true,
    apiDocs: true,
    auth: 'jwt',
    linting: true
  };

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-app-test-'));
    sourceDir = path.join(tmpDir, 'source');
    targetDir = path.join(tmpDir, 'target');
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(targetDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('substitutes template placeholders in .template files', () => {
    fs.writeFileSync(
      path.join(sourceDir, 'config.json.template'),
      '{"name": "{{projectName}}", "lang": "{{language}}"}'
    );

    const engine = new TemplateEngine(mockConfig, targetDir);
    engine.copyTemplateDir(sourceDir);

    const outputFilePath = path.join(targetDir, 'config.json');
    expect(fs.existsSync(outputFilePath)).toBe(true);

    const content = fs.readFileSync(outputFilePath, 'utf-8');
    expect(content).toBe('{"name": "test-api", "lang": "typescript"}');
  });

  it('renames _gitignore to .gitignore', () => {
    fs.writeFileSync(path.join(sourceDir, '_gitignore'), 'node_modules/\n.env');

    const engine = new TemplateEngine(mockConfig, targetDir);
    engine.copyTemplateDir(sourceDir);

    const outputFilePath = path.join(targetDir, '.gitignore');
    expect(fs.existsSync(outputFilePath)).toBe(true);
    expect(fs.readFileSync(outputFilePath, 'utf-8')).toBe('node_modules/\n.env');
  });

  it('renames _env.template to .env and generates .env.example', () => {
    fs.writeFileSync(path.join(sourceDir, '_env.template'), 'PORT=3000\nDATABASE_URL=postgresql://');

    const engine = new TemplateEngine(mockConfig, targetDir);
    engine.copyTemplateDir(sourceDir);

    const envPath = path.join(targetDir, '.env');
    const envExamplePath = path.join(targetDir, '.env.example');

    expect(fs.existsSync(envPath)).toBe(true);
    expect(fs.existsSync(envExamplePath)).toBe(true);
    expect(fs.readFileSync(envPath, 'utf-8')).toBe('PORT=3000\nDATABASE_URL=postgresql://');
    expect(fs.readFileSync(envExamplePath, 'utf-8')).toBe('PORT=3000\nDATABASE_URL=postgresql://');
  });

  it('does not write files when dryRun is true', () => {
    const dryRunConfig: ProjectConfig = { ...mockConfig, dryRun: true };
    fs.writeFileSync(path.join(sourceDir, 'index.ts.template'), 'console.log("{{projectName}}");');

    const engine = new TemplateEngine(dryRunConfig, targetDir);
    engine.copyTemplateDir(sourceDir);

    const outputFilePath = path.join(targetDir, 'index.ts');
    expect(fs.existsSync(outputFilePath)).toBe(false);
  });
});
