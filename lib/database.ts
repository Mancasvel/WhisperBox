import { ObjectId } from 'mongodb'
import { 
  User, 
  Conversation, 
  Message, 
  ConversationVector, 
  VectorSearchResult,
  VectorSearchOptions,
  EmotionStage
} from './types'
import { withUnsentDB } from './mongodb'
import { encryptMessage, decryptMessage, generateUserKey } from './encryption'

// Funciones auxiliares de cifrado para la base de datos
async function encryptData(content: string, userId: string): Promise<string> {
  const userKey = generateUserKey(userId)
  return encryptMessage(content, userKey)
}

async function decryptData(encryptedContent: string, userId: string): Promise<string> {
  const userKey = generateUserKey(userId)
  return decryptMessage(encryptedContent, userKey)
}

// ================================
// FUNCIONES DE USUARIO
// ================================

/**
 * Crea un nuevo usuario con límites predeterminados
 */
export async function createUser(
  email: string, 
  name?: string
): Promise<User> {
  return withUnsentDB(async (db) => {
    const now = new Date()

    const user: User = {
      email,
      name,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      
      // Sistema de límites fijos para todos los usuarios
      aiChatsUsed: 0,
      aiChatsLimit: 10, // Límite generoso para todos los usuarios
      
      // Estadísticas
      totalConversations: 0,
      emotionalJourney: [],
      
      // Generar hash de clave de cifrado
      encryptionKeyHash: await generateEncryptionKeyHash(email)
    }

    const result = await db.collection('users').insertOne(user)
    return { ...user, _id: result.insertedId }
  })
}

/**
 * Obtiene un usuario por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return withUnsentDB(async (db) => {
    return await db.collection('users').findOne({ email })
  })
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  return withUnsentDB(async (db) => {
    return await db.collection('users').findOne({ _id: new ObjectId(userId) })
  })
}

/**
 * Actualiza el último login del usuario
 */
export async function updateUserLastLogin(userId: string): Promise<boolean> {
  return withUnsentDB(async (db) => {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      }
    )
    return result.modifiedCount > 0
  })
}

/**
 * Verifica si el usuario puede usar chat con IA
 */
export async function canUserUseAIChat(userId: string): Promise<boolean> {
  const user = await getUserById(userId)
  if (!user) {
    return false
  }

  return user.aiChatsUsed < user.aiChatsLimit
}

/**
 * Incrementa el contador de chats con IA utilizados
 */
export async function incrementAIChatsUsed(userId: string): Promise<boolean> {
  return withUnsentDB(async (db) => {
    const result = await db.collection('users').updateOne(
      { 
        _id: new ObjectId(userId),
        $expr: { $lt: ['$aiChatsUsed', '$aiChatsLimit'] }
      },
      { 
        $inc: { aiChatsUsed: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    return result.modifiedCount > 0
  })
}

// ================================
// FUNCIONES DE CONVERSACIÓN
// ================================

/**
 * Crea una nueva conversación
 */
export async function createConversation(
  userId: string,
  personId: string,
  title: string,
  description?: string
): Promise<Conversation> {
  return withUnsentDB(async (db) => {
    const now = new Date()
    
    const conversation: Conversation = {
      userId,
      personId,
      title,
      description,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      isActive: true,
      isArchived: false,
      isBurned: false,
      messageCount: 0,
      emotionalScore: 0,
      currentStage: 'denial' as EmotionStage,
      stageHistory: [],
      aiEnabled: false,
      aiResponsesUsed: 0,
      isVectorized: false,
      vectorIds: [],
      readyForClosure: false,
      metadata: {
        totalWords: 0,
        avgWordsPerMessage: 0,
        totalTimeSpent: 0,
        mostUsedKeywords: [],
        intensityPeaks: [],
        mysteriousFragmentsShown: []
      }
    }

    const result = await db.collection('conversations').insertOne(conversation)
    
    // Incrementar contador de conversaciones del usuario
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { totalConversations: 1 },
        $set: { updatedAt: new Date() }
      }
    )

    return { ...conversation, _id: result.insertedId }
  })
}

/**
 * Obtiene las conversaciones de un usuario
 */
export async function getUserConversations(
  userId: string, 
  includeArchived: boolean = false
): Promise<Conversation[]> {
  return withUnsentDB(async (db) => {
    const filter: any = { userId }
    if (!includeArchived) {
      filter.isArchived = false
    }

    return await db.collection('conversations')
      .find(filter)
      .sort({ updatedAt: -1 })
      .toArray()
  })
}

/**
 * Habilita IA para una conversación
 */
export async function enableAIForConversation(conversationId: string): Promise<boolean> {
  return withUnsentDB(async (db) => {
    const result = await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { 
        $set: { 
          aiEnabled: true,
          updatedAt: new Date()
        }
      }
    )
    return result.modifiedCount > 0
  })
}

// ================================
// FUNCIONES DE MENSAJE
// ================================

/**
 * Crea un nuevo mensaje
 */
export async function createMessage(
  conversationId: string,
  userId: string,
  content: string,
  messageType: 'user' | 'ai' | 'system' = 'user',
  timeSpent: number = 0
): Promise<Message> {
  return withUnsentDB(async (db) => {
    const now = new Date()
    
    // Cifrar el contenido del mensaje
    const encryptedContent = await encryptData(content, userId)
    
    // Generar hash del contenido para verificación
    const contentHash = await generateContentHash(content)
    
    const message: Message = {
      conversationId,
      userId,
      content: encryptedContent,
      contentHash,
      createdAt: now,
      isEdited: false,
      messageType,
      emotionalAnalysis: {
        score: 0,
        stage: 'denial' as EmotionStage,
        keywords: [],
        intensity: 0,
        progressToNext: 0,
        factors: {
          keywordMatches: 0,
          sentimentIntensity: 0,
          messageLength: content.length,
          emotionalWords: 0,
          timeSpent
        }
      },
      timeSpent,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      isDeleted: false,
      metadata: {},
      isVectorized: false
    }

    const result = await db.collection('messages').insertOne(message)
    
    // Actualizar estadísticas de la conversación
    await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { 
        $inc: { messageCount: 1 },
        $set: { 
          lastMessageAt: now,
          updatedAt: now
        }
      }
    )

    return { ...message, _id: result.insertedId }
  })
}

/**
 * Obtiene los mensajes de una conversación
 */
export async function getConversationMessages(
  conversationId: string, 
  userId: string,
  limit: number = 50
): Promise<Message[]> {
  return withUnsentDB(async (db) => {
    const messages = await db.collection('messages')
      .find({ 
        conversationId,
        userId,
        isDeleted: false
      })
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray()

    // Descifrar el contenido de los mensajes
    for (const message of messages) {
      try {
        message.content = await decryptData(message.content, userId)
      } catch (error) {
        console.error('Error decrypting message:', error)
        message.content = '[Error: Could not decrypt message]'
      }
    }

    return messages
  })
}

// ================================
// FUNCIONES DE VECTORIZACIÓN
// ================================

/**
 * Vectoriza un mensaje para búsqueda semántica
 */
export async function vectorizeMessage(
  messageId: string,
  conversationId: string,
  userId: string,
  content: string,
  vector: number[],
  keywords: string[] = []
): Promise<ConversationVector> {
  return withUnsentDB(async (db) => {
    const now = new Date()
    
    const conversationVector: ConversationVector = {
      conversationId,
      userId,
      content: await encryptData(content, userId),
      contentPlain: content, // Temporal para vectorización
      vector,
      metadata: {
        stage: 'denial' as EmotionStage,
        emotionalScore: 0,
        wordCount: content.split(/\s+/).length,
        createdAt: now,
        keywords
      },
      createdAt: now,
      updatedAt: now
    }

    const result = await db.collection('conversation_vectors').insertOne(conversationVector)
    
    // Marcar mensaje como vectorizado
    await db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      { 
        $set: { 
          isVectorized: true,
          vectorId: result.insertedId.toString(),
          vectorizedAt: now
        }
      }
    )

    return { ...conversationVector, _id: result.insertedId }
  })
}

/**
 * Busca vectores similares para RAG
 */
export async function searchSimilarVectors(
  userId: string,
  queryVector: number[],
  options: VectorSearchOptions = {}
): Promise<VectorSearchResult[]> {
  return withUnsentDB(async (db) => {
    const {
      limit = 5,
      threshold = 0.7,
      includeMetadata = true,
      filterByStage,
      timeRange
    } = options

    // Esta es una implementación simplificada
    // En producción, usarías una base de datos vectorial como Pinecone
    const vectors = await db.collection('conversation_vectors')
      .find({ userId })
      .toArray()

    const results: VectorSearchResult[] = []
    
    for (const vector of vectors) {
      const similarity = calculateCosineSimilarity(queryVector, vector.vector)
      
      if (similarity >= threshold) {
        results.push({
          vector,
          similarity,
          relevance: similarity
        })
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  })
}

// ================================
// FUNCIONES AUXILIARES
// ================================

/**
 * Calcula la similitud coseno entre dos vectores
 */
function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i]
    normA += vectorA[i] * vectorA[i]
    normB += vectorB[i] * vectorB[i]
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
  
  if (magnitude === 0) {
    return 0
  }

  return dotProduct / magnitude
}

/**
 * Genera un hash del contenido para verificación
 */
async function generateContentHash(content: string): Promise<string> {
  const crypto = await import('crypto')
  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Genera un hash de la clave de cifrado para verificación
 */
async function generateEncryptionKeyHash(email: string): Promise<string> {
  const crypto = await import('crypto')
  return crypto.createHash('sha256').update(email + process.env.ENCRYPTION_SECRET).digest('hex')
}

/**
 * Análisis emocional simplificado de un mensaje
 */
export async function analyzeMessageEmotion(content: string): Promise<any> {
  // Esta es una implementación placeholder
  // En producción, integrarías con tu servicio de IA
  return {
    primaryEmotion: 'neutral',
    intensity: 5,
    keywords: content.toLowerCase().split(/\s+/).slice(0, 10),
    stage: 'denial' as EmotionStage
  }
} 