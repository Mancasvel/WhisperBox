import { ObjectId } from 'mongodb'
export type EmotionStage = 'denial' | 'anger' | 'bargaining' | 'depression' | 'acceptance'

// Tipos para el Usuario simplificado (sin pagos)
export interface User {
  _id?: ObjectId
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
  
  // Sistema de límites sin pagos
  aiChatsUsed: number
  aiChatsLimit: number // Límite fijo para todos los usuarios
  
  // Autenticación
  magicLinkToken?: string
  magicLinkExpiration?: Date
  
  // Estadísticas
  totalConversations: number
  emotionalJourney: EmotionStage[]
  encryptionKeyHash?: string // Hash de la clave de cifrado para verificación
}



// Vectorización para RAG
export interface ConversationVector {
  _id?: ObjectId
  conversationId: string
  userId: string
  content: string // Contenido original (cifrado)
  contentPlain: string // Contenido para vectorización (descifrado temporalmente)
  vector: number[] // Vector embeddings
  metadata: {
    stage: EmotionStage
    emotionalScore: number
    wordCount: number
    createdAt: Date
    keywords: string[]
  }
  createdAt: Date
  updatedAt: Date
}

// Tipos para perfiles de personas
export interface PersonProfile {
  _id?: ObjectId
  userId: string
  name: string
  relationship: string // 'ex-partner', 'friend', 'family', 'colleague', 'stranger', 'self', 'other'
  description?: string
  context: string // Contexto personal sobre esta persona
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
  conversationCount: number
  lastConversationAt?: Date
  tags: string[]
  isActive: boolean
}

// Tipos para la Conversación actualizada
export interface Conversation {
  _id?: ObjectId
  userId: string
  personId: string // Referencia al perfil de la persona
  title: string // Título generado automáticamente o por el usuario
  description?: string // Descripción opcional
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
  isActive: boolean
  isArchived: boolean
  isBurned: boolean // Si fue "quemada" en el ritual
  burnedAt?: Date
  messageCount: number
  emotionalScore: number
  currentStage: EmotionStage
  stageHistory: EmotionStageHistory[]
  
  // Sistema de IA mejorado
  aiEnabled: boolean // Si tiene respuestas de IA activadas
  aiResponsesUsed: number // Contador de respuestas de IA utilizadas
  aiLastResponse?: Date
  aiNextResponse?: Date // Programada para respuesta con delay
  
  // Vectorización
  isVectorized: boolean
  vectorizedAt?: Date
  vectorIds: string[] // IDs de los vectores asociados
  
  readyForClosure: boolean
  closureOfferedAt?: Date
  closureAction?: 'burn' | 'archive' | 'continue'
  closureReason?: string
  metadata: ConversationMetadata
}

// Historial de etapas emocionales
export interface EmotionStageHistory {
  stage: EmotionStage
  score: number
  reachedAt: Date
  duration: number // Tiempo en esta etapa en minutos
}

// Metadatos de conversación
export interface ConversationMetadata {
  totalWords: number
  avgWordsPerMessage: number
  totalTimeSpent: number // En minutos
  mostUsedKeywords: string[]
  intensityPeaks: Date[]
  mysteriousFragmentsShown: string[]
}

// Tipos para el Mensaje actualizado
export interface Message {
  _id?: ObjectId
  conversationId: string
  userId: string
  content: string // Contenido cifrado
  contentHash: string // Hash del contenido para verificación
  createdAt: Date
  updatedAt?: Date
  isEdited: boolean
  editHistory?: MessageEdit[]
  messageType: 'user' | 'ai' | 'system'
  emotionalAnalysis: MessageEmotionalAnalysis
  aiResponse?: AIResponse
  timeSpent: number // Tiempo invertido escribiendo en segundos
  wordCount: number
  characterCount: number
  isDeleted: boolean
  deletedAt?: Date
  metadata: MessageMetadata
  
  // Vectorización
  isVectorized: boolean
  vectorId?: string
  vectorizedAt?: Date
}

// Análisis emocional del mensaje
export interface MessageEmotionalAnalysis {
  score: number
  stage: EmotionStage
  keywords: string[]
  intensity: number
  progressToNext: number
  factors: {
    keywordMatches: number
    sentimentIntensity: number
    messageLength: number
    emotionalWords: number
    timeSpent: number
  }
}

// Respuesta de IA actualizada
export interface AIResponse {
  content: string // Contenido cifrado
  generatedAt: Date
  deliveredAt?: Date
  model: string // 'claude-3' | 'gpt-4'
  prompt: string
  stage: EmotionStage
  delay: number // Delay programado en minutos
  wasDelivered: boolean
  emotionalTone: string
  mysteriousFragment?: string
  
  // Contexto RAG
  ragContext?: {
    vectorsUsed: string[]
    relevantMessages: string[]
    contextSummary: string
  }
}

// Historial de edición de mensajes
export interface MessageEdit {
  content: string // Contenido cifrado
  editedAt: Date
  reason?: string
}

// Metadatos del mensaje
export interface MessageMetadata {
  deviceInfo?: string
  location?: string
  mood?: string
  tags?: string[]
  attachments?: string[]
  reactions?: string[]
}

// Tipos para el sistema de notificaciones (simplificado)
export interface NotificationSettings {
  userId: string
  pushEnabled: boolean
  mysteriousFragments: boolean
  aiResponses: boolean
  remindersToContinue: boolean
  createdAt: Date
  updatedAt: Date
}

// Tipos para el sistema de fragmentos misteriosos
export interface MysteriousFragment {
  _id?: ObjectId
  userId: string
  content: string
  stage: EmotionStage
  shownAt: Date
  wasRead: boolean
  readAt?: Date
  context: string // Contexto en el que se mostró
  type: 'notification' | 'in_app' | 'daily_fragment'
}



// Tipos para estadísticas del usuario
export interface UserStats {
  userId: string
  totalMessages: number
  totalConversations: number
  avgEmotionalScore: number
  timeSpent: number
  favoriteStage: EmotionStage
  progressionRate: number
  streakDays: number
  lastActiveDate: Date
  aiChatsUsed: number
  updatedAt: Date
}

// Tipos para el sistema de backup
export interface BackupData {
  userId: string
  conversations: Conversation[]
  messages: Message[]
  settings: NotificationSettings
  stats: UserStats
  createdAt: Date
  encrypted: boolean
  version: string
}

// Tipos para respuestas de API
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Tipos para sesiones de autenticación
export interface AuthSession {
  userId: string
  email: string
  name?: string
  aiChatsUsed: number
  aiChatsLimit: number
  isActive: boolean
  expiresAt: Date
}

// Tipos para análisis de IA
export interface AIAnalysisRequest {
  messages: string[]
  currentStage: EmotionStage
  emotionalScore: number
  userContext: string
  ragContext?: ConversationVector[] // Contexto vectorizado
}

export interface AIAnalysisResponse {
  response: string
  suggestedStage: EmotionStage
  emotionalTone: string
  mysteriousFragment?: string
  shouldOfferClosure: boolean
  delay: number
  ragContext?: {
    vectorsUsed: string[]
    relevantMessages: string[]
    contextSummary: string
  }
}

// Tipos para el sistema de vectorización
export interface VectorSearchResult {
  vector: ConversationVector
  similarity: number
  relevance: number
}

export interface VectorSearchOptions {
  limit?: number
  threshold?: number
  includeMetadata?: boolean
  filterByStage?: EmotionStage
  timeRange?: {
    start: Date
    end: Date
  }
} 

// Mental Health & Emotional Wellbeing Types for WhisperBox
export type EmotionalTone = 'anxious' | 'hopeful' | 'sad' | 'stressed' | 'calm' | 'overwhelmed' | 'angry' | 'peaceful' | 'confused' | 'grateful'

export interface MentalHealthProfile {
  primaryConcerns: string[]
  preferredSupportStyle: 'gentle' | 'direct' | 'analytical' | 'encouraging'
  crisisContactInfo?: string
  emergencyContacts?: string[]
  preferredCopingStrategies: string[]
  triggersToAvoid: string[]
}

export interface WhisperBoxUser extends User {
  mentalHealthProfile?: MentalHealthProfile
  privacySettings: {
    shareProgressAnonymously: boolean
    allowCommunitySupport: boolean
    dataRetentionDays: number
  }
}

export interface JournalEntry extends Conversation {
  journalType: 'daily' | 'crisis' | 'reflection' | 'gratitude' | 'processing' | 'breakthrough'
  mood?: EmotionalTone
  tags: string[]
  isPrivate: boolean
  weatherContext?: string
  locationContext?: string
}

export interface EmotionalInsight {
  primaryEmotion: EmotionalTone
  intensity: number // 1-10
  underlyingThemes: string[]
  emotionalProgress: 'stagnant' | 'processing' | 'breakthrough' | 'integration'
  recommendedActions: SelfCareAction[]
  crisisLevel: number // 0-10 (0 = stable, 10 = immediate crisis)
  supportNeeded: 'low' | 'medium' | 'high' | 'crisis'
}

export interface SelfCareAction {
  id: string
  category: 'breathing' | 'movement' | 'connection' | 'mindfulness' | 'creativity' | 'professional'
  title: string
  description: string
  duration: string // "5 minutes", "10-15 minutes", etc.
  difficulty: 'easy' | 'moderate' | 'challenging'
  resources?: string[]
}

export interface CrisisResource {
  name: string
  type: 'hotline' | 'text' | 'chat' | 'emergency'
  contact: string
  description: string
  availability: string
  country: string
  language: string[]
}

export interface WhisperBoxResponse {
  emotionalAnalysis: EmotionalInsight
  supportResponse: {
    validation: string
    insights: string
    encouragement: string
    selfCareActions: SelfCareAction[]
  }
  mentalHealthMetrics: {
    crisisLevel: number
    supportNeeded: 'low' | 'medium' | 'high' | 'crisis'
    recommendedResources: CrisisResource[]
  }
  mysteriousFragment?: string // Keep some of the original contemplative elements
} 