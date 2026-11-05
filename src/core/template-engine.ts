import fs from 'fs';
import path from 'path';
import type { ProjectConfig } from '../types/index.js';
import { blue, dim } from 'kolorist';

export class TemplateEngine {
  constructor(private config: ProjectConfig, private targetDir: string) {}

  copyTemplateDir(sourceDir: string) {
    if (!fs.existsSync(sourceDir)) return;

    const files = fs.readdirSync(sourceDir, { recursive: true }) as string[];
    
    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const stats = fs.statSync(srcPath);
      
      if (stats.isDirectory()) continue;

      let destPath = path.join(this.targetDir, file);
      let content = fs.readFileSync(srcPath, 'utf-8');

      // Process Handlebars-style template variables {{projectName}}, etc.
      if (srcPath.endsWith('.template')) {
        destPath = destPath.replace(/\.template$/, '');
        content = content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_: string, key: string) => {
          const val = (this.config as unknown as Record<string, unknown>)[key];
          return val !== undefined ? String(val) : '';
        });
      }

      // Handle dotfiles (npm ignores .gitignore and .env during packaging)
      let isEnvFile = false;
      if (path.basename(destPath) === '_gitignore') {
        destPath = path.join(path.dirname(destPath), '.gitignore');
      } else if (path.basename(destPath) === '_env.template' || path.basename(destPath) === '_env') {
        destPath = path.join(path.dirname(destPath), '.env');
        isEnvFile = true;
      }

      const envExamplePath = path.join(path.dirname(destPath), '.env.example');

      if (this.config.dryRun) {
        console.log(dim(`[DRY-RUN] Would create: `) + blue(path.relative(process.cwd(), destPath)));
        if (isEnvFile) {
          console.log(dim(`[DRY-RUN] Would create: `) + blue(path.relative(process.cwd(), envExamplePath)));
        }
      } else {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, content);
        if (isEnvFile) {
          fs.writeFileSync(envExamplePath, content);
        }
      }
    }
  }
}