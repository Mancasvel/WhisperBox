'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/AuthContext'
import {
  Edit3,
  Wind,
  Brain,
  LifeBuoy,
  Sparkles,
  Heart,
  TrendingUp,
  Clock,
  Target,
  Shield
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const features = [
    {
      id: 'journal',
      path: '/journal',
      icon: <Edit3 className="w-6 h-6" />,
      title: 'Emotional Journaling',
      description: 'Express your thoughts and feelings in a safe, private space',
      gradient: 'from-whisper-green-500 to-whisper-green-600',
      bgColor: 'bg-whisper-green-50/10',
      stats: 'Start writing today'
    },
    {
      id: 'breathing',
      path: '/breathing',
      icon: <Wind className="w-6 h-6" />,
      title: 'Breathing Exercises',
      description: 'Guided techniques to reduce anxiety and promote calm',
      gradient: 'from-whisper-orange-500 to-whisper-green-500',
      bgColor: 'bg-whisper-orange-50/10',
      stats: '4-7-8 technique'
    },
    {
      id: 'grounding',
      path: '/grounding',
      title: 'Grounding Exercises',
      icon: <Brain className="w-6 h-6" />,
      description: '5-4-3-2-1 technique to help you feel present',
      gradient: 'from-whisper-green-600 to-whisper-orange-500',
      bgColor: 'bg-whisper-green-50/10',
      stats: 'Find your center'
    },
    {
      id: 'crisis',
      path: '/crisis',
      icon: <LifeBuoy className="w-6 h-6" />,
      title: 'Crisis Support',
      description: 'Immediate access to mental health resources',
      gradient: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50/10',
      stats: '24/7 available'
    }
  ]

  const quickStats = [
    {
      label: 'AI Chats Available',
      value: `${(user?.aiChatsLimit || 10) - (user?.aiChatsUsed || 0)}`,
      total: user?.aiChatsLimit || 10,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-whisper-green-600'
    },
    {
      label: 'Days Active',
      value: '1',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-whisper-green-600'
    },
    {
      label: 'Safe Space',
      value: '100%',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-whisper-orange-600'
    }
  ]

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const aiChatsProgress = ((user?.aiChatsUsed || 0) / (user?.aiChatsLimit || 10)) * 100

  return (
    <ProtectedRoute>
      <div className="journal-sanctuary min-h-screen">
        <FeatureNavigation
          title="Your Wellness Dashboard"
          description="Welcome to your safe space for mental health and emotional wellbeing"
          showBackButton={false}
        />

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Welcome Section */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-whisper-green-500/10 to-whisper-green-600/10 border-whisper-green-200/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-12 h-12 text-whisper-green-500" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-journal font-semibold mb-2">
                      Welcome back, {user?.name || 'Friend'}
                    </h1>
                    <p className="text-muted-foreground font-ui">
                      Take a moment for yourself. Your mental wellness journey continues here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {quickStats.map((stat, index) => (
              <motion.div key={stat.label} variants={fadeIn}>
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-ui">{stat.label}</p>
                        <p className="text-2xl font-journal font-semibold">{stat.value}</p>
                        {stat.total && (
                          <Progress 
                            value={aiChatsProgress} 
                            className="h-1 mt-2" 
                          />
                        )}
                      </div>
                      <div className={`${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={fadeIn}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card 
                                     className={`cursor-pointer border-border/50 hover:border-whisper-green-300/50 transition-all duration-300 overflow-hidden h-full ${feature.bgColor}`}
                  onClick={() => router.push(feature.path)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-journal mb-2">{feature.title}</CardTitle>
                        <CardDescription className="font-ui text-muted-foreground leading-relaxed mb-3">
                          {feature.description}
                        </CardDescription>
                        <Badge variant="secondary" className="text-xs">
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-ui"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(feature.path)
                      }}
                    >
                      Start {feature.title.split(' ')[0]} →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-journal font-medium mb-4">Need immediate support?</h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => router.push('/crisis')}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 font-ui"
                  >
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    Crisis Resources
                  </Button>
                  <Button
                    onClick={() => router.push('/breathing')}
                    className="bg-gradient-to-r from-whisper-green-500 to-whisper-green-600 hover:from-whisper-green-600 hover:to-whisper-green-700 font-ui"
                  >
                    <Wind className="w-4 h-4 mr-2" />
                    Quick Calm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 