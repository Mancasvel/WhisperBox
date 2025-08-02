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
      <div className="text-center bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <div className="w-8 h-8 bg-white/30 rounded-full"></div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-2">Loading your journal...</div>
        <div className="text-gray-600">Retrieving your thoughts and reflections</div>
      </div>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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