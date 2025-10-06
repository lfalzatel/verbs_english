# Verbos English - English Verbs Learning Platform

A comprehensive Next.js application for learning English verbs through interactive games and exercises.

## 🚀 Features

- **70+ Interactive Games**: Memory, Concentration, Matching, Word Search, and Crossword puzzles
- **3 Difficulty Levels**: Easy, Medium, and Hard for progressive learning
- **Multi-language Support**: Translations in Spanish, French, German, Italian, and Portuguese
- **User Progress Tracking**: Experience points, levels, and achievement system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Features**: WebSocket integration for live interactions
- **Database Management**: SQLite with Prisma ORM for efficient data handling

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand + TanStack Query
- **Real-time**: Socket.IO
- **Authentication**: NextAuth.js v4

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd verbos-english
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL=file:./db/custom.db
   NODE_ENV=development
   PORT=3000
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🚀 Production Deployment

### Option 1: Traditional Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t verbos-english .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 -e NODE_ENV=production verbos-english
   ```

### Option 3: Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/db/custom.db
    volumes:
      - ./db:/app/db
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `HOSTNAME` | Server hostname | `0.0.0.0` |
| `DATABASE_URL` | Database connection string | `file:./db/custom.db` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `*` |
| `NEXTAUTH_URL` | NextAuth URL | - |

### Database Setup

The application uses SQLite with Prisma ORM. The database is automatically initialized with seed data on first run.

To manually seed the database:
```bash
curl -X POST http://localhost:3000/api/verbs/seed
```

## 📊 Monitoring

### Health Check

Monitor application status:
```bash
curl http://localhost:3000/api/health
```

Response example:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "uptime": 3600,
  "memory": {
    "used": "128 MB",
    "total": "256 MB"
  },
  "database": {
    "connected": true,
    "status": "connected"
  },
  "server": {
    "port": 3000,
    "ready": true
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure the database directory exists and is writable
   - Check the `DATABASE_URL` environment variable
   - Run `npm run db:push` to create the database schema

2. **Build Errors**
   - Clear the build cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Generate Prisma client: `npm run db:generate`

3. **Static Asset Issues**
   - Ensure `output: 'standalone'` is in `next.config.ts`
   - Check that public files are properly served
   - Verify asset paths in production

4. **Performance Issues**
   - Monitor memory usage via `/api/health`
   - Check database connection pooling
   - Enable production optimizations

### Error Messages

- **"Error al cargar los verbos"**: Database connection issue. Try initializing the database.
- **"El servicio no está disponible temporalmente"**: Server is starting up. Wait a moment and retry.
- **"Error interno del servidor"**: Database might be initializing. Use the "Inicializar Base de Datos" button.

## 🔄 Development Workflow

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking
npm run build

# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:reset     # Reset database
```

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── *.tsx          # Game components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
└── lib/               # Utilities and database
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the health check endpoint
- Contact the development team

---

**Note**: This application is optimized for production deployment with proper error handling, database initialization, and monitoring capabilities.