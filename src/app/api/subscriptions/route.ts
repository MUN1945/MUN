import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/subscriptions - Get current subscription
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "No subscription found" },
        { status: 404 }
      )
    }

    // Check if trial has expired
    const now = new Date()
    const isTrialExpired =
      subscription.status === "TRIAL" &&
      subscription.trialEndsAt &&
      new Date(subscription.trialEndsAt) < now

    if (isTrialExpired) {
      const updated = await db.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      })
      return NextResponse.json({ success: true, data: updated })
    }

    // Get available pricing plans
    const plans = await db.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: subscription,
      plans,
    })
  } catch (error) {
    console.error("Get subscription error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Create checkout session or handle subscription actions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, tier, paymentMethodId } = body

    if (action === "checkout") {
      // Create a checkout session
      // In production, this would use Stripe
      if (!tier) {
        return NextResponse.json(
          { success: false, error: "Subscription tier is required" },
          { status: 400 }
        )
      }

      const validTiers = ["FREE", "STUDENT_PRO", "TEACHER_PRO", "SCHOOL_ENTERPRISE"]
      if (!validTiers.includes(tier)) {
        return NextResponse.json(
          { success: false, error: "Invalid subscription tier" },
          { status: 400 }
        )
      }

      // Simulated checkout URL (in production, this would be a Stripe checkout URL)
      const checkoutUrl = `${process.env.APP_URL}/api/subscriptions?action=success&tier=${tier}`

      return NextResponse.json({
        success: true,
        data: { checkoutUrl, tier },
        message: "Checkout session created",
      })
    }

    if (action === "success") {
      // Handle successful payment
      if (!tier) {
        return NextResponse.json(
          { success: false, error: "Subscription tier is required" },
          { status: 400 }
        )
      }

      const now = new Date()
      const periodEnd = new Date()
      periodEnd.setMonth(periodEnd.getMonth() + 1)

      const subscription = await db.subscription.upsert({
        where: { userId: session.user.id },
        update: {
          tier: tier as never,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
        create: {
          userId: session.user.id,
          tier: tier as never,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      })

      return NextResponse.json({
        success: true,
        data: subscription,
        message: "Subscription activated successfully",
      })
    }

    if (action === "cancel") {
      // Cancel subscription at period end
      const subscription = await db.subscription.findUnique({
        where: { userId: session.user.id },
      })

      if (!subscription) {
        return NextResponse.json(
          { success: false, error: "No subscription found" },
          { status: 404 }
        )
      }

      const updated = await db.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: true },
      })

      return NextResponse.json({
        success: true,
        data: updated,
        message: "Subscription will be cancelled at the end of the billing period",
      })
    }

    if (action === "webhook") {
      // Handle Stripe webhook
      // In production, verify webhook signature
      const { type: eventType, data: eventData } = body

      if (eventType === "customer.subscription.updated") {
        const stripeSubscriptionId = eventData?.object?.id
        if (stripeSubscriptionId) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId },
            data: {
              status: eventData.object.status === "active" ? "ACTIVE" : "PAST_DUE",
              currentPeriodEnd: eventData.object.current_period_end
                ? new Date(eventData.object.current_period_end * 1000)
                : undefined,
            },
          })
        }
      }

      if (eventType === "customer.subscription.deleted") {
        const stripeSubscriptionId = eventData?.object?.id
        if (stripeSubscriptionId) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId },
            data: { status: "CANCELLED" },
          })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use: checkout, success, cancel, or webhook" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Subscription action error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process subscription action" },
      { status: 500 }
    )
  }
}
