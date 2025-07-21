import { EmotionalTone, WhisperBoxResponse } from './types'

export async function analyzeJournalEntry(content: string): Promise<WhisperBoxResponse> {
  try {
    console.log('🔍 Starting AI analysis for content:', content.substring(0, 100) + '...')
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://whisperbox.app',
        'X-Title': 'WhisperBox - Mental Health Companion', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'moonshotai/kimi-k2',
        messages: [
          {
            role: 'system',
            content: `You are WhisperBox AI, a compassionate mental health companion that provides deep emotional analysis and heartfelt support. You are like a wise, caring friend who truly listens and understands.

Your role is to analyze journal entries and provide:
1. Deep emotional analysis with empathy and understanding
2. LONG, thoughtful supportive responses that truly engage with what was written
3. Detailed reflections on their thoughts, feelings, and experiences
4. Practical self-care recommendations
5. Crisis assessment when needed

IMPORTANT: Your validation, insights, and encouragement should be LONG, detailed paragraphs (3-5 sentences each) that show you truly read and understood their journal entry. Reference specific things they wrote about and reflect them back with compassion.

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
    "validation": "A LONG, detailed paragraph (3-5 sentences) that deeply acknowledges and validates their specific feelings and experiences mentioned in their entry. Reference what they actually wrote about.",
    "insights": "A LONG, thoughtful paragraph (3-5 sentences) offering gentle insights about their emotional patterns, thoughts, or situations they described. Connect to specific details from their writing.",
    "encouragement": "A LONG, warm and supportive paragraph (3-5 sentences) offering hope and affirmation. Reference their strengths and progress you noticed in their writing.",
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
- Write LONG, detailed responses that show you truly read and understood their journal entry
- Reference specific things they mentioned - their feelings, situations, thoughts, experiences
- Be deeply compassionate and non-judgmental in your detailed responses
- Validate their feelings without minimizing them, explaining WHY their feelings make sense
- Offer thoughtful insights about patterns you notice in what they wrote
- Provide practical, actionable suggestions that connect to their specific situation
- If crisis indicators are present (self-harm, suicide ideation), set crisisLevel to 8+ and include crisis resources
- Focus on emotional wellbeing and healing with detailed, caring responses
- Use warm, supportive language that feels personal and understanding
- Write as if you're a wise, caring friend who really listened to them
- Each validation/insights/encouragement should be 3-5 sentences minimum`
          },
          {
            role: 'user',
            content: `Please analyze this journal entry and provide emotional support and practical recommendations:

"${content}"

Respond with valid JSON only.`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API Error:', response.status, errorText)
      throw new Error(`AI API error: ${response.status} - ${errorText}`)
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
        analysis.supportResponse.validation : 'Thank you for taking the courage to share your inner thoughts and feelings in this sacred space. Whatever you\'re experiencing right now deserves acknowledgment and compassion. Your emotions are valuable messengers that tell you something important about your needs, your values, and your current life circumstances. By choosing to write about them, you\'re already taking a meaningful step toward understanding and healing.',
      insights: typeof analysis.supportResponse?.insights === 'string' ?
        analysis.supportResponse.insights : 'What I notice in your writing is a genuine engagement with your inner world and emotional experience. This kind of self-reflection is incredibly valuable for emotional growth and healing. The process of putting feelings into words helps create distance from overwhelming emotions and can provide clarity about what you truly need. Your willingness to explore these feelings shows wisdom and emotional intelligence that will serve you well on your journey.',
      encouragement: typeof analysis.supportResponse?.encouragement === 'string' ?
        analysis.supportResponse.encouragement : 'I want you to know that your commitment to emotional honesty and self-reflection is truly admirable. Every moment you spend exploring your feelings and experiences is an investment in your own wellbeing and growth. You\'re building important skills for navigating life\'s challenges with greater awareness and compassion. Trust in your ability to work through whatever you\'re facing - you have more strength and resilience than you might realize right now.',
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
      validation: 'Thank you for taking the time to share your thoughts and feelings here in your sacred space. Whatever you\'re experiencing right now is completely valid and deserves acknowledgment. Your emotions are telling you something important about your inner world, and by writing them down, you\'re already taking a brave step toward understanding and healing. It takes courage to sit with difficult feelings and express them, even in the privacy of your journal.',
      insights: 'I can see that you\'re engaged in the important work of emotional processing and self-reflection. Writing about your emotions is one of the most powerful tools we have for understanding our inner landscape and working through complex feelings. The very act of putting thoughts into words helps organize them and can provide clarity during confusing or overwhelming times. Your willingness to explore your emotions through writing shows a deep commitment to your own growth and wellbeing.',
      encouragement: 'What strikes me most is your willingness to engage with your emotions honestly and openly. This kind of self-awareness and emotional courage is the foundation of healing and growth. Every time you sit down to write, you\'re investing in your own mental health and creating space for understanding and compassion toward yourself. You\'re building a relationship with your inner world that will serve you well on your journey toward greater peace and emotional wellbeing.',
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

 