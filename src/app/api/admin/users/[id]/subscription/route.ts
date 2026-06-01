import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// ============================================================
// PATCH /api/admin/users/[id]/subscription
// Master Admin only: Manage client subscription status
// Actions: reset_trial, upgrade, override_status, activate
// ============================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    // ONLY MASTER_ADMIN can manage subscriptions through this endpoint
    const adminRole = session.user.role as string
    if (adminRole !== "MASTER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Only MASTER_ADMIN can manage client subscriptions" },
        { status: 403 }
      )
    }

    // Verify target user exists
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      // ============================================================
      // A. RESET TRIAL — Restart trial period from day one
      // ============================================================
      case "reset_trial": {
        const trialDays = body.trialDays || 14 // Default 14-day reset trial
        const now = new Date()
        const trialEndsAt = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000)

        const updated = await db.subscription.upsert({
          where: { userId },
          update: {
            status: "TRIAL",
            tier: "FREE",
            trialStartsAt: now,
            trialEndsAt,
            cancelAtPeriodEnd: false,
          },
          create: {
            userId,
            status: "TRIAL",
            tier: "FREE",
            trialStartsAt: now,
            trialEndsAt,
          },
        })

        // Ensure user account is active
        await db.user.update({
          where: { id: userId },
          data: { isActive: true },
        })

        // Log audit
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: "UPDATE",
            resource: "Subscription",
            resourceId: userId,
            details: `MASTER_ADMIN reset trial for ${targetUser.email}: ${trialDays}-day trial starting ${now.toISOString()}`,
          },
        })

        return NextResponse.json({
          success: true,
          message: `Trial reset for ${targetUser.email}. New ${trialDays}-day trial activated.`,
          data: {
            userId,
            subscription: {
              status: updated.status,
              tier: updated.tier,
              trialStartsAt: updated.trialStartsAt,
              trialEndsAt: updated.trialEndsAt,
            },
          },
        })
      }

      // ============================================================
      // B. MANUAL UPGRADE — Upgrade from Observer (Free Trial) to Active (Pro)
      //    Without requiring payment, subscription purchase, or checkout
      // ============================================================
      case "upgrade": {
        const targetTier = body.tier || "DELEGATE_PRO" // Default to Delegate Pro
        const validTiers = ["DELEGATE_PRO", "DIRECTOR_PRO", "SCHOOL_STARTER", "SCHOOL_PROFESSIONAL", "SCHOOL_ENTERPRISE", "CONFERENCE_PACKAGE"]

        if (!validTiers.includes(targetTier)) {
          return NextResponse.json(
            { success: false, error: `Invalid tier. Valid tiers: ${validTiers.join(", ")}` },
            { status: 400 }
          )
        }

        const now = new Date()
        const periodEnd = new Date(now)
        periodEnd.setFullYear(periodEnd.getFullYear() + 1) // 1-year access

        const updated = await db.subscription.upsert({
          where: { userId },
          update: {
            status: "ACTIVE",
            tier: targetTier as never,
            trialStartsAt: null,
            trialEndsAt: null,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
          },
          create: {
            userId,
            status: "ACTIVE",
            tier: targetTier as never,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        })

        // Ensure user account is active
        await db.user.update({
          where: { id: userId },
          data: { isActive: true },
        })

        // Log audit
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: "UPDATE",
            resource: "Subscription",
            resourceId: userId,
            details: `MASTER_ADMIN manually upgraded ${targetUser.email} to ${targetTier} (ACTIVE). No payment required.`,
          },
        })

        return NextResponse.json({
          success: true,
          message: `${targetUser.email} upgraded to ${targetTier} (Active). No payment required.`,
          data: {
            userId,
            subscription: {
              status: updated.status,
              tier: updated.tier,
              currentPeriodStart: updated.currentPeriodStart,
              currentPeriodEnd: updated.currentPeriodEnd,
            },
          },
        })
      }

      // ============================================================
      // C. OVERRIDE STATUS — Manually set any subscription status
      //    For internal testing, customer support, promotional access, etc.
      // ============================================================
      case "override_status": {
        const { status, tier, periodEndDays, reason } = body
        const validStatuses = ["TRIAL", "ACTIVE", "PAST_DUE", "CANCELLED", "EXPIRED"]

        if (status && !validStatuses.includes(status)) {
          return NextResponse.json(
            { success: false, error: `Invalid status. Valid statuses: ${validStatuses.join(", ")}` },
            { status: 400 }
          )
        }

        const validTiers = ["FREE", "DELEGATE_PRO", "DIRECTOR_PRO", "SCHOOL_STARTER", "SCHOOL_PROFESSIONAL", "SCHOOL_ENTERPRISE", "CONFERENCE_PACKAGE"]
        if (tier && !validTiers.includes(tier)) {
          return NextResponse.json(
            { success: false, error: `Invalid tier. Valid tiers: ${validTiers.join(", ")}` },
            { status: 400 }
          )
        }

        const updateData: Record<string, unknown> = {}

        if (status) updateData.status = status
        if (tier) updateData.tier = tier

        // If setting to ACTIVE with a period end
        if (status === "ACTIVE" && periodEndDays) {
          updateData.currentPeriodStart = new Date()
          updateData.currentPeriodEnd = new Date(Date.now() + periodEndDays * 24 * 60 * 60 * 1000)
          updateData.cancelAtPeriodEnd = false
        }

        // If setting to TRIAL, set trial dates
        if (status === "TRIAL") {
          const trialDays = body.trialDays || 14
          updateData.trialStartsAt = new Date()
          updateData.trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
        }

        const updated = await db.subscription.upsert({
          where: { userId },
          update: updateData,
          create: {
            userId,
            status: status || "ACTIVE",
            tier: tier || "FREE",
            ...(updateData.currentPeriodStart ? { currentPeriodStart: updateData.currentPeriodStart as Date } : {}),
            ...(updateData.currentPeriodEnd ? { currentPeriodEnd: updateData.currentPeriodEnd as Date } : {}),
            ...(updateData.trialStartsAt ? { trialStartsAt: updateData.trialStartsAt as Date } : {}),
            ...(updateData.trialEndsAt ? { trialEndsAt: updateData.trialEndsAt as Date } : {}),
          },
        })

        // Ensure user account is active if subscription is active
        if (status === "ACTIVE" || status === "TRIAL") {
          await db.user.update({
            where: { id: userId },
            data: { isActive: true },
          })
        }

        // Log audit
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: "UPDATE",
            resource: "Subscription",
            resourceId: userId,
            details: `MASTER_ADMIN overrode subscription for ${targetUser.email}: status=${status}, tier=${tier}${reason ? `, reason=${reason}` : ""}`,
          },
        })

        return NextResponse.json({
          success: true,
          message: `Subscription overridden for ${targetUser.email}. Status: ${status || "unchanged"}, Tier: ${tier || "unchanged"}.`,
          data: {
            userId,
            subscription: {
              status: updated.status,
              tier: updated.tier,
              trialStartsAt: updated.trialStartsAt,
              trialEndsAt: updated.trialEndsAt,
              currentPeriodStart: updated.currentPeriodStart,
              currentPeriodEnd: updated.currentPeriodEnd,
            },
          },
        })
      }

      // ============================================================
      // D. ACTIVATE CLIENT — Change client from Inactive to Active
      //    Reactivate suspended or inactive clients, restore access immediately
      // ============================================================
      case "activate": {
        // Activate the user account
        await db.user.update({
          where: { id: userId },
          data: { isActive: true },
        })

        // If subscription is expired, reactivate it to TRIAL
        if (targetUser.subscription?.status === "EXPIRED" || !targetUser.subscription) {
          const trialDays = body.trialDays || 14
          const now = new Date()

          await db.subscription.upsert({
            where: { userId },
            update: {
              status: "TRIAL",
              tier: "FREE",
              trialStartsAt: now,
              trialEndsAt: new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000),
              cancelAtPeriodEnd: false,
            },
            create: {
              userId,
              status: "TRIAL",
              tier: "FREE",
              trialStartsAt: now,
              trialEndsAt: new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000),
            },
          })
        }

        // Invalidate all sessions so user needs to re-login with fresh token
        await db.session.updateMany({
          where: { userId, isActive: true },
          data: { isActive: false },
        })

        // Log audit
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: "UPDATE",
            resource: "User",
            resourceId: userId,
            details: `MASTER_ADMIN activated client ${targetUser.email} and restored access`,
          },
        })

        return NextResponse.json({
          success: true,
          message: `${targetUser.email} has been activated. Access restored immediately. User will need to sign in again.`,
          data: { userId, isActive: true },
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action. Valid actions: reset_trial, upgrade, override_status, activate" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("[ADMIN SUBSCRIPTION] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to manage subscription" },
      { status: 500 }
    )
  }
}
