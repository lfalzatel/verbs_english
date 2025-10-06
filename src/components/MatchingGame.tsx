'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { usePlayer } from '@/contexts/PlayerContext'
import { Clock, RotateCcw, Trophy, ArrowLeftRight, Languages, Globe } from 'lucide-react'

interface DraggableItem {
  id: string
  content: string
  type: 'left' | 'right'
  verbId: number
  matched: boolean
  correctPartner?: string
}

interface GameVariant {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  theme: string
  pairCount: number
  timeLimit?: number
  leftColumnTitle: string
  rightColumnTitle: string
}

const GAME_VARIANTS: GameVariant[] = [
  {
    id: 'easy-matching',
    name: 'Conexión Fácil',
    description: 'Conecta verbos básicos con su traducción, 8 pares',
    difficulty: 'easy',
    theme: 'basic',
    pairCount: 8,
    leftColumnTitle: 'Infinitivo en Inglés',
    rightColumnTitle: 'Traducción en Español'
  },
  {
    id: 'medium-matching',
    name: 'Conexión Media',
    description: 'Conecta infinitivos con pasado y participio, 12 pares',
    difficulty: 'medium',
    theme: 'mixed',
    pairCount: 12,
    leftColumnTitle: 'Infinitivo',
    rightColumnTitle: 'Pasado / Participio'
  },
  {
    id: 'hard-matching',
    name: 'Conexión Difícil',
    description: 'Verbos irregulares y formas avanzadas, 16 pares',
    difficulty: 'hard',
    theme: 'advanced',
    pairCount: 16,
    leftColumnTitle: 'Verbo',
    rightColumnTitle: 'Forma Correspondiente'
  }
]

export default function MatchingGame() {
  const { player, updateScore, addExperience, saveGameScore } = usePlayer()
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [selectedVariant, setSelectedVariant] = useState<GameVariant | null>(null)
  const [leftItems, setLeftItems] = useState<DraggableItem[]>([])
  const [rightItems, setRightItems] = useState<DraggableItem[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [time, setTime] = useState(0)
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
        filteredVerbs = [...irregularVerbs.slice(0, 8), ...hardVerbs.slice(0, 8)]
      }
      
      // Additional difficulty filtering
      if (variant.difficulty === 'easy') {
        filteredVerbs = filteredVerbs.filter((v: any) => v.difficulty === 'easy')
      } else if (variant.difficulty === 'medium') {
        filteredVerbs = filteredVerbs.filter((v: any) => ['easy', 'medium'].includes(v.difficulty))
      }
      
      // Random selection
      const shuffled = filteredVerbs.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, variant.pairCount)
      
      setGameVerbs(selected)
      return selected
    } catch (error) {
      console.error('Error fetching verbs:', error)
      return []
    }
  }

  const createGameItems = async (variant: GameVariant) => {
    const verbs = await fetchVerbs(variant)
    const left: DraggableItem[] = []
    const right: DraggableItem[] = []

    verbs.forEach((verb: any, index: number) => {
      let leftContent = ''
      let rightContent = ''
      let correctPartner = ''

      if (variant.theme === 'basic') {
        leftContent = verb.infinitive
        rightContent = verb.spanish || verb.translation
        correctPartner = rightContent
      } else if (variant.theme === 'mixed') {
        leftContent = verb.infinitive
        // Mix between past and participle
        if (Math.random() < 0.5) {
          rightContent = verb.past
        } else {
          rightContent = verb.participle
        }
        correctPartner = rightContent
      } else if (variant.theme === 'advanced') {
        // Mix of all forms randomly
        const forms = ['past', 'participle', 'translation']
        const selectedForm = forms[Math.floor(Math.random() * forms.length)]
        leftContent = verb.infinitive
        rightContent = verb[selectedForm as keyof typeof verb] || verb.translation
        correctPartner = rightContent
      }

      left.push({
        id: `left-${index}`,
        content: leftContent,
        type: 'left',
        verbId: verb.id,
        matched: false,
        correctPartner
      })

      right.push({
        id: `right-${index}`,
        content: rightContent,
        type: 'right',
        verbId: verb.id,
        matched: false,
        correctPartner: leftContent
      })
    })

    // Shuffle right items
    const shuffledRight = right.sort(() => Math.random() - 0.5)
    
    setLeftItems(left)
    setRightItems(shuffledRight)
  }

  const startGame = async (variant: GameVariant) => {
    setSelectedVariant(variant)
    await createGameItems(variant)
    setGameState('playing')
    setMatches(0)
    setAttempts(0)
    setTime(0)
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  const handleItemClick = (itemId: string, type: 'left' | 'right') => {
    if (type === 'left') {
      setSelectedLeft(itemId)
      setSelectedRight(null)
    } else {
      setSelectedRight(itemId)
      setSelectedLeft(null)
    }

    // Check for match
    if (type === 'left' && selectedRight) {
      checkMatch(itemId, selectedRight)
    } else if (type === 'right' && selectedLeft) {
      checkMatch(selectedLeft, itemId)
    }
  }

  const checkMatch = (leftId: string, rightId: string) => {
    const leftItem = leftItems.find(item => item.id === leftId)
    const rightItem = rightItems.find(item => item.id === rightId)
    
    setAttempts(attempts + 1)

    if (leftItem && rightItem && leftItem.verbId === rightItem.verbId) {
      // Match found
      setLeftItems(prev => prev.map(item => 
        item.id === leftId ? { ...item, matched: true } : item
      ))
      setRightItems(prev => prev.map(item => 
        item.id === rightId ? { ...item, matched: true } : item
      ))
      setMatches(matches + 1)
      
      // Check if game is finished
      if (matches + 1 === leftItems.length) {
        endGame()
      }
    }

    setSelectedLeft(null)
    setSelectedRight(null)
  }

  const endGame = () => {
    setGameState('finished')
    
    if (player && selectedVariant) {
      const accuracy = matches > 0 ? (matches / attempts) * 100 : 0
      const timeBonus = selectedVariant.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 100 - time)
      const score = Math.floor((matches * 50) + (accuracy * 10) + timeBonus)
      
      updateScore('matching', score)
      addExperience(Math.floor(score / 10))
      saveGameScore('matching', score, time, accuracy)
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setSelectedVariant(null)
    setLeftItems([])
    setRightItems([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatches(0)
    setAttempts(0)
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
              <ArrowLeftRight className="w-6 h-6 text-blue-600" />
              Juego de Conexión de Verbos
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
                      <span>{variant.pairCount} pares</span>
                      <span>Conexión</span>
                    </div>
                    <Button 
                      onClick={() => startGame(variant)} 
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
              <Badge variant="outline">Parejas: {matches}/{leftItems.length}</Badge>
              <Badge variant="outline">Intentos: {attempts}</Badge>
              <Badge variant="outline">
                {selectedVariant?.timeLimit ? `Tiempo: ${selectedVariant.timeLimit - time}s` : `Tiempo: ${formatTime(time)}`}
              </Badge>
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
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">{selectedVariant?.leftColumnTitle}</h3>
              <div className="space-y-2">
                {leftItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => !item.matched && handleItemClick(item.id, 'left')}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      item.matched 
                        ? 'bg-green-100 text-green-800 line-through opacity-50' 
                        : selectedLeft === item.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">{selectedVariant?.rightColumnTitle}</h3>
              <div className="space-y-2">
                {rightItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => !item.matched && handleItemClick(item.id, 'right')}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      item.matched 
                        ? 'bg-green-100 text-green-800 line-through opacity-50' 
                        : selectedRight === item.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedVariant?.theme === 'multilingual' && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="flex items-center gap-2 mx-auto w-fit">
                <Globe className="w-4 h-4" />
                Modo Políglota - Múltiples Idiomas
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    const accuracy = attempts > 0 ? Math.round((matches / attempts) * 100) : 0
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">¡Conexión Completada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Parejas Conectadas</p>
              <p className="text-2xl font-bold">{matches}/{leftItems.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Precisión</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tiempo</p>
            <p className="text-xl font-bold">{formatTime(time)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Puntuación</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.floor((matches * 50) + (accuracy * 10) + (selectedVariant?.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 100 - time)))}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => selectedVariant && startGame(selectedVariant)}>
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