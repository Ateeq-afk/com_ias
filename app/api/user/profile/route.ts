import { NextRequest, NextResponse } from "next/server"
import { withStudentAuth } from "@/lib/api-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
  dateOfBirth: z.string().datetime().optional(),
  state: z.string().min(2).max(50).optional(),
  aspirationType: z.string().min(2).max(50).optional(),
  targetYear: z.number().int().min(2024).max(2030).optional(),
  preferredLanguage: z.string().min(2).max(10).optional(),
  studyHoursGoal: z.number().int().min(1).max(24).optional(),
})

// GET /api/user/profile - Get user profile
export const GET = withStudentAuth(async (req: NextRequest, user) => {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            phone: true,
            dateOfBirth: true,
            state: true,
            aspirationType: true,
            targetYear: true,
            preferredLanguage: true,
            studyHoursGoal: true,
            streakCount: true,
            totalStudyTime: true,
            lastActiveAt: true,
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

// PUT /api/user/profile - Update user profile
export const PUT = withStudentAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json()
    const validationResult = updateProfileSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues.map((err: any) => err.message)
        },
        { status: 400 }
      )
    }

    const updateData = validationResult.data

    // Update user and profile in transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user table if name is provided
      if (updateData.name) {
        await tx.user.update({
          where: { id: user.id },
          data: { name: updateData.name }
        })
      }

      // Update profile table
      const profileData: any = { ...updateData }
      delete profileData.name // Remove name as it's not in profile table

      if (Object.keys(profileData).length > 0) {
        await tx.userProfile.upsert({
          where: { userId: user.id },
          update: profileData,
          create: {
            userId: user.id,
            ...profileData
          }
        })
      }

      // Return updated user with profile
      return await tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          profile: {
            select: {
              phone: true,
              dateOfBirth: true,
              state: true,
              aspirationType: true,
              targetYear: true,
              preferredLanguage: true,
              studyHoursGoal: true,
              streakCount: true,
              totalStudyTime: true,
              lastActiveAt: true,
            }
          }
        }
      })
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})