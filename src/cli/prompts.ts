import * as p from '@clack/prompts';
import type { ProjectConfig, Language, Framework, Architecture, Database, ORM, PackageManager } from '../types/index.js';
import { compatibilityMatrix } from '../config/matrix.js';

interface CliOptions {
  preset?: string;
  dryRun?: boolean;
  yes?: boolean;
}

const PRESETS: Record<string, Partial<ProjectConfig>> = {
  'node-api': {
    language: 'typescript',
    framework: 'express',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'express-ts': {
    language: 'typescript',
    framework: 'express',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'express-js': {
    language: 'javascript',
    framework: 'express',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'fastify-ts': {
    language: 'typescript',
    framework: 'fastify',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'fastify-js': {
    language: 'javascript',
    framework: 'fastify',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'nestjs': {
    language: 'typescript',
    framework: 'nestjs',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'prisma',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'fastapi': {
    language: 'python',
    framework: 'fastapi',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'sqlalchemy',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'django': {
    language: 'python',
    framework: 'django',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'none',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'gin': {
    language: 'go',
    framework: 'gin',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'gorm',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'fiber': {
    language: 'go',
    framework: 'fiber',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'gorm',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  },
  'spring-boot': {
    language: 'java',
    framework: 'spring-boot',
    architecture: 'mvc',
    database: 'postgresql',
    orm: 'hibernate',
    packageManager: 'npm',
    docker: true,
    dockerCompose: true,
    git: true
  }
};

export async function runPrompts(initialName?: string, options: CliOptions = {}): Promise<ProjectConfig> {
  const projectName = initialName || 'my-api';
  const dryRun = Boolean(options.dryRun);

  // 1. Preset or non-interactive flag (--yes)
  if (options.preset && PRESETS[options.preset]) {
    const preset = PRESETS[options.preset]!;
    return {
      projectName,
      language: preset.language ?? 'typescript',
      framework: preset.framework ?? 'express',
      architecture: preset.architecture ?? 'mvc',
      database: preset.database ?? 'postgresql',
      orm: preset.orm ?? 'prisma',
      packageManager: preset.packageManager ?? 'npm',
      docker: preset.docker ?? true,
      dockerCompose: preset.dockerCompose ?? true,
      git: preset.git ?? true,
      testing: true,
      apiDocs: true,
      linting: true,
      auth: 'jwt',
      dryRun
    };
  }

  if (options.yes) {
    return {
      projectName,
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
      linting: true,
      auth: 'jwt',
      dryRun
    };
  }

  // 2. Interactive Prompts
  p.intro('Configure your production backend');

  const config = {} as Partial<ProjectConfig>;
  if (dryRun) {
    config.dryRun = true;
  }

  const nameGroup = await p.group({
    projectName: () => p.text({
      message: 'Project name:',
      initialValue: projectName,
      validate: (value) => {
        if (!value) return 'Please enter a project name.';
        if (!/^[a-z0-9-_]+$/.test(value)) return 'Project name can only contain lowercase letters, numbers, dashes, and underscores.';
      }
    }),
    language: () => p.select({
      message: 'Select programming language:',
      options: [
        { value: 'typescript', label: 'TypeScript (Node.js)' },
        { value: 'javascript', label: 'JavaScript (Node.js)' },
        { value: 'python', label: 'Python' },
        { value: 'go', label: 'Go' },
        { value: 'java', label: 'Java' }
      ]
    })
  }, {
    onCancel: () => { p.cancel('Operation cancelled.'); process.exit(0); }
  });

  Object.assign(config, nameGroup);

  const selectedLanguage = config.language as Language;
  const langConfig = compatibilityMatrix[selectedLanguage];

  const restGroup = await p.group({
    framework: () => p.select({
      message: 'Select framework:',
      options: langConfig.frameworks.map(f => ({ value: f, label: f }))
    }),
    architecture: () => p.select({
      message: 'Select architecture:',
      options: [
        { value: 'mvc', label: 'MVC (Model-View-Controller)' },
        { value: 'clean', label: 'Clean Architecture' },
        { value: 'modular', label: 'Modular Architecture' }
      ]
    }),
    database: () => p.select({
      message: 'Select database:',
      options: [
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'mongodb', label: 'MongoDB' },
        { value: 'none', label: 'None' }
      ]
    }),
    orm: () => p.select({
      message: 'Select ORM / Data Layer:',
      options: langConfig.orms.map(o => ({ value: o, label: o }))
    }),
    docker: () => p.confirm({ message: 'Add Docker & Docker Compose setup?' }),
    git: () => p.confirm({ message: 'Initialize Git repository?' }),
    packageManager: () => {
      if (selectedLanguage === 'typescript' || selectedLanguage === 'javascript') {
        return p.select({
          message: 'Package manager:',
          options: [
            { value: 'npm', label: 'npm' },
            { value: 'pnpm', label: 'pnpm' },
            { value: 'yarn', label: 'yarn' },
            { value: 'bun', label: 'bun' }
          ]
        });
      }
      return Promise.resolve('npm' as PackageManager);
    }
  }, {
    onCancel: () => { p.cancel('Operation cancelled.'); process.exit(0); }
  });

  Object.assign(config, restGroup);
  
  // Set non-prompted production defaults
  config.testing = true;
  config.apiDocs = true;
  config.linting = true;
  config.auth = 'jwt';
  config.dockerCompose = Boolean(config.docker);

  p.outro('Configuration complete! Generating project...');
  return config as ProjectConfig;
}