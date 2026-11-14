'use client'

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import type { Dispatch, SetStateAction } from 'react'

const missingValue = '\u0000missing'
const readError = '\u0000read-error'

function getSnapshot(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? missingValue
  } catch (error) {
    console.error(`Could not load demo data for "${key}"`, error)
    return readError
  }
}

function subscribe(key: string, callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) callback()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('buy-build:storage', callback)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('buy-build:storage', callback)
  }
}

export function useDemoStorage<T>(
  key: string,
  initialValue: T,
): {
  value: T
  setValue: Dispatch<SetStateAction<T>>
  ready: boolean
  storageError: string | null
} {
  const [initialState] = useState(initialValue)
  const subscribeToKey = useCallback((callback: () => void) => subscribe(key, callback), [key])
  const snapshot = useSyncExternalStore(subscribeToKey, () => getSnapshot(key), () => null)
  const parsed = useMemo(() => {
    if (snapshot === null || snapshot === missingValue || snapshot === readError) {
      return {
        value: initialState,
        error: snapshot === readError ? 'Demo data could not be loaded from this browser.' : null,
      }
    }
    try {
      return { value: JSON.parse(snapshot) as T, error: null }
    } catch (error) {
      console.error(`Could not parse demo data for "${key}"`, error)
      return { value: initialState, error: 'Saved demo data is invalid and could not be loaded.' }
    }
  }, [key, snapshot, initialState])
  const [writeError, setWriteError] = useState<string | null>(null)

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    try {
      const value = typeof nextValue === 'function'
        ? (nextValue as (current: T) => T)(parsed.value)
        : nextValue
      const serialized = JSON.stringify(value)
      if (serialized === undefined) throw new Error('Demo data is not serializable')
      window.localStorage.setItem(key, serialized)
      setWriteError(null)
      window.dispatchEvent(new Event('buy-build:storage'))
    } catch (error) {
      console.error(`Could not save demo data for "${key}"`, error)
      setWriteError('Demo data could not be saved in this browser.')
    }
  }, [key, parsed.value])

  return {
    value: parsed.value,
    setValue,
    ready: snapshot !== null,
    storageError: parsed.error ?? writeError,
  }
}
