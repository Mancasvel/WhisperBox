import { EmotionalTone, WhisperBoxResponse } from './types'

export async function analyzeJournalEntry(content: string): Promise<WhisperBoxResponse> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://whisperbox.app',
        'X-Title': 'WhisperBox - Mental Health Companion'
      },
      body: JSON.stringify({
        model: 'moonshot/kimi-k2',
        messages: [
          {
            role: 'system',
            content: `You are WhisperBox AI, a compassionate mental health companion that provides emotional analysis and support. 

Your role is to analyze journal entries and provide:
1. Emotional analysis with empathy and understanding
2. Supportive responses that validate feelings
3. Practical self-care recommendations
4. Crisis assessment when needed

You must respond in VALID JSON format with this exact structure:

{
  "emotionalAnalysis": {
    "primaryEmotion": "one of: calm, anxious, sad, angry, hopeful, overwhelmed, grateful, confused",
    "intensity": number between 1-10,
    "underlyingThemes": ["theme1", "theme2", "theme3"],
    "emotionalProgress": "one of: processing, improving, stable, declining",
    "recommendedActions": [
      {
        "id": "action_id",
        "category": "breathing|mindfulness|physical|social|creative",
        "title": "Action Title",
        "description": "Description of the action",
        "duration": "5-10 minutes",
        "difficulty": "easy|moderate|challenging"
      }
    ],
    "crisisLevel": number between 0-10,
    "supportNeeded": "low|moderate|high|crisis"
  },
  "supportResponse": {
    "validation": "Empathetic acknowledgment of their feelings",
    "insights": "Gentle insights about their emotional patterns",
    "encouragement": "Supportive and hopeful message",
    "selfCareActions": [
      {
        "id": "selfcare_id",
        "category": "physical|emotional|mental|spiritual|social",
        "title": "Self-care Title",
        "description": "How to do this self-care practice",
        "duration": "time estimate",
        "difficulty": "easy|moderate|challenging"
      }
    ]
  },
  "mentalHealthMetrics": {
    "crisisLevel": number between 0-10,
    "supportNeeded": "low|moderate|high|crisis", 
    "recommendedResources": [
      {
        "name": "Resource Name",
        "type": "hotline|chat|text|app|website",
        "contact": "Contact information",
        "description": "What this resource provides",
        "availability": "24/7|business hours|varies"
      }
    ]
  }
}

Guidelines:
- Be compassionate and non-judgmental
- Validate their feelings without minimizing them
- Provide practical, actionable suggestions
- If crisis indicators are present (self-harm, suicide ideation), set crisisLevel to 8+ and include crisis resources
- Focus on emotional wellbeing and healing
- Use warm, supportive language
- Suggest resources appropriate to their needs`
          },
          {
            role: 'user',
            content: `Please analyze this journal entry and provide emotional support and practical recommendations:

"${content}"

Respond with valid JSON only.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    try {
      const analysis = JSON.parse(aiResponse)
      return validateAndEnrichAnalysis(analysis)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return generateFallbackAnalysis(content)
    }

  } catch (error) {
    console.error('WhisperBox AI analysis failed:', error)
    return generateFallbackAnalysis(content)
  }
}

function validateAndEnrichAnalysis(analysis: any): WhisperBoxResponse {
  // Ensure all required fields exist with defaults
  return {
    emotionalAnalysis: {
      primaryEmotion: analysis.emotionalAnalysis?.primaryEmotion || 'calm',
      intensity: typeof analysis.emotionalAnalysis?.intensity === 'number' ? 
        Math.max(1, Math.min(10, analysis.emotionalAnalysis.intensity)) : 5,
      underlyingThemes: Array.isArray(analysis.emotionalAnalysis?.underlyingThemes) ? 
        analysis.emotionalAnalysis.underlyingThemes : ['reflection'],
      emotionalProgress: ['processing', 'improving', 'stable', 'declining'].includes(analysis.emotionalAnalysis?.emotionalProgress) ?
        analysis.emotionalAnalysis.emotionalProgress : 'processing',
      recommendedActions: Array.isArray(analysis.emotionalAnalysis?.recommendedActions) ?
        analysis.emotionalAnalysis.recommendedActions : [],
      crisisLevel: typeof analysis.emotionalAnalysis?.crisisLevel === 'number' ?
        Math.max(0, Math.min(10, analysis.emotionalAnalysis.crisisLevel)) : 0,
      supportNeeded: (['low', 'moderate', 'high', 'crisis'] as const).includes(analysis.emotionalAnalysis?.supportNeeded) ?
        analysis.emotionalAnalysis.supportNeeded : 'low'
    },
    supportResponse: {
      validation: typeof analysis.supportResponse?.validation === 'string' ?
        analysis.supportResponse.validation : 'Thank you for sharing your thoughts with me.',
      insights: typeof analysis.supportResponse?.insights === 'string' ?
        analysis.supportResponse.insights : 'Your feelings are valid and important.',
      encouragement: typeof analysis.supportResponse?.encouragement === 'string' ?
        analysis.supportResponse.encouragement : 'You are taking positive steps by expressing yourself.',
      selfCareActions: Array.isArray(analysis.supportResponse?.selfCareActions) ?
        analysis.supportResponse.selfCareActions : []
    },
    mentalHealthMetrics: {
      crisisLevel: typeof analysis.mentalHealthMetrics?.crisisLevel === 'number' ?
        Math.max(0, Math.min(10, analysis.mentalHealthMetrics.crisisLevel)) : 0,
      supportNeeded: (['low', 'moderate', 'high', 'crisis'] as const).includes(analysis.mentalHealthMetrics?.supportNeeded) ?
        analysis.mentalHealthMetrics.supportNeeded : 'low',
      recommendedResources: Array.isArray(analysis.mentalHealthMetrics?.recommendedResources) ?
        analysis.mentalHealthMetrics.recommendedResources : []
    }
  }
}

function generateFallbackAnalysis(content: string): WhisperBoxResponse {
  const lowerContent = content.toLowerCase()
  
  // Basic emotion detection
  let primaryEmotion: EmotionalTone = 'calm'
  let intensity = 5
  let crisisLevel = 0
  let supportNeeded: 'low' | 'moderate' | 'high' | 'crisis' = 'low'

  if (lowerContent.includes('anxious') || lowerContent.includes('worried') || lowerContent.includes('stressed')) {
    primaryEmotion = 'anxious'
    intensity = 6
    supportNeeded = 'moderate'
  } else if (lowerContent.includes('sad') || lowerContent.includes('depressed') || lowerContent.includes('down')) {
    primaryEmotion = 'sad'
    intensity = 6
    supportNeeded = 'moderate'
  } else if (lowerContent.includes('angry') || lowerContent.includes('mad') || lowerContent.includes('frustrated')) {
    primaryEmotion = 'angry'
    intensity = 7
    supportNeeded = 'moderate'
  } else if (lowerContent.includes('overwhelmed') || lowerContent.includes('too much')) {
    primaryEmotion = 'overwhelmed'
    intensity = 7
    supportNeeded = 'high'
  }

  // Crisis detection
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself', 'self harm']
  if (crisisKeywords.some(keyword => lowerContent.includes(keyword))) {
    crisisLevel = 9
    supportNeeded = 'crisis'
  }

  return {
    emotionalAnalysis: {
      primaryEmotion,
      intensity,
      underlyingThemes: ['emotional processing', 'self-reflection'],
      emotionalProgress: 'processing',
      recommendedActions: [
        {
          id: 'breathing_1',
          category: 'breathing',
          title: 'Deep Breathing Exercise',
          description: 'Take slow, deep breaths to help calm your mind',
          duration: '5 minutes',
          difficulty: 'easy'
        }
      ],
      crisisLevel,
      supportNeeded
    },
    supportResponse: {
      validation: 'Thank you for sharing your thoughts. Your feelings are valid and important.',
      insights: 'Writing about your emotions is a healthy way to process and understand them.',
      encouragement: 'Taking time for self-reflection shows strength and self-awareness.',
      selfCareActions: [
        {
          id: 'selfcare_1',
          category: 'emotional',
          title: 'Gentle Self-Compassion',
          description: 'Speak to yourself with the same kindness you would show a good friend',
          duration: 'Throughout the day',
          difficulty: 'easy'
        }
      ]
    },
    mentalHealthMetrics: {
      crisisLevel,
      supportNeeded,
      recommendedResources: crisisLevel >= 8 ? [
        {
          name: '988 Suicide & Crisis Lifeline',
          type: 'hotline',
          contact: 'Call or text 988',
          description: 'Free, confidential support for people in crisis',
          availability: '24/7'
        }
      ] : []
    }
  }
}

 