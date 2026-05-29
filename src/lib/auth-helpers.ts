import { hash, compare } from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

/**
 * Get the current authenticated user from the server session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

/**
 * Require a specific role - throws if user doesn't have the required role
 */
export async function requireRole(role: string) {
  const user = await requireAuth()
  if (user.role !== role && user.role !== "SUPER_ADMIN") {
    throw new Error(`Role '${role}' required. You have role '${user.role}'.`)
  }
  return user
}

/**
 * Require one of several roles - throws if user doesn't have any of the required roles
 */
export async function requireAnyRole(roles: string[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role) && user.role !== "SUPER_ADMIN") {
    throw new Error(
      `One of roles [${roles.join(", ")}] required. You have role '${user.role}'.`
    )
  }
  return user
}

/**
 * Check if a user has admin-level privileges
 */
export function isAdmin(role: string): boolean {
  return ["ADMIN", "SUPER_ADMIN"].includes(role)
}

/**
 * Check if a user has teacher-level or above privileges
 */
export function isTeacherOrAbove(role: string): boolean {
  return ["TEACHER", "ADMIN", "SUPER_ADMIN", "SCHOOL_ADMIN"].includes(role)
}

/**
 * Check if a user can manage conferences
 */
export function canManageConferences(role: string): boolean {
  return isTeacherOrAbove(role)
}

/**
 * Check if a user can create courses
 */
export function canCreateCourses(role: string): boolean {
  return isAdmin(role)
}

/**
 * Check if a user can access admin dashboard
 */
export function canAccessAdmin(role: string): boolean {
  return isAdmin(role)
}

/**
 * Role hierarchy for comparison
 */
const ROLE_HIERARCHY: Record<string, number> = {
  STUDENT: 1,
  TEACHER: 2,
  SCHOOL_ADMIN: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
}

/**
 * Check if a user's role is at least the specified level
 */
export function hasMinRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  return userLevel >= requiredLevel
}
