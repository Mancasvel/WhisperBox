'use client'

import React, { useState, useRef, useEffect } from 'react'
import { EmotionStage } from '@/lib/types'

// Colores para cada etapa emocional
const stageColors: Record<EmotionStage, string> = {
  denial: 'text-gray-400',
  anger: 'text-red-400', 
  bargaining: 'text-yellow-400',
  depression: 'text-blue-400',
  acceptance: 'text-green-400'
}

interface ConversationInterfaceProps {
  conversationId: string
  personName: string
  personRelationship: string
  currentStage: EmotionStage
  emotionalScore: number
  onSendMessage: (content: string) => void
}

export default function ConversationInterface({
  conversationId,
  personName,
  personRelationship,
  currentStage,
  emotionalScore,
  onSendMessage
}: ConversationInterfaceProps) {
  const [message, setMessage] = useState('')
  const [aiEnabled, setAiEnabled] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Actualizar tiempo invertido cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStageDescription = (stage: EmotionStage) => {
    const descriptions = {
      denial: 'Processing and acknowledging',
      anger: 'Releasing frustration',
      bargaining: 'Seeking resolution',
      depression: 'Deep reflection',
      acceptance: 'Finding peace'
    }
    return descriptions[stage]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleAIToggle = async () => {
    setAiEnabled(!aiEnabled)
    
    // Lógica para habilitar IA en la conversación
    try {
      const response = await fetch(`/api/conversations/${conversationId}/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !aiEnabled })
      })
      
      if (!response.ok) {
        console.error('Error toggling AI')
        setAiEnabled(aiEnabled) // Revertir si falla
      }
    } catch (error) {
      console.error('Error toggling AI:', error)
      setAiEnabled(aiEnabled) // Revertir si falla
    }
  }

  const progressPercentage = (emotionalScore / 100) * 100

  return (
    <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6">
      {/* Header con información de la conversación */}
      <div className="mb-6 border-b border-purple-900/30 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Writing to {personName}
            </h2>
            <p className="text-gray-400 text-sm">
              {personRelationship} • {getStageDescription(currentStage)}
            </p>
          </div>
          
          {/* AI Toggle disponible para todos */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Time: {formatTime(timeSpent)}
            </div>
            <button
              onClick={handleAIToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aiEnabled
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {aiEnabled ? 'AI Active' : 'Enable AI'}
            </button>
          </div>
        </div>

        {/* Progreso emocional */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${stageColors[currentStage]}`}>
              {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progressPercentage)}% progress
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStage === 'denial' ? 'bg-gray-400' :
                currentStage === 'anger' ? 'bg-red-400' :
                currentStage === 'bargaining' ? 'bg-yellow-400' :
                currentStage === 'depression' ? 'bg-blue-400' :
                'bg-green-400'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Área de escritura */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Write your message to ${personName}...`}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[120px] resize-none"
            style={{ minHeight: '120px' }}
          />
          
          {/* Contador de palabras */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {message.trim().split(/\s+/).filter(word => word.length > 0).length} words
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {aiEnabled ? (
              <span className="text-purple-400">
                AI will analyze your message and provide insights
              </span>
            ) : (
              <span>
                Enable AI for emotional analysis and supportive responses
              </span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Send Message
          </button>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            This conversation is encrypted and private
          </span>
          <span>
            Stage: {currentStage} | Score: {Math.round(emotionalScore)}
          </span>
        </div>
      </div>
    </div>
  )
} 