// src/context/JournalContext.jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getUserEntries, createEntry, deleteEntry, updateEntry } from '../services/journalService'

const JournalContext = createContext(null)

export function JournalProvider({ children }) {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getUserEntries(user.uid)
      setEntries(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addEntry = useCallback(async (entryData) => {
    if (!user) return
    const id = await createEntry(user.uid, entryData)
    const newEntry = { id, ...entryData, userId: user.uid }
    setEntries(prev => [newEntry, ...prev])
    return id
  }, [user])

  const removeEntry = useCallback(async (entryId) => {
    await deleteEntry(entryId)
    setEntries(prev => prev.filter(e => e.id !== entryId))
  }, [])

  const editEntry = useCallback(async (entryId, data) => {
    await updateEntry(entryId, data)
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, ...data } : e))
  }, [])

  return (
    <JournalContext.Provider value={{ entries, loading, fetchEntries, addEntry, removeEntry, editEntry }}>
      {children}
    </JournalContext.Provider>
  )
}

export const useJournal = () => useContext(JournalContext)