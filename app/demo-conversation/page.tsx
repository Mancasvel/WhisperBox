'use client'

import React, { useState } from 'react'
import ConversationInterface from '@/components/ConversationInterface'
import { EmotionStage } from '@/lib/types'

export default function DemoConversationPage() {
  const [currentStage, setCurrentStage] = useState<EmotionStage>('denial')
  const [emotionalScore, setEmotionalScore] = useState(25)

  const handleSendMessage = (content: string) => {
    console.log('Demo message sent:', content)
    
    // Simulate emotional progression
    setEmotionalScore(prev => Math.min(100, prev + Math.random() * 15))
    
    // Simulate stage progression
    if (emotionalScore > 80 && currentStage !== 'acceptance') {
      setCurrentStage('acceptance')
    } else if (emotionalScore > 60 && currentStage === 'denial') {
      setCurrentStage('bargaining')
    } else if (emotionalScore > 40 && currentStage === 'denial') {
      setCurrentStage('anger')
    }
  }

  const stages: EmotionStage[] = ['denial', 'anger', 'bargaining', 'depression', 'acceptance']

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6">
          <h1 className="text-3xl font-bold mb-4">Demo Conversation</h1>
          <p className="text-gray-300 mb-6">
            Experience WhisperBox's emotional journaling interface with Sarah, your ex-partner. 
            Write authentic messages and watch the emotional progression unfold.
          </p>

          {/* Demo Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Current Stage:</span>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value as EmotionStage)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Emotional Score:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={emotionalScore}
                onChange={(e) => setEmotionalScore(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-white font-medium">
                {Math.round(emotionalScore)}%
              </span>
            </div>

            <div className="text-sm text-gray-400">
              AI Features: <span className="text-green-400">Available</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <p className="text-sm text-purple-200">
              <strong>Demo Mode:</strong> This is a demonstration of WhisperBox's interface. 
              All AI features are available to experience the full emotional journaling experience.
            </p>
          </div>
        </div>
      </div>

      {/* Conversation Interface */}
      <div className="h-[calc(100vh-200px)]">
        <ConversationInterface
          conversationId="demo-1"
          personName="Sarah"
          personRelationship="ex-partner"
          currentStage={currentStage}
          emotionalScore={emotionalScore}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
} 