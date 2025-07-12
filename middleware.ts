import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting map (in production, use Redis)
const rateLimit = new Map<string, { count: number; lastReset: number }>()

// Rate limiting configuration
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || "100")
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || "900000") // 15 minutes

function applyRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimit.get(ip)
  
  if (!userLimit) {
    rateLimit.set(ip, { count: 1, lastReset: now })
    return true
  }
  
  // Reset if window has passed
  if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, lastReset: now })
    return true
  }
  
  // Check if limit exceeded
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  // Increment count
  userLimit.count++
  return true
}

// Security headers
function addSecurityHeaders(response: NextResponse) {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")
  
  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block")
  
  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://api.razorpay.com;"
  )
  
  // Remove server information
  response.headers.delete("X-Powered-By")
  
  return response
}

export default withAuth(
  function middleware(req: NextRequest) {
    const response = NextResponse.next()
    
    // Apply security headers
    addSecurityHeaders(response)
    
    // Apply rate limiting
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown"
    if (!applyRateLimit(ip)) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
    
    // Check user role for protected routes
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    
    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }
    
    // Student dashboard protection
    if (pathname.startsWith("/dashboard")) {
      if (!token || !["STUDENT", "ADMIN"].includes(token.role as string)) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }
    
    // API routes protection
    if (pathname.startsWith("/api/")) {
      // Skip auth routes
      if (pathname.startsWith("/api/auth/")) {
        return response
      }
      
      // Protect other API routes
      if (!token) {
        return new NextResponse("Unauthorized", { status: 401 })
      }
      
      // Admin API routes
      if (pathname.startsWith("/api/admin/") && token.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 })
      }
    }
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
          "/diagnostic",
          "/lesson-demo",
          "/lesson-generator-demo",
        ]
        
        // Check if route is public
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // Protected routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}