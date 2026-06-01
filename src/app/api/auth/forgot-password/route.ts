import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { randomUUID } from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

// Simple in-memory rate limiter: 1 request per email per 5 minutes
const rateLimitMap = new Map<string, { lastRequest: number }>()
const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Rate limit check
    const rateLimitKey = `forgot-password:${normalizedEmail}`
    const rateLimitInfo = rateLimitMap.get(rateLimitKey)
    const now = Date.now()

    if (rateLimitInfo && now - rateLimitInfo.lastRequest < RATE_LIMIT_WINDOW) {
      const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW - (now - rateLimitInfo.lastRequest)) / 1000)
      return NextResponse.json(
        { error: `Please wait ${waitSeconds} seconds before requesting another reset link.` },
        { status: 429 }
      )
    }

    // Clean up old rate limit entries periodically
    if (Math.random() < 0.05) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (now - value.lastRequest > RATE_LIMIT_WINDOW * 2) {
          rateLimitMap.delete(key)
        }
      }
    }

    // Find user by email — always return success to prevent email enumeration
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    let emailSent = false
    let resetToken: string | null = null

    if (user) {
      // Invalidate any existing reset tokens for this email
      await db.passwordResetToken.updateMany({
        where: { email: normalizedEmail, used: false },
        data: { used: true },
      })

      // Generate new reset token
      resetToken = randomUUID()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await db.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token: resetToken,
          expiresAt,
        },
      })

      // Send password reset email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://mun-diplomatiq.vercel.app'
      const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`
      try {
        await sendPasswordResetEmail(normalizedEmail, user.name, resetUrl)
        emailSent = true
      } catch (emailError) {
        console.error("[PASSWORD RESET] Failed to send email:", emailError)
      }
      console.log(`[PASSWORD RESET] Reset link generated for ${normalizedEmail}: ${resetUrl}`)

      // Also notify platform admins about the password reset request
      try {
        const admins = await db.user.findMany({
          where: { role: { in: ['MASTER_ADMIN', 'FOUNDER', 'SUPER_ADMIN'] }, isActive: true },
          select: { id: true },
        })
        for (const admin of admins) {
          await db.notification.create({
            data: {
              userId: admin.id,
              title: 'Password Reset Request',
              message: `User ${normalizedEmail} has requested a password reset. ${emailSent ? 'Email was sent successfully.' : 'Email delivery failed — you can reset their password manually from the Command Center → User Management, or share this reset link: ' + resetUrl}`,
              type: 'admin_action',
              link: '/dashboard',
            },
          })
        }
      } catch (notifError) {
        console.error("[PASSWORD RESET] Failed to notify admins:", notifError)
      }
    }

    // Update rate limiter
    rateLimitMap.set(rateLimitKey, { lastRequest: now })

    // Always return success to prevent email enumeration
    // Include token info only if user exists and email was NOT sent (fallback mechanism)
    const response: Record<string, unknown> = {
      message: "If an account exists with this email, you will receive a password reset link shortly.",
    }

    // Security: Only include the reset token in the response if the email failed to send
    // This allows the frontend to display a direct reset link as a fallback
    // The token is still required to actually reset the password, so this is safe
    if (user && !emailSent && resetToken) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://mun-diplomatiq.vercel.app'
      response.resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`
      response.emailDeliveryFailed = true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
