'use client'

import React, { useEffect } from 'react'
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
  Loader2,
  Zap,
  Stars,
  Cpu,
  Globe
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-xl"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading WhisperBox...</h3>
          <p className="text-gray-600">
            Preparing your wellness journey
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
      title: 'AI-Enhanced Journaling',
      description: 'Express your thoughts in a secure space with intelligent emotional analysis and personalized insights',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: 'Interactive Wellness',
      description: 'Immersive breathing exercises with beautiful animations to reduce anxiety and promote calm',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Smart Grounding',
      description: 'Adaptive 5-4-3-2-1 sensory technique with guided interactions for presence and centering',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: <LifeBuoy className="w-8 h-8" />,
      title: 'Instant Crisis Support',
      description: 'Immediate access to curated mental health resources with 24/7 professional support lines',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const benefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption with zero-knowledge architecture. Your thoughts remain completely private.',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'Advanced AI Intelligence',
      description: 'Trauma-informed AI companion trained in therapeutic principles for compassionate support.',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <Stars className="w-8 h-8" />,
      title: 'Evidence-Based Design',
      description: 'Techniques rooted in CBT, DBT, and mindfulness practices validated by mental health professionals.',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Always Accessible',
      description: 'Progressive web app works offline, installs on any device, and provides 24/7 support.',
      gradient: 'from-amber-400 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Modern Hero Section */}
        <motion.section 
          className="text-center mb-20"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-20 left-1/4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
            />
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-32 right-1/3 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-40"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              
              
              <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200 text-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <Zap className="w-4 h-4 mr-2" />
                Katy Youth Hacks 2025 • AI-Powered Mental Wellness
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Where{' '}
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Technology
                </span>
                <br />
                Meets{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Compassion
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
                Experience the future of mental wellness with WhisperBox – an AI-enhanced platform that combines 
                cutting-edge technology with evidence-based therapeutic approaches to create your personal sanctuary for healing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  onClick={() => router.push('/auth/login')}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Heart className="w-6 h-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-700 px-10 py-4 rounded-2xl text-lg font-semibold"
                >
                  Sign In
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  End-to-End Encrypted
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Insights
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Trauma-Informed Care
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-20"
        >
          {/* Features Section */}
          <motion.section 
            variants={fadeIn}
            className="relative"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Innovative Features for{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Mental Wellness
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover cutting-edge tools designed to support your emotional journey with compassion and intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden group">
                    <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
                    <CardHeader className="bg-gradient-to-br from-green-50/50 via-blue-50/50 to-purple-50/50 border-b border-white/40 p-8">
                      <div className="flex items-start space-x-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</CardTitle>
                          <CardDescription className="text-gray-600 leading-relaxed text-lg">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section 
            variants={fadeIn}
            className="relative"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  WhisperBox
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built with advanced technology and compassionate design principles for the most effective mental health support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group">
                    <div className={`h-1 bg-gradient-to-r ${benefit.gradient}`} />
                    <CardHeader className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
                      <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {React.cloneElement(benefit.icon, { className: "w-8 h-8 text-white" })}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Final CTA Section */}
          <motion.section
            variants={fadeIn}
            className="relative"
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" />
              <CardContent className="bg-gradient-to-br from-green-50/50 via-blue-50/50 to-purple-50/50 p-12 text-center">
                <div className="max-w-4xl mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-xl mx-auto mb-8">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 mb-6">
                    Ready to Transform Your{' '}
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Mental Wellness Journey?
                    </span>
                  </h3>
                  
                  <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Join thousands who have discovered healing through our innovative AI-powered platform. 
                    Your emotional wellbeing starts with a single entry. Begin your transformation today.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Button
                      onClick={() => router.push('/auth/login')}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <Heart className="w-6 h-6 mr-3" />
                      Start Your Healing Journey
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      100% Free
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      No Credit Card Required
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Start Immediately
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>

        {/* Modern Footer */}
        <motion.footer 
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mt-20 pb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl" />
            <Card className="relative border-0 shadow-lg bg-white/60 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Logo 
                    size="md" 
                    showText={true}
                    textClassName="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                    className="items-center"
                  />
                </div>
                
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                  WhisperBox is a supportive tool and not a replacement for professional mental health care. 
                  If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.
                </p>
                
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <span>© 2025 WhisperBox</span>
                  <span>•</span>
                  <span>Created by Manuel Castillejo</span>
                  <span>•</span>
                  <span>Katy Youth Hacks 2025</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.footer>
      </div>
    </div>
  )
} 