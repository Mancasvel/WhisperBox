'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const BreathingExercise = dynamic(
  () => import('@/components/CalmingFeatures').then(mod => ({ default: mod.BreathingExercise })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading breathing exercise...</div>
      </div>
    ),
  }
)

export default function BreathingPage() {
  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <FeatureNavigation
          title="Breathing Exercise"
          description="Guided 4-7-8 breathing technique for relaxation and anxiety relief"
        />

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
              <CardContent className="p-0">
                <BreathingExercise />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 