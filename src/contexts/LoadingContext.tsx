'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface LoadingContextType {
  registerLoader: (id: string) => void
  unregisterLoader: (id: string) => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loaders, setLoaders] = useState<Set<string>>(new Set())
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    // Wait for page DOM to load
    if (document.readyState === 'complete') {
      setIsPageLoaded(true)
    } else {
      const handleLoad = () => setIsPageLoaded(true)
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  const registerLoader = useCallback((id: string) => {
    setLoaders(prev => new Set(prev).add(id))
  }, [])

  const unregisterLoader = useCallback((id: string) => {
    setLoaders(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  // Loading is complete when page is loaded AND all registered loaders are done
  const isLoading = !isPageLoaded || loaders.size > 0

  return (
    <LoadingContext.Provider value={{ registerLoader, unregisterLoader, isLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

