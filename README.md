# UPV Calendar Application

## Project Architecture

This application supports two distinct deployment and development approaches:

1. **Java Spring Boot + Angular (Original Architecture)**
   - Backend: Java Spring Boot with Maven
   - Frontend: Angular
   - Database: PostgreSQL
   - Startup method: `upv-calendar.bat` script

2. **Node.js + Angular (Docker Architecture)**
   - Backend: Node.js with Express and TypeORM
   - Frontend: Angular with Nginx
   - Database: PostgreSQL
   - Startup method: Docker Compose

## Quick Start

### Option 1: Using the Windows Batch Script (Java Backend)

1. Ensure PostgreSQL is running on port 5432
2. Run the application starter script:
   ```
   upv-calendar.bat
   ```
3. Access the application at: http://localhost:4200

### Option 2: Using Docker (Node.js Backend)

1. **Important**: Clean node_modules before building:

   **Windows PowerShell**:
   ```powershell
   # Clean any existing node_modules
   Remove-Item -Recurse -Force -ErrorAction SilentlyContinue backend/node_modules, frontend/node_modules
   ```

   **Linux/macOS**:
   ```bash
   # Clean any existing node_modules
   rm -rf backend/node_modules frontend/node_modules
   ```

2. Start the application with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the applications:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api

## Docker Setup Details

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Services

The Docker configuration includes three main services:

1. **PostgreSQL Database** (`postgres`):
   - Port: 5432
   - Credentials: username=postgres, password=postgres, database=upvcal
   - Healthcheck ensures database is ready before backend starts

2. **Backend API** (`backend`):
   - Port: 3000
   - Built with Node.js and TypeScript
   - Uses TypeORM for database access
   - Healthcheck ensures API is running before frontend starts

3. **Frontend** (`frontend`):
   - Port: 80
   - Built with Angular
   - Served via Nginx

### Useful Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild a specific service
docker-compose build backend

# Reset PostgreSQL data volume
docker-compose down -v
docker-compose up -d
```

## Local Development

### Java Backend Development (Original)
```bash
# Run the Spring Boot backend
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

### Node.js Backend Development (Alternative)
```bash
cd backend
npm install
npm run dev
```

### Frontend Development (Angular)
```bash
cd frontend
npm install
npm start
```

## Troubleshooting

### Batch Script Issues

1. **Input Redirection Error**: If you see "Input redirection is not supported", it's because the batch file execution environment (like VSCode's Code Runner) doesn't properly support I/O redirection.
   
   The current batch file has been fixed to avoid all redirection operators (`>`, `<`, `|`) by:
   - Using `CHOICE` for timed waits instead of `timeout > nul`
   - Creating log files with explicit commands instead of redirections
   - Using alternative command structures for operations that typically use redirection
   
2. **Process Not Starting**: Ensure you have Java 17 and Node.js installed.

3. **Batch File Best Practices for IDE Compatibility**:
   - Avoid direct redirections like `command > file` or `command > nul`
   - Use `CHOICE /T` for timing delays instead of `ping` or `timeout`
   - When writing to files, use intermediate variables and quoted paths
   - Run potentially problematic commands via a new CMD instance

### Docker Issues

1. **Circular Dependencies**: Ensure there are no self-references in package.json files

   **Windows PowerShell**:
   ```powershell
   # Check for circular dependencies in backend
   Select-String -Pattern "upv-calendar-backend" -Path backend/package.json
   # Check for circular dependencies in frontend
   Select-String -Pattern "frontend" -Path frontend/package.json
   ```

2. **Node Modules Issues**: Clean node_modules before building

   **Windows PowerShell**:
   ```powershell
   Remove-Item -Recurse -Force -ErrorAction SilentlyContinue backend/node_modules, frontend/node_modules
   ```

3. **Docker Cache Problems**: Try rebuilding without cache
   ```bash
   docker-compose build --no-cache
   ```

4. **Windows-specific Issues**: 
   - If you see path or symlink errors, try running Docker with Linux containers mode
   - Ensure Windows path length limitations aren't causing issues (use shorter paths)
   - Try using Docker Desktop WSL 2 backend for better compatibility

## Database Management

The database will be automatically initialized when the backend starts. You can also manually run:

```bash
# For the Docker-based Node.js backend
docker-compose exec backend npm run db:init
docker-compose exec backend npm run db:seed
docker-compose exec backend npm run db:reset
``` 