'use client'

import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { analyzeJournalEntry } from '@/lib/whisperBoxAI'
import { useAuth } from '@/lib/AuthContext'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const JournalInterface = dynamic(() => import('@/components/JournalInterface'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="text-muted-foreground animate-pulse">Loading your journal...</div>
    </div>
  ),
})

interface JournalEntry {
  id?: string
  title: string
  content: string
  mood: string
  tags: string[]
  emotionalScore: number
  createdAt: Date
}

export default function JournalPage() {
  const { user } = useAuth()

  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // AI Analysis function
  const handleAnalyze = useCallback(async (content: string) => {
    try {
      const analysis = await analyzeJournalEntry(content)
      return analysis
    } catch (error) {
      console.error('Analysis failed:', error)
      return null
    }
  }, [])

  // Save journal entry function
  const handleSave = useCallback(async (entry: JournalEntry) => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: entry.content,
          title: entry.title,
          mood: entry.mood,
          tags: entry.tags,
          journalType: 'daily',
          isPrivate: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save journal entry')
      }

      const result = await response.json()
      console.log('Journal entry saved successfully:', result)
      
      // You could add a toast notification here
      return result.data

    } catch (error) {
      console.error('Error saving journal entry:', error)
      // You could add error notification here
      throw error
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="journal-sanctuary min-h-screen">
        <FeatureNavigation
          title="Your Sacred Journal"
          description="A private space for emotional expression and healing"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <JournalInterface 
              onAnalyze={handleAnalyze}
              onSave={handleSave}
            />
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 