'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/ui/Logo'
import { 
  Heart, 
  Edit3, 
  Wind, 
  Brain, 
  LifeBuoy, 
  Shield, 
  Sparkles, 
  Leaf,
  ArrowRight,
  Loader2
} from 'lucide-react'

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [loading, isAuthenticated, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="journal-sanctuary min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-emotional-calm-500 mx-auto" />
            </motion.div>
          </div>
          <p className="text-muted-foreground font-ui">
            Loading WhisperBox...
          </p>
        </motion.div>
      </div>
    )
  }

  // Don't render anything if authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

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
      icon: <Edit3 className="w-8 h-8" />,
      title: 'Emotional Journaling',
      description: 'Express your thoughts freely in a safe, private space with AI insights',
      gradient: 'from-whisper-green-500 to-whisper-green-600'
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: 'Breathing Exercises',
      description: 'Guided breathing techniques to reduce anxiety and promote calm',
      gradient: 'from-whisper-orange-500 to-whisper-green-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Grounding Exercises',
      description: '5-4-3-2-1 technique to help you feel present and centered',
      gradient: 'from-whisper-green-600 to-whisper-orange-500'
    },
    {
      icon: <LifeBuoy className="w-8 h-8" />,
      title: 'Crisis Support',
      description: 'Immediate access to mental health resources and support lines',
      gradient: 'from-red-500 to-orange-500'
    }
  ]

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-whisper-green-600" />,
      title: 'Private & Secure',
      description: 'Your data is encrypted and stays private. Only you can access your entries.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-whisper-orange-600" />,
      title: 'AI-Powered Insights',
      description: 'Compassionate AI provides emotional analysis and personalized wellness suggestions.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-whisper-green-600" />,
      title: 'Evidence-Based',
      description: 'Techniques grounded in psychology and mental health best practices.'
    }
  ]

  return (
    <div className="journal-sanctuary min-h-screen">
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
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Logo 
                size="xl" 
                showText={true}
                textClassName="text-5xl font-journal font-bold bg-gradient-to-r from-whisper-green-600 to-whisper-green-700 bg-clip-text text-transparent mb-2"
                className="items-center"
              />
            </motion.div>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="emotion-badge healing mt-2">
                <Heart className="w-3 h-3 mr-1" />
                Mental Wellness Companion
              </Badge>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-ui leading-relaxed">
            Your private mental health companion. A secure space for emotional journaling with AI-powered insights and compassionate support.
          </p>
        </motion.header>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          {/* Quick Start Section */}
          <motion.div 
            variants={fadeIn}
            className="relative"
          >
            <Card className="bg-gradient-to-br from-whisper-green-500/10 to-whisper-green-600/10 border-whisper-green-200/30">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-whisper-green-500" />
                  </motion.div>
                </div>
                <CardTitle className="text-3xl font-journal mb-4">Ready to Begin Your Wellness Journey?</CardTitle>
                <CardDescription className="text-lg font-ui text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join thousands who have found peace and healing through our compassionate AI-powered mental health platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/auth/login')}
                    size="lg"
                    className="bg-gradient-to-r from-whisper-green-500 to-whisper-green-600 hover:from-whisper-green-600 hover:to-whisper-green-700 text-white font-ui shadow-xl"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="outline"
                    size="lg"
                    className="font-ui border-whisper-green-300 hover:bg-whisper-green-50"
                  >
                    Sign In
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground font-ui">
                  No payment required • Secure magic link authentication • Start writing immediately
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-border/50 hover:border-whisper-green-300/50 transition-all duration-300">
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
                <Card className="text-center h-full border-border/50 hover:border-whisper-green-300/50 transition-all duration-300">
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

          {/* Final CTA */}
          <motion.div
            variants={fadeIn}
            className="text-center"
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-journal font-semibold mb-4">
                  Take the first step toward emotional wellbeing
                </h3>
                <p className="text-muted-foreground font-ui mb-6 max-w-2xl mx-auto">
                  Your mental health journey starts with a single entry. Join our compassionate community and discover the healing power of guided emotional expression.
                </p>
                <Button
                  onClick={() => router.push('/auth/login')}
                  size="lg"
                  className="bg-gradient-to-r from-whisper-green-500 to-whisper-green-600 hover:from-whisper-green-600 hover:to-whisper-green-700 text-white font-ui shadow-xl"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start Your Healing Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center mt-16 pb-8"
        >
          <div className="border-t border-border pt-8 space-y-6">
            <p className="text-muted-foreground text-sm font-ui">
              WhisperBox is a supportive tool and not a replacement for professional mental health care.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
} 