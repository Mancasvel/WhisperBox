'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { Dialog } from '@headlessui/react'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// Icons
import { 
  Heart, 
  Wind, 
  Eye, 
  Hand, 
  Ear, 
  Brain,
  LifeBuoy,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Play,
  Pause,
  RotateCcw,
  X
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
    language: ["English", "Spanish"]
  },
  {
    name: "Crisis Text Line",
    type: "text",
    contact: "Text HOME to 741741",
    description: "Free crisis support via text message",
    availability: "24/7",
    country: "US",
    language: ["English"]
  },
  {
    name: "International Association for Suicide Prevention",
    type: "chat",
    contact: "https://www.iasp.info/resources/Crisis_Centres/",
    description: "Global crisis centers directory",
    availability: "Varies by location",
    country: "Global",
    language: ["Multiple"]
  },
  {
    name: "Emergency Services",
    type: "emergency",
    contact: "Call 911 (US) or local emergency number",
    description: "Immediate emergency assistance",
    availability: "24/7",
    country: "Global",
    language: ["Local"]
  }
]

// Lottie animation placeholders
const breathingAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Breathing",
  ddd: 0,
  assets: [],
  layers: []
}

const calmWaveAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 150,
  h: 150,
  nm: "CalmWave",
  ddd: 0,
  assets: [],
  layers: []
}

// Breathing Exercise Component
export const BreathingExercise: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale')
  const [timer, setTimer] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [totalCycles] = useState(4)

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 2
  }

  const phaseLabels = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest'
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          const currentPhaseDuration = phaseDurations[phase]
          
          if (prev >= currentPhaseDuration - 1) {
            // Move to next phase
            if (phase === 'inhale') setPhase('hold')
            else if (phase === 'hold') setPhase('exhale')
            else if (phase === 'exhale') setPhase('rest')
            else if (phase === 'rest') {
              setPhase('inhale')
              setCycle(c => c + 1)
            }
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, phase])

  const startExercise = () => {
    setIsActive(true)
    setPhase('inhale')
    setTimer(0)
    setCycle(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase('inhale')
    setTimer(0)
    setCycle(0)
  }

  const progress = (cycle / totalCycles) * 100
  const phaseProgress = (timer / phaseDurations[phase]) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-journal font-semibold">4-7-8 Breathing</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          A calming breathing technique to reduce anxiety and promote relaxation
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        {/* Breathing Circle */}
        <div className="relative">
          <motion.div
            className="breathing-circle"
            animate={{
              scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 0.8,
            }}
            transition={{
              duration: phaseDurations[phase],
              ease: "easeInOut"
            }}
          >
            <div className="lottie-container">
              <Lottie 
                animationData={breathingAnimation} 
                loop 
                autoplay={isActive}
                style={{ width: 120, height: 120 }}
              />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="text-center text-white">
              <div className="text-lg font-semibold">{phaseLabels[phase]}</div>
              <div className="text-sm opacity-80">{phaseDurations[phase] - timer}s</div>
            </div>
          </motion.div>
        </div>

        {/* Phase Progress */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{phaseLabels[phase]}</span>
            <span className="text-sm text-muted-foreground">
              {cycle + 1}/{totalCycles}
            </span>
          </div>
          <Progress value={phaseProgress} className="h-2 mb-4" />
          <Progress value={progress} className="h-1" />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {!isActive ? (
            <Button
              onClick={startExercise}
              className="bg-gradient-to-r from-emotional-calm-500 to-emotional-healing-500 hover:from-emotional-calm-600 hover:to-emotional-healing-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={pauseExercise}
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={resetExercise}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-card/50 rounded-xl p-4 max-w-md">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Inhale</strong> through your nose for 4 seconds</li>
            <li>• <strong>Hold</strong> your breath for 7 seconds</li>
            <li>• <strong>Exhale</strong> through your mouth for 8 seconds</li>
            <li>• <strong>Rest</strong> for 2 seconds before repeating</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// Grounding Exercise Component
export const GroundingExercise: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isStarted, setIsStarted] = useState(false)

  const steps = [
    {
      number: 5,
      sense: 'see',
      icon: <Eye className="w-6 h-6" />,
      title: 'Things you can see',
      description: 'Look around and name 5 things you can see',
      examples: ['a window', 'your hands', 'a book', 'the ceiling', 'your phone']
    },
    {
      number: 4,
      sense: 'touch',
      icon: <Hand className="w-6 h-6" />,
      title: 'Things you can touch',
      description: 'Find 4 things you can feel or touch',
      examples: ['your clothing', 'a table surface', 'your hair', 'a pillow']
    },
    {
      number: 3,
      sense: 'hear',
      icon: <Ear className="w-6 h-6" />,
      title: 'Things you can hear',
      description: 'Listen carefully and identify 3 sounds',
      examples: ['traffic outside', 'your breathing', 'air conditioning']
    },
    {
      number: 2,
      sense: 'smell',
      icon: <Wind className="w-6 h-6" />,
      title: 'Things you can smell',
      description: 'Notice 2 different scents',
      examples: ['coffee', 'fresh air', 'soap', 'food']
    },
    {
      number: 1,
      sense: 'taste',
      icon: <Heart className="w-6 h-6" />,
      title: 'Thing you can taste',
      description: 'Focus on 1 taste in your mouth',
      examples: ['mint from gum', 'coffee', 'water', 'your natural taste']
    }
  ]

  const handleStepComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep])
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const resetExercise = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsStarted(false)
  }

  const progress = (completedSteps.length / steps.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-journal font-semibold">5-4-3-2-1 Grounding</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Ground yourself in the present moment using your five senses
        </p>
      </div>

      {!isStarted ? (
        <div className="text-center space-y-6">
          <div className="lottie-container">
            <Lottie 
              animationData={calmWaveAnimation} 
              loop 
              autoplay
              style={{ width: 150, height: 150 }}
            />
          </div>
          <div className="bg-card/50 rounded-xl p-6 max-w-md mx-auto">
            <h3 className="font-medium mb-3">This exercise helps you:</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Reduce anxiety and panic</li>
              <li>• Connect with the present moment</li>
              <li>• Calm racing thoughts</li>
              <li>• Feel more grounded and stable</li>
            </ul>
          </div>
          <Button
            onClick={() => setIsStarted(true)}
            className="bg-gradient-to-r from-emotional-calm-500 to-emotional-healing-500 hover:from-emotional-calm-600 hover:to-emotional-healing-600"
          >
            Begin Exercise
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length}/{steps.length} complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-emotional-calm-200/50">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-emotional-calm-100 flex items-center justify-center text-emotional-calm-600">
                      {steps[currentStep].icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {steps[currentStep].number} {steps[currentStep].title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="bg-emotional-calm-50/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Examples:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {steps[currentStep].examples.map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-3">
                      {completedSteps.includes(currentStep) ? (
                        <Badge className="bg-emotional-healing-500">
                          ✓ Completed
                        </Badge>
                      ) : (
                        <Button
                          onClick={handleStepComplete}
                          className="bg-gradient-to-r from-emotional-calm-500 to-emotional-healing-500 hover:from-emotional-calm-600 hover:to-emotional-healing-600"
                        >
                          I've identified {steps[currentStep].number}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3">
            <Button onClick={resetExercise} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            
            {completedSteps.length === steps.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Badge className="bg-emotional-healing-500 px-4 py-2">
                  🎉 Exercise Complete!
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Crisis Support Component
export const CrisisSupport: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="crisis-alert max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <LifeBuoy className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-journal font-semibold text-red-800">
                    Crisis Support Resources
                  </h2>
                  <p className="text-sm text-red-700">
                    You are not alone. Help is available 24/7.
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {CRISIS_RESOURCES.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-red-200 rounded-xl p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      {resource.type === 'hotline' && <Phone className="w-5 h-5 text-red-600" />}
                      {resource.type === 'text' && <MessageCircle className="w-5 h-5 text-red-600" />}
                      {resource.type === 'chat' && <Globe className="w-5 h-5 text-red-600" />}
                      {resource.type === 'emergency' && <LifeBuoy className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-800 mb-1">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-red-700 mb-2">
                        {resource.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {resource.availability}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-red-900">
                          {resource.contact}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-2">
                Remember:
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• You are not alone in this</li>
                <li>• Reaching out for help is a sign of strength</li>
                <li>• These feelings will pass</li>
                <li>• Your life has value and meaning</li>
                <li>• There are people who want to help</li>
              </ul>
            </div>
          </motion.div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

// Quick Calm Button Component
export const QuickCalmButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<'breathing' | 'grounding' | 'crisis' | null>(null)

  const features = [
    {
      id: 'breathing' as const,
      name: 'Breathing',
      icon: <Wind className="w-4 h-4" />,
      description: '4-7-8 Technique'
    },
    {
      id: 'grounding' as const,
      name: 'Grounding',
      icon: <Brain className="w-4 h-4" />,
      description: '5-4-3-2-1 Exercise'
    },
    {
      id: 'crisis' as const,
      name: 'Crisis Support',
      icon: <LifeBuoy className="w-4 h-4" />,
      description: 'Get Help Now'
    }
  ]

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emotional-calm-500 to-emotional-healing-500 hover:from-emotional-calm-600 hover:to-emotional-healing-600 shadow-lg"
        >
          <Heart className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Quick Actions Menu */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-journal font-semibold">Quick Calm</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose a technique to center yourself
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {features.map((feature) => (
                  <motion.button
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveFeature(feature.id)
                      setIsOpen(false)
                    }}
                    className="w-full p-4 bg-card border border-border rounded-xl hover:border-emotional-calm-300 hover:bg-emotional-calm-50/10 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-emotional-calm-100 flex items-center justify-center text-emotional-calm-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Feature Modals */}
      <Dialog open={activeFeature === 'breathing'} onClose={() => setActiveFeature(null)}>
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-card border border-border rounded-2xl max-w-lg w-full">
            <BreathingExercise onClose={() => setActiveFeature(null)} />
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={activeFeature === 'grounding'} onClose={() => setActiveFeature(null)}>
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-card border border-border rounded-2xl max-w-lg w-full">
            <GroundingExercise onClose={() => setActiveFeature(null)} />
          </Dialog.Panel>
        </div>
      </Dialog>

      <CrisisSupport 
        isOpen={activeFeature === 'crisis'} 
        onClose={() => setActiveFeature(null)} 
      />
    </>
  )
} 