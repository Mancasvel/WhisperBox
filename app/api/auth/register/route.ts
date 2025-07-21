import { createUser, getUserByEmail } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Validación básica
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim()

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'An account with this email already exists. Please try logging in instead.',
          userExists: true
        },
        { status: 409 }
      )
    }

    try {
      // Crear nuevo usuario con límites predeterminados
      const newUser = await createUser(normalizedEmail, name)

      // Respuesta exitosa
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! Please check your email for verification.',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt,
          isActive: newUser.isActive,
          aiChatsUsed: newUser.aiChatsUsed,
          aiChatsLimit: newUser.aiChatsLimit,
          totalConversations: newUser.totalConversations
        }
      })

    } catch (dbError) {
      console.error('Database error during user creation:', dbError)
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 