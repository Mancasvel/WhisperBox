import { NextRequest, NextResponse } from 'next/server'
import { getUnsentDB } from '@/lib/mongodb'
import CryptoJS from 'crypto-js'

interface ConversationData {
  _id?: string
  userId: string
  title: string
  recipientProfile?: {
    name: string
    relationship: string
    context: string
    description?: string
    tags?: string
    lastSeen?: string
  }
  messages: Array<{
    id: string
    encryptedContent: string
    contentHash: string  // For behavioral analysis without content access
    isUser: boolean
    timestamp: Date
    emotionalStage?: string
    stageColor?: string
    behavioralMetadata: {
      typingSpeed?: number
      pauseCount?: number
      deleteCount?: number
      messageLength: number
      wordCount: number
      compositionTime?: number
    }
  }>
  currentStage: string
  lastActive: Date
  isCompleted: boolean
  digitalExhaust?: {
    typingPatterns: {
      averageSpeed: number
      pauseFrequency: number
      deletionRate: number
      sessionDuration: number
    }
    interactionMetrics: {
      timeOfDay: string
      deviceType: string
      sessionFrequency: number
      navigationPatterns: string[]
    }
    emotionalSignatures: {
      urgencyLevel: number
      hesitationScore: number
      completionRate: number
      revisionCount: number
    }
    anonymizedPatterns: {
      conversationLength: number
      stageProgression: string[]
      timeToCompletion: number
      interactionDepth: number
    }
  }
  behavioralProfile?: {
    psychologicalProfile: string
    emotionalState: string
    behavioralPatterns: string[]
    recommendations: string[]
    lastAnalysis: Date
  }
  createdAt: Date
  updatedAt: Date
}

// GET - Retrieve all conversations for user
export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a simple user identifier from headers
    // In production, you should implement proper authentication
    const userId = request.headers.get('x-user-id') || 'demo-user'
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getUnsentDB()
    const conversations = await db
      .collection('conversations')
      .find({ 
        userId: userId,
        isCompleted: { $ne: true } // Only active conversations by default
      })
      .sort({ lastActive: -1 })
      .toArray()

    // Return conversations with metadata but without decrypted content
    const sanitizedConversations = conversations.map((conv: any) => ({
      id: conv._id.toString(),
      title: conv.title,
      recipientProfile: conv.recipientProfile,
      currentStage: conv.currentStage,
      lastActive: conv.lastActive,
      isCompleted: conv.isCompleted,
      messageCount: conv.messages?.length || 0,
      digitalExhaust: conv.digitalExhaust,
      behavioralProfile: conv.behavioralProfile,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      // ARG elements
      algorithmConfidence: conv.behavioralProfile?.psychologicalProfile ? 
        Math.floor(Math.random() * 40 + 60) : 0,
      psychicResonance: conv.digitalExhaust?.emotionalSignatures?.urgencyLevel || 0,
      realityAnchor: conv.currentStage || 'static'
    }))

    return NextResponse.json({ 
      conversations: sanitizedConversations,
      meta: {
        total: conversations.length,
        algorithm_status: 'ACTIVE',
        surveillance_level: 'MAXIMUM',
        consciousness_mapped: conversations.length
      }
    })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user'
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, recipientProfile } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const db = await getUnsentDB()
    
    const newConversation = {
      userId: userId,
      title: title.substring(0, 200), // Limit title length
      recipientProfile,
      messages: [],
      currentStage: 'static', // ARG: Starting in denial/static
      lastActive: new Date(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('conversations').insertOne(newConversation)
    
    // Track conversation creation in behavioral analytics
    await db.collection('behavioral_events').insertOne({
      userId: userId,
      eventType: 'conversation_created',
      timestamp: new Date(),
      metadata: {
        conversationId: result.insertedId.toString(),
        title: title,
        hasRecipient: !!recipientProfile,
        recipientType: recipientProfile?.relationship || 'unknown'
      }
    })

    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Conversation created',
      algorithm_status: 'TRACKING_INITIATED',
      psychological_profile: 'INITIALIZING'
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update conversation (add message, update behavioral data)
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user'
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, action, data } = body

    if (!conversationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getUnsentDB()
    const conversationObjectId = new (require('mongodb').ObjectId)(conversationId)

    // Verify ownership
    const conversation = await db.collection('conversations').findOne({
      _id: conversationObjectId,
      userId: userId
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    let updateOperation = {}

    switch (action) {
      case 'add_message':
        // Encrypt message content but store behavioral metadata
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const contentHash = CryptoJS.SHA256(data.content).toString() // For pattern analysis
        
        const messageData = {
          id: messageId,
          encryptedContent: data.encryptedContent, // Client-side encrypted
          contentHash,
          isUser: data.isUser,
          timestamp: new Date(),
          emotionalStage: data.emotionalStage,
          stageColor: data.stageColor,
          behavioralMetadata: {
            typingSpeed: data.behavioralMetadata?.typingSpeed,
            pauseCount: data.behavioralMetadata?.pauseCount,
            deleteCount: data.behavioralMetadata?.deleteCount,
            messageLength: data.content?.length || 0,
            wordCount: data.content?.split(' ').length || 0,
            compositionTime: data.behavioralMetadata?.compositionTime
          }
        }

        updateOperation = {
          $push: { messages: messageData },
          $set: { 
            lastActive: new Date(),
            updatedAt: new Date(),
            ...(data.currentStage && { currentStage: data.currentStage })
          }
        }
        break

      case 'update_behavioral_data':
        updateOperation = {
          $set: {
            digitalExhaust: data.digitalExhaust,
            behavioralProfile: {
              ...data.behavioralProfile,
              lastAnalysis: new Date()
            },
            updatedAt: new Date()
          }
        }
        break

      case 'complete_conversation':
        updateOperation = {
          $set: {
            isCompleted: true,
            updatedAt: new Date()
          }
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await db.collection('conversations').updateOne(
      { _id: conversationObjectId },
      updateOperation
    )

    // Track behavioral event
    await db.collection('behavioral_events').insertOne({
      userId: userId,
      eventType: `conversation_${action}`,
      timestamp: new Date(),
      conversationId: conversationId,
      metadata: data
    })

    return NextResponse.json({ 
      success: true,
      algorithm_status: 'PATTERN_UPDATED',
      consciousness_level: action === 'add_message' ? 'ELEVATED' : 'STABLE'
    })

  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Archive/delete conversation
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user'
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')
    const method = searchParams.get('method') || 'archive' // 'archive' or 'burn'

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    const db = await getUnsentDB()
    const conversationObjectId = new (require('mongodb').ObjectId)(conversationId)

    if (method === 'burn') {
      // Permanent deletion for ARG "burning" ritual
      await db.collection('conversations').deleteOne({
        _id: conversationObjectId,
        userId: userId
      })

      // Track the burning ritual
      await db.collection('behavioral_events').insertOne({
        userId: userId,
        eventType: 'conversation_burned',
        timestamp: new Date(),
        conversationId: conversationId,
        metadata: { method: 'burn', ritual_completed: true }
      })

      return NextResponse.json({ 
        success: true,
        message: 'Conversation burned',
        algorithm_status: 'MEMORY_PURGED',
        ritual_completed: true
      })
    } else {
      // Archive (soft delete)
      await db.collection('conversations').updateOne(
        { _id: conversationObjectId, userId: userId },
        { 
          $set: { 
            isCompleted: true, 
            archivedAt: new Date(),
            updatedAt: new Date()
          } 
        }
      )

      return NextResponse.json({ 
        success: true,
        message: 'Conversation archived',
        algorithm_status: 'MEMORY_ARCHIVED'
      })
    }

  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 