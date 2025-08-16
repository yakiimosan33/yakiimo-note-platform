'use client'

const FREE_READ_KEY = 'firstFreeReadUsed'

export function hasFreeReadUsed(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(FREE_READ_KEY) === 'true'
}

export function markFreeReadUsed(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(FREE_READ_KEY, 'true')
}

export function resetFreeRead(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(FREE_READ_KEY)
}

export function canReadArticle(isAuthenticated: boolean): boolean {
  if (isAuthenticated) return true
  return !hasFreeReadUsed()
}