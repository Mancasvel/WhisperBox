'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { analyzeMessage } from '@/lib/scoreEngine'
import { EmotionStage, getStageColors } from '@/lib/emotionStages'
import { encryptMessage, generateUserKey, storeUserKey, retrieveUserKey } from '@/lib/encryption'

interface Message {
  id: string
  content: string
  timestamp: Date
  emotionalAnalysis: {
    score: number
    stage: EmotionStage
    intensity: number
    keywords: string[]
  }
  timeSpent: number
}

interface ChatInterfaceProps {
  conversationId: string
  conversationTitle: string
}

export default function ChatInterface({ 
  conversationId, 
  conversationTitle
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [currentStage, setCurrentStage] = useState<EmotionStage>('denial')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [currentMessage])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setCurrentMessage(value)
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true)
      setTypingStartTime(Date.now())
    } else if (isTyping && value.length === 0) {
      setIsTyping(false)
      setTypingStartTime(null)
    }
  }

  // Get or generate user encryption key
  const getUserKey = () => {
    if (!user?.email) return null
    
    // Try to get existing key from localStorage
    const existingKey = retrieveUserKey(user.email)
    if (existingKey) return existingKey
    
    // Generate new key if none exists
    const newKey = generateUserKey(user.email)
    storeUserKey(user.email, newKey)
    return newKey
  }

  const handleSendMessage = async () => {
    const userKey = getUserKey()
    if (!currentMessage.trim() || !user || !userKey) return

    const timeSpent = typingStartTime ? (Date.now() - typingStartTime) / 1000 : 0
    const analysis = analyzeMessage(currentMessage, timeSpent)

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      timestamp: new Date(),
      emotionalAnalysis: analysis,
      timeSpent
    }

    try {
      // Encrypt message before storing
      const encryptedContent = encryptMessage(currentMessage, userKey)
      
      // TODO: Save to database with encrypted content
      console.log('Message would be saved encrypted:', encryptedContent)
      
      // Add to local state for now
      setMessages(prev => [...prev, newMessage])
      
      // Update overall score
      const newScore = messages.length > 0 
        ? Math.round((overallScore + analysis.score) / 2)
        : analysis.score
      
      setOverallScore(newScore)
      setCurrentStage(analysis.stage)
      
      // Clear input
      setCurrentMessage('')
      setIsTyping(false)
      setTypingStartTime(null)
      
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const stageColor = getStageColors(currentStage)

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{conversationTitle}</h2>
            <p className="text-sm text-gray-400">
              {messages.length} messages • Stage: {currentStage}
            </p>
          </div>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-md text-sm transition-colors"
          >
            {showAnalysis ? 'Hide' : 'Analysis'}
          </button>
        </div>
      </div>

      {/* Emotional Analysis Panel */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-black/60 border-b border-purple-500/20"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Emotional Score</h3>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${overallScore}%`,
                      backgroundColor: stageColor
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{overallScore}/100</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Current Stage</h3>
                <p 
                  className="text-lg font-semibold"
                  style={{ color: stageColor }}
                >
                  {currentStage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <div className="max-w-xs lg:max-w-md px-4 py-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded-lg text-white">
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                  <span className="text-xs text-white/70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full bg-white/20"
                    style={{ 
                      color: getStageColors(message.emotionalAnalysis.stage)
                    }}
                  >
                    {message.emotionalAnalysis.stage}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              What do you need to say?
            </div>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              This is your safe space. Write what you feel, what you think, 
              what you never could say. No one else will read it.
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Write your message..."
              className="w-full px-4 py-3 bg-black/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300 resize-none min-h-[50px] max-h-[200px]"
              rows={1}
            />
            {isTyping && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                Typing...
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        

      </div>
    </div>
  )
} 