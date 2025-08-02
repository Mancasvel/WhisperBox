'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import FeatureNavigation from '@/components/FeatureNavigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { 
  Save, 
  ArrowLeft, 
  Heart, 
  BookOpen,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

// Dynamic import for SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(
  () => {
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

interface JournalEntry {
  title: string
  content: string
  mood: string
  tags: string[]
  journalType: string
}

export default function NewJournalPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [entry, setEntry] = useState<JournalEntry>({
    title: '',
    content: '',
    mood: '',
    tags: [],
    journalType: 'daily'
  })
  const [tagInput, setTagInput] = useState('')
  const editorRef = useRef<any>(null)
  const contentRef = useRef<string>('')

  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Auto-generate title based on type and date
  useEffect(() => {
    if (!entry.title && entry.journalType) {
      const now = new Date()
      const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
      
      const titles = {
        daily: `Daily Reflection - ${dateStr}`,
        crisis: `Crisis Processing - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        gratitude: `Gratitude Journal - ${dateStr}`,
        reflection: `Personal Insights - ${dateStr}`,
        processing: `Emotional Processing - ${dateStr}`,
        breakthrough: `Breakthrough Moment - ${dateStr}`
      }
      
      setEntry(prev => ({
        ...prev,
        title: titles[entry.journalType as keyof typeof titles] || `Journal Entry - ${dateStr}`
      }))
    }
  }, [entry.journalType])

  const handleContentChange = useCallback((value: string) => {
    contentRef.current = value || ''
  }, [])

  const handleSave = useCallback(async () => {
    // Get content from the ref
    const content = contentRef.current
    
    if (!content.trim()) {
      alert('Please write something in your journal before saving.')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/journal', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          title: entry.title,
          mood: entry.mood,
          tags: entry.tags,
          journalType: entry.journalType,
          isPrivate: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save journal entry')
      }

      const result = await response.json()
      console.log('Journal entry saved successfully:', result)
      
      setSaved(true)
      
      // Redirect to the entry view page after a short delay
      setTimeout(() => {
        router.push(`/journal/${result.data.id}`)
      }, 1500)

    } catch (error) {
      console.error('Error saving journal entry:', error)
      alert('Failed to save your entry. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [entry, router])

  const addTag = () => {
    if (tagInput.trim() && !entry.tags.includes(tagInput.trim())) {
      setEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'text-yellow-600' },
    { value: 'sad', label: '😢 Sad', color: 'text-blue-600' },
    { value: 'anxious', label: '😰 Anxious', color: 'text-purple-600' },
    { value: 'calm', label: '😌 Calm', color: 'text-green-600' },
    { value: 'angry', label: '😠 Angry', color: 'text-red-600' },
    { value: 'confused', label: '😕 Confused', color: 'text-gray-600' },
    { value: 'grateful', label: '🙏 Grateful', color: 'text-emerald-600' },
    { value: 'hopeful', label: '🌟 Hopeful', color: 'text-teal-600' }
  ]

  const journalTypes = [
    { value: 'daily', label: 'Daily Reflection' },
    { value: 'crisis', label: 'Crisis Processing' },
    { value: 'gratitude', label: 'Gratitude Journal' },
    { value: 'reflection', label: 'Personal Insights' },
    { value: 'processing', label: 'Emotional Processing' },
    { value: 'breakthrough', label: 'Breakthrough Moment' }
  ]

  if (saved) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Entry Saved! ✨</h2>
            <p className="text-gray-600 text-lg">Redirecting to your journal entry...</p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <FeatureNavigation
          title="New Journal Entry"
          description="Express your thoughts and feelings in a safe space"
        />

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-8 text-gray-600 hover:text-blue-600 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Journal
            </Button>

            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
              <CardHeader className="bg-gradient-to-br from-green-50/50 via-blue-50/50 to-purple-50/50 border-b border-white/40 p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      Create New Entry
                    </CardTitle>
                    <p className="text-gray-600 text-lg">Share your thoughts in a safe, private space</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                {/* Entry Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="journalType" className="text-sm font-medium text-gray-700">
                      Journal Type
                    </label>
                    <select 
                      id="journalType"
                      value={entry.journalType} 
                      onChange={(e) => setEntry(prev => ({ ...prev, journalType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whisper-green/20 focus:border-whisper-green outline-none bg-white text-gray-900"
                    >
                      {journalTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mood" className="text-sm font-medium text-gray-700">
                      Current Mood
                    </label>
                    <select 
                      id="mood"
                      value={entry.mood} 
                      onChange={(e) => setEntry(prev => ({ ...prev, mood: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whisper-green/20 focus:border-whisper-green outline-none bg-white text-gray-900"
                    >
                      <option value="">How are you feeling?</option>
                      {moodOptions.map((mood) => (
                        <option key={mood.value} value={mood.value}>
                          {mood.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-900">
                    Entry Title
                  </label>
                  <Input
                    id="title"
                    value={entry.title}
                    onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your entry a meaningful title..."
                    className="text-lg"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tags (optional)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tags to organize your thoughts..."
                      className="flex-1"
                    />
                    <Button onClick={addTag} variant="outline" size="sm" className="hover:text-gray-700">
                      <Tag className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {entry.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                          onClick={() => removeTag(tag)}
                        >
                          #{tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Thoughts & Feelings
                  </label>
                  <div className="prose-editor">
                    <SimpleMDE
                      ref={editorRef}
                      onChange={handleContentChange}
                      options={{
                        spellChecker: false,
                        autofocus: false,
                        placeholder: "This is your safe space. Write freely about your thoughts, feelings, experiences, or anything that's on your mind. Your words are private and secure...",
                        toolbar: [
                          'bold', 'italic', 'strikethrough', '|',
                          'heading-1', 'heading-2', 'heading-3', '|',
                          'unordered-list', 'ordered-list', '|',
                          'link', 'quote', 'code', '|',
                          'preview', 'side-by-side', 'fullscreen', '|',
                          'guide'
                        ],
                        minHeight: '400px',
                        status: false
                      }}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full mb-8"></div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-lg disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Saving Your Thoughts...
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 mr-3" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border border-white/40 rounded-2xl p-6 shadow-lg mt-8">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">What happens next?</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    After saving, you'll be able to get AI insights about your emotional patterns and receive supportive guidance tailored to your journal entry. Your thoughts are private, secure, and ready to help you on your healing journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 