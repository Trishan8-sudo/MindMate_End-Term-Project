// src/services/aiService.js
// Calls Gemini API to analyze journal entries

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key || key === 'your-gemini-api-key-here') {
    throw new Error('Missing VITE_GEMINI_API_KEY in .env file. Get one at https://aistudio.google.com/apikey')
  }
  return key
}

export async function analyzeEntry({ mood, moodScore, tags, text }) {
  const prompt = `You are MindMate, a compassionate mental wellness AI companion. 
A user has submitted their journal entry. Analyze it and respond ONLY with a valid JSON object — no markdown, no explanation, no code fences.

User's entry:
- Mood: ${mood} (score: ${moodScore}/10)
- Emotion tags: ${tags.join(', ') || 'none'}
- Journal text: "${text || 'No text provided'}"

Respond with exactly this JSON structure:
{
  "emotionalTone": "one of: joyful | content | neutral | anxious | sad | stressed | angry",
  "summary": "A warm 1–2 sentence summary of how they seem to be feeling",
  "insight": "A gentle observation about their state (1–2 sentences)",
  "copingTip": {
    "title": "Short technique name",
    "description": "2–3 sentence description of a practical coping technique relevant to their mood"
  },
  "affirmation": "A short, warm, genuine affirmation (not cheesy)"
}`

  const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`AI analysis failed (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function generateWeeklySummary(entries) {
  if (!entries.length) return null

  const entrySummaries = entries.slice(0, 7).map(e =>
    `- ${e.mood} (${e.moodScore}/10): ${e.text?.substring(0, 100) || 'no text'}`
  ).join('\n')

  const prompt = `You are MindMate. Here are a user's recent journal entries:

${entrySummaries}

Respond ONLY with a JSON object — no markdown, no explanation, no code fences:
{
  "weekSummary": "2–3 sentence overview of the user's emotional week",
  "dominantMood": "the most common emotional theme",
  "progressNote": "something positive or encouraging about their journey",
  "weeklyTip": "one actionable wellness suggestion for the coming week"
}`

  const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`Weekly summary failed (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}