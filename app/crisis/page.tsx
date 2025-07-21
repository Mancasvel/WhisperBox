'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  LifeBuoy,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Heart,
  AlertTriangle,
  Shield
} from 'lucide-react'

// Crisis Resources Data
const CRISIS_RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    type: "hotline",
    contact: "Call or text 988",
    description: "Free, confidential support for people in distress",
    availability: "24/7",
    country: "US",
    language: ["English", "Spanish"],
    urgent: true
  },
  {
    name: "Crisis Text Line",
    type: "text",
    contact: "Text HOME to 741741",
    description: "Free crisis support via text message",
    availability: "24/7",
    country: "US",
    language: ["English"],
    urgent: true
  },
  {
    name: "International Association for Suicide Prevention",
    type: "chat",
    contact: "https://www.iasp.info/resources/Crisis_Centres/",
    description: "Global crisis centers directory",
    availability: "Varies by location",
    country: "Global",
    language: ["Multiple"],
    urgent: false
  },
  {
    name: "Emergency Services",
    type: "emergency",
    contact: "Call 911 (US) or local emergency number",
    description: "Immediate emergency assistance",
    availability: "24/7",
    country: "Global",
    language: ["Local"],
    urgent: true
  }
]

export default function CrisisPage() {
  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

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

  const urgentResources = CRISIS_RESOURCES.filter(resource => resource.urgent)
  const additionalResources = CRISIS_RESOURCES.filter(resource => !resource.urgent)

  return (
    <ProtectedRoute>
      <div className="journal-sanctuary min-h-screen">
        <FeatureNavigation
          title="Crisis Support Resources"
          description="You are not alone. Help is available 24/7"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Crisis Alert Banner */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <Card className="crisis-alert border-red-200/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-xl font-journal font-semibold text-red-800 mb-3">
                      If you're in immediate danger or having thoughts of self-harm
                    </h2>
                    <p className="text-red-700 mb-4 font-ui">
                      Please reach out for help immediately. Your life has value and there are people who want to help you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                        <a href="tel:988">
                          <Phone className="w-4 h-4 mr-2" />
                          Call 988 Now
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                        <a href="sms:741741">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Text 741741
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Immediate Resources */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <LifeBuoy className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-journal font-semibold">Immediate Help</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentResources.map((resource, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="border-red-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          {resource.type === 'hotline' && <Phone className="w-5 h-5 text-red-600" />}
                          {resource.type === 'text' && <MessageCircle className="w-5 h-5 text-red-600" />}
                          {resource.type === 'emergency' && <LifeBuoy className="w-5 h-5 text-red-600" />}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-journal text-red-800">
                            {resource.name}
                          </CardTitle>
                          <CardDescription className="text-red-700 font-ui">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {resource.availability}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-red-900 bg-red-50 p-3 rounded-lg">
                          {resource.contact}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                            {resource.country}
                          </Badge>
                          {resource.language.map((lang, langIndex) => (
                            <Badge key={langIndex} variant="outline" className="text-xs border-red-300 text-red-700">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-8" />

          {/* Additional Resources */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-6 h-6 text-whisper-green-600" />
              <h3 className="text-xl font-journal font-semibold">Additional Resources</h3>
            </div>
            
            <div className="space-y-4">
              {additionalResources.map((resource, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-whisper-green-100 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-whisper-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-journal font-semibold mb-1">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground font-ui mb-2">{resource.description}</p>
                          <div className="text-sm font-medium text-whisper-green-700">
                            {resource.contact}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator className="my-8" />

          {/* Support Message */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-whisper-green-50/20 to-whisper-orange-50/20 border-whisper-green-200/30">
              <CardContent className="p-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex justify-center mb-4"
                >
                  <Heart className="w-12 h-12 text-whisper-green-500" />
                </motion.div>
                <h3 className="text-xl font-journal font-semibold mb-4">Remember</h3>
                <div className="space-y-2 font-ui text-muted-foreground">
                  <p>• You are not alone in this</p>
                  <p>• Reaching out for help is a sign of strength</p>
                  <p>• These feelings will pass</p>
                  <p>• Your life has value and meaning</p>
                  <p>• There are people who want to help</p>
                </div>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5 text-whisper-green-600" />
                  <span className="text-sm font-medium font-ui">Your safety and wellbeing matter</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 