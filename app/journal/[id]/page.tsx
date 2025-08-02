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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <FeatureNavigation
            title="Loading Entry..."
            description="Retrieving your journal entry"
          />
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading your thoughts...</h3>
                <p className="text-gray-600">Just a moment while we retrieve your journal entry</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !entry) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <FeatureNavigation
            title="Entry Not Found"
            description="Unable to load journal entry"
          />
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {error || 'Journal entry not found'}
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    The entry you're looking for doesn't exist or couldn't be loaded. It may have been moved or deleted.
                  </p>
                  <Button 
                    onClick={() => router.push('/journal')}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Back to Journal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <FeatureNavigation
          title={entry.title}
          description="Your private journal entry"
        />

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/journal')}
              className="text-gray-600 hover:text-blue-600 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Journal
            </Button>

            {/* Entry Content */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
              <CardHeader className="bg-gradient-to-br from-green-50/50 via-blue-50/50 to-purple-50/50 border-b border-white/40 p-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-gray-900">
                        {entry.title}
                      </CardTitle>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Journal Type</div>
                            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200 font-medium">
                              {entry.journalType}
                            </Badge>
                          </div>
                        </div>
                        
                        {entry.mood && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                              <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Mood</div>
                              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 font-medium">
                                {entry.mood}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Created</div>
                            <div className="font-medium text-gray-900">{formatDate(entry.createdAt)}</div>
                          </div>
                        </div>
                        
                        {entry.emotionalScore && (
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              entry.emotionalScore <= 3 ? 'bg-gradient-to-br from-red-400 to-red-500' :
                              entry.emotionalScore <= 6 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                              'bg-gradient-to-br from-green-400 to-green-500'
                            }`}>
                              <span className="text-white font-bold text-sm">{entry.emotionalScore}</span>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Emotional Intensity</div>
                              <div className={`font-medium ${getEmotionalScoreColor(entry.emotionalScore)}`}>
                                {entry.emotionalScore}/10
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {entry.hasAiAnalysis && (
                      <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200 px-4 py-2">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Analyzed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Tags</h4>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200 px-3 py-2 text-sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Your Thoughts & Feelings</h4>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {entry.fullContent || entry.content}
                    </div>
                  </div>
                </div>

                {/* Analyze Button */}
                {!entry.hasAiAnalysis && (
                  <div className="text-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-lg disabled:opacity-50"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          Analyzing your emotions...
                        </>
                      ) : (
                        <>
                          <Brain className="w-6 h-6 mr-3" />
                          Get AI Insights
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
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 backdrop-blur-sm overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400"></div>
                  <CardHeader className="bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 border-b border-white/40 p-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                          AI Emotional Analysis
                        </CardTitle>
                        <p className="text-gray-600 text-lg">Insights to support your emotional journey</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 space-y-8">
                    {/* Validation */}
                    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-white/40 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Validation & Support</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {entry.aiAnalysis.supportResponse?.validation}
                      </p>
                    </div>

                    {/* Insights */}
                    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-white/40 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Emotional Insights</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {entry.aiAnalysis.supportResponse?.insights}
                      </p>
                    </div>

                    {/* Encouragement */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-white/40 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Encouragement & Growth</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {entry.aiAnalysis.supportResponse?.encouragement}
                      </p>
                    </div>

                    {/* Crisis Support */}
                    {entry.aiAnalysis.mentalHealthMetrics?.crisisLevel && entry.aiAnalysis.mentalHealthMetrics.crisisLevel > 7 && (
                      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                            <LifeBuoy className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Crisis Support Available</h3>
                        </div>
                        <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                          {entry.aiAnalysis.mentalHealthMetrics.supportNeeded}
                        </p>
                        
                        {entry.aiAnalysis.mentalHealthMetrics.recommendedResources && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-gray-900">Immediate Resources:</h4>
                            {entry.aiAnalysis.mentalHealthMetrics.recommendedResources.map((resource, index) => (
                              <div key={index} className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 shadow-sm">
                                <div className="font-bold text-gray-900 mb-1">{resource.name}</div>
                                <div className="text-orange-800 font-medium">{resource.contact}</div>
                                <div className="text-sm text-gray-600">{resource.availability}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Self-Care Actions */}
                    {entry.aiAnalysis.supportResponse?.selfCareActions && entry.aiAnalysis.supportResponse.selfCareActions.length > 0 && (
                      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-white/40 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Recommended Self-Care Actions</h3>
                        </div>
                        <div className="grid gap-4">
                          {entry.aiAnalysis.supportResponse.selfCareActions.slice(0, 3).map((action, index) => (
                            <div key={index} className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-2">{action.title}</h4>
                                  <p className="text-gray-700 leading-relaxed">{action.description}</p>
                                </div>
                                <div className="ml-4 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
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