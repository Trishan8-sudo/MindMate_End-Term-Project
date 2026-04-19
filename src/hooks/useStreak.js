// src/hooks/useStreak.js
import { useMemo } from 'react'

export function useStreak(entries) {
  return useMemo(() => {
    if (!entries.length) return 0

    // Get unique dates (YYYY-MM-DD) sorted descending
    const dates = [...new Set(
      entries.map(e => {
        const d = e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt || Date.now())
        return d.toISOString().split('T')[0]
      })
    )].sort((a, b) => b.localeCompare(a))

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Streak must start today or yesterday
    if (dates[0] !== today && dates[0] !== yesterday) return 0

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = (prev - curr) / 86400000
      if (Math.round(diff) === 1) streak++
      else break
    }
    return streak
  }, [entries])
}