import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execa } from 'execa';
import type { ProjectConfig } from '../types/index.js';
import { TemplateEngine } from '../core/template-engine.js';
import * as p from '@clack/prompts';
import { green, cyan, yellow, dim } from 'kolorist';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getTemplateRoot(): string {
  const candidate1 = path.join(__dirname, '../templates');
  const candidate2 = path.resolve(__dirname, '../../templates');
  if (fs.existsSync(candidate1)) return candidate1;
  if (fs.existsSync(candidate2)) return candidate2;
  return candidate1;
}

function getNextSteps(config: ProjectConfig): string {
  const dockerStep = config.docker ? '  docker compose up -d\n' : '';

  switch (config.language) {
    case 'typescript':
    case 'javascript':
      return `  cd ${config.projectName}
${dockerStep}  ${config.packageManager} run dev`;

    case 'python': {
      const isWin = process.platform === 'win32';
      const activateCmd = isWin ? '  .\\venv\\Scripts\\activate' : '  source venv/bin/activate';
      const runCmd = config.framework === 'django' 
        ? '  python manage.py runserver'
        : '  uvicorn main:app --reload --port 8000';
      return `  cd ${config.projectName}
${activateCmd}
${dockerStep}${runCmd}`;
    }

    case 'go':
      return `  cd ${config.projectName}
${dockerStep}  go run main.go`;

    case 'java':
      return `  cd ${config.projectName}
${dockerStep}  ./mvnw spring-boot:run  (or: mvn spring-boot:run)`;

    default:
      return `  cd ${config.projectName}
${dockerStep}  ${config.packageManager} run dev`;
  }
}

export async function generateProject(config: ProjectConfig) {
  const targetDir = path.resolve(process.cwd(), config.projectName);
  
  if (!config.dryRun && fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      throw new Error(`Directory "${config.projectName}" already exists and is not empty.`);
    }
  }

  const engine = new TemplateEngine(config, targetDir);
  const templateRoot = getTemplateRoot();

  const s = p.spinner();
  s.start('Generating project files');

  // 1. Base Language/Framework/Architecture Template
  let baseTemplatePath = path.join(templateRoot, config.language, config.framework, config.architecture);
  if (!fs.existsSync(baseTemplatePath)) {
    // Fallback to mvc if clean/modular architecture variant does not exist
    baseTemplatePath = path.join(templateRoot, config.language, config.framework, 'mvc');
  }
  engine.copyTemplateDir(baseTemplatePath);

  // 2. Shared Templates (Docker, Gitignore)
  if (config.docker) {
    const dockerTemplatePath = path.join(templateRoot, 'shared/docker', config.language);
    if (fs.existsSync(dockerTemplatePath)) {
      engine.copyTemplateDir(dockerTemplatePath);
    }
  }
  
  if (config.git) {
    const gitTemplatePath = path.join(templateRoot, 'shared/git', config.language);
    if (fs.existsSync(gitTemplatePath)) {
      engine.copyTemplateDir(gitTemplatePath);
    }
  }

  s.stop('Project files created');

  if (config.dryRun) {
    p.outro(cyan('Dry run completed. No files were written to disk.'));
    return;
  }

  // 3. Install Dependencies
  s.start('Installing dependencies');
  try {
    if (config.language === 'typescript' || config.language === 'javascript') {
      await execa(config.packageManager, ['install'], { cwd: targetDir });
    } else if (config.language === 'python') {
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      await execa(pythonCmd, ['-m', 'venv', 'venv'], { cwd: targetDir });
      const pipCmd = process.platform === 'win32' ? 'venv\\Scripts\\pip' : 'venv/bin/pip';
      await execa(pipCmd, ['install', '-r', 'requirements.txt'], { cwd: targetDir });
    } else if (config.language === 'go') {
      await execa('go', ['mod', 'tidy'], { cwd: targetDir });
    } else if (config.language === 'java') {
      // If maven is available, trigger dependency resolution
      try {
        await execa('mvn', ['dependency:resolve'], { cwd: targetDir });
      } catch {
        // Maven might not be installed, which is expected on many machines
      }
    }
    s.stop('Dependencies installed');
  } catch (e) {
    s.stop('Dependency installation skipped or completed with warnings (install manually if needed)');
  }

  // 4. ORM Initialization (Prisma for TS/JS)
  if (config.orm === 'prisma' && (config.language === 'typescript' || config.language === 'javascript')) {
    s.start('Initializing Prisma Client');
    try {
      await execa('npx', ['prisma', 'generate'], { cwd: targetDir });
      s.stop('Prisma Client generated');
    } catch (e) {
      s.stop('Prisma initialization skipped (run npx prisma generate manually)');
    }
  }

  // 5. Initialize Git
  if (config.git) {
    s.start('Initializing Git repository');
    try {
      await execa('git', ['init'], { cwd: targetDir });
      await execa('git', ['add', '.'], { cwd: targetDir });
      await execa('git', ['commit', '-m', 'chore: initial scaffold from create-server-side-app'], { cwd: targetDir });
      s.stop('Git repository initialized with initial commit');
    } catch (e) {
      s.stop('Git initialization skipped');
    }
  }

  p.outro(`
${green('✔ Project created successfully!')}

${dim('Next steps:')}
${getNextSteps(config)}

Your backend is ready 🚀
  `);
}