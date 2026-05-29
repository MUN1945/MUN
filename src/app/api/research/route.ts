import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isTeacherOrAbove } from "@/lib/auth-helpers"
import { db } from "@/lib/db"

// GET /api/research - List research tasks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const assignedTo = searchParams.get("assignedTo")
    const priority = searchParams.get("priority")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    // Non-admin users can only see their own tasks or tasks from their school
    if (!isTeacherOrAbove(session.user.role)) {
      where.OR = [
        { assignedTo: session.user.id },
        { schoolId: session.user.schoolId || "unknown" },
      ]
    } else if (session.user.schoolId) {
      where.schoolId = session.user.schoolId
    }

    if (status) where.status = status
    if (assignedTo) where.assignedTo = assignedTo
    if (priority) where.priority = priority

    const [tasks, total] = await Promise.all([
      db.researchTask.findMany({
        where,
        include: {
          assignee: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.researchTask.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get research tasks error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch research tasks" },
      { status: 500 }
    )
  }
}

// POST /api/research - Create research task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!isTeacherOrAbove(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions. Teacher or Admin role required." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, assignedTo, dueDate, priority, category } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      )
    }

    const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]
    const taskPriority = validPriorities.includes(priority) ? priority : "MEDIUM"

    const task = await db.researchTask.create({
      data: {
        schoolId: session.user.schoolId || session.user.id,
        title,
        description,
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "PENDING",
        priority: taskPriority,
        category: category || null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    // Create notification for assigned user
    if (assignedTo) {
      await db.notification.create({
        data: {
          userId: assignedTo,
          title: "New Research Task Assigned",
          message: `You have been assigned a research task: ${title}`,
          type: "assignment",
          link: `/research`,
        },
      })
    }

    return NextResponse.json(
      { success: true, data: task, message: "Research task created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create research task error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create research task" },
      { status: 500 }
    )
  }
}

// PATCH /api/research - Update task status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, status, title, description, assignedTo, dueDate, priority, category } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 }
      )
    }

    // Verify task exists and user has access
    const existingTask = await db.researchTask.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Research task not found" },
        { status: 404 }
      )
    }

    // Only assigned user or teachers can update
    if (
      existingTask.assignedTo !== session.user.id &&
      !isTeacherOrAbove(session.user.role)
    ) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status) {
      const validStatuses = ["PENDING", "IN_PROGRESS", "SUBMITTED", "REVIEWED", "COMPLETED"]
      if (validStatuses.includes(status)) {
        updateData.status = status
      }
    }
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (priority) updateData.priority = priority
    if (category !== undefined) updateData.category = category || null

    const updatedTask = await db.researchTask.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Research task updated successfully",
    })
  } catch (error) {
    console.error("Update research task error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update research task" },
      { status: 500 }
    )
  }
}

// DELETE /api/research - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (!isTeacherOrAbove(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 }
      )
    }

    await db.researchTask.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: "Research task deleted successfully",
    })
  } catch (error) {
    console.error("Delete research task error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete research task" },
      { status: 500 }
    )
  }
}
