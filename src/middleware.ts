import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 60 // 60 requests per minute for API

// Public routes that don't require authentication
const publicRoutes = [
  "/api/auth",
  "/api/courses",
]

// Routes that require specific roles
const roleRestrictedRoutes: Record<string, string[]> = {
  "/api/admin": ["ADMIN", "SUPER_ADMIN"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Rate limiting
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const rateLimitKey = `${clientIp}:${pathname}`
  const now = Date.now()

  const rateLimitInfo = rateLimitMap.get(rateLimitKey)
  if (!rateLimitInfo || now - rateLimitInfo.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(rateLimitKey, { count: 1, lastReset: now })
  } else {
    rateLimitInfo.count++
    if (rateLimitInfo.count > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }
  }

  // Clean up old rate limit entries periodically
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.lastReset > RATE_LIMIT_WINDOW * 2) {
        rateLimitMap.delete(key)
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  )

  // Add CORS headers for API routes
  if (pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", request.headers.get("origin") || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
}
