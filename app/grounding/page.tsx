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
        <div className="text-muted-foreground animate-pulse">Loading grounding exercise...</div>
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
      <div className="journal-sanctuary min-h-screen">
        <FeatureNavigation
          title="Grounding Exercise"
          description="5-4-3-2-1 technique for present moment awareness and anxiety management"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-emotional-healing-200/30">
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