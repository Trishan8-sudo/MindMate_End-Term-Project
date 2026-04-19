// src/pages/History.jsx
import { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import EntryCard from '../components/EntryCard'
import { useJournal } from '../context/JournalContext'

const MOOD_FILTERS = ['All', 'Joyful', 'Content', 'Neutral', 'Anxious', 'Sad', 'Stressed', 'Angry']

export default function History() {
  const { entries, loading, fetchEntries } = useJournal()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchMood = filter === 'All' || e.mood?.toLowerCase() === filter.toLowerCase()
      const matchSearch = !search || e.text?.toLowerCase().includes(search.toLowerCase())
      return matchMood && matchSearch
    })
  }, [entries, filter, search])

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ padding: '32px 20px', flex: 1 }}>
        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, marginBottom: 4 }}>
            Your journal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
          </p>
        </div>

        {/* Search */}
        <div className="animate-fade-up" style={{ marginBottom: 14 }}>
          <input
            className="input"
            placeholder="🔍  Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips */}
        <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {MOOD_FILTERS.map(m => (
            <button
              key={m}
              className={`tag-chip${filter === m ? ' selected' : ''}`}
              onClick={() => setFilter(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Entries */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <p>{entries.length === 0 ? 'No entries yet. Start journaling!' : 'No entries match your filter.'}</p>
          </div>
        ) : (
          filtered.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  )
}