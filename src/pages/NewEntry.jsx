// src/pages/NewEntry.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useJournal } from '../context/JournalContext'
import { analyzeEntry } from '../services/aiService'

const MOODS = [
  { label: 'Joyful',  emoji: '😄', score: 9 },
  { label: 'Content', emoji: '😊', score: 7 },
  { label: 'Neutral', emoji: '😐', score: 5 },
  { label: 'Anxious', emoji: '😰', score: 4 },
  { label: 'Sad',     emoji: '😢', score: 3 },
  { label: 'Stressed',emoji: '😤', score: 3 },
  { label: 'Angry',   emoji: '😡', score: 2 },
]

const EMOTION_TAGS = [
  'calm', 'grateful', 'hopeful', 'tired', 'overwhelmed',
  'lonely', 'motivated', 'confused', 'proud', 'frustrated',
  'excited', 'nervous', 'peaceful', 'irritable', 'loved',
]

const PROMPTS = [
  "What's one thing on your mind right now?",
  "Did anything significant happen today?",
  "What are you grateful for today, even if it's small?",
  "How did your body feel today?",
]

export default function NewEntry() {
  const { addEntry, editEntry } = useJournal()
  const navigate = useNavigate()

  const [selectedMood, setSelectedMood] = useState(null)
  const [moodScore, setMoodScore] = useState(5)
  const [selectedTags, setSelectedTags] = useState([])
  const [text, setText] = useState('')
  const [step, setStep] = useState(1) // 1: mood, 2: tags, 3: write
  const [submitting, setSubmitting] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [entrySaved, setEntrySaved] = useState(false)
  const [error, setError] = useState('')
  const textRef = useRef()

  const toggleTag = tag =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setMoodScore(mood.score)
  }

  const handleSubmit = async () => {
    if (!selectedMood) return setError('Please select a mood first.')
    setError('')
    setSubmitting(true)
    try {
      // 1. Always save the entry first — guaranteed persistence
      const entryData = {
        mood: selectedMood.label,
        moodScore,
        tags: selectedTags,
        text,
      }
      const entryId = await addEntry(entryData)
      setEntrySaved(true)

      // 2. Try AI analysis as a secondary step
      try {
        const analysis = await analyzeEntry({
          mood: selectedMood.label,
          moodScore,
          tags: selectedTags,
          text,
        })
        setAiResult(analysis)
        // Update the saved entry with AI analysis
        if (entryId) {
          await editEntry(entryId, { aiAnalysis: analysis })
        }
      } catch (aiErr) {
        console.warn('AI analysis unavailable:', aiErr.message)
        setError('Entry saved! AI analysis was unavailable — you can try again later.')
      }
    } catch (err) {
      console.error('Failed to save entry:', err)
      setError('Failed to save entry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // After submission — show the AI result or simple success
  if (aiResult || (entrySaved && !submitting)) {
    return (
      <div className="page">
        <Navbar />
        <div className="container" style={{ padding: '32px 20px' }}>
          <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🌿</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}>Entry saved</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {aiResult ? "Here's what your AI companion noticed." : 'Your journal entry has been saved successfully.'}
            </p>
          </div>

          {aiResult && (
            <div className="insight-card animate-fade-up" style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.7 }}>
                "{aiResult.affirmation}"
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                {aiResult.insight}
              </p>
              <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  💡 {aiResult.copingTip.title}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {aiResult.copingTip.description}
                </p>
              </div>
            </div>
          )}

          {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setAiResult(null); setEntrySaved(false); setStep(1); setSelectedMood(null); setSelectedTags([]); setText(''); setError('') }}
              className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              + New entry
            </button>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Go home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ padding: '32px 20px' }}>

        {/* Step indicator */}
        <div className="animate-fade-up" style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: step >= s ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Step 1 — Mood */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 6 }}>
              How are you feeling?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
              Pick the mood that best describes your current state.
            </p>
            <div className="mood-row" style={{ marginBottom: 28 }}>
              {MOODS.map(m => (
                <button
                  key={m.label}
                  className={`mood-btn${selectedMood?.label === m.label ? ' selected' : ''}`}
                  onClick={() => handleMoodSelect(m)}
                >
                  <span className="emoji">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
            {selectedMood && (
              <div style={{ marginBottom: 24 }}>
                <label className="label">Fine-tune your score: {moodScore}/10</label>
                <input
                  type="range" min={1} max={10} value={moodScore}
                  onChange={e => setMoodScore(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>
            )}
            {error && <div className="error-msg" style={{ marginBottom: 14 }}>{error}</div>}
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { if (!selectedMood) return setError('Pick a mood to continue.'); setError(''); setStep(2) }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Emotion tags */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 6 }}>
              Any specific feelings?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 22 }}>
              Select all that apply. This helps the AI understand your nuance.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {EMOTION_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`tag-chip${selectedTags.includes(tag) ? ' selected' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Write */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 6 }}>
              Write it out
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
              Let it flow. There are no wrong answers here.
            </p>

            {/* Starter prompts */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {PROMPTS.map(p => (
                <button
                  key={p}
                  className="tag-chip"
                  onClick={() => {
                    setText(prev => prev ? prev + '\n\n' + p + '\n' : p + '\n')
                    textRef.current?.focus()
                  }}
                >
                  + {p}
                </button>
              ))}
            </div>

            <textarea
              ref={textRef}
              className="input"
              placeholder="Start writing..."
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ minHeight: 200, marginBottom: 20 }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>← Back</button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <><span className="spinner" /> Analyzing…</> : '✨ Save & Analyze'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}