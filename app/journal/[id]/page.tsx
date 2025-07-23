'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { analyzeJournalEntry } from '@/lib/whisperBoxAI'
import { WhisperBoxResponse } from '@/lib/types'
import { 
  ArrowLeft, 
  Brain, 
  Calendar, 
  Heart, 
  Sparkles,
  BookOpen,
  Clock,
  Tag,
  Lightbulb,
  LifeBuoy,
  Target,
  CheckCircle2,
  Loader2
} from 'lucide-react'

interface JournalEntry {
  id: string
  title: string
  content: string
  fullContent: string
  journalType: string
  mood: string
  tags: string[]
  emotionalScore: number
  createdAt: string
  aiAnalysis: WhisperBoxResponse | null
  hasAiAnalysis: boolean
}

export default function JournalEntryPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const entryId = params?.id as string
  const shouldAnalyze = searchParams?.get('analyze') === 'true'

  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Fetch the journal entry
  useEffect(() => {
    if (entryId) {
      fetchEntry()
    }
  }, [entryId])

  // Auto-analyze if requested
  useEffect(() => {
    if (entry && shouldAnalyze && !entry.hasAiAnalysis && !analyzing) {
      handleAnalyze()
    }
  }, [entry, shouldAnalyze])

  const fetchEntry = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all entries and find the one we need
      const response = await fetch('/api/journal', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch journal entry')
      }

      const result = await response.json()
      const foundEntry = result.data?.entries?.find((e: any) => e.id === entryId)
      
      if (!foundEntry) {
        throw new Error('Journal entry not found')
      }

      setEntry(foundEntry)
    } catch (error) {
      console.error('Error fetching entry:', error)
      setError('Failed to load journal entry')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = useCallback(async () => {
    if (!entry || analyzing) return

    try {
      setAnalyzing(true)
      setError(null)

      const analysis = await analyzeJournalEntry(entry.fullContent || entry.content)
      
      if (analysis) {
        // Update the entry with the analysis
        setEntry(prev => prev ? {
          ...prev,
          aiAnalysis: analysis,
          hasAiAnalysis: true
        } : null)

        // Update in database by saving with analysis
        await fetch('/api/journal', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: entry.fullContent || entry.content,
            title: entry.title,
            mood: entry.mood,
            tags: entry.tags,
            journalType: entry.journalType,
            isPrivate: true,
            aiAnalysis: analysis
          }),
        })
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Failed to analyze entry. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }, [entry])

  const moodColors = {
    happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    sad: 'bg-blue-100 text-blue-800 border-blue-200',
    anxious: 'bg-purple-100 text-purple-800 border-purple-200',
    calm: 'bg-green-100 text-green-800 border-green-200',
    angry: 'bg-red-100 text-red-800 border-red-200',
    confused: 'bg-gray-100 text-gray-800 border-gray-200',
    grateful: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    hopeful: 'bg-teal-100 text-teal-800 border-teal-200'
  }

  const journalTypeColors = {
    daily: 'bg-whisper-green/10 text-whisper-green border-whisper-green/20',
    crisis: 'bg-red-50 text-red-700 border-red-200',
    gratitude: 'bg-amber-50 text-amber-700 border-amber-200',
    reflection: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    breakthrough: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEmotionalScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="journal-sanctuary min-h-screen bg-gradient-to-br from-whisper-green/5 to-blue-50/30">
          <FeatureNavigation
            title="Loading Entry..."
            description="Retrieving your journal entry"
          />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-whisper-green" />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !entry) {
    return (
      <ProtectedRoute>
        <div className="journal-sanctuary min-h-screen bg-gradient-to-br from-whisper-green/5 to-blue-50/30">
          <FeatureNavigation
            title="Entry Not Found"
            description="Unable to load journal entry"
          />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="text-center">
              <CardContent className="py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || 'Journal entry not found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  The entry you're looking for doesn't exist or couldn't be loaded.
                </p>
                <Button 
                  onClick={() => router.push('/journal')}
                  className="bg-whisper-green hover:bg-whisper-green/90 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Journal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="journal-sanctuary min-h-screen bg-gradient-to-br from-whisper-green/5 to-blue-50/30">
        <FeatureNavigation
          title={entry.title}
          description="Your private journal entry"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/journal')}
              className="text-gray-600 hover:text-whisper-green"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>

            {/* Entry Content */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {entry.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={journalTypeColors[entry.journalType as keyof typeof journalTypeColors] || 'bg-gray-50 text-gray-700'}
                      >
                        {entry.journalType}
                      </Badge>
                      
                      {entry.mood && (
                        <Badge 
                          variant="outline"
                          className={moodColors[entry.mood as keyof typeof moodColors] || 'bg-gray-50 text-gray-700'}
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          {entry.mood}
                        </Badge>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(entry.createdAt)}
                      </div>
                      
                      {entry.emotionalScore && (
                        <div className={`text-sm font-medium ${getEmotionalScoreColor(entry.emotionalScore)}`}>
                          Intensity: {entry.emotionalScore}/10
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {entry.hasAiAnalysis && (
                      <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Analyzed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-6">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                  {entry.fullContent || entry.content}
                </div>

                {/* Analyze Button */}
                {!entry.hasAiAnalysis && (
                  <div className="flex justify-center mb-8">
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing your emotions...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {entry.aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-blue-50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Sparkles className="w-6 h-6 mr-3 text-purple-600" />
                      AI Emotional Analysis
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Validation */}
                    <div className="bg-white/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-whisper-green" />
                        Validation & Support
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {entry.aiAnalysis.supportResponse?.validation}
                      </p>
                    </div>

                    {/* Insights */}
                    <div className="bg-white/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-amber-600" />
                        Emotional Insights
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {entry.aiAnalysis.supportResponse?.insights}
                      </p>
                    </div>

                    {/* Encouragement */}
                    <div className="bg-white/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-600" />
                        Encouragement & Growth
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {entry.aiAnalysis.supportResponse?.encouragement}
                      </p>
                    </div>

                    {/* Crisis Support */}
                    {entry.aiAnalysis.mentalHealthMetrics?.crisisLevel && entry.aiAnalysis.mentalHealthMetrics.crisisLevel > 7 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                          <LifeBuoy className="w-5 h-5 mr-2 text-red-600" />
                          Crisis Support Available
                        </h3>
                        <p className="text-red-800 leading-relaxed mb-4">
                          {entry.aiAnalysis.mentalHealthMetrics.supportNeeded}
                        </p>
                        
                        {entry.aiAnalysis.mentalHealthMetrics.recommendedResources && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-900">Immediate Resources:</h4>
                            {entry.aiAnalysis.mentalHealthMetrics.recommendedResources.map((resource, index) => (
                              <div key={index} className="bg-white/50 rounded p-3">
                                <div className="font-medium text-red-900">{resource.name}</div>
                                <div className="text-sm text-red-700">{resource.contact}</div>
                                <div className="text-xs text-red-600">{resource.availability}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Self-Care Actions */}
                    {entry.aiAnalysis.supportResponse?.selfCareActions && entry.aiAnalysis.supportResponse.selfCareActions.length > 0 && (
                      <div className="bg-white/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                          Recommended Self-Care Actions
                        </h3>
                        <div className="grid gap-3">
                          {entry.aiAnalysis.supportResponse.selfCareActions.slice(0, 3).map((action, index) => (
                            <div key={index} className="bg-white/70 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                                </div>
                                <div className="text-xs text-gray-500 ml-4">
                                  {action.duration}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 