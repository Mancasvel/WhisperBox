'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { EmotionStage, getStageColors } from '@/lib/emotionStages'
import Link from 'next/link'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  lastMessageAt: Date
  messageCount: number
  emotionalScore: number
  currentStage: EmotionStage
  isBurned: boolean
  isArchived: boolean
}

export default function ConversationsPage() {
  const { user, isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all')

  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Fetch real conversations from API
      // For now, using mock data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'Letter to my father',
          lastMessage: 'I could never tell you what I really felt...',
          lastMessageAt: new Date('2024-01-15'),
          messageCount: 12,
          emotionalScore: 75,
          currentStage: 'acceptance',
          isBurned: false,
          isArchived: false
        },
        {
          id: '2',
          title: 'To my past self',
          lastMessage: 'I wish I had known then what I know now...',
          lastMessageAt: new Date('2024-01-10'),
          messageCount: 8,
          emotionalScore: 45,
          currentStage: 'bargaining',
          isBurned: false,
          isArchived: false
        },
        {
          id: '3',
          title: 'Archived conversation',
          lastMessage: 'This conversation was archived',
          lastMessageAt: new Date('2024-01-05'),
          messageCount: 15,
          emotionalScore: 90,
          currentStage: 'acceptance',
          isBurned: false,
          isArchived: true
        }
      ]
      setConversations(mockConversations)
      setLoading(false)
    }
  }, [isAuthenticated])

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'archived') return conv.isArchived
    if (filter === 'active') return !conv.isArchived && !conv.isBurned
    return !conv.isBurned
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Conversations</h1>
          <p className="text-gray-400">All conversations you've had with yourself</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === 'active' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === 'archived' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
            >
              Archived
            </button>
          </div>

          {/* New Conversation Button */}
          <Link
            href="/new-conversation"
            className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            + New Conversation
          </Link>

          {/* Conversations List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredConversations.map((conversation) => {
                const stageColor = getStageColors(conversation.currentStage)
                
                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300 hover:bg-black/60"
                  >
                    <Link href={`/conversation/${conversation.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {conversation.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{conversation.messageCount} messages</span>
                            <span>•</span>
                            <span>{conversation.lastMessageAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span 
                              className="font-medium"
                              style={{ color: stageColor }}
                            >
                              {conversation.currentStage}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="w-16 h-2 bg-gray-700 rounded-full mb-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${conversation.emotionalScore}%`,
                                backgroundColor: stageColor
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {conversation.emotionalScore}/100
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {filter === 'all' 
                  ? 'You have no conversations yet' 
                  : filter === 'archived' 
                  ? 'You have no archived conversations'
                  : 'You have no active conversations'
                }
              </p>
              <Link
                href="/new-conversation"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Start your first conversation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 