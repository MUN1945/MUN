import { NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth-helpers"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, schoolId, phone, country, city } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Validate role
    const validRoles = ["STUDENT", "TEACHER", "SCHOOL_ADMIN"]
    const userRole = validRoles.includes(role) ? role : "STUDENT"

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role: userRole,
        phone: phone || null,
        country: country || "UAE",
        city: city || null,
        schoolId: schoolId || null,
        isActive: true,
        emailVerified: false,
      },
    })

    // Create delegate profile for students
    if (userRole === "STUDENT") {
      await db.delegateProfile.create({
        data: {
          userId: user.id,
          xp: 0,
          level: "OBSERVER",
          streak: 0,
          longestStreak: 0,
          conferencesAttended: 0,
          committeesServed: 0,
          awardsReceived: 0,
          resolutionsWritten: 0,
          speechesDelivered: 0,
        },
      })
    }

    // Create subscription with trial period (14 days)
    const trialStart = new Date()
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14)

    await db.subscription.create({
      data: {
        userId: user.id,
        tier: "FREE",
        status: "TRIAL",
        trialStartsAt: trialStart,
        trialEndsAt: trialEnd,
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
        message: "Account created successfully. Your 14-day trial has started.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
