'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Player {
  id: string
  name: string
  avatar?: string
  level: number
  experience: number
  totalGames: number
  bestScores: {
    memory: number
    concentration: number
    matching: number
    wordsearch: number
    crossword: number
  }
}

interface PlayerContextType {
  player: Player | null
  setPlayerName: (name: string) => void
  logout: () => void
  updateScore: (gameType: string, score: number) => void
  addExperience: (exp: number) => void
  saveGameScore: (gameType: string, score: number, timeSpent: number, accuracy: number) => void
  isLoading: boolean
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if player name is stored in localStorage
    const storedPlayer = localStorage.getItem('player_data')
    if (storedPlayer) {
      try {
        const playerData = JSON.parse(storedPlayer)
        setPlayer(playerData)
      } catch (error) {
        console.error('Error parsing player data:', error)
        localStorage.removeItem('player_data')
      }
    }
    setIsLoading(false)
  }, [])

  const setPlayerName = (name: string) => {
    if (!name || name.trim().length < 2) {
      return
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`,
      level: 1,
      experience: 0,
      totalGames: 0,
      bestScores: {
        memory: 0,
        concentration: 0,
        matching: 0,
        wordsearch: 0,
        crossword: 0
      }
    }

    setPlayer(newPlayer)
    localStorage.setItem('player_data', JSON.stringify(newPlayer))
  }

  const logout = () => {
    setPlayer(null)
    localStorage.removeItem('player_data')
  }

  const updateScore = (gameType: string, score: number) => {
    if (!player) return

    const updatedPlayer = {
      ...player,
      totalGames: player.totalGames + 1,
      bestScores: {
        ...player.bestScores,
        [gameType]: Math.max(player.bestScores[gameType as keyof typeof player.bestScores] || 0, score)
      }
    }

    setPlayer(updatedPlayer)
    localStorage.setItem('player_data', JSON.stringify(updatedPlayer))
  }

  const addExperience = (exp: number) => {
    if (!player) return

    const newExperience = player.experience + exp
    const newLevel = Math.floor(newExperience / 100) + 1 // 100 exp por nivel

    const updatedPlayer = {
      ...player,
      experience: newExperience,
      level: newLevel
    }

    setPlayer(updatedPlayer)
    localStorage.setItem('player_data', JSON.stringify(updatedPlayer))
  }

  const saveGameScore = (gameType: string, score: number, timeSpent: number, accuracy: number) => {
    if (!player) {
      console.log('saveGameScore: No player found')
      return
    }

    console.log(`saveGameScore called for ${gameType}: ${score} points, ${timeSpent}s, ${accuracy}% accuracy`)
    console.log('Player ID:', player.id)

    // Save detailed score to localStorage for stats
    const gameScore = {
      id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameType,
      score,
      timeSpent,
      accuracy,
      completedAt: new Date().toISOString()
    }

    const storageKey = `gameScores_${player.id}`
    console.log('Saving to key:', storageKey)
    
    const existingScores = localStorage.getItem(storageKey)
    console.log('Existing scores:', existingScores)
    
    const scores = existingScores ? JSON.parse(existingScores) : []
    scores.push(gameScore)
    localStorage.setItem(storageKey, JSON.stringify(scores))
    
    console.log('Updated scores:', JSON.stringify(scores))

    // Also update player's basic stats
    updateScore(gameType, score)
    addExperience(Math.floor(score / 10))

    console.log(`Successfully saved score for ${gameType}: ${score} points, ${timeSpent}s, ${accuracy}% accuracy`)
  }

  return (
    <PlayerContext.Provider value={{ player, setPlayerName, logout, updateScore, addExperience, saveGameScore, isLoading }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}