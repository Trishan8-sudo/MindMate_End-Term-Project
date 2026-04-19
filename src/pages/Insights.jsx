// src/pages/Insights.jsx
import { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import MoodChart from '../components/MoodChart'
import { useJournal } from '../context/JournalContext'
import { useMoodStats } from '../hooks/useMoodStats'
import { useStreak } from '../hooks/useStreak'
import { generateWeeklySummary } from '../services/aiService'

const MOOD_EMOJI = {
  joyful: '😄', content: '😊', neutral: '😐',
  anxious: '😰', sad: '😢', stressed: '😤', angry: '😡',
}

export default function Insights() {
  const { entries, loading, fetchEntries } = useJournal()
  const { avgScore, moodCounts, last7, topTags } = useMoodStats(entries)
  const streak = useStreak(entries)
  const [weeklySummary, setWeeklySummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState('')

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const dominantMood = useMemo(() => {
    if (!Object.keys(moodCounts).length) return null
    return Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
  }, [moodCounts])

  const handleGenerateSummary = async () => {
    if (!entries.length) return
    setSummaryLoading(true)
    setSummaryError('')
    try {
      const summary = await generateWeeklySummary(entries)
      setWeeklySummary(summary)
    } catch {
      setSummaryError('Could not generate summary. Check your API key.')
    } finally {
      setSummaryLoading(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ padding: '32px 20px', flex: 1 }}>

        <div className="animate-fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, marginBottom: 4 }}>
            Your insights
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Patterns and reflections from your journey.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <p>Start journaling to see insights here.</p>
          </div>
        ) : (
          <>
            {/* Overview stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}
              className="animate-fade-up">
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
                  {avgScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/10</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Average mood</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="streak" style={{ justifyContent: 'center', fontSize: '1.1rem' }}>
                  🔥 {streak}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>Day streak</div>
              </div>
            </div>

            {/* Mood chart */}
            <div className="card animate-fade-up" style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>
                7-day mood trend
              </h2>
              <MoodChart last7={last7} />
              <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>🟢 7–10 High</span>
                <span>🟠 4–6 Mid</span>
                <span>🔵 1–3 Low</span>
              </div>
            </div>

            {/* Dominant mood */}
            {dominantMood && (
              <div className="card animate-fade-up" style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 14 }}>
                  Mood breakdown
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {Object.entries(moodCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([mood, count]) => (
                      <div key={mood} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--bg-muted)', borderRadius: 10, padding: '8px 14px',
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>{MOOD_EMOJI[mood.toLowerCase()] || '😐'}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{mood}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{count}×</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Top emotion tags */}
            {topTags.length > 0 && (
              <div className="card animate-fade-up" style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 14 }}>
                  Recurring feelings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {topTags.map(({ tag, count }) => {
                    const max = topTags[0].count
                    return (
                      <div key={tag}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 500 }}>{tag}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{count}×</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(count / max) * 100}%`,
                            background: 'var(--accent)',
                            borderRadius: 4,
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* AI Weekly Summary */}
            <div className="card animate-fade-up" style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 6 }}>
                ✨ AI Weekly Summary
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                Let your AI companion reflect on your recent entries.
              </p>

              {weeklySummary ? (
                <div>
                  <div className="insight-card" style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.7 }}>
                      {weeklySummary.weekSummary}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--green)', fontWeight: 500, marginBottom: 8 }}>
                      🌱 {weeklySummary.progressNote}
                    </p>
                    <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>💡 Tip for next week</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{weeklySummary.weeklyTip}</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={handleGenerateSummary}>
                    Refresh
                  </button>
                </div>
              ) : (
                <>
                  {summaryError && <div className="error-msg" style={{ marginBottom: 12 }}>{summaryError}</div>}
                  <button
                    className="btn btn-soft"
                    onClick={handleGenerateSummary}
                    disabled={summaryLoading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {summaryLoading ? <><span className="spinner" /> Generating…</> : '✨ Generate my summary'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}