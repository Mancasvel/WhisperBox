import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserById } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Verificar sesión
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Obtener información del usuario
    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Respuesta simplificada sin información de suscripción
    return NextResponse.json({
      success: true,
      user: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
        isActive: user.isActive,
        
        // Límites de uso
        aiChatsUsed: user.aiChatsUsed,
        aiChatsLimit: user.aiChatsLimit,
        aiChatsRemaining: user.aiChatsLimit - user.aiChatsUsed,
        
        // Estadísticas
        totalConversations: user.totalConversations,
        emotionalJourney: user.emotionalJourney
      }
    })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 