// src/components/MoodChart.jsx

export default function MoodChart({ last7 }) {
  const max = 10

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
        {last7.map((day, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {day.score !== null ? (
              <div
                style={{
                  width: '100%',
                  height: `${(day.score / max) * 80}px`,
                  minHeight: 8,
                  background: day.score >= 7
                    ? 'var(--green)'
                    : day.score >= 4
                    ? 'var(--accent)'
                    : 'var(--blue)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease',
                  position: 'relative',
                }}
                title={`${day.label}: ${day.score}/10`}
              />
            ) : (
              <div style={{
                width: '100%', height: 8,
                background: 'var(--border)',
                borderRadius: '6px 6px 0 0',
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {last7.map((day, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: '0.7rem', color: 'var(--text-muted)',
          }}>
            {day.label}
          </div>
        ))}
      </div>
    </div>
  )
}