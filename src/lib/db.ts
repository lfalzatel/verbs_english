import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in a read-only environment
function isReadOnlyEnvironment(): boolean {
  // Check if we're in production and might have filesystem restrictions
  if (process.env.NODE_ENV === 'production') {
    // Common indicators of read-only environments
    return process.env.VERCEL === '1' || 
           process.env.NETLIFY === 'true' ||
           process.env.READ_ONLY_FILESYSTEM === 'true'
  }
  return false
}

// Function to get database URL for different environments
function getDatabaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side - shouldn't happen but just in case
    throw new Error('Database should only be accessed from server-side')
  }
  
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }
  
  // For read-only environments, use in-memory database
  if (isReadOnlyEnvironment()) {
    console.log('🚀 Read-only environment detected, using in-memory database')
    return 'file::memory:'
  }
  
  // For production, ensure the database file exists
  if (process.env.NODE_ENV === 'production') {
    // Extract file path from database URL
    const match = databaseUrl.match(/file:(.+)/)
    if (match) {
      const dbPath = match[1]
      const dbDir = path.dirname(dbPath)
      
      // Ensure directory exists
      fs.access(dbDir).catch(() => {
        fs.mkdir(dbDir, { recursive: true })
      })
    }
  }
  
  return databaseUrl
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl()
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    await db.$connect()
    console.log('Database connected successfully')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Initialize database with seed data if needed
export async function initializeDatabase() {
  try {
    // Check if verbs exist
    const verbCount = await db.verb.count()
    if (verbCount === 0) {
      console.log('Database is empty, seeding initial data...')
      
      // Import and seed data directly to avoid circular dependency
      const VERBS_DATA = [
        // Regular Verbs - Easy
        { infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', spanish: 'jugar', french: 'jouer', german: 'spielen', italian: 'giocare', portuguese: 'jogar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 95 },
        { infinitive: 'walk', past: 'walked', participle: 'walked', translation: 'caminar', spanish: 'caminar', french: 'marcher', german: 'gehen', italian: 'camminare', portuguese: 'caminhar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 88 },
        { infinitive: 'talk', past: 'talked', participle: 'talked', translation: 'hablar', spanish: 'hablar', french: 'parler', german: 'sprechen', italian: 'parlare', portuguese: 'falar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 92 },
        { infinitive: 'work', past: 'worked', participle: 'worked', translation: 'trabajar', spanish: 'trabajar', french: 'travailler', german: 'arbeiten', italian: 'lavorare', portuguese: 'trabalhar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 90 },
        { infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', spanish: 'estudiar', french: 'étudier', german: 'studieren', italian: 'studiare', portuguese: 'estudar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 85 },
        
        // Irregular Verbs - Medium
        { infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', spanish: 'comer', french: 'manger', german: 'essen', italian: 'mangiare', portuguese: 'comer', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 94 },
        { infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', spanish: 'beber', french: 'boire', german: 'trinken', italian: 'bere', portuguese: 'beber', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 89 },
        { infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', spanish: 'conducir', french: 'conduire', german: 'fahren', italian: 'guidare', portuguese: 'dirigir', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 73 },
        { infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', spanish: 'volar', french: 'voler', german: 'fliegen', italian: 'volare', portuguese: 'voar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 62 },
        { infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', spanish: 'dar', french: 'donner', german: 'geben', italian: 'dare', portuguese: 'dar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 91 },
        
        // Irregular Verbs - Hard
        { infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', spanish: 'ser/estar', french: 'être', german: 'sein', italian: 'essere', portuguese: 'ser/estar', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 100 },
        { infinitive: 'have', past: 'had', participle: 'had', translation: 'tener', spanish: 'tener', french: 'avoir', german: 'haben', italian: 'avere', portuguese: 'ter', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 99 },
        { infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', spanish: 'hacer', french: 'faire', german: 'tun', italian: 'fare', portuguese: 'fazer', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 97 },
        { infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', spanish: 'decir', french: 'dire', german: 'sagen', italian: 'dire', portuguese: 'dizer', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 94 },
        { infinitive: 'tell', past: 'told', participle: 'told', translation: 'contar', spanish: 'contar', french: 'raconter', german: 'erzählen', italian: 'raccontare', portuguese: 'contar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 88 },
      ]

      for (const verb of VERBS_DATA) {
        await db.verb.create({
          data: verb as any
        }).catch(() => {
          // Ignore duplicate errors
        })
      }
      
      console.log('Database seeded successfully')
    }
    return true
  } catch (error) {
    console.error('Database initialization failed:', error)
    return false
  }
}

// Check if we're using in-memory database
export function isInMemoryDatabase(): boolean {
  return isReadOnlyEnvironment()
}