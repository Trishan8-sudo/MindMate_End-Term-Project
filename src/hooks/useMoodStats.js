// src/hooks/useMoodStats.js
import { useMemo } from 'react'

export function useMoodStats(entries) {
  return useMemo(() => {
    if (!entries.length) return { avgScore: 0, moodCounts: {}, last7: [], topTags: [] }

    // Average mood score
    const avgScore = Math.round(
      entries.reduce((sum, e) => sum + (e.moodScore || 5), 0) / entries.length
    )

    // Mood label counts
    const moodCounts = entries.reduce((acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1
      return acc
    }, {})

    // Last 7 days mood scores for chart
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000)
      const dateStr = d.toISOString().split('T')[0]
      const dayEntries = entries.filter(e => {
        const ed = e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt || Date.now())
        return ed.toISOString().split('T')[0] === dateStr
      })
      const score = dayEntries.length
        ? Math.round(dayEntries.reduce((s, e) => s + (e.moodScore || 5), 0) / dayEntries.length)
        : null
      return {
        date: dateStr,
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        score,
      }
    }).reverse()

    // Top emotion tags
    const tagMap = {}
    entries.forEach(e => (e.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1 }))
    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    return { avgScore, moodCounts, last7, topTags }
  }, [entries])
}