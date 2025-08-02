'use client'

import { useEffect, useCallback, useState } from 'react'
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
  CheckCircle2
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

  const handleSave = useCallback(async () => {
    if (!entry.content.trim()) {
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
          content: entry.content,
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
        <div className="journal-sanctuary min-h-screen bg-gradient-to-br from-whisper-green/5 to-blue-50/30 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-whisper-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entry Saved! 💚</h2>
            <p className="text-gray-600">Redirecting to your journal entry...</p>
          </motion.div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="journal-sanctuary min-h-screen bg-gradient-to-br from-whisper-green/5 to-blue-50/30">
        <FeatureNavigation
          title="New Journal Entry"
          description="Express your thoughts and feelings in a safe space"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-gray-600 hover:text-whisper-green"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Button>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
                  <BookOpen className="w-6 h-6 mr-3 text-whisper-green" />
                  Create New Entry
                </CardTitle>
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
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
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
                    <Button onClick={addTag} variant="outline" size="sm">
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
                      value={entry.content}
                      onChange={(value) => setEntry(prev => ({ ...prev, content: value || '' }))}
                      options={{
                        spellChecker: false,
                        autofocus: true,
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
                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !entry.content.trim()}
                    className="bg-whisper-green hover:bg-whisper-green/90 text-white px-8 py-3 text-lg font-medium"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                  💡 <strong>Tip:</strong> After saving, you'll be able to get AI insights about your emotional patterns and receive supportive guidance.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 