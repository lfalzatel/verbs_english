import { NextRequest, NextResponse } from 'next/server'
import { db, testDatabaseConnection, initializeDatabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')

    let verbs = await db.verb.findMany({
      orderBy: [
        { difficulty: 'asc' },
        { infinitive: 'asc' }
      ]
    })

    if (category && category !== 'all') {
      verbs = verbs.filter(verb => verb.category === category)
    }

    if (difficulty && difficulty !== 'all') {
      verbs = verbs.filter(verb => verb.difficulty === difficulty)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      verbs = verbs.filter(verb =>
        verb.infinitive.toLowerCase().includes(searchLower) ||
        verb.past.toLowerCase().includes(searchLower) ||
        verb.participle.toLowerCase().includes(searchLower) ||
        verb.translation.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(verbs)
  } catch (error) {
    console.error('Error fetching verbs:', error)
    
    // Try to initialize database if it's empty
    try {
      console.log('Attempting to initialize database...')
      const initialized = await initializeDatabase()
      if (initialized) {
        // Retry the request after initialization
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const difficulty = searchParams.get('difficulty')
        const search = searchParams.get('search')

        let verbs = await db.verb.findMany({
          orderBy: [
            { difficulty: 'asc' },
            { infinitive: 'asc' }
          ]
        })

        if (category && category !== 'all') {
          verbs = verbs.filter(verb => verb.category === category)
        }

        if (difficulty && difficulty !== 'all') {
          verbs = verbs.filter(verb => verb.difficulty === difficulty)
        }

        if (search) {
          const searchLower = search.toLowerCase()
          verbs = verbs.filter(verb =>
            verb.infinitive.toLowerCase().includes(searchLower) ||
            verb.past.toLowerCase().includes(searchLower) ||
            verb.participle.toLowerCase().includes(searchLower) ||
            verb.translation.toLowerCase().includes(searchLower)
          )
        }

        return NextResponse.json(verbs)
      }
    } catch (initError) {
      console.error('Database initialization failed:', initError)
    }

    return NextResponse.json(
      { error: 'Failed to fetch verbs. The database might be initializing.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { infinitive, past, participle, translation, category, difficulty } = body

    if (!infinitive || !past || !participle || !translation || !category || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const verb = await db.verb.create({
      data: {
        infinitive,
        past,
        participle,
        translation,
        category,
        difficulty,
        type: 'action',
        frequency: 50
      }
    })

    return NextResponse.json(verb, { status: 201 })
  } catch (error) {
    console.error('Error creating verb:', error)
    return NextResponse.json(
      { error: 'Failed to create verb' },
      { status: 500 }
    )
  }
}