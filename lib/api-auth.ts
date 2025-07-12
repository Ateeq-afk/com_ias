import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  role: string
}

/**
 * Get authenticated user from request
 * @param req - NextRequest object
 * @returns Promise<AuthenticatedUser | null>
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return null
    }
    
    return {
      id: token.userId as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as string,
    }
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Check if user has required role
 * @param user - Authenticated user
 * @param requiredRoles - Array of required roles
 * @returns boolean
 */
export function hasRequiredRole(user: AuthenticatedUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role)
}

/**
 * Middleware function to protect API routes
 * @param handler - The API route handler
 * @param options - Configuration options
 * @returns Protected API route handler
 */
export function withAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse> | NextResponse,
  options: {
    requiredRoles?: string[]
    allowUnauthenticated?: boolean
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = await getAuthenticatedUser(req)
      
      // Check authentication
      if (!user && !options.allowUnauthenticated) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      // Check authorization
      if (user && options.requiredRoles && !hasRequiredRole(user, options.requiredRoles)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      
      return await handler(req, user!)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Admin-only API route protection
 */
export function withAdminAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse> | NextResponse
) {
  return withAuth(handler, { requiredRoles: ['ADMIN'] })
}

/**
 * Student or Admin API route protection
 */
export function withStudentAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse> | NextResponse
) {
  return withAuth(handler, { requiredRoles: ['STUDENT', 'ADMIN'] })
}

/**
 * Rate limiting for API routes
 */
const apiRateLimit = new Map<string, { count: number; lastReset: number }>()

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    maxRequests?: number
    windowMs?: number
  } = {}
) {
  const maxRequests = options.maxRequests || 60 // 60 requests
  const windowMs = options.windowMs || 60000 // per minute
  
  return async (req: NextRequest): Promise<NextResponse> => {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()
    
    const userLimit = apiRateLimit.get(ip)
    
    if (!userLimit) {
      apiRateLimit.set(ip, { count: 1, lastReset: now })
      return await handler(req)
    }
    
    // Reset if window has passed
    if (now - userLimit.lastReset > windowMs) {
      apiRateLimit.set(ip, { count: 1, lastReset: now })
      return await handler(req)
    }
    
    // Check if limit exceeded
    if (userLimit.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    
    // Increment count
    userLimit.count++
    return await handler(req)
  }
}

/**
 * Input validation middleware
 */
export function withValidation<T>(
  schema: { parse: (data: any) => T },
  handler: (req: NextRequest, validatedData: T) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const body = await req.json()
      const validatedData = schema.parse(body)
      
      return await handler(req, validatedData)
    } catch (error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: error.errors
          },
          { status: 400 }
        )
      }
      
      console.error('Validation middleware error:', error)
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }
  }
}