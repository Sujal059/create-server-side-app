# create-server-side-app 🚀

[![npm version](https://img.shields.io/badge/npm-v2.0.0-blue.svg)](https://www.npmjs.com/package/create-server-side-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-passing-success.svg)](https://vitest.dev/)

**Production-grade backend scaffolder** for **TypeScript**, **JavaScript**, **Python**, **Go**, and **Java**.

Generate fully configured, production-ready REST APIs and microservices in seconds — complete with **JWT authentication**, **database ORM configuration**, **environment validation**, **Docker & Docker Compose**, and clean architectural separation.

---

## ⚡ Quick Start

Create a new backend with an interactive terminal wizard:

```bash
# Using npx
npx create-server-side-app my-api

# Or using npm create
npm create server-side-app my-api

# Or using the alias
npx create-server-side-app my-api
```

Or run directly with a preset:

```bash
npx create-server-side-app my-api --preset fastapi
```

Or run headless in CI/CD or non-interactive environments:

```bash
npx create-server-side-app my-api --yes
```

---

## 🛠 Supported Technology Stack

| Language | Frameworks | Architectures | ORM / Data Layer | Databases | Containerization |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TypeScript** | Express, Fastify, NestJS | MVC, Clean Architecture | Prisma, TypeORM, Drizzle | PostgreSQL, MongoDB, SQLite | Docker + Docker Compose |
| **JavaScript** | Express, Fastify | MVC | Prisma, TypeORM | PostgreSQL, MongoDB, SQLite | Docker + Docker Compose |
| **Python** | FastAPI, Django REST | MVC | SQLAlchemy, Django ORM | PostgreSQL, SQLite | Docker + Docker Compose |
| **Go** | Gin, Fiber | MVC | GORM | SQLite, PostgreSQL | Multi-stage Docker + Compose |
| **Java** | Spring Boot 3.2 | MVC | Spring Data JPA / Hibernate | PostgreSQL, H2 | Multi-stage Docker + Compose |

---

## ✨ What Every Generated Project Includes

Every generated backend is not just a "Hello World" stub — it is configured with production standards:

1. **🔐 Authentication & Security**:
   - Ready-to-use JWT authentication (`/register`, `/login`, `/me`)
   - Industry-standard password hashing (bcrypt / passlib / Spring Security)
   - Route protection middleware / auth guards
   - Security headers (Helmet, CORS pre-configured)

2. **🩺 Health & Observability**:
   - Standard `/health` check endpoint returning server status, service name, and ISO timestamp
   - Structured JSON logging (Pino for Node, standard logging for Go/Python/Java)

3. **⚙️ Environment Management**:
   - Dotenv configuration with strict type validation (Zod in TS, Pydantic in Python, etc.)
   - Auto-generated `.env` and `.env.example` templates

4. **🐳 Container Ready**:
   - Optimized multi-stage `Dockerfile` (minimal production footprint)
   - `docker-compose.yml` linking your application container to PostgreSQL with automated health checks

5. **📦 Git & CI Ready**:
   - Comprehensive language-specific `.gitignore` file
   - Initial git commit creation option

---

## 💻 CLI Options and Flags

```text
Usage: create-server-side-app [options] [project-name]

Production-grade Backend Scaffolder for Node.js, Python, Go, and Java

Arguments:
  project-name       Name of the project to create (e.g. my-service)

Options:
  -V, --version      Output version number
  --preset <preset>  Use a predefined configuration preset
  --dry-run          Preview files that would be generated without writing to disk
  -y, --yes          Skip prompts and use production defaults
  -h, --help         Display help information
```

### Predefined Presets

You can bypass interactive prompts by passing `--preset <name>`:

| Preset Name | Language | Framework | Architecture | Database & ORM |
| :--- | :--- | :--- | :--- | :--- |
| `express-ts` (or `node-api`) | TypeScript | Express | MVC | PostgreSQL + Prisma |
| `fastify-ts` | TypeScript | Fastify | MVC | PostgreSQL + Prisma |
| `nestjs` | TypeScript | NestJS | MVC | PostgreSQL + Prisma |
| `express-js` | JavaScript | Express | MVC | PostgreSQL + Prisma |
| `fastify-js` | JavaScript | Fastify | MVC | In-memory / Extensible |
| `fastapi` | Python | FastAPI | MVC | SQLite/PostgreSQL + SQLAlchemy |
| `django` | Python | Django | MVC | SQLite/PostgreSQL + Django ORM |
| `gin` | Go | Gin | MVC | SQLite + GORM |
| `fiber` | Go | Fiber | MVC | SQLite + GORM |
| `spring-boot` | Java | Spring Boot 3 | MVC | H2/PostgreSQL + Hibernate JPA |

---

## 📂 Project Structure Overview

### 1. TypeScript / JavaScript (Express & Fastify MVC)

```text
my-api/
├── prisma/
│   └── schema.prisma         # Prisma schema model
├── src/
│   ├── config/
│   │   ├── db.ts             # Prisma client connection
│   │   └── env.ts            # Type-safe environment validation (Zod)
│   ├── controllers/
│   │   └── auth.controller.ts# Register, login & profile handlers
│   ├── middleware/
│   │   └── auth.middleware.ts# JWT bearer validation middleware
│   ├── routes/
│   │   └── auth.routes.ts    # Route definitions
│   └── server.ts             # Express / Fastify app bootstrap
├── .env                      # Local environment variables
├── .env.example              # Environment variables template
├── .gitignore                # Pre-configured gitignore
├── Dockerfile                # Multi-stage production container
├── docker-compose.yml        # App + PostgreSQL container orchestration
├── package.json
└── tsconfig.json             # Strictest TypeScript configuration
```

### 2. TypeScript Clean Architecture

```text
my-api/
├── src/
│   ├── domain/               # Enterprise business rules
│   │   ├── entities/         # User domain entity
│   │   └── repositories/     # Repository interfaces
│   ├── usecases/             # Application business rules
│   │   └── auth.usecase.ts   # Registration & login use cases
│   ├── infrastructure/       # External tools, DB & frameworks
│   │   ├── db/prisma.ts      # Prisma database client
│   │   ├── repositories/     # Prisma repository implementation
│   │   └── security/         # JWT service
│   ├── interfaces/           # Interface adapters
│   │   └── http/
│   │       ├── controllers/  # Auth controller
│   │       ├── middleware/   # Auth middleware
│   │       └── routes/       # Auth router
│   └── server.ts             # Dependency injection & HTTP bootstrap
```

### 3. Python (FastAPI MVC)

```text
my-api/
├── app/
│   ├── config/
│   │   ├── database.py       # SQLAlchemy engine & session factory
│   │   └── settings.py       # Pydantic BaseSettings config
│   ├── controllers/
│   │   └── auth.py           # Bcrypt hashing & JWT signing logic
│   ├── middleware/
│   │   └── auth.py           # FastAPI OAuth2 Bearer dependency
│   ├── models/
│   │   └── user.py           # SQLAlchemy User model
│   ├── routes/
│   │   └── auth.py           # Register, login, me endpoints
│   └── schemas/
│       └── auth.py           # Pydantic validation schemas
├── main.py                   # FastAPI application & CORS
├── requirements.txt          # Production dependencies
├── .env & .env.example
├── Dockerfile
└── docker-compose.yml
```

### 4. Go (Gin & Fiber MVC)

```text
my-api/
├── config/
│   ├── config.go             # godotenv environment loader
│   └── database.go           # GORM SQLite/PostgreSQL connection
├── controllers/
│   └── auth.go               # Bcrypt & JWT auth handlers
├── middleware/
│   └── auth.go               # Fiber / Gin Bearer JWT middleware
├── models/
│   └── user.go               # GORM User model & migration
├── routes/
│   └── routes.go             # Router registration
├── main.go                   # Application entry point
├── go.mod                    # Go module definitions
├── .env & .env.example
├── Dockerfile
└── docker-compose.yml
```

### 5. Java (Spring Boot MVC)

```text
my-api/
├── src/main/java/com/example/api/
│   ├── config/
│   │   ├── JwtAuthFilter.java# Spring Security OncePerRequestFilter
│   │   ├── JwtUtils.java     # JJWT generator & token validator
│   │   └── SecurityConfig.java# Stateless security filter chain
│   ├── controller/
│   │   ├── AuthController.java# Register, login, me endpoints
│   │   └── HealthController.java# Health check endpoint
│   ├── dto/
│   │   └── AuthDtos.java     # Request / response DTOs with validation
│   ├── model/
│   │   └── User.java         # JPA Entity
│   ├── repository/
│   │   └── UserRepository.java# Spring Data JPA repository
│   └── Application.java      # Spring Boot main class
├── src/main/resources/
│   └── application.properties# H2 / PostgreSQL and JWT properties
├── pom.xml                   # Maven dependencies & plugins
├── .env & .env.example
├── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Running Your Generated Project

### Node.js (TypeScript or JavaScript)
```bash
cd my-api
docker compose up -d    # (Optional: starts PostgreSQL)
npm install
npm run dev
```

### Python (FastAPI / Django)
```bash
cd my-api

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate       # On Linux/macOS
.\venv\Scripts\activate        # On Windows

pip install -r requirements.txt

# Run FastAPI
uvicorn main:app --reload --port 8000

# Or run Django
python manage.py migrate
python manage.py runserver
```

### Go (Gin / Fiber)
```bash
cd my-api
go mod tidy
go run main.go
```

### Java (Spring Boot)
```bash
cd my-api
mvn spring-boot:run
```

---

## 🧪 Testing the CLI

This repository is built with TypeScript and tested using [Vitest](https://vitest.dev/):

```bash
# Run unit tests
npm test

# Run type-checking
npm run lint

# Build production bundle with tsup
npm run build
```

---

## 💡 Recommended Future Enhancements

Here are strategic changes recommended for future versions of `create-backend-app`:

1. **OpenAPI / Swagger Auto-generation**:
   - Provide an option during scaffolding to pre-configure Swagger UI / OpenAPI docs (`/docs` or `/swagger`) across all frameworks.
2. **GitHub Actions CI/CD Template**:
   - Add a shared `.github/workflows/ci.yml` template that automatically runs linting, tests, and Docker builds for the selected language.
3. **Database Migration Prompts**:
   - Automatically offer to run initial migrations (`prisma migrate dev`, `alembic upgrade head`, `python manage.py migrate`) when database drivers are selected.
4. **GraphQL Support**:
   - Add options for Apollo Server (Node.js), Strawberry (Python), and gqlgen (Go).
5. **Community Template Plugin System**:
   - Allow users to supply remote git repositories as templates (e.g., `npx create-backend-app --template user/repo`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
