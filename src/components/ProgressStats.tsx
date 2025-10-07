'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, Clock, TrendingUp, BookOpen } from 'lucide-react'

interface Score {
  id: number
  playerName: string
  gameType: string
  score: number
  moves?: number
  timeSpent: number
  completedAt: string
  verb: {
    infinitive: string
    translation: string
  }
}

interface Stats {
  totalGames: number
  totalScore: number
  bestScore: number
  averageScore: number
  totalTime: number
  memoryGames: number
  concentrationGames: number
  recentScores: Score[]
}

export default function ProgressStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scores')
      if (!response.ok) {
        throw new Error('Failed to fetch scores')
      }
      const scores: Score[] = await response.json()
      
      const calculatedStats: Stats = {
        totalGames: scores.length,
        totalScore: scores.reduce((sum, score) => sum + score.score, 0),
        bestScore: Math.max(...scores.map(s => s.score), 0),
        averageScore: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length) : 0,
        totalTime: scores.reduce((sum, score) => sum + score.timeSpent, 0),
        memoryGames: scores.filter(s => s.gameType === 'memory').length,
        concentrationGames: scores.filter(s => s.gameType === 'concentration').length,
        recentScores: scores.slice(0, 10)
      }
      
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
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGameTypeLabel = (gameType: string) => {
    switch (gameType) {
      case 'memory': return 'Memoria'
      case 'concentration': return 'Concentración'
      default: return gameType
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
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
            Estadísticas de Progreso
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rendimiento General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progreso General</span>
                <span className="text-sm text-gray-600">
                  {stats.bestScore > 0 ? Math.min(100, Math.round((stats.averageScore / stats.bestScore) * 100)) : 0}%
                </span>
              </div>
              <Progress 
                value={stats.bestScore > 0 ? Math.min(100, Math.round((stats.averageScore / stats.bestScore) * 100)) : 0} 
                className="h-2"
              />
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Puntuación total acumulada: <span className="font-bold text-purple-600">{stats.totalScore}</span></p>
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
                      <p className="font-medium text-gray-900">{score.playerName}</p>
                      <p className="text-sm text-gray-600">
                        {score.verb.infinitive} - {score.verb.translation}
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
            <p className="text-gray-600">
              Comienza a jugar en los juegos de memoria o concentración para ver tus estadísticas aquí.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}