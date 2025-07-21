import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/database'
import { generateMagicLinkToken, sendMagicLinkEmail } from '@/lib/auth'
import { withUnsentDB } from '@/lib/mongodb'
import { User } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    let user = await getUserByEmail(normalizedEmail)

    // Si el usuario no existe, crearlo
    if (!user) {
      const now = new Date()
      
      const newUser: User = {
        email: normalizedEmail,
        name,
        createdAt: now,
        updatedAt: now,
        isActive: true,
        
        // Sistema de límites fijos para todos los usuarios
        aiChatsUsed: 0,
        aiChatsLimit: 10,
        
        totalConversations: 0,
        emotionalJourney: []
      }

      await withUnsentDB(async (db) => {
        const result = await db.collection('users').insertOne(newUser)
        user = { ...newUser, _id: result.insertedId }
      })
    }

    if (!user) {
      throw new Error('Failed to create or retrieve user')
    }

    // Generar magic link token
    const { token, expiresAt } = generateMagicLinkToken()

    // Guardar token en la base de datos
    await withUnsentDB(async (db) => {
      await db.collection('users').updateOne(
        { _id: user!._id },
        {
          $set: {
            magicLinkToken: token,
            magicLinkExpiration: expiresAt,
            updatedAt: new Date()
          }
        }
      )
    })

    // Generar URL del magic link
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host')
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
    const magicLinkUrl = `${baseUrl}/auth/verify?token=${token}`

    // Enviar email
    await sendMagicLinkEmail(normalizedEmail, magicLinkUrl)

    return NextResponse.json({
      success: true,
      message: 'Magic link sent! Please check your email to access your account.'
    })

  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link. Please try again.' },
      { status: 500 }
    )
  }
} 