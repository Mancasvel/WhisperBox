'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Lottie from 'lottie-react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Dynamic import for SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(
  () => {
    // Import CSS when component loads
    if (typeof window !== 'undefined') {
      require('easymde/dist/easymde.min.css')
    }
    return import('react-simplemde-editor')
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[400px] p-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    ),
  }
)

// Icons (using existing or you can install lucide-react)
import { 
  Heart, 
  Sparkles, 
  Send, 
  Save, 
  Brain, 
  Lightbulb,
  Clock,
  Target,
  BookOpen,
  LifeBuoy,
  Zap
} from 'lucide-react'

import { WhisperBoxResponse } from '@/lib/types'

interface JournalEntry {
  id?: string
  title: string
  content: string
  mood: string
  tags: string[]
  emotionalScore: number
  createdAt: Date
  aiAnalysis?: AIAnalysis
}

type AIAnalysis = WhisperBoxResponse

interface JournalInterfaceProps {
  onSave?: (entry: JournalEntry) => void
  onAnalyze?: (content: string) => Promise<AIAnalysis | null>
  initialEntry?: Partial<JournalEntry>
  className?: string
}

const moods = [
  { name: 'Peaceful', emoji: '😌', color: 'calm' },
  { name: 'Anxious', emoji: '😟', color: 'warm' },
  { name: 'Grateful', emoji: '🙏', color: 'healing' },
  { name: 'Overwhelmed', emoji: '😰', color: 'warm' },
  { name: 'Hopeful', emoji: '🌟', color: 'healing' },
  { name: 'Sad', emoji: '😢', color: 'calm' },
  { name: 'Excited', emoji: '🤗', color: 'healing' },
  { name: 'Confused', emoji: '🤔', color: 'warm' },
]

const journalPrompts = [
  "What am I feeling right now, and where do I feel it in my body?",
  "What would I tell my best friend if they were going through this?",
  "What am I grateful for today, even in the midst of difficulty?",
  "What do I need most right now to feel safe and supported?",
  "How have I grown stronger through past challenges?",
  "What small act of kindness could I offer myself today?"
]

// Lottie animation data (you would import actual JSON files)
const heartAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Heart",
  ddd: 0,
  assets: [],
  layers: []
}

export default function JournalInterface({ 
  onSave, 
  onAnalyze, 
  initialEntry,
  className = "" 
}: JournalInterfaceProps) {
  const [entry, setEntry] = useState<JournalEntry>({
    title: initialEntry?.title || '',
    content: initialEntry?.content || '',
    mood: initialEntry?.mood || '',
    tags: initialEntry?.tags || [],
    emotionalScore: initialEntry?.emotionalScore || 0,
    createdAt: new Date()
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)

  const [wordCount, setWordCount] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showPrompts, setShowPrompts] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [startTime] = useState(Date.now())

  const simpleMDERef = useRef<any>(null)

  // Time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // Word count tracking
  useEffect(() => {
    const words = entry.content.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }, [entry.content])

  const handleContentChange = useCallback((value: string) => {
    setEntry(prev => ({ ...prev, content: value }))
  }, [])

  const handleMoodSelect = (mood: string) => {
    setEntry(prev => ({ ...prev, mood }))
  }

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt)
    setEntry(prev => ({ 
      ...prev, 
      content: prev.content + (prev.content ? '\n\n' : '') + prompt + '\n\n'
    }))
    setShowPrompts(false)
  }

  const handleAnalyze = async () => {
    if (!entry.content.trim() || !onAnalyze || !onSave) return

    setIsAnalyzing(true)
    try {
      // First get AI analysis
      const analysis = await onAnalyze(entry.content)
      if (analysis) {
        setAiAnalysis(analysis)
        // Save the entry with AI analysis
        await onSave({
          ...entry,
          aiAnalysis: analysis
        })
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(entry)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const simpleMDEOptions = {
    spellChecker: false,
    placeholder: "Begin writing your thoughts... This is your sacred space for emotional expression.",
    toolbar: false,
    status: false,
    autofocus: true
  }

  return (
    <div className={`journal-sanctuary min-h-screen p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="relative inline-block">
            <h1 className="text-4xl font-journal font-semibold text-foreground mb-2">
              Your Sacred Journal
            </h1>
            <div className="absolute -top-2 -right-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-emotional-calm-400" />
              </motion.div>
            </div>
          </div>
          <p className="text-muted-foreground font-ui">
            A space for emotional healing and self-discovery
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-ui">{formatTime(timeSpent)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-ui">{wordCount} words</span>
                  </div>
                  {entry.mood && (
                    <Badge variant="secondary" className={`emotion-badge ${moods.find(m => m.name === entry.mood)?.color || 'calm'}`}>
                      {moods.find(m => m.name === entry.mood)?.emoji} {entry.mood}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPrompts(true)}
                    className="font-ui"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Prompts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Journal Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="journal-editor-container">
                <SimpleMDE
                  ref={simpleMDERef}
                  value={entry.content}
                  onChange={handleContentChange}
                  options={simpleMDEOptions}
                  className="journal-editor"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-journal font-medium">How are you feeling?</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood.name)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      entry.mood === mood.name
                        ? 'border-whisper-green-400 bg-whisper-green-50/20'
                        : 'border-border hover:border-whisper-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-ui">{mood.name}</div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSave}
              variant="outline"
              className="font-ui"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </div>

          <div className="flex items-center space-x-3">

            <Button
              onClick={handleAnalyze}
              disabled={!entry.content.trim() || isAnalyzing}
              className="bg-gradient-to-r from-whisper-green-500 to-whisper-green-600 hover:from-whisper-green-600 hover:to-whisper-green-700 font-ui"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Inline AI Analysis Results */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Card className="ai-reflection border-whisper-green-200/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="lottie-container w-10 h-10">
                    <Lottie animationData={heartAnimation} loop autoplay />
                  </div>
                  <div>
                    <h3 className="text-lg font-journal font-semibold">AI Reflection</h3>
                    <p className="text-sm text-muted-foreground">Compassionate insights for your journey</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Validation */}
                  <div>
                    <h4 className="font-medium mb-3 text-whisper-green-600 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Validation
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{aiAnalysis.supportResponse.validation}</p>
                  </div>
                  
                  <Separator />
                  
                  {/* Insights */}
                  <div>
                    <h4 className="font-medium mb-3 text-whisper-green-600 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Insights
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{aiAnalysis.supportResponse.insights}</p>
                  </div>
                  
                  <Separator />
                  
                  {/* Encouragement */}
                  <div>
                    <h4 className="font-medium mb-3 text-whisper-orange-600 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Encouragement
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{aiAnalysis.supportResponse.encouragement}</p>
                  </div>

                  {/* Crisis Support if needed */}
                  {aiAnalysis.mentalHealthMetrics.crisisLevel > 7 && (
                    <>
                      <Separator />
                      <div className="crisis-alert">
                        <div className="flex items-start space-x-3">
                          <LifeBuoy className="w-6 h-6 text-red-600 mt-1" />
                          <div>
                            <h4 className="font-medium text-red-800 mb-2">Crisis Support Available</h4>
                            <p className="text-sm text-red-700 mb-3">
                              It seems like you might be going through a particularly difficult time. 
                              Remember, you're not alone, and help is available.
                            </p>
                            <div className="space-y-2">
                              {aiAnalysis.mentalHealthMetrics.recommendedResources.map((resource, index) => (
                                <div key={index} className="text-sm">
                                  <strong>{resource.name}</strong> - {resource.contact}
                                  <br />
                                  <span className="text-red-600">{resource.availability}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Prompts Modal */}
        <Dialog open={showPrompts} onClose={() => setShowPrompts(false)}>
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-journal font-medium">Journal Prompts</h3>
                  <Button variant="ghost" onClick={() => setShowPrompts(false)}>
                    ×
                  </Button>
                </div>
                <div className="space-y-3">
                  {journalPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      onClick={() => handlePromptSelect(prompt)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-whisper-green-300 hover:bg-whisper-green-50/10 transition-all duration-200"
                    >
                      <p className="text-sm font-ui">{prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </motion.div>
    </div>
  )
} 