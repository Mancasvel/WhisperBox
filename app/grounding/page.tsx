'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const GroundingExercise = dynamic(
  () => import('@/components/CalmingFeatures').then(mod => ({ default: mod.GroundingExercise })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading grounding exercise...</h3>
          <p className="text-gray-600">Preparing your mindfulness journey</p>
        </div>
      </div>
    ),
  }
)

export default function GroundingPage() {
  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <FeatureNavigation
          title="Grounding Exercise"
          description="5-4-3-2-1 technique for present moment awareness and anxiety management"
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
                <GroundingExercise />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 