// Storage utilities for handling statistics in different environments
import { isInMemoryDatabase } from '@/lib/db'

export interface PlayerStats {
  name: string
  level: number
  experience: number
  totalGames: number
  bestScores: {
    memory?: number
    concentration?: number
    matching?: number
    wordsearch?: number
    crossword?: number
  }
}

export interface GameScore {
  gameType: string
  score: number
  moves?: number
  timeSpent: number
  accuracy: number
  completedAt: string
}

// Local storage key prefix
const STORAGE_PREFIX = 'verbos_english_'

// Get player data from localStorage
export function getPlayerFromStorage(): PlayerStats | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}player`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Save player data to localStorage
export function savePlayerToStorage(player: PlayerStats): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(`${STORAGE_PREFIX}player`, JSON.stringify(player))
  } catch (error) {
    console.warn('Failed to save player to localStorage:', error)
  }
}

// Get game scores from localStorage
export function getScoresFromStorage(): GameScore[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}scores`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save game score to localStorage
export function saveScoreToStorage(score: GameScore): void {
  if (typeof window === 'undefined') return
  
  try {
    const scores = getScoresFromStorage()
    scores.push(score)
    
    // Keep only last 100 scores to avoid storage issues
    const recentScores = scores.slice(-100)
    localStorage.setItem(`${STORAGE_PREFIX}scores`, JSON.stringify(recentScores))
  } catch (error) {
    console.warn('Failed to save score to localStorage:', error)
  }
}

// Update player stats after a game
export function updatePlayerStats(gameType: string, score: number, accuracy: number): PlayerStats | null {
  const player = getPlayerFromStorage()
  if (!player) return null
  
  // Update experience and level
  const experienceGained = Math.floor(score * (accuracy / 100))
  player.experience += experienceGained
  player.totalGames += 1
  
  // Level up every 100 XP
  const newLevel = Math.floor(player.experience / 100) + 1
  if (newLevel > player.level) {
    player.level = newLevel
  }
  
  // Update best scores
  if (!player.bestScores) {
    player.bestScores = {}
  }
  
  const currentBest = player.bestScores[gameType as keyof typeof player.bestScores] || 0
  if (score > currentBest) {
    player.bestScores[gameType as keyof typeof player.bestScores] = score
  }
  
  savePlayerToStorage(player)
  return player
}

// Check if we should use localStorage instead of database
export function shouldUseLocalStorage(): boolean {
  return isInMemoryDatabase() || typeof window !== 'undefined'
}

// Clear all stored data
export function clearStoredData(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}player`)
    localStorage.removeItem(`${STORAGE_PREFIX}scores`)
  } catch (error) {
    console.warn('Failed to clear stored data:', error)
  }
}

// Get storage usage info
export function getStorageInfo(): { used: number; available: number; percentage: number } {
  if (typeof window === 'undefined') return { used: 0, available: 0, percentage: 0 }
  
  try {
    let used = 0
    for (let key in localStorage) {
      if (key.startsWith(STORAGE_PREFIX)) {
        used += localStorage[key].length
      }
    }
    
    // Estimate 5MB limit for localStorage
    const available = 5 * 1024 * 1024 // 5MB in bytes
    const percentage = (used / available) * 100
    
    return { used, available, percentage }
  } catch {
    return { used: 0, available: 0, percentage: 0 }
  }
}