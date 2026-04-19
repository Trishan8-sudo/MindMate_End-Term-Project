// src/services/journalService.js
import {
  collection, addDoc, getDocs, getDoc,
  updateDoc, deleteDoc, doc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'entries'

export async function createEntry(userId, entryData) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...entryData,
    userId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserEntries(userId) {
  try {
    // Try with orderBy (requires composite index)
    const q = query(
      collection(db, COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    // Fallback: query without orderBy if composite index is missing
    // The error message typically includes a link to create the index
    if (err.code === 'failed-precondition' || err.message?.includes('index')) {
      console.warn(
        'Firestore composite index missing. Falling back to client-side sorting.\n' +
        'To fix, create the index in Firebase Console or follow the link in the error:\n',
        err.message
      )
      const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId)
      )
      const snap = await getDocs(q)
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Sort client-side
      return entries.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
        return bTime - aTime
      })
    }
    throw err
  }
}

export async function getEntry(entryId) {
  const snap = await getDoc(doc(db, COLLECTION, entryId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function updateEntry(entryId, data) {
  await updateDoc(doc(db, COLLECTION, entryId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteEntry(entryId) {
  await deleteDoc(doc(db, COLLECTION, entryId))
}