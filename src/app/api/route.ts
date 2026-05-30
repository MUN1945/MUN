import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connectivity
    await db.$queryRaw`SELECT 1`
    return NextResponse.json({
      status: 'healthy',
      service: 'DiplomatiQ',
      version: '0.2.0',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      service: 'DiplomatiQ',
      version: '0.2.0',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 })
  }
}
