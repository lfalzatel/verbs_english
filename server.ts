// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { testDatabaseConnection, initializeDatabase } from '@/lib/db';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    console.log(`Starting server in ${dev ? 'development' : 'production'} mode`);
    console.log(`Server will run on http://${hostname}:${currentPort}`);

    // Ensure database directory exists in production
    if (!dev) {
      const dbDir = path.join(process.cwd(), 'db');
      try {
        await fs.access(dbDir);
      } catch {
        console.log('Creating database directory...');
        await fs.mkdir(dbDir, { recursive: true });
      }
    }

    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { 
        distDir: './.next',
        // Ensure proper handling of static assets
        generateEtags: false,
        poweredByHeader: false,
      }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer(async (req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }

      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      // Handle requests
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: dev ? "*" : process.env.ALLOWED_ORIGINS?.split(',') || "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      // Handle production environment
      transports: dev ? ['polling', 'websocket'] : ['polling']
    });

    setupSocket(io);

    // Initialize database
    console.log('Testing database connection...');
    const dbConnected = await testDatabaseConnection();
    if (dbConnected) {
      console.log('Database connected successfully');
      await initializeDatabase();
    } else {
      console.error('Database connection failed - some features may not work');
    }

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
      console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (!dev) {
        console.log('> Production optimizations enabled');
        console.log('> Static assets are being served from .next');
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
