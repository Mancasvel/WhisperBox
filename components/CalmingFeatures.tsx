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
  X,
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  Target,
  Lightbulb,
  Sparkles
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
      className="p-8"
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">4-7-8 Breathing</h2>
              <p className="text-gray-600 text-left">
                A calming breathing technique to reduce anxiety and promote relaxation
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-10">
        {/* Breathing Circle */}
        <div className="relative">
          <motion.div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 shadow-2xl flex items-center justify-center"
            animate={{
              scale: phase === 'inhale' ? 1.1 : phase === 'hold' ? 1.1 : 0.9,
              boxShadow: phase === 'inhale' || phase === 'hold' ? 
                "0 25px 50px -12px rgba(59, 130, 246, 0.5)" : 
                "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            transition={{
              duration: phaseDurations[phase],
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-40 h-40 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-inner"
              animate={{
                scale: phase === 'inhale' ? 1.05 : phase === 'hold' ? 1.05 : 0.95,
              }}
            >
              <div className="lottie-container">
                <Lottie 
                  animationData={breathingAnimation} 
                  loop 
                  autoplay={isActive}
                  style={{ width: 100, height: 100 }}
                />
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="text-center text-white">
              <div className="text-xl font-bold drop-shadow-lg">{phaseLabels[phase]}</div>
              <div className="text-lg opacity-90 drop-shadow-md">{phaseDurations[phase] - timer}s</div>
            </div>
          </motion.div>
        </div>

        {/* Phase Progress */}
        <div className="w-full max-w-md">
          <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">{phaseLabels[phase]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">{cycle + 1}</span>
                </div>
                <span className="text-sm text-gray-600">of {totalCycles}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Current Phase</span>
                  <span>{Math.round(phaseProgress)}%</span>
                </div>
                <Progress value={phaseProgress} className="h-3 bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          {!isActive ? (
            <Button
              onClick={startExercise}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-3" />
              Begin Exercise
            </Button>
          ) : (
            <Button
              onClick={pauseExercise}
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-700 px-8 py-4 rounded-2xl font-semibold"
            >
              <Pause className="w-5 h-5 mr-3" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={resetExercise}
            size="lg"
            variant="outline"
            className="border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-700 px-8 py-4 rounded-2xl font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 rounded-2xl p-6 max-w-lg shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">How It Works</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">4</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Inhale</div>
                  <div className="text-sm text-gray-600">Through your nose</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">7</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Hold</div>
                  <div className="text-sm text-gray-600">Keep your breath</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">8</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Exhale</div>
                  <div className="text-sm text-gray-600">Through your mouth</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">2</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rest</div>
                  <div className="text-sm text-gray-600">Before repeating</div>
                </div>
              </div>
            </div>
          </div>
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
      className="p-8"
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">5-4-3-2-1 Grounding</h2>
              <p className="text-gray-600 text-left">
                Ground yourself in the present moment using your five senses
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {!isStarted ? (
        <div className="text-center space-y-10">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 shadow-2xl flex items-center justify-center mx-auto">
            <div className="w-40 h-40 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <div className="lottie-container">
                <Lottie 
                  animationData={calmWaveAnimation} 
                  loop 
                  autoplay
                  style={{ width: 120, height: 120 }}
                />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 rounded-2xl p-6 max-w-lg mx-auto shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">This exercise helps you:</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-700">Reduce anxiety and panic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <span className="text-gray-700">Connect with the present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <span className="text-gray-700">Calm racing thoughts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                </div>
                <span className="text-gray-700">Feel grounded and stable</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsStarted(true)}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-lg"
          >
            Begin Exercise
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Progress */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">{completedSteps.length}</span>
                </div>
                <span className="text-sm text-gray-600">of {steps.length}</span>
              </div>
            </div>
            <Progress value={progress} className="h-3 bg-gray-100" />
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
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                <CardHeader className="text-center p-8">
                  <div className="flex items-center justify-center space-x-6 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                      {steps[currentStep].icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {steps[currentStep].number} {steps[currentStep].title}
                      </CardTitle>
                      <p className="text-lg text-gray-600 mt-2">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-semibold text-gray-900">Examples to help you:</p>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {steps[currentStep].examples.map((example, index) => (
                          <Badge key={index} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200 px-3 py-1">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                      {completedSteps.includes(currentStep) ? (
                        <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 text-lg font-semibold rounded-2xl shadow-lg">
                          ✓ Completed
                        </Badge>
                      ) : (
                        <Button
                          onClick={handleStepComplete}
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
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
          <div className="text-center space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="flex items-center justify-center space-x-6">
              <Button 
                onClick={resetExercise} 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-700 px-8 py-4 rounded-2xl font-semibold"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Start Over
              </Button>
              
              {completedSteps.length === steps.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Exercise Complete!</h4>
                        <p className="text-gray-600">You've successfully grounded yourself</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Crisis Support Resources
                    </h2>
                    <p className="text-white/90">
                      Professional help is available 24/7. You are not alone.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-xl"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Quick Access Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold h-14">
                  <a href="tel:988">
                    <Phone className="w-5 h-5 mr-3" />
                    Call 988 Now
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 h-14">
                  <a href="sms:741741">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Text HOME to 741741
                  </a>
                </Button>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {CRISIS_RESOURCES.map((resource, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full">
                      <div className="h-1 bg-gradient-to-r from-orange-400 to-red-400"></div>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            {resource.type === 'hotline' && <Phone className="w-6 h-6 text-orange-600" />}
                            {resource.type === 'text' && <MessageCircle className="w-6 h-6 text-orange-600" />}
                            {resource.type === 'chat' && <Globe className="w-6 h-6 text-orange-600" />}
                            {resource.type === 'emergency' && <LifeBuoy className="w-6 h-6 text-orange-600" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {resource.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {resource.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-gray-700">
                                <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                                  <Clock className="w-3 h-3 text-orange-600" />
                                </div>
                                <span className="text-sm font-medium">
                                  {resource.availability}
                                </span>
                              </div>
                              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-3 rounded-lg">
                                <div className="font-bold text-gray-900">
                                  {resource.contact}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {resource.country}
                                </Badge>
                                {resource.language.map((lang, langIndex) => (
                                  <Badge key={langIndex} variant="outline" className="border-gray-300 text-gray-700 text-xs">
                                    <Globe className="w-3 h-3 mr-1" />
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Supportive Message */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">You Matter</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Users className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm">You are not alone in this journey</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700 text-sm">Seeking help shows incredible strength</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                          <Heart className="w-3 h-3 text-purple-600" />
                        </div>
                        <span className="text-gray-700 text-sm">Your life has immense value and purpose</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Professional Support Available
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Crisis situations are temporary. With the right support, 
                        you can navigate through this difficult time toward healing and hope.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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