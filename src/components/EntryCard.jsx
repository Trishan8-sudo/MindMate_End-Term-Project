// src/components/EntryCard.jsx
import { useState } from 'react'
import { useJournal } from '../context/JournalContext'

const MOOD_COLORS = {
  joyful: 'var(--yellow-soft)',
  content: 'var(--green-soft)',
  neutral: 'var(--bg-muted)',
  anxious: 'var(--purple-soft)',
  sad: 'var(--blue-soft)',
  stressed: 'var(--accent-soft)',
  angry: '#fde8e8',
}

export default function EntryCard({ entry, onDelete }) {
  const { removeEntry } = useJournal()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const date = entry.createdAt?.toDate
    ? entry.createdAt.toDate()
    : new Date(entry.createdAt || Date.now())

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeEntry(entry.id)
      onDelete?.()
    } catch (err) {
      console.error('Failed to delete entry:', err)
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="card animate-fade-up" style={{ marginBottom: 16, opacity: deleting ? 0.5 : 1, transition: 'opacity 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: MOOD_COLORS[entry.aiAnalysis?.emotionalTone] || 'var(--bg-muted)',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              {entry.mood}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            {(entry.tags || []).map(t => (
              <span key={t} className="badge" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                {t}
              </span>
            ))}
          </div>

          {entry.text && (
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              marginBottom: 12,
            }}>
              "{entry.text.length > 180 ? entry.text.substring(0, 180) + '…' : entry.text}"
            </p>
          )}

          {entry.aiAnalysis && (
            <div className="insight-card" style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>
                ✨ AI Insight
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {entry.aiAnalysis.insight}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 40 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--accent)',
          }}>
            {entry.moodScore}
          </div>

          {confirming ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: '#ef4444', border: 'none', cursor: 'pointer',
                  color: '#fff', fontSize: '0.72rem', padding: '4px 8px',
                  borderRadius: 6, fontWeight: 600,
                }}
                title="Confirm delete"
              >
                {deleting ? '...' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  background: 'var(--bg-muted)', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.72rem', padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '1rem', padding: 4,
                borderRadius: 6, transition: 'color 0.15s',
              }}
              title="Delete entry"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}