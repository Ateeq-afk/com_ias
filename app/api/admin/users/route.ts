import { NextRequest, NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/api-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().transform(val => val.toLowerCase()),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
  sendWelcomeEmail: z.boolean().default(false),
})

const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/users - Get all users with pagination
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) {
      where.role = role
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              state: true,
              aspirationType: true,
              lastActiveAt: true,
            }
          },
          _count: {
            select: {
              testAttempts: true,
              enrollments: true,
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// POST /api/admin/users - Create new user
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validationResult = createUserSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues.map((err: any) => err.message)
        },
        { status: 400 }
      )
    }

    const { name, email, role, sendWelcomeEmail } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create user (admin created users don't have passwords initially)
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      })

      // Create user profile for students
      if (role === 'STUDENT') {
        await tx.userProfile.create({
          data: {
            userId: newUser.id,
          }
        })
      }

      // Create notification
      if (sendWelcomeEmail) {
        await tx.notification.create({
          data: {
            userId: newUser.id,
            title: 'Welcome to UPSC IAS Learning Platform!',
            message: 'Your account has been created by an administrator. Please set up your password to get started.',
            type: 'INFO'
          }
        })
      }

      return newUser
    })

    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})