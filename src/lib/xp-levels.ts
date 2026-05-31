// ============================================================
// CANONICAL XP LEVEL THRESHOLDS — Single source of truth
// ============================================================

export const XP_LEVELS: Record<string, number> = {
  OBSERVER: 0,
  DELEGATE: 100,
  AMBASSADOR: 300,
  DIPLOMAT: 600,
  ENVOY: 1000,
  SECRETARY_GENERAL: 1500,
}

export const XP_LEVEL_NAMES = Object.keys(XP_LEVELS)

export function getLevelForXP(xp: number): string {
  let level = 'OBSERVER'
  for (const [levelName, threshold] of Object.entries(XP_LEVELS)) {
    if (xp >= threshold) {
      level = levelName
    }
  }
  return level
}

export function getNextLevelXP(currentXP: number): { nextLevel: string; xpNeeded: number } | null {
  let nextLevel: string | null = null
  let xpNeeded = 0

  for (const [levelName, threshold] of Object.entries(XP_LEVELS)) {
    if (currentXP < threshold) {
      nextLevel = levelName
      xpNeeded = threshold - currentXP
      break
    }
  }

  return nextLevel ? { nextLevel, xpNeeded } : null
}
