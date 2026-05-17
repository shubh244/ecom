'use client'

import { useEffect } from 'react'

/**
 * Removes legacy PWA service workers that can leave iOS Safari with stale/broken caches
 * (symptom: HTML loads but CSS appears missing).
 */
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const cleanup = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((r) => r.unregister()))
      } catch {
        /* ignore */
      }

      try {
        if ('caches' in window) {
          const keys = await caches.keys()
          await Promise.all(keys.map((k) => caches.delete(k)))
        }
      } catch {
        /* ignore */
      }
    }

    void cleanup()
  }, [])

  return null
}
