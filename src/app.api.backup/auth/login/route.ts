import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.player.findUnique({
      where: { name: email } // Using name field since Player model doesn't have email
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // For now, we'll use a simple password check since Player model doesn't have password field
    // In a real app, you'd want to add password field to Player model or use a separate auth system
    const isValidPassword = password === 'password' // Simple check for demo

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return user data
    const userResponse = {
      id: user.id,
      username: user.name,
      email: user.name, // Using name as email for now
      displayName: user.name,
      level: user.level,
      experience: user.experience,
      totalGames: user.totalGames,
      bestScore: user.bestScores ? Math.max(...Object.values(user.bestScores as Record<string, number>)) : 0,
      createdAt: user.createdAt
    }

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}