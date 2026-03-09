import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook para infinite scroll usando IntersectionObserver.
 * Devuelve un ref para el elemento sentinel; cuando se hace visible,
 * dispara `onIntersect`. Usa rootMargin de 200px para pre-fetch.
 */
export function useInfiniteScroll(onIntersect: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && enabled) {
        onIntersect()
      }
    },
    [onIntersect, enabled],
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleIntersect])

  return sentinelRef
}
