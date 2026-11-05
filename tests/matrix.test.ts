import { describe, it, expect } from 'vitest';
import { compatibilityMatrix } from '../src/config/matrix.js';
import type { Language } from '../src/types/index.js';

describe('compatibilityMatrix', () => {
  const languages: Language[] = ['typescript', 'javascript', 'python', 'go', 'java'];

  it('includes all supported languages', () => {
    for (const lang of languages) {
      expect(compatibilityMatrix[lang]).toBeDefined();
      expect(compatibilityMatrix[lang].frameworks.length).toBeGreaterThan(0);
      expect(compatibilityMatrix[lang].orms.length).toBeGreaterThan(0);
    }
  });

  it('contains expected frameworks for Node.js ecosystems', () => {
    expect(compatibilityMatrix.typescript.frameworks).toContain('express');
    expect(compatibilityMatrix.typescript.frameworks).toContain('fastify');
    expect(compatibilityMatrix.typescript.frameworks).toContain('nestjs');

    expect(compatibilityMatrix.javascript.frameworks).toContain('express');
    expect(compatibilityMatrix.javascript.frameworks).toContain('fastify');
  });

  it('contains expected frameworks for Python, Go, and Java', () => {
    expect(compatibilityMatrix.python.frameworks).toContain('fastapi');
    expect(compatibilityMatrix.python.frameworks).toContain('django');

    expect(compatibilityMatrix.go.frameworks).toContain('gin');
    expect(compatibilityMatrix.go.frameworks).toContain('fiber');

    expect(compatibilityMatrix.java.frameworks).toContain('spring-boot');
  });
});
