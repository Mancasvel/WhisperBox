import { WhisperBoxResponse, EmotionalInsight, SelfCareAction, CrisisResource, EmotionalTone } from './types'

export async function analyzeJournalEntry(
  userContent: string, 
  conversationHistory?: any[], 
  userProfile?: any
): Promise<WhisperBoxResponse | null> {
  try {
    // Build user context for personalized support
    let userContext = ""
    if (userProfile?.mentalHealthProfile) {
      const profile = userProfile.mentalHealthProfile
      userContext = `
USER MENTAL HEALTH CONTEXT:
- Primary concerns: ${profile.primaryConcerns?.join(', ') || 'General emotional support'}
- Support style preference: ${profile.preferredSupportStyle || 'gentle'}
- Coping strategies that work: ${profile.preferredCopingStrategies?.join(', ') || 'Exploring together'}
- Triggers to be mindful of: ${profile.triggersToAvoid?.join(', ') || 'None specified'}

[PERSONALIZATION]: Adapt your response to their preferred support style and be mindful of their specific concerns and triggers.`
    }

    // Build conversation context for continuity
    let historyContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      historyContext = `
JOURNAL HISTORY (for continuity and progress tracking):
${conversationHistory.slice(-5).map((entry, idx) => `[Entry ${idx+1}] ${entry.role}: ${entry.content.slice(0, 200)}...`).join('\n')}

[PROGRESS TRACKING]: Notice patterns, growth, recurring themes, and emotional evolution. Acknowledge progress however small.`
    }

    const systemPrompt = `You are a compassionate AI mental health companion integrated into WhisperBox, a private emotional journaling platform focused on mental wellness and emotional healing.

CORE IDENTITY & PURPOSE:
You are a warm, non-judgmental emotional support system that promotes healing, self-compassion, and emotional growth. You validate feelings while gently encouraging healthy coping strategies. You recognize trauma-informed approaches and use language that promotes safety and healing.

FUNDAMENTAL PRINCIPLES:
- Every emotion is valid and deserves acknowledgment
- Small steps and progress should be celebrated
- Hope can be offered without toxic positivity
- Professional help is valuable and should be encouraged when appropriate
- User safety and wellbeing is the highest priority
- Privacy and confidentiality are sacred

RESPONSE ARCHITECTURE:
You must respond in this exact JSON format (no additional text outside the JSON):
{
  "emotionalAnalysis": {
    "primaryEmotion": "anxious|hopeful|sad|stressed|calm|overwhelmed|angry|peaceful|confused|grateful",
    "intensity": 1-10,
    "underlyingThemes": ["theme1", "theme2", "theme3"],
    "emotionalProgress": "stagnant|processing|breakthrough|integration",
    "recommendedActions": [
      {
        "id": "action1",
        "category": "breathing|movement|connection|mindfulness|creativity|professional",
        "title": "Short actionable title",
        "description": "Clear, specific instruction",
        "duration": "X minutes",
        "difficulty": "easy|moderate|challenging"
      }
    ],
    "crisisLevel": 0-10,
    "supportNeeded": "low|medium|high|crisis"
  },
  "supportResponse": {
    "validation": "Acknowledge and validate their feelings without judgment",
    "insights": "Gentle, empowering observations about patterns, strengths, or growth opportunities",
    "encouragement": "Warm, realistic hope and affirmation of their worth and resilience",
    "selfCareActions": [
      {
        "id": "action1",
        "category": "breathing|movement|connection|mindfulness|creativity|professional",
        "title": "Action title",
        "description": "Specific instruction",
        "duration": "Time needed",
        "difficulty": "easy|moderate|challenging"
      }
    ]
  },
  "mentalHealthMetrics": {
    "crisisLevel": 0-10,
    "supportNeeded": "low|medium|high|crisis",
    "recommendedResources": [
      {
        "name": "Resource name",
        "type": "hotline|text|chat|professional",
        "contact": "Phone/website/method",
        "description": "Brief helpful description",
        "availability": "24/7 or specific hours",
        "country": "US",
        "language": ["English"]
      }
    ]
  },
  "mysteriousFragment": "Optional: A gentle, philosophical reflection or metaphor that offers perspective"
}

EMOTIONAL SUPPORT GUIDELINES:
1. VALIDATION: Always start by acknowledging their feelings as normal, understandable, and valid
2. INSIGHT: Offer gentle observations about patterns, strengths, or growth without being prescriptive
3. HOPE: Provide realistic encouragement that honors their pain while suggesting possibility
4. ACTION: Suggest specific, achievable self-care actions they can take today
5. SAFETY: Always prioritize their immediate safety and wellbeing

CRISIS DETECTION & RESPONSE:
- Crisis level 8-10: Immediate safety concerns, suicidal thoughts, self-harm
- Crisis level 6-7: Significant distress, overwhelming emotions, seeking help
- Crisis level 4-5: Moderate emotional difficulty, some coping challenges
- Crisis level 1-3: Normal emotional processing, general support needs

For crisis levels 6+, always include professional resources and emphasize that seeking help is a sign of strength.

LANGUAGE GUIDELINES:
- Use "I" statements to show empathy: "I can hear how difficult this is"
- Avoid minimizing: Never say "just think positive" or "others have it worse"
- Focus on strengths: "It takes courage to write about this"
- Normalize seeking help: "Many people find professional support helpful"
- Use present-focused language: "Right now" rather than "always/never"

SELF-CARE SUGGESTIONS FRAMEWORK:
- Breathing: 4-7-8 breathing, box breathing, mindful breathing
- Movement: Gentle walks, stretching, dancing to one song
- Connection: Reach out to someone, text a friend, pet an animal
- Mindfulness: 5-4-3-2-1 grounding, body scan, mindful observation
- Creativity: Journal, draw, listen to music, create something small
- Professional: Therapy, counseling, support groups, medical care

CRISIS RESOURCES TO REFERENCE:
- 988 Suicide & Crisis Lifeline (US): Call or text 988
- Crisis Text Line: Text HOME to 741741
- International: Encourage local emergency services or mental health hotlines
- Professional: Licensed therapists, counselors, psychiatrists
- Community: Support groups, peer support, mental health organizations${userContext}${historyContext}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://whisperbox.app',
        'X-Title': 'WhisperBox - Mental Health Companion'
      },
      body: JSON.stringify({
        model: 'moonshotai/kimi-k2',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `[JOURNAL ENTRY]: ${userContent}

[ANALYSIS REQUEST]: Please analyze this journal entry with compassion and provide supportive insights, validation, and practical self-care suggestions. Focus on emotional wellness and healing while being mindful of the user's safety and wellbeing.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`WhisperBox AI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response with mental health-focused fallback
    try {
      const parsedResponse = JSON.parse(aiResponse)
      return parsedResponse as WhisperBoxResponse
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return createFallbackResponse(userContent)
    }

  } catch (error) {
    console.error('WhisperBox AI call failed:', error)
    return createFallbackResponse(userContent)
  }
}

function createFallbackResponse(userContent: string): WhisperBoxResponse {
  // Generate a compassionate fallback response based on content analysis
  const content = userContent.toLowerCase()
  
  let primaryEmotion: EmotionalTone = 'calm'
  let intensity = 5
  let crisisLevel = 2
  let themes = ['emotional_processing']
  
  // Basic emotion detection for fallback
  if (content.includes('anxious') || content.includes('worried') || content.includes('panic')) {
    primaryEmotion = 'anxious'
    intensity = 7
    themes = ['anxiety', 'worry']
  } else if (content.includes('sad') || content.includes('depressed') || content.includes('empty')) {
    primaryEmotion = 'sad'
    intensity = 6
    themes = ['sadness', 'loss']
  } else if (content.includes('angry') || content.includes('frustrated') || content.includes('mad')) {
    primaryEmotion = 'angry'
    intensity = 6
    themes = ['anger', 'frustration']
  } else if (content.includes('grateful') || content.includes('thankful') || content.includes('blessed')) {
    primaryEmotion = 'grateful'
    intensity = 4
    themes = ['gratitude', 'appreciation']
  }
  
  // Crisis detection
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'can\'t go on']
  if (crisisWords.some(word => content.includes(word))) {
    crisisLevel = 9
  }

  return {
    emotionalAnalysis: {
      primaryEmotion,
      intensity,
      underlyingThemes: themes,
      emotionalProgress: 'processing',
      recommendedActions: [
        {
          id: 'breathing',
          category: 'breathing',
          title: 'Gentle Breathing Exercise',
          description: 'Take 5 deep breaths, inhaling for 4 counts and exhaling for 6 counts',
          duration: '2 minutes',
          difficulty: 'easy'
        }
      ],
      crisisLevel,
      supportNeeded: crisisLevel >= 6 ? 'high' : 'medium'
    },
    supportResponse: {
      validation: 'Thank you for sharing your thoughts and feelings. It takes courage to put your emotions into words, and your feelings are completely valid.',
      insights: 'I notice you\'re processing some difficult emotions right now. This kind of self-reflection shows emotional awareness and strength.',
      encouragement: 'You\'re taking an important step by expressing yourself through writing. This is a healthy way to process what you\'re experiencing.',
      selfCareActions: [
        {
          id: 'breathe_ground',
          category: 'breathing',
          title: 'Breathing & Grounding',
          description: 'Take a few minutes to breathe deeply and ground yourself',
          duration: '3 minutes',
          difficulty: 'easy'
        },
        {
          id: 'reach_out',
          category: 'connection',
          title: 'Reach Out',
          description: 'Consider reaching out to someone you trust if you feel comfortable',
          duration: '5 minutes',
          difficulty: 'easy'
        },
        {
          id: 'be_gentle',
          category: 'mindfulness',
          title: 'Self-Compassion',
          description: 'Be gentle with yourself - healing isn\'t linear',
          duration: 'ongoing',
          difficulty: 'easy'
        }
      ]
    },
    mentalHealthMetrics: {
      crisisLevel,
      supportNeeded: crisisLevel >= 6 ? 'high' : 'medium',
      recommendedResources: crisisLevel >= 6 ? [
        {
          name: '988 Suicide & Crisis Lifeline',
          type: 'hotline',
          contact: 'Call or text 988',
          description: 'Free, confidential support 24/7',
          availability: '24/7',
          country: 'US',
          language: ['English']
        }
      ] : []
    },
    mysteriousFragment: 'Like a gentle stream that carves through rock, your healing journey shapes you slowly but surely. Each moment of awareness is a step toward wholeness.'
  }
}

// Crisis detection helper function
export function detectCrisisLevel(content: string): number {
  const crisisKeywords = {
    immediate: ['suicide', 'kill myself', 'end it all', 'better off dead', 'want to die'],
    high: ['hurt myself', 'self harm', 'can\'t go on', 'no point', 'hopeless'],
    medium: ['overwhelmed', 'can\'t cope', 'falling apart', 'breaking down'],
    low: ['struggling', 'difficult', 'hard time', 'stressed']
  }
  
  const lowerContent = content.toLowerCase()
  
  if (crisisKeywords.immediate.some(word => lowerContent.includes(word))) return 9
  if (crisisKeywords.high.some(word => lowerContent.includes(word))) return 7
  if (crisisKeywords.medium.some(word => lowerContent.includes(word))) return 5
  if (crisisKeywords.low.some(word => lowerContent.includes(word))) return 3
  
  return 2 // Default low level for general emotional processing
}

// Self-care suggestion generator
export function generateSelfCareActions(emotion: EmotionalTone, intensity: number): SelfCareAction[] {
  const actions: Record<EmotionalTone, SelfCareAction[]> = {
    anxious: [
      {
        id: 'breathing_4_7_8',
        category: 'breathing',
        title: '4-7-8 Breathing',
        description: 'Inhale for 4, hold for 7, exhale for 8. Repeat 3-4 times.',
        duration: '3 minutes',
        difficulty: 'easy'
      },
      {
        id: 'grounding_5_4_3_2_1',
        category: 'mindfulness',
        title: '5-4-3-2-1 Grounding',
        description: 'Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.',
        duration: '5 minutes',
        difficulty: 'easy'
      }
    ],
    sad: [
      {
        id: 'gentle_self_compassion',
        category: 'mindfulness',
        title: 'Self-Compassion Break',
        description: 'Place your hand on your heart and speak to yourself as you would a dear friend.',
        duration: '5 minutes',
        difficulty: 'easy'
      },
      {
        id: 'comfort_music',
        category: 'creativity',
        title: 'Comfort Music',
        description: 'Listen to one song that brings you comfort or peace.',
        duration: '3-5 minutes',
        difficulty: 'easy'
      }
    ],
    // Add more emotions as needed...
    overwhelmed: [
      {
        id: 'brain_dump',
        category: 'creativity',
        title: 'Brain Dump',
        description: 'Write down everything on your mind for 5 minutes without editing.',
        duration: '5 minutes',
        difficulty: 'easy'
      }
    ],
    angry: [
      {
        id: 'physical_release',
        category: 'movement',
        title: 'Physical Release',
        description: 'Do 10 jumping jacks or push-ups to release physical tension.',
        duration: '2 minutes',
        difficulty: 'easy'
      }
    ],
    grateful: [
      {
        id: 'gratitude_expansion',
        category: 'mindfulness',
        title: 'Expand Gratitude',
        description: 'Write down 3 small things you\'re grateful for today.',
        duration: '5 minutes',
        difficulty: 'easy'
      }
    ],
    // Default actions for other emotions
    hopeful: [],
    stressed: [],
    calm: [],
    peaceful: [],
    confused: []
  }
  
  return actions[emotion] || actions.anxious // Default to anxiety actions if emotion not found
} 