import { NextResponse } from "next/server";
import { testDatabaseConnection } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    
    // Check environment
    const env = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || 3000;
    
    // Get system info
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env,
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      },
      database: {
        connected: dbConnected,
        status: dbConnected ? 'connected' : 'disconnected'
      },
      server: {
        port: port,
        ready: true
      }
    };

    // If database is not connected, mark as degraded
    if (!dbConnected) {
      healthStatus.status = 'degraded';
      return NextResponse.json(healthStatus, { status: 503 });
    }

    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}