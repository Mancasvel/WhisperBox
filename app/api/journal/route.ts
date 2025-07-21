import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { analyzeJournalEntry } from '@/lib/whisperBoxAI'
import { withUnsentDB } from '@/lib/mongodb'
import { encryptMessage, decryptMessage, generateUserKey } from '@/lib/encryption'
import { JournalEntry, WhisperBoxResponse, EmotionalTone } from '@/lib/types'

// GET - Retrieve user's journal entries
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    const journalType = searchParams.get('type')

    const result = await withUnsentDB(async (db) => {
      const filter: any = { userId: currentUser.userId }
      
      if (journalType) {
        filter.journalType = journalType
      }

      const entries = await db
        .collection('conversations') // Reusing existing collection
        .find(filter)
        .sort({ lastMessageAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()

      // Get decrypted content for each entry
      const enrichedEntries = await Promise.all(
        entries.map(async (entry: any) => {
          // Get the latest message content
          const messages = await db
            .collection('messages')
            .find({ conversationId: entry._id.toString() })
            .sort({ createdAt: -1 })
            .limit(1)
            .toArray()

          let content = ''
          if (messages.length > 0) {
            const userKey = generateUserKey(currentUser.userId)
            content = decryptMessage(messages[0].content, userKey)
          }

          return {
            id: entry._id.toString(),
            title: entry.title,
            journalType: entry.journalType || 'daily',
            mood: entry.mood,
            content: content.slice(0, 200) + (content.length > 200 ? '...' : ''), // Preview
            currentStage: entry.currentStage,
            emotionalScore: entry.emotionalScore,
            lastActive: entry.lastMessageAt,
            createdAt: entry.createdAt,
            messageCount: entry.messageCount || 0,
            tags: entry.tags || [],
            isPrivate: entry.isPrivate !== false, // Default to private
            aiAnalysis: entry.aiAnalysis || null
          }
        })
      )

      return {
        entries: enrichedEntries,
        total: await db.collection('conversations').countDocuments(filter),
        hasMore: skip + limit < await db.collection('conversations').countDocuments(filter)
      }
    })

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error retrieving journal entries:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve journal entries' },
      { status: 500 }
    )
  }
}

// POST - Create new journal entry with AI analysis
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request)
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      content, 
      journalType = 'daily', 
      mood, 
      title,
      tags = [],
      isPrivate = true 
    } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Journal content is required' },
        { status: 400 }
      )
    }

    // Generate AI analysis
    let aiAnalysis: WhisperBoxResponse | null = null
    try {
      aiAnalysis = await analyzeJournalEntry(content)
    } catch (aiError) {
      console.error('AI analysis failed:', aiError)
      // Continue without AI analysis - user experience shouldn't suffer
    }

    const result = await withUnsentDB(async (db) => {
      const now = new Date()
      
      // Create journal entry (using conversations collection structure)
      const journalEntry = {
        userId: currentUser.userId,
        personId: 'self', // For journal entries, we use 'self'
        title: title || generateJournalTitle(journalType, now),
        journalType,
        mood,
        tags,
        isPrivate,
        createdAt: now,
        updatedAt: now,
        lastMessageAt: now,
        isActive: true,
        isArchived: false,
        isBurned: false,
        messageCount: 1,
        emotionalScore: aiAnalysis?.emotionalAnalysis.intensity || 5,
        currentStage: mapEmotionToStage(aiAnalysis?.emotionalAnalysis.primaryEmotion || 'calm'),
        stageHistory: [],
        
        // AI Analysis Results
        aiEnabled: true,
        aiAnalysis: aiAnalysis,
        
        // Vectorization (for future use)
        isVectorized: false,
        vectorIds: [],
        
        readyForClosure: false,
        metadata: {
          totalWords: content.split(/\s+/).length,
          avgWordsPerMessage: content.split(/\s+/).length,
          totalTimeSpent: 0,
          mostUsedKeywords: extractKeywords(content),
          intensityPeaks: [],
          mysteriousFragmentsShown: []
        }
      }

      const entryResult = await db.collection('conversations').insertOne(journalEntry)
      
      // Create the journal message (encrypted)
      const userKey = generateUserKey(currentUser.userId)
      const encryptedContent = encryptMessage(content, userKey)
      
      const message = {
        conversationId: entryResult.insertedId.toString(),
        userId: currentUser.userId,
        content: encryptedContent,
        contentHash: generateContentHash(content),
        createdAt: now,
        isEdited: false,
        editHistory: [],
        messageType: 'user' as const,
        emotionalAnalysis: aiAnalysis?.emotionalAnalysis || {
          primaryEmotion: 'calm' as EmotionalTone,
          intensity: 5,
          underlyingThemes: ['reflection'],
          emotionalProgress: 'processing' as const
        },
        timeSpent: 0,
        wordCount: content.split(/\s+/).length,
        characterCount: content.length,
        isDeleted: false,
        metadata: { journalType, mood, tags },
        isVectorized: false
      }

      await db.collection('messages').insertOne(message)

      // Update user statistics
      await db.collection('users').updateOne(
        { _id: currentUser.userId },
        { 
          $inc: { totalConversations: 1 },
          $set: { updatedAt: now }
        }
      )

      return {
        id: entryResult.insertedId.toString(),
        ...journalEntry,
        content: content, // Return unencrypted for immediate use
        aiAnalysis
      }
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Journal entry created successfully'
    })

  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    )
  }
}

// Helper functions
function generateJournalTitle(type: string, date: Date): string {
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const titles = {
    daily: `Daily Reflection - ${dateStr}`,
    crisis: `Crisis Processing - ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
    gratitude: `Gratitude Journal - ${dateStr}`,
    reflection: `Personal Insights - ${dateStr}`,
    processing: `Emotional Processing - ${dateStr}`,
    breakthrough: `Breakthrough Moment - ${dateStr}`
  }
  
  return titles[type as keyof typeof titles] || `Journal Entry - ${dateStr}`
}

function mapEmotionToStage(emotion: EmotionalTone): string {
  const emotionStageMap: Record<EmotionalTone, string> = {
    angry: 'anger',
    sad: 'depression',
    anxious: 'denial',
    stressed: 'bargaining',
    overwhelmed: 'depression',
    confused: 'denial',
    hopeful: 'acceptance',
    grateful: 'acceptance',
    peaceful: 'acceptance',
    calm: 'acceptance'
  }
  
  return emotionStageMap[emotion] || 'denial'
}

function extractKeywords(content: string): string[] {
  // Simple keyword extraction - in production, you'd use a more sophisticated NLP library
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'what', 'about'].includes(word))
  
  // Count word frequency
  const wordCount: Record<string, number> = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // Return top 5 most frequent words
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
}

function generateContentHash(content: string): string {
  // Simple hash function - in production, use crypto
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
} 