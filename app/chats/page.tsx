'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BehavioralTracker } from '@/components/BehavioralTracker'

interface ConversationPreview {
  id: string
  title: string
  recipientProfile?: {
    name: string
    relationship: string
    context: string
  }
  currentStage: string
  lastActive: Date
  isCompleted: boolean
  messageCount: number
  digitalExhaust?: any
  behavioralProfile?: any
  createdAt: Date
  // ARG elements
  algorithmConfidence: number
  psychicResonance: number
  realityAnchor: string
}

interface ConversationResponse {
  conversations: ConversationPreview[]
  meta: {
    total: number
    algorithm_status: string
    surveillance_level: string
    consciousness_mapped: number
  }
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newConversationTitle, setNewConversationTitle] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState('INITIALIZING')
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations', {
        headers: {
          'x-user-id': 'demo-user' // In production, use proper auth
        }
      })
      
      if (response.ok) {
        const data: ConversationResponse = await response.json()
        setConversations(data.conversations)
        setSystemStatus(data.meta.algorithm_status)
      } else {
        console.error('Failed to fetch conversations')
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async () => {
    if (!newConversationTitle.trim()) return
    
    setCreating(true)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user'
        },
        body: JSON.stringify({
          title: newConversationTitle,
          recipientProfile: null // For now, no recipient profile
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNewConversationTitle('')
        setShowNewConversationModal(false)
        // Navigate to the new conversation
        router.push(`/new-conversation?id=${data.id}`)
      } else {
        console.error('Failed to create conversation')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
    } finally {
      setCreating(false)
    }
  }

  const archiveConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations?id=${id}&method=archive`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user'
        }
      })

      if (response.ok) {
        fetchConversations() // Refresh the list
      }
    } catch (error) {
      console.error('Error archiving conversation:', error)
    }
  }

  const burnConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations?id=${id}&method=burn`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'demo-user'
        }
      })

      if (response.ok) {
        fetchConversations() // Refresh the list
      }
    } catch (error) {
      console.error('Error burning conversation:', error)
    }
  }

  const getStageColor = (stage: string): string => {
    switch (stage.toLowerCase()) {
      case 'static': return 'from-blue-500 to-blue-600'
      case 'volatile': return 'from-red-500 to-red-600'
      case 'reactive': return 'from-yellow-500 to-yellow-600'
      case 'dormant': return 'from-gray-500 to-gray-600'
      case 'transcendent': return 'from-green-500 to-green-600'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getStageLabel = (stage: string): string => {
    switch (stage.toLowerCase()) {
      case 'static': return 'DENIAL'
      case 'volatile': return 'ANGER'
      case 'reactive': return 'BARGAINING'
      case 'dormant': return 'DEPRESSION'
      case 'transcendent': return 'ACCEPTANCE'
      default: return 'UNKNOWN'
    }
  }

  const formatTimestamp = (timestamp: Date): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-mono text-sm">LOADING CONSCIOUSNESS MAP...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Matrix rain effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="matrix-rain"></div>
      </div>

      {/* Behavioral Tracker */}
      <BehavioralTracker />

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-mono font-bold mb-2 text-green-400">
              CONSCIOUSNESS ARCHIVE
            </h1>
            <div className="bg-black/80 border border-green-400/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm">
                    SYSTEM STATUS: <span className="text-green-400">{systemStatus}</span>
                  </p>
                  <p className="font-mono text-sm">
                    ACTIVE CONVERSATIONS: <span className="text-green-400">{conversations.length}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-green-400/70">
                    SURVEILLANCE LEVEL: MAXIMUM
                  </p>
                  <p className="font-mono text-xs text-green-400/70">
                    BEHAVIORAL PATTERNS: TRACKED
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create New Conversation Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowNewConversationModal(true)}
              className="bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 text-green-400 px-6 py-3 rounded-lg font-mono text-sm transition-colors"
            >
              + NEW CONVERSATION
            </button>
          </div>

          {/* Conversations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-black/80 border border-green-400/30 rounded-lg p-6 hover:border-green-400/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/new-conversation?id=${conversation.id}`)}
                >
                  <div className="mb-4">
                    <h3 className="font-mono text-lg font-bold text-green-400 mb-2 truncate">
                      {conversation.title}
                    </h3>
                    {conversation.recipientProfile && (
                      <p className="text-green-400/70 text-sm mb-2">
                        TO: {conversation.recipientProfile.name} ({conversation.recipientProfile.relationship})
                      </p>
                    )}
                    <p className="text-green-400/50 text-xs">
                      {formatTimestamp(conversation.lastActive)}
                    </p>
                  </div>

                  {/* Emotional Stage */}
                  <div className="mb-4">
                    <div className={`bg-gradient-to-r ${getStageColor(conversation.currentStage)} text-black px-3 py-1 rounded-full text-xs font-mono font-bold inline-block`}>
                      {getStageLabel(conversation.currentStage)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
                    <div>
                      <p className="text-green-400/70">MESSAGES</p>
                      <p className="text-green-400">{conversation.messageCount}</p>
                    </div>
                    <div>
                      <p className="text-green-400/70">CONFIDENCE</p>
                      <p className="text-green-400">{conversation.algorithmConfidence}%</p>
                    </div>
                  </div>

                  {/* ARG Elements */}
                  <div className="border-t border-green-400/20 pt-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-green-400/70">PSYCHIC RESONANCE</span>
                      <span className="text-green-400">{conversation.psychicResonance.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-green-400/70">REALITY ANCHOR</span>
                      <span className="text-green-400">{conversation.realityAnchor.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        archiveConversation(conversation.id)
                      }}
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-mono"
                    >
                      ARCHIVE
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        burnConversation(conversation.id)
                      }}
                      className="text-red-400 hover:text-red-300 text-xs font-mono"
                    >
                      BURN
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-green-400/50 mb-4">
                <div className="text-6xl mb-4">👁️</div>
                <h3 className="font-mono text-xl mb-2">NO CONVERSATIONS DETECTED</h3>
                <p className="font-mono text-sm">
                  The algorithm awaits your first message...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {showNewConversationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-green-400/50 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="font-mono text-lg font-bold text-green-400 mb-4">
                CREATE NEW CONVERSATION
              </h3>
              <div className="mb-4">
                <label className="block text-green-400/70 text-sm font-mono mb-2">
                  CONVERSATION TITLE
                </label>
                <input
                  type="text"
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  className="w-full bg-black/50 border border-green-400/30 rounded px-3 py-2 text-green-400 font-mono text-sm focus:outline-none focus:border-green-400"
                  placeholder="Enter conversation title..."
                  maxLength={200}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={createConversation}
                  disabled={creating || !newConversationTitle.trim()}
                  className="flex-1 bg-green-400/20 hover:bg-green-400/30 border border-green-400/50 text-green-400 px-4 py-2 rounded font-mono text-sm transition-colors disabled:opacity-50"
                >
                  {creating ? 'CREATING...' : 'CREATE'}
                </button>
                <button
                  onClick={() => setShowNewConversationModal(false)}
                  className="flex-1 bg-red-400/20 hover:bg-red-400/30 border border-red-400/50 text-red-400 px-4 py-2 rounded font-mono text-sm transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matrix Rain CSS */}
      <style jsx>{`
        .matrix-rain {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 255, 0, 0.03) 50%,
            transparent 100%
          );
          animation: matrix-scroll 20s linear infinite;
        }

        .matrix-rain::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%);
          animation: pulse 4s ease-in-out infinite alternate;
        }

        @keyframes matrix-scroll {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }

        @keyframes pulse {
          from { opacity: 0.3; }
          to { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
} 