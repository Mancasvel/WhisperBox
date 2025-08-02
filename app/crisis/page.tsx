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
  Shield,
  Headphones,
  HelpCircle,
  Users,
  MapPin
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <FeatureNavigation
          title="Crisis Support Resources"
          description="You are not alone. Professional help is available 24/7"
        />

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Crisis Alert Banner */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mb-10"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
              <CardContent className="p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                      Immediate Support Available
                    </h2>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                      If you're in immediate danger or having thoughts of self-harm, please reach out for help right now. 
                      Your life has value and there are trained professionals ready to support you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg rounded-2xl px-8 py-4">
                        <a href="tel:988">
                          <Phone className="w-5 h-5 mr-3" />
                          Call 988 Now
                        </a>
                      </Button>
                      <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold shadow-lg rounded-2xl px-8 py-4">
                        <a href="sms:741741">
                          <MessageCircle className="w-5 h-5 mr-3" />
                          Text HOME to 741741
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
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <LifeBuoy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Crisis Hotlines</h3>
                <p className="text-gray-600 text-lg">Available 24/7 for immediate support</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {urgentResources.map((resource, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                    <CardHeader className="pb-4 pt-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-b border-white/40">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          {resource.type === 'hotline' && <Phone className="w-8 h-8 text-white" />}
                          {resource.type === 'text' && <MessageCircle className="w-8 h-8 text-white" />}
                          {resource.type === 'emergency' && <LifeBuoy className="w-8 h-8 text-white" />}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                            {resource.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 text-lg leading-relaxed">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 text-gray-700">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-lg">
                            {resource.availability}
                          </span>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 p-6 rounded-2xl shadow-sm">
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            {resource.contact}
                          </div>
                          <div className="text-gray-600 text-lg">
                            {resource.type === 'hotline' ? 'Call now for immediate support' : 
                             resource.type === 'text' ? 'Text for confidential help' : 
                             'Emergency assistance available'}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200 hover:bg-purple-200 px-3 py-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {resource.country}
                          </Badge>
                          {resource.language.map((lang, langIndex) => (
                            <Badge key={langIndex} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:bg-blue-200 px-3 py-1">
                              <Globe className="w-3 h-3 mr-1" />
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

          <div className="flex items-center justify-center my-12">
            <div className="flex items-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
              <HelpCircle className="w-6 h-6 text-gray-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            </div>
          </div>

          {/* Additional Resources */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Additional Support</h3>
                <p className="text-gray-600 text-lg">Extended resources and directories</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {additionalResources.map((resource, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Globe className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-3">{resource.name}</h4>
                          <p className="text-gray-600 mb-4 leading-relaxed text-lg">{resource.description}</p>
                          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 p-4 rounded-2xl shadow-sm">
                            <div className="text-blue-800 font-semibold text-lg">
                              {resource.contact.startsWith('http') ? (
                                <a 
                                  href={resource.contact} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center"
                                >
                                  Visit Directory
                                  <Globe className="w-5 h-5 ml-2" />
                                </a>
                              ) : (
                                resource.contact
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 mt-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-gray-700 font-medium">{resource.availability}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-indigo-600" />
                              </div>
                              <span className="text-gray-700 font-medium">{resource.country}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-center my-12">
            <div className="flex items-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-32"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-32"></div>
            </div>
          </div>

          {/* Support Message */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-blue-100/30 to-purple-100/30"></div>
              <CardContent className="p-10 relative z-10">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-6">You Matter</h3>
                
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">You are not alone in this journey</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Headphones className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700">Professional support is always available</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-gray-700">Your life has immense value and purpose</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-gray-700">Seeking help shows incredible strength</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-gray-700">Difficult feelings are temporary</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-gray-700">A supportive community surrounds you</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        Your Safety & Wellbeing Are Our Priority
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Remember that crisis situations are temporary, and with the right support, 
                      you can navigate through this difficult time toward healing and hope.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 