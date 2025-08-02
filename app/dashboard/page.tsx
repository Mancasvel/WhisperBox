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
      gradient: 'from-green-400 to-blue-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-blue-50',
      stats: 'Start writing today'
    },
    {
      id: 'breathing',
      path: '/breathing',
      icon: <Wind className="w-6 h-6" />,
      title: 'Breathing Exercises',
      description: 'Guided techniques to reduce anxiety and promote calm',
      gradient: 'from-blue-400 to-purple-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      stats: '4-7-8 technique'
    },
    {
      id: 'grounding',
      path: '/grounding',
      title: 'Grounding Exercises',
      icon: <Brain className="w-6 h-6" />,
      description: '5-4-3-2-1 technique to help you feel present',
      gradient: 'from-purple-400 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      stats: 'Find your center'
    },
    {
      id: 'crisis',
      path: '/crisis',
      icon: <LifeBuoy className="w-6 h-6" />,
      title: 'Crisis Support',
      description: 'Immediate access to mental health resources',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      stats: '24/7 available'
    }
  ]

  const quickStats = [
    {
      label: 'AI Chats Available',
      value: `${(user?.aiChatsLimit || 10) - (user?.aiChatsUsed || 0)}`,
      total: user?.aiChatsLimit || 10,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-100'
    },
    {
      label: 'Days Active',
      value: '1',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-100 to-blue-100'
    },
    {
      label: 'Safe Space',
      value: '100%',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-purple-100'
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      Welcome back, {user?.name || 'Friend'}
                    </h1>
                    <p className="text-gray-600 text-lg">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {quickStats.map((stat, index) => (
              <motion.div key={stat.label} variants={fadeIn}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        {stat.total && (
                          <div className="mt-3">
                            <Progress 
                              value={aiChatsProgress} 
                              className="h-2" 
                            />
                            <p className="text-xs text-gray-500 mt-1">of {stat.total} available</p>
                          </div>
                        )}
                      </div>
                      <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center shadow-md ml-4`}>
                        <div className={`${stat.color}`}>
                          {stat.icon}
                        </div>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={fadeIn}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card 
                  className="cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full bg-white/80 backdrop-blur-sm"
                  onClick={() => router.push(feature.path)}
                >
                  <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                  <div className={`${feature.bgColor} p-6 border-b border-white/40`}>
                    <div className="flex items-start space-x-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg flex items-center justify-center`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed text-lg mb-4">
                          {feature.description}
                        </CardDescription>
                        <Badge className="bg-white/60 text-gray-800 border-white/40 px-3 py-1">
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Button
                      variant="ghost"
                      className="w-full justify-center bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl py-3 text-lg font-semibold"
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
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Need immediate support?</h3>
                </div>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Access crisis resources or quick calming techniques whenever you need them.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/crisis')}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
                  >
                    <LifeBuoy className="w-5 h-5 mr-3" />
                    Crisis Resources
                  </Button>
                  <Button
                    onClick={() => router.push('/breathing')}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
                  >
                    <Wind className="w-5 h-5 mr-3" />
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