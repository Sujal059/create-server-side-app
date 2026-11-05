import { describe, it, expect } from 'vitest';
import { runPrompts } from '../src/cli/prompts.js';
import fs from 'fs';
import path from 'path';

describe('CLI Presets and Non-Interactive Flags', () => {
  const presets = [
    'express-ts',
    'fastify-ts',
    'nestjs',
    'express-js',
    'fastify-js',
    'fastapi',
    'django',
    'gin',
    'fiber',
    'spring-boot',
  ];

  for (const preset of presets) {
    it(`generates a valid configuration for preset "${preset}"`, async () => {
      const config = await runPrompts('test-app', { preset, dryRun: true });
      expect(config.projectName).toBe('test-app');
      expect(config.language).toBeDefined();
      expect(config.framework).toBeDefined();
      expect(config.architecture).toBe('mvc');
      expect(config.dryRun).toBe(true);

      // Verify that template directory exists for this preset
      const templatePath = path.resolve(
        __dirname,
        '../templates',
        config.language,
        config.framework,
        config.architecture
      );
      expect(fs.existsSync(templatePath)).toBe(true);
    });
  }

  it('handles --yes non-interactive flag with sensible defaults', async () => {
    const config = await runPrompts('default-app', { yes: true, dryRun: true });
    expect(config.projectName).toBe('default-app');
    expect(config.language).toBe('typescript');
    expect(config.framework).toBe('express');
    expect(config.docker).toBe(true);
    expect(config.git).toBe(true);
  });
});
