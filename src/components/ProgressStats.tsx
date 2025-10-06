'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, Clock, TrendingUp, BookOpen } from 'lucide-react'
import { usePlayer } from '@/contexts/PlayerContext'

interface GameScore {
  id: string
  gameType: string
  score: number
  moves?: number
  timeSpent: number
  accuracy: number
  completedAt: string
  verb?: string
  translation?: string
}

interface Stats {
  totalGames: number
  totalScore: number
  bestScore: number
  averageScore: number
  totalTime: number
  averageAccuracy: number
  memoryGames: number
  concentrationGames: number
  matchingGames: number
  wordSearchGames: number
  crosswordGames: number
  recentScores: GameScore[]
}

export default function ProgressStats() {
  const { player } = usePlayer()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('ProgressStats rendered, player:', player)

  // Test function - remove this after testing
  const testSaveScore = () => {
    if (!player) return
    
    const testScore = {
      id: `test_${Date.now()}`,
      gameType: 'wordsearch',
      score: 100,
      timeSpent: 60,
      accuracy: 85,
      completedAt: new Date().toISOString()
    }
    
    const storageKey = `gameScores_${player.id}`
    const existingScores = localStorage.getItem(storageKey)
    const scores = existingScores ? JSON.parse(existingScores) : []
    scores.push(testScore)
    localStorage.setItem(storageKey, JSON.stringify(scores))
    
    console.log('Test score saved:', testScore)
    fetchStats() // Refresh stats
  }

  useEffect(() => {
    console.log('ProgressStats useEffect triggered, player:', player)
    if (player) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [player])

  const fetchStats = async () => {
    if (!player) return

    try {
      setLoading(true)
      // Get scores from localStorage
      const storageKey = `gameScores_${player.id}`
      console.log('Looking for scores with key:', storageKey)
      const storedScores = localStorage.getItem(storageKey)
      console.log('Raw stored scores:', storedScores)
      const scores: GameScore[] = storedScores ? JSON.parse(storedScores) : []
      
      console.log(`Found ${scores.length} scores for player ${player.id}:`, scores)
      
      const calculatedStats: Stats = {
        totalGames: scores.length,
        totalScore: scores.reduce((sum, score) => sum + score.score, 0),
        bestScore: Math.max(...scores.map(s => s.score), 0),
        averageScore: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length) : 0,
        totalTime: scores.reduce((sum, score) => sum + score.timeSpent, 0),
        averageAccuracy: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score.accuracy, 0) / scores.length) : 0,
        memoryGames: scores.filter(s => s.gameType === 'memory').length,
        concentrationGames: scores.filter(s => s.gameType === 'concentration').length,
        matchingGames: scores.filter(s => s.gameType === 'matching').length,
        wordSearchGames: scores.filter(s => s.gameType === 'wordsearch').length,
        crosswordGames: scores.filter(s => s.gameType === 'crossword').length,
        recentScores: scores.slice(0, 10).reverse()
      }
      
      console.log('Calculated stats:', calculatedStats)
      setStats(calculatedStats)
    } catch (err) {
      setError('Error al cargar las estadísticas.')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getGameTypeColor = (gameType: string) => {
    switch (gameType) {
      case 'memory': return 'bg-green-100 text-green-800'
      case 'concentration': return 'bg-purple-100 text-purple-800'
      case 'matching': return 'bg-blue-100 text-blue-800'
      case 'wordsearch': return 'bg-orange-100 text-orange-800'
      case 'crossword': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGameTypeLabel = (gameType: string) => {
    switch (gameType) {
      case 'memory': return 'Memoria'
      case 'concentration': return 'Concentración'
      case 'matching': return 'Apareamiento'
      case 'wordsearch': return 'Sopa de Letras'
      case 'crossword': return 'Crucigrama'
      default: return gameType
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!player) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ingresa tu Nombre para Ver Estadísticas</h3>
            <p className="text-gray-600">
              Ingresa tu nombre para guardar tu progreso y ver tus estadísticas detalladas.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchStats} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Reintentar
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Estadísticas de Progreso - {player.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
              <p className="text-sm text-gray-600">Juegos Totales</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.bestScore}</p>
              <p className="text-sm text-gray-600">Mejor Puntuación</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
              <p className="text-sm text-gray-600">Puntuación Media</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTime)}</p>
              <p className="text-sm text-gray-600">Tiempo Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución de Juegos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Juego de Memoria</span>
                <span className="text-sm text-gray-600">{stats.memoryGames} juegos</span>
              </div>
              <Progress 
                value={stats.totalGames > 0 ? (stats.memoryGames / stats.totalGames) * 100 : 0} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Juego de Concentración</span>
                <span className="text-sm text-gray-600">{stats.concentrationGames} juegos</span>
              </div>
              <Progress 
                value={stats.totalGames > 0 ? (stats.concentrationGames / stats.totalGames) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Juego de Apareamiento</span>
                <span className="text-sm text-gray-600">{stats.matchingGames} juegos</span>
              </div>
              <Progress 
                value={stats.totalGames > 0 ? (stats.matchingGames / stats.totalGames) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sopa de Letras</span>
                <span className="text-sm text-gray-600">{stats.wordSearchGames} juegos</span>
              </div>
              <Progress 
                value={stats.totalGames > 0 ? (stats.wordSearchGames / stats.totalGames) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Crucigrama</span>
                <span className="text-sm text-gray-600">{stats.crosswordGames} juegos</span>
              </div>
              <Progress 
                value={stats.totalGames > 0 ? (stats.crosswordGames / stats.totalGames) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rendimiento General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Precisión Promedio</span>
                <span className="text-sm text-gray-600">{stats.averageAccuracy}%</span>
              </div>
              <Progress value={stats.averageAccuracy} className="h-2" />
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Puntuación total acumulada: <span className="font-bold text-purple-600">{stats.totalScore}</span></p>
              <p>Tiempo promedio por juego: <span className="font-bold text-blue-600">
                {stats.totalGames > 0 ? formatTime(Math.round(stats.totalTime / stats.totalGames)) : '0s'}
              </span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.recentScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Partidas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentScores.map((score) => (
                <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getGameTypeColor(score.gameType)}>
                      {getGameTypeLabel(score.gameType)}
                    </Badge>
                    <div>
                      <p className="font-medium text-gray-900">{score.verb || 'Verbo'}</p>
                      <p className="text-sm text-gray-600">
                        {score.translation || 'Traducción'} • {score.accuracy}% precisión
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getScoreColor(score.score, stats.bestScore)}`}>
                      {score.score} pts
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(score.timeSpent)}
                      {score.moves && ` • ${score.moves} movimientos`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.totalGames === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">¡Aún no has jugado!</h3>
            <p className="text-gray-600 mb-4">
              Comienza a jugar en los diferentes juegos para ver tus estadísticas aquí.
            </p>
            {/* Temporary test button */}
            <button 
              onClick={testSaveScore}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mr-2"
            >
              Guardar Puntuación de Prueba
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}