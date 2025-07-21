'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Icons
import { 
  Heart, 
  Edit3, 
  Wind, 
  Brain, 
  LifeBuoy, 
  Shield, 
  Sparkles, 
  Leaf,
  ArrowLeft,
  Phone,
  MessageCircle
} from 'lucide-react'

// Dynamic imports to avoid SSR issues
const JournalInterface = dynamic(() => import('@/components/JournalInterface'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="text-muted-foreground">Loading journal...</div>
    </div>
  ),
})

const BreathingExercise = dynamic(() => import('@/components/CalmingFeatures').then(mod => ({ default: mod.BreathingExercise })), {
  ssr: false,
  loading: () => <div className="text-muted-foreground">Loading breathing exercise...</div>,
})

const GroundingExercise = dynamic(() => import('@/components/CalmingFeatures').then(mod => ({ default: mod.GroundingExercise })), {
  ssr: false,
  loading: () => <div className="text-muted-foreground">Loading grounding exercise...</div>,
})

const CrisisSupport = dynamic(() => import('@/components/CalmingFeatures').then(mod => ({ default: mod.CrisisSupport })), {
  ssr: false,
  loading: () => <div className="text-muted-foreground">Loading crisis support...</div>,
})

const QuickCalmButton = dynamic(() => import('@/components/CalmingFeatures').then(mod => ({ default: mod.QuickCalmButton })), {
  ssr: false,
  loading: () => null,
})

export default function WhisperBoxHome() {
  const [activeMode, setActiveMode] = useState<'welcome' | 'journal' | 'breathing' | 'grounding'>('welcome')
  const [showCrisis, setShowCrisis] = useState(false)

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

  const features = [
    {
      id: 'journal',
      icon: <Edit3 className="w-8 h-8" />,
      title: 'Emotional Journaling',
      description: 'Express your thoughts freely in a safe, private space with AI insights',
      gradient: 'from-emotional-calm-500 to-emotional-healing-500',
      bgColor: 'bg-emotional-calm-50/20'
    },
    {
      id: 'breathing',
      icon: <Wind className="w-8 h-8" />,
      title: 'Breathing Exercises',
      description: 'Guided breathing techniques to reduce anxiety and promote calm',
      gradient: 'from-emotional-warm-500 to-emotional-calm-500',
      bgColor: 'bg-emotional-warm-50/20'
    },
    {
      id: 'grounding',
      icon: <Brain className="w-8 h-8" />,
      title: 'Grounding Exercises',
      description: '5-4-3-2-1 technique to help you feel present and centered',
      gradient: 'from-emotional-healing-500 to-emotional-warm-500',
      bgColor: 'bg-emotional-healing-50/20'
    },
    {
      id: 'crisis',
      icon: <LifeBuoy className="w-8 h-8" />,
      title: 'Crisis Support',
      description: 'Immediate access to mental health resources and support lines',
      gradient: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50/20'
    }
  ]

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-emotional-calm-600" />,
      title: 'Private & Secure',
      description: 'Your data is encrypted and stays private. Only you can access your entries.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-emotional-warm-600" />,
      title: 'AI-Powered Insights',
      description: 'Compassionate AI provides emotional analysis and personalized wellness suggestions.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-emotional-healing-600" />,
      title: 'Evidence-Based',
      description: 'Techniques grounded in psychology and mental health best practices.'
    }
  ]

  return (
    <div className="journal-sanctuary min-h-screen">
      {/* Quick Calm Button - Always available */}
      <QuickCalmButton />

      {/* Crisis Support Modal */}
      <CrisisSupport 
        isOpen={showCrisis} 
        onClose={() => setShowCrisis(false)} 
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-emotional-calm-500 to-emotional-healing-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              W
            </motion.div>
            <div>
              <h1 className="text-5xl font-journal font-bold bg-gradient-to-r from-emotional-calm-600 to-emotional-healing-600 bg-clip-text text-transparent mb-2">
                WhisperBox
              </h1>
              <Badge variant="outline" className="emotion-badge healing">
                <Heart className="w-3 h-3 mr-1" />
                Mental Wellness Companion
              </Badge>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-ui leading-relaxed">
            Your private mental health companion. A secure space for emotional journaling with AI-powered insights and compassionate support.
          </p>
        </motion.header>

        {/* Mode Selection or Active Mode */}
        <AnimatePresence mode="wait">
          {activeMode === 'welcome' && (
            <motion.div
              key="welcome"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Feature Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerContainer}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    variants={fadeIn}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card 
                      className={`cursor-pointer border-border/50 hover:border-emotional-calm-300/50 transition-all duration-300 overflow-hidden ${feature.bgColor}`}
                      onClick={() => feature.id === 'crisis' ? setShowCrisis(true) : setActiveMode(feature.id as any)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl font-journal mb-2">{feature.title}</CardTitle>
                            <CardDescription className="font-ui text-muted-foreground leading-relaxed">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick Start Section */}
              <motion.div 
                variants={fadeIn}
                className="relative"
              >
                <Card className="bg-gradient-to-br from-emotional-calm-500/10 to-emotional-healing-500/10 border-emotional-calm-200/30">
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8 text-emotional-calm-500" />
                      </motion.div>
                    </div>
                    <CardTitle className="text-3xl font-journal mb-4">Ready to Begin Your Wellness Journey?</CardTitle>
                    <CardDescription className="text-lg font-ui text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Start with a journal entry about how you're feeling today. Our AI companion will provide gentle insights and personalized self-care suggestions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      onClick={() => setActiveMode('journal')}
                      size="lg"
                      className="bg-gradient-to-r from-emotional-calm-500 to-emotional-healing-500 hover:from-emotional-calm-600 hover:to-emotional-healing-600 text-white font-ui shadow-xl"
                    >
                      <Edit3 className="w-5 h-5 mr-2" />
                      Start Journaling
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits Section */}
              <motion.div 
                variants={fadeIn}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="text-center h-full border-border/50 hover:border-emotional-calm-300/50 transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-center mb-4">
                          <div className="p-4 rounded-full bg-gradient-to-br from-background to-muted">
                            {benefit.icon}
                          </div>
                        </div>
                        <CardTitle className="font-journal">{benefit.title}</CardTitle>
                        <CardDescription className="font-ui leading-relaxed">
                          {benefit.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Journal Mode */}
          {activeMode === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-journal font-semibold">Your Sacred Journal</h2>
                  <p className="text-muted-foreground font-ui">A private space for emotional expression and healing</p>
                </div>
                <Button
                  onClick={() => setActiveMode('welcome')}
                  variant="outline"
                  className="font-ui"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Menu
                </Button>
              </div>
              <JournalInterface />
            </motion.div>
          )}

          {/* Breathing Mode */}
          {activeMode === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-journal">Breathing Exercise</CardTitle>
                    <CardDescription className="font-ui">Guided 4-7-8 breathing for relaxation</CardDescription>
                  </div>
                  <Button
                    onClick={() => setActiveMode('welcome')}
                    variant="outline"
                    className="font-ui"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Menu
                  </Button>
                </CardHeader>
                <CardContent>
                  <BreathingExercise />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Grounding Mode */}
          {activeMode === 'grounding' && (
            <motion.div
              key="grounding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-journal">Grounding Exercise</CardTitle>
                    <CardDescription className="font-ui">5-4-3-2-1 technique for present moment awareness</CardDescription>
                  </div>
                  <Button
                    onClick={() => setActiveMode('welcome')}
                    variant="outline"
                    className="font-ui"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Menu
                  </Button>
                </CardHeader>
                <CardContent>
                  <GroundingExercise />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center mt-16 pb-8"
        >
          <div className="border-t border-border pt-8 space-y-6">
            <Card className="bg-red-50/50 border-red-200/50">
              <CardContent className="pt-6">
                <p className="text-red-800 font-medium mb-4">
                  If you're experiencing a mental health crisis, please reach out for immediate help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => setShowCrisis(true)}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 font-ui"
                  >
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    Crisis Resources
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 font-ui"
                  >
                    <a href="tel:988">
                      <Phone className="w-4 h-4 mr-2" />
                      Call 988
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 font-ui"
                  >
                    <a href="sms:741741">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Text 741741
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <p className="text-muted-foreground text-sm font-ui">
              WhisperBox is a supportive tool and not a replacement for professional mental health care.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
} 