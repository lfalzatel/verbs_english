'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { usePlayer } from '@/contexts/PlayerContext'
import { Clock, RotateCcw, Trophy, Sparkles, Brain } from 'lucide-react'

interface Card {
  id: number
  content: string
  type: 'infinitive' | 'past' | 'participle' | 'translation'
  verbId: number
  isFlipped: boolean
  isMatched: boolean
}

interface GameVariant {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  theme: string
  cardCount: number
  timeLimit?: number
}

const GAME_VARIANTS: GameVariant[] = [
  {
    id: 'easy-memory',
    name: 'Memoria Fácil',
    description: 'Verbos básicos con traducciones, 12 cartas',
    difficulty: 'easy',
    theme: 'basic',
    cardCount: 12
  },
  {
    id: 'medium-memory',
    name: 'Memoria Media',
    description: 'Verbos intermedios en pasado y participio, 20 cartas',
    difficulty: 'medium',
    theme: 'mixed',
    cardCount: 20
  },
  {
    id: 'hard-memory',
    name: 'Memoria Difícil',
    description: 'Verbos avanzados e irregulares, 30 cartas',
    difficulty: 'hard',
    theme: 'advanced',
    cardCount: 30
  }
]

export default function MemoryGame() {
  const { player, updateScore, addExperience, saveGameScore } = usePlayer()
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [selectedVariant, setSelectedVariant] = useState<GameVariant | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [time, setTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [gameVerbs, setGameVerbs] = useState<any[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing' && !selectedVariant?.timeLimit) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, selectedVariant])

  useEffect(() => {
    if (selectedVariant?.timeLimit && time >= selectedVariant.timeLimit) {
      endGame()
    }
  }, [time, selectedVariant])

  const fetchVerbs = async (variant: GameVariant) => {
    try {
      const response = await fetch('/api/verbs')
      const verbs = await response.json()
      
      let filteredVerbs = verbs
      
      // Filter by theme and difficulty
      if (variant.theme === 'basic') {
        filteredVerbs = verbs.filter((v: any) => v.difficulty === 'easy')
      } else if (variant.theme === 'mixed') {
        filteredVerbs = verbs.filter((v: any) => ['easy', 'medium'].includes(v.difficulty))
      } else if (variant.theme === 'advanced') {
        // Mix of irregular and hard verbs
        const irregularVerbs = verbs.filter((v: any) => v.category === 'irregular')
        const hardVerbs = verbs.filter((v: any) => v.difficulty === 'hard')
        filteredVerbs = [...irregularVerbs.slice(0, 8), ...hardVerbs.slice(0, 7)]
      }
      
      // Additional difficulty filtering
      if (variant.difficulty === 'easy') {
        filteredVerbs = filteredVerbs.filter((v: any) => v.difficulty === 'easy')
      } else if (variant.difficulty === 'medium') {
        filteredVerbs = filteredVerbs.filter((v: any) => ['easy', 'medium'].includes(v.difficulty))
      }
      
      // Random selection
      const shuffled = filteredVerbs.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, variant.cardCount / 2)
      
      setGameVerbs(selected)
      return selected
    } catch (error) {
      console.error('Error fetching verbs:', error)
      return []
    }
  }

  const initializeGame = async (variant: GameVariant) => {
    setSelectedVariant(variant)
    const verbs = await fetchVerbs(variant)
    
    const gameCards: Card[] = []
    let cardId = 0

    verbs.forEach((verb: any) => {
      // Create pairs based on difficulty
      if (variant.difficulty === 'easy') {
        gameCards.push(
          { id: cardId++, content: verb.infinitive, type: 'infinitive', verbId: verb.id, isFlipped: false, isMatched: false },
          { id: cardId++, content: verb.translation, type: 'translation', verbId: verb.id, isFlipped: false, isMatched: false }
        )
      } else if (variant.difficulty === 'medium') {
        // Mix of infinitive-translation and past-participle pairs
        if (Math.random() < 0.5) {
          gameCards.push(
            { id: cardId++, content: verb.infinitive, type: 'infinitive', verbId: verb.id, isFlipped: false, isMatched: false },
            { id: cardId++, content: verb.translation, type: 'translation', verbId: verb.id, isFlipped: false, isMatched: false }
          )
        } else {
          gameCards.push(
            { id: cardId++, content: verb.past, type: 'past', verbId: verb.id, isFlipped: false, isMatched: false },
            { id: cardId++, content: verb.participle, type: 'participle', verbId: verb.id, isFlipped: false, isMatched: false }
          )
        }
      } else {
        // Hard: mix all forms randomly
        const forms = ['infinitive', 'past', 'participle', 'translation']
        const form1 = forms[Math.floor(Math.random() * forms.length)]
        const form2 = forms[Math.floor(Math.random() * forms.length)]
        
        gameCards.push(
          { id: cardId++, content: verb[form1] || verb.infinitive, type: form1 as any, verbId: verb.id, isFlipped: false, isMatched: false },
          { id: cardId++, content: verb[form2] || verb.translation, type: form2 as any, verbId: verb.id, isFlipped: false, isMatched: false }
        )
      }
    })

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setGameState('playing')
    setMoves(0)
    setMatches(0)
    setTime(0)
    setFlippedCards([])
  }

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return
    if (flippedCards.length === 2) return
    if (cards.find(c => c.id === cardId)?.isMatched) return
    if (flippedCards.includes(cardId)) return

    // Flip the card
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ))

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setIsProcessing(true)
      setMoves(moves + 1)
      
      const [first, second] = newFlippedCards
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard && secondCard && firstCard.verbId === secondCard.verbId) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(matches + 1)
          setFlippedCards([])
          setIsProcessing(false)
          
          // Check if game is finished
          if (matches + 1 === cards.length / 2) {
            endGame()
          }
        }, 1000)
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
          setIsProcessing(false)
        }, 1500)
      }
    }
  }

  const endGame = () => {
    setGameState('finished')
    
    if (player && selectedVariant) {
      const score = Math.max(100 - moves + (selectedVariant.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 100 - time)), 10)
      const accuracy = cards.length > 0 ? (matches / (cards.length / 2)) * 100 : 0
      
      updateScore('memory', score)
      addExperience(Math.floor(score / 10))
      saveGameScore('memory', score, time, accuracy)
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setSelectedVariant(null)
    setCards([])
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!player) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-lg">Por favor ingresa tu nombre para jugar</p>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'menu') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              Juego de Memoria de Verbos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {GAME_VARIANTS.map(variant => (
                <Card key={variant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{variant.name}</CardTitle>
                      <Badge className={getDifficultyColor(variant.difficulty)}>
                        {variant.difficulty === 'easy' ? 'Fácil' : variant.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{variant.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{variant.cardCount} cartas</span>
                      <span>{variant.cardCount / 2} parejas</span>
                    </div>
                    <Button 
                      onClick={() => initializeGame(variant)} 
                      className="w-full"
                    >
                      Comenzar Juego
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === 'playing') {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{selectedVariant?.name}</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Movimientos: {moves}</Badge>
              <Badge variant="outline">
                {selectedVariant?.timeLimit ? `Tiempo: ${selectedVariant.timeLimit - time}s` : `Tiempo: ${formatTime(time)}`}
              </Badge>
              <Badge variant="outline">Parejas: {matches}/{cards.length / 2}</Badge>
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
          {selectedVariant?.timeLimit && (
            <Progress value={(time / selectedVariant.timeLimit) * 100} className="w-full" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`grid gap-3 ${cards.length <= 12 ? 'grid-cols-4' : cards.length <= 20 ? 'grid-cols-6' : 'grid-cols-8'}`}>
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  card.isFlipped || card.isMatched
                    ? card.isMatched 
                      ? 'bg-green-500 text-white scale-95'
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <span className="text-xs font-medium text-center">
                  {card.isFlipped || card.isMatched ? card.content : '?'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">¡Juego Completado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Movimientos</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tiempo</p>
              <p className="text-2xl font-bold">{formatTime(time)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Puntuación</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.max(100 - moves + (selectedVariant?.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 100 - time)), 10)}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => selectedVariant && initializeGame(selectedVariant)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Jugar de Nuevo
            </Button>
            <Button onClick={resetGame} variant="outline">
              Otra Variante
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}