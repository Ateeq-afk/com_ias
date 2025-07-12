import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/password'
import { z } from 'zod'

// Input validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address').transform(val => val.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors: validationResult.error.issues.map((err: any) => err.message)
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    // Additional password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          message: 'Password validation failed',
          errors: passwordValidation.errors
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password securely
    const hashedPassword = await hashPassword(password)

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'STUDENT',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      })

      // Create user profile
      await tx.userProfile.create({
        data: {
          userId: newUser.id,
        }
      })

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          title: 'Welcome to UPSC IAS Learning Platform!',
          message: 'Your learning journey begins now. Explore our courses and start preparing for success.',
          type: 'SUCCESS'
        }
      })

      return newUser
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle specific database errors
    if ((error as any)?.code === 'P2002') {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}