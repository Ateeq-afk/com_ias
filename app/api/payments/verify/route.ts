import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      plan
    } = await request.json()

    // Verify Razorpay signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'SUCCESS',
        transactionId: razorpay_payment_id
      }
    })

    // Calculate subscription dates
    const startDate = new Date()
    let endDate = new Date(startDate)
    
    switch (plan) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
    }

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: plan,
        status: 'ACTIVE',
        startDate: startDate,
        endDate: endDate,
        autoRenew: true
      },
      create: {
        userId: user.id,
        plan: plan,
        status: 'ACTIVE',
        startDate: startDate,
        endDate: endDate,
        autoRenew: true
      }
    })

    // Link payment to subscription
    await prisma.payment.update({
      where: { id: payment.id },
      data: { subscriptionId: subscription.id }
    })

    // Create success notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Payment Successful!',
        message: `Your ${plan.toLowerCase()} subscription has been activated successfully.`,
        type: 'SUCCESS'
      }
    })

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        endDate: subscription.endDate
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}