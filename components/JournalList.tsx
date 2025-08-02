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
    <div className={`space-y-8 ${className}`}>
      {/* Header with New Entry Button */}
      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Your Journal
              </h1>
              <p className="text-gray-600 text-lg">
                {entries.length > 0 ? `${entries.length} entries in your healing journey` : 'Start your healing journey today'}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push('/journal/new')}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-3" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Search your thoughts and feelings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none text-gray-900 placeholder-gray-500 shadow-sm"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Filter className="w-4 h-4 text-gray-500" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none text-gray-900 font-medium shadow-sm min-w-[160px] appearance-none cursor-pointer"
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
        </div>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 rounded-3xl p-12 text-center shadow-lg"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {searchTerm || filterType !== 'all' ? 'No entries found' : 'Your journal awaits'}
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter to find what you\'re looking for' 
              : 'Begin your emotional healing journey by writing your first entry. Every great story starts with a single word.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <Button 
              onClick={() => router.push('/journal/new')}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5 mr-3" />
              Create First Entry
            </Button>
          )}
        </motion.div>
      )}

      {/* Journal Entries */}
      <AnimatePresence>
        <div className="space-y-6">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group cursor-pointer" onClick={() => router.push(`/journal/${entry.id}`)}>
                <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {entry.title}
                      </CardTitle>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <Badge 
                            className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200 font-medium"
                          >
                            {entry.journalType}
                          </Badge>
                        </div>
                        
                        {entry.mood && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <Badge 
                              className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 font-medium"
                            >
                              {entry.mood}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{formatDate(entry.createdAt)}</span>
                        </div>
                        
                        {entry.emotionalScore && (
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              entry.emotionalScore <= 3 ? 'bg-gradient-to-br from-red-400 to-red-500' :
                              entry.emotionalScore <= 6 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                              'bg-gradient-to-br from-green-400 to-green-500'
                            }`}>
                              <span className="text-white font-bold text-sm">{entry.emotionalScore}</span>
                            </div>
                            <span className={`font-medium ${getEmotionalScoreColor(entry.emotionalScore)}`}>
                              Intensity: {entry.emotionalScore}/10
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {entry.hasAiAnalysis && (
                        <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200 px-3 py-2">
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Analyzed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 pb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-4 mb-6">
                    <p className="text-gray-700 leading-relaxed line-clamp-3 text-lg">
                      {entry.content}
                    </p>
                  </div>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-6">
                      {entry.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200 px-3 py-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/journal/${entry.id}`)
                        }}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 px-6 py-3 rounded-2xl shadow-md font-semibold"
                      >
                        <BookOpen className="w-5 h-5 mr-3" />
                        Read Full Entry
                      </Button>
                      
                      {!entry.hasAiAnalysis && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/journal/${entry.id}?analyze=true`)
                          }}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 px-6 py-3 rounded-2xl shadow-md font-semibold"
                        >
                          <Brain className="w-5 h-5 mr-3" />
                          Analyze with AI
                        </Button>
                      )}
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
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