'use client'

import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="journal-sanctuary min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-whisper-green-200/30">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                                      <Loader2 className="w-8 h-8 text-whisper-green-500" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                                      <Heart className="w-4 h-4 text-whisper-green-500" />
                </motion.div>
              </div>
              <p className="text-muted-foreground font-ui text-center">
                Preparing your safe space...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Show nothing while redirecting to login
  if (!isAuthenticated) {
    return null
  }

  // Render protected content
  return <>{children}</>
} 