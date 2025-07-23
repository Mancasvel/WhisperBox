'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const JournalList = dynamic(() => import('@/components/JournalList'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="text-muted-foreground animate-pulse">Loading your journal...</div>
    </div>
  ),
})

export default function JournalPage() {
  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <ProtectedRoute>
      <div className="journal-sanctuary min-h-screen bg-gradient-to-br from-whisper-green/5 to-blue-50/30">
        <FeatureNavigation
          title="Your Sacred Journal"
          description="A private space for emotional expression and healing"
        />

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <JournalList />
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 