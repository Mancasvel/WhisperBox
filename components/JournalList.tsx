'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Heart, 
  Brain,
  Clock,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  aiAnalysis: any
  hasAiAnalysis: boolean
}

interface JournalListProps {
  className?: string
}

export default function JournalList({ className = '' }: JournalListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const { user } = useAuth()
  const router = useRouter()

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

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/journal', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch entries')
      }

      const result = await response.json()
      setEntries(result.data?.entries || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || entry.journalType === filterType
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEmotionalScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with New Entry Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-whisper-green" />
            Your Journal
          </h1>
          <p className="text-gray-600">
            {entries.length > 0 ? `${entries.length} entries` : 'Start your healing journey'}
          </p>
        </div>
        
        <Button 
          onClick={() => router.push('/journal/new')}
          className="bg-whisper-green hover:bg-whisper-green/90 text-white shadow-lg"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your thoughts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whisper-green/20 focus:border-whisper-green outline-none"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whisper-green/20 focus:border-whisper-green outline-none bg-white"
        >
          <option value="all">All Types</option>
          <option value="daily">Daily</option>
          <option value="crisis">Crisis</option>
          <option value="gratitude">Gratitude</option>
          <option value="reflection">Reflection</option>
          <option value="processing">Processing</option>
          <option value="breakthrough">Breakthrough</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No entries found' : 'Your journal awaits'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Begin your emotional healing journey by writing your first entry'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <Button 
              onClick={() => router.push('/journal/new')}
              className="bg-whisper-green hover:bg-whisper-green/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Entry
            </Button>
          )}
        </motion.div>
      )}

      {/* Journal Entries */}
      <AnimatePresence>
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-whisper-green group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-whisper-green transition-colors">
                        {entry.title}
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 flex-wrap">
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
                
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                    {entry.content}
                  </p>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-4">
                      {entry.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/journal/${entry.id}`)}
                        className="group-hover:bg-whisper-green group-hover:text-white transition-colors"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Full Entry
                      </Button>
                      
                      {!entry.hasAiAnalysis && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/journal/${entry.id}?analyze=true`)}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze with AI
                        </Button>
                      )}
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-whisper-green transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
} 