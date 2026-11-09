'use client'

import { useEffect, useState } from 'react'

export function useDemoStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(initialValue)
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) setValue(JSON.parse(saved) as T)
    } catch (error) {
      console.error(`Could not load demo data for "${key}"`, error)
      setStorageError('Demo data could not be loaded from this browser.')
    } finally {
      setReady(true)
    }
  }, [key])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Could not save demo data for "${key}"`, error)
      setStorageError('Demo data could not be saved in this browser.')
    }
  }, [key, ready, value])

  return { value, setValue, ready, storageError }
}
