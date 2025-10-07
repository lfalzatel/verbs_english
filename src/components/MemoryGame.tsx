'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, RotateCcw, Trophy, Clock } from 'lucide-react'

interface CardData {
  id: number
  content: string
  type: 'english' | 'spanish'
  pairId: number
  isFlipped: boolean
  isMatched: boolean
}

const verbPairs = [
  { english: 'be', spanish: 'ser/estar' },
  { english: 'have', spanish: 'tener' },
  { english: 'do', spanish: 'hacer' },
  { english: 'go', spanish: 'ir' },
  { english: 'eat', spanish: 'comer' },
  { english: 'sleep', spanish: 'dormir' },
  { english: 'study', spanish: 'estudiar' },
  { english: 'work', spanish: 'trabajar' },
  { english: 'play', spanish: 'jugar' },
  { english: 'write', spanish: 'escribir' },
  { english: 'read', spanish: 'leer' },
  { english: 'run', spanish: 'correr' }
]

export default function MemoryGame() {
  const [cards, setCards] = useState<CardData[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [bestScore, setBestScore] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameCompleted])

  useEffect(() => {
    const saved = localStorage.getItem('memoryGameBestScore')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  const initializeGame = () => {
    const gameCards: CardData[] = []
    let id = 0

    verbPairs.forEach((pair, pairIndex) => {
      gameCards.push({
        id: id++,
        content: pair.english,
        type: 'english',
        pairId: pairIndex,
        isFlipped: false,
        isMatched: false
      })
      gameCards.push({
        id: id++,
        content: pair.spanish,
        type: 'spanish',
        pairId: pairIndex,
        isFlipped: false,
        isMatched: false
      })
    })

    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setSelectedCards([])
    setMoves(0)
    setMatches(0)
    setGameStarted(true)
    setGameCompleted(false)
    setTimer(0)
  }

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameCompleted) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return
    if (selectedCards.length === 2) return

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    )
    setCards(newCards)

    const newSelected = [...selectedCards, cardId]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1)
      checkForMatch(newSelected)
    }
  }

  const checkForMatch = (selected: number[]) => {
    const [first, second] = selected.map(id => cards.find(c => c.id === id))
    
    if (first && second && first.pairId === second.pairId && first.type !== second.type) {
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === first.id || c.id === second.id
            ? { ...c, isMatched: true }
            : c
        ))
        setMatches(prev => {
          const newMatches = prev + 1
          if (newMatches === verbPairs.length) {
            completeGame()
          }
          return newMatches
        })
        setSelectedCards([])
      }, 600)
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          selected.includes(c.id) ? { ...c, isFlipped: false } : c
        ))
        setSelectedCards([])
      }, 1000)
    }
  }

  const completeGame = () => {
    setGameCompleted(true)
    const score = moves
    if (!bestScore || score < bestScore) {
      setBestScore(score)
      localStorage.setItem('memoryGameBestScore', score.toString())
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (matches / verbPairs.length) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-green-600" />
            Juego de Memoria - Verbos en Inglés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Encuentra las parejas de verbos en inglés y sus traducciones en español.
              ¡Usa tu memoria para hacer el menor número de movimientos posible!
            </p>

            {!gameStarted && (
              <Button onClick={initializeGame} size="lg" className="bg-green-600 hover:bg-green-700">
                <Brain className="w-5 h-5 mr-2" />
                Comenzar Juego
              </Button>
            )}

            {gameStarted && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Movimientos</p>
                  <p className="text-2xl font-bold text-blue-600">{moves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Parejas</p>
                  <p className="text-2xl font-bold text-green-600">{matches}/{verbPairs.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Tiempo</p>
                  <p className="text-2xl font-bold text-purple-600">{formatTime(timer)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Mejor Puntuación</p>
                  <p className="text-2xl font-bold text-yellow-600">{bestScore || '-'}</p>
                </div>
              </div>
            )}

            {gameStarted && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {gameStarted && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                relative aspect-square cursor-pointer transform transition-all duration-300
                ${card.isFlipped || card.isMatched ? 'rotate-0' : 'hover:scale-105'}
                ${card.isMatched ? 'opacity-60' : ''}
              `}
            >
              <div className={`
                absolute inset-0 rounded-lg transition-all duration-300 transform-gpu
                ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
              `} style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center backface-hidden shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className={`
                  absolute inset-0 rounded-lg flex items-center justify-center backface-hidden shadow-lg
                  ${card.type === 'english' 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gradient-to-br from-orange-400 to-orange-600'}
                  ${card.isMatched ? 'ring-4 ring-green-400' : ''}
                `} style={{ transform: 'rotateY(180deg)' }}>
                  <div className="text-center p-2">
                    <p className="text-white font-bold text-sm">
                      {card.content}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {card.type === 'english' ? 'EN' : 'ES'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {gameCompleted && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="text-center py-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">¡Felicidades!</h3>
            <p className="text-gray-700 mb-4">
              Completaste el juego en {moves} movimientos y {formatTime(timer)}.
            </p>
            {bestScore === moves && (
              <p className="text-sm text-green-600 font-medium mb-4">
                ¡Nueva mejor puntuación!
              </p>
            )}
            <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Jugar de Nuevo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}