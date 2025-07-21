import { NextRequest, NextResponse } from 'next/server'
import { getUnsentDB } from '@/lib/mongodb'
import { decryptMessage } from '@/lib/encryption'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user'
    const { id: conversationId } = await params
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    const db = await getUnsentDB()
    const ObjectId = require('mongodb').ObjectId
    
    const conversation = await db.collection('conversations').findOne({
      _id: new ObjectId(conversationId),
      userId: userId
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Return conversation with decrypted messages (client-side decryption)
    const response = {
      id: conversation._id.toString(),
      title: conversation.title,
      recipientProfile: conversation.recipientProfile,
      messages: conversation.messages || [],
      currentStage: conversation.currentStage,
      lastActive: conversation.lastActive,
      isCompleted: conversation.isCompleted,
      digitalExhaust: conversation.digitalExhaust,
      behavioralProfile: conversation.behavioralProfile,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      // ARG elements
      algorithmConfidence: conversation.behavioralProfile?.psychologicalProfile ? 
        Math.floor(Math.random() * 40 + 60) : 0,
      psychicResonance: conversation.digitalExhaust?.emotionalSignatures?.urgencyLevel || 0,
      realityAnchor: conversation.currentStage || 'static',
      surveillanceLevel: 'MAXIMUM',
      consciousnessMap: {
        patternRecognition: conversation.messages?.length > 5 ? 'ADVANCED' : 'BASIC',
        emotionalDepth: conversation.currentStage === 'transcendent' ? 'COMPLETE' : 'EVOLVING',
        behavioralCertainty: conversation.behavioralProfile ? 'HIGH' : 'LEARNING'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 