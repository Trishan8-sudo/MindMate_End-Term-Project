// src/pages/Dashboard.jsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MoodChart from '../components/MoodChart'
import { useAuth } from '../context/AuthContext'
import { useJournal } from '../context/JournalContext'
import { useMoodStats } from '../hooks/useMoodStats'
import { useStreak } from '../hooks/useStreak'

const MOOD_EMOJI = {
  joyful: '😄', content: '😊', neutral: '😐',
  anxious: '😰', sad: '😢', stressed: '😤', angry: '😡',
}

export default function Dashboard() {
  const { user } = useAuth()
  const { entries, loading, fetchEntries } = useJournal()
  const { avgScore, moodCounts, last7, topTags } = useMoodStats(entries)
  const streak = useStreak(entries)
  const firstName = user?.displayName?.split(' ')[0] || 'there'

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const latestEntry = entries[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ padding: '32px 20px', flex: 1 }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 4 }}>{greeting}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            How are you feeling today?
          </p>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}
          className="animate-fade-up">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {entries.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Entries</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
              {avgScore}/10
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Avg Mood</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="streak" style={{ justifyContent: 'center', fontSize: '1rem' }}>
              🔥 {streak}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>Day Streak</div>
          </div>
        </div>

        {/* CTA */}
        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <Link to="/new" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
            ✏️ &nbsp; Write today's entry
          </Link>
        </div>

        {/* Mood chart */}
        {entries.length > 0 && (
          <div className="card animate-fade-up" style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>
              Mood this week
            </h2>
            <MoodChart last7={last7} />
          </div>
        )}

        {/* Top emotions */}
        {topTags.length > 0 && (
          <div className="card animate-fade-up" style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 14 }}>
              Your frequent feelings
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {topTags.map(({ tag, count }) => (
                <span key={tag} className="badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '0.85rem' }}>
                  {tag} <span style={{ opacity: 0.6 }}>×{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Latest AI insight */}
        {latestEntry?.aiAnalysis && (
          <div className="insight-card animate-fade-up" style={{ marginBottom: 24 }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
              ✨ Latest insight
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.6 }}>
              "{latestEntry.aiAnalysis.affirmation}"
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {latestEntry.aiAnalysis.insight}
            </p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <span className="spinner" />
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <p>No entries yet. Write your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}