'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { usePlayer } from '@/contexts/PlayerContext'
import { Clock, RotateCcw, Trophy, Target, Zap, Brain } from 'lucide-react'

interface Question {
  id: number
  verb: any
  question: string
  correctAnswer: string
  options: string[]
  type: 'past' | 'participle' | 'translation' | 'multilingual'
}

interface GameVariant {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  theme: string
  questionCount: number
  timeLimit?: number
  pointsPerQuestion: number
}

const GAME_VARIANTS: GameVariant[] = [
  {
    id: 'easy-concentration',
    name: 'Concentración Fácil',
    description: 'Verbos básicos en pasado simple, 10 preguntas',
    difficulty: 'easy',
    theme: 'basic',
    questionCount: 10,
    pointsPerQuestion: 10
  },
  {
    id: 'medium-concentration',
    name: 'Concentración Media',
    description: 'Mezcla de pasado y participio, 15 preguntas',
    difficulty: 'medium',
    theme: 'mixed',
    questionCount: 15,
    pointsPerQuestion: 15
  },
  {
    id: 'hard-concentration',
    name: 'Concentración Difícil',
    description: 'Verbos irregulares y traducciones, 20 preguntas',
    difficulty: 'hard',
    theme: 'advanced',
    questionCount: 20,
    pointsPerQuestion: 20
  }
]

export default function ConcentrationGame() {
  const { player, updateScore, addExperience, saveGameScore } = usePlayer()
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [selectedVariant, setSelectedVariant] = useState<GameVariant | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameVerbs, setGameVerbs] = useState<any[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === 'playing' && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing' && !showResult) {
      handleAnswer()
    }
    return () => clearInterval(interval)
  }, [timeLeft, gameState, showResult])

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
        filteredVerbs = [...irregularVerbs.slice(0, 10), ...hardVerbs.slice(0, 10)]
      }
      
      // Additional difficulty filtering
      if (variant.difficulty === 'easy') {
        filteredVerbs = filteredVerbs.filter((v: any) => v.difficulty === 'easy')
      } else if (variant.difficulty === 'medium') {
        filteredVerbs = filteredVerbs.filter((v: any) => ['easy', 'medium'].includes(v.difficulty))
      }
      
      // Random selection
      const shuffled = filteredVerbs.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, variant.questionCount)
      
      setGameVerbs(selected)
      return selected
    } catch (error) {
      console.error('Error fetching verbs:', error)
      return []
    }
  }

  const generateQuestions = async (variant: GameVariant) => {
    const verbs = await fetchVerbs(variant)
    const gameQuestions: Question[] = []

    verbs.forEach((verb: any, index: number) => {
      let question: Question = {
        id: index,
        verb,
        question: '',
        correctAnswer: '',
        options: [],
        type: 'past'
      }

      if (variant.theme === 'basic') {
        question.question = `¿Cuál es el pasado de "${verb.infinitive}"?`
        question.correctAnswer = verb.past
        question.type = 'past'
      } else if (variant.theme === 'mixed') {
        const isPast = Math.random() > 0.5
        if (isPast) {
          question.question = `¿Cuál es el pasado de "${verb.infinitive}"?`
          question.correctAnswer = verb.past
          question.type = 'past'
        } else {
          question.question = `¿Cuál es el participio de "${verb.infinitive}"?`
          question.correctAnswer = verb.participle
          question.type = 'participle'
        }
      } else if (variant.theme === 'advanced') {
        // Mix of past, participle and translation
        const questionType = Math.random()
        if (questionType < 0.4) {
          question.question = `¿Cuál es el pasado de "${verb.infinitive}"?`
          question.correctAnswer = verb.past
          question.type = 'past'
        } else if (questionType < 0.7) {
          question.question = `¿Cuál es el participio de "${verb.infinitive}"?`
          question.correctAnswer = verb.participle
          question.type = 'participle'
        } else {
          question.question = `¿Cómo se traduce "${verb.infinitive}"?`
          question.correctAnswer = verb.spanish || verb.translation
          question.type = 'translation'
        }
      }

      // Generate options
      const allAnswers = verbs.map((v: any) => {
        if (question.type === 'translation' || question.type === 'multilingual') {
          return question.type === 'multilingual' 
            ? v.french || v.german || v.italian || v.portuguese || v.spanish || v.translation
            : v.spanish || v.translation
        } else if (question.type === 'past') {
          return v.past
        } else {
          return v.participle
        }
      }).filter(Boolean)

      const wrongAnswers = allAnswers
        .filter(answer => answer !== question.correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      question.options = [question.correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      gameQuestions.push(question)
    })

    return gameQuestions
  }

  const startGame = async (variant: GameVariant) => {
    setSelectedVariant(variant)
    const gameQuestions = await generateQuestions(variant)
    setQuestions(gameQuestions)
    setCurrentQuestion(0)
    setScore(0)
    setCorrectAnswers(0)
    setTimeLeft(variant.timeLimit || 0)
    setShowResult(false)
    setSelectedAnswer('')
    setGameState('playing')
  }

  const handleAnswer = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const points = selectedVariant?.pointsPerQuestion || 10
      const timeBonus = selectedVariant?.timeLimit ? Math.floor((timeLeft / (selectedVariant.timeLimit || 1)) * points) : 0
      setScore(score + points + timeBonus)
      setCorrectAnswers(correctAnswers + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer('')
        setShowResult(false)
        setTimeLeft(selectedVariant?.timeLimit || 0)
      } else {
        endGame()
      }
    }, 2000)
  }

  const endGame = () => {
    setGameState('finished')
    
    if (player && selectedVariant) {
      const accuracy = questions.length > 0 ? (score / (questions.length * 10)) * 100 : 0
      
      updateScore('concentration', score)
      addExperience(Math.floor(score / 10))
  const timeSpent = 0 // TODO: Implement proper time tracking
      saveGameScore('concentration', score, timeSpent, accuracy)
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setSelectedVariant(null)
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setCorrectAnswers(0)
    setTimeLeft(0)
    setShowResult(false)
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
              <Brain className="w-6 h-6 text-purple-600" />
              Juego de Concentración de Verbos
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
                      <span>{variant.questionCount} preguntas</span>
                      <span>{variant.pointsPerQuestion} pts</span>
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
    const question = questions[currentQuestion]
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{selectedVariant?.name}</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Pregunta {currentQuestion + 1}/{questions.length}</Badge>
              <Badge variant="outline">Puntos: {score}</Badge>
              {selectedVariant?.timeLimit && (
                <Badge variant={timeLeft <= 3 ? 'destructive' : 'outline'} className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeLeft}s
                </Badge>
              )}
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">{question.question}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                variant={showResult ? (
                  option === question.correctAnswer ? 'default' :
                  selectedAnswer === option ? 'destructive' : 'outline'
                ) : (
                  selectedAnswer === option ? 'default' : 'outline'
                )}
                className={`p-4 h-auto text-lg ${
                  showResult && option === question.correctAnswer ? 'bg-green-500 hover:bg-green-600' :
                  showResult && selectedAnswer === option && option !== question.correctAnswer ? 'bg-red-500 hover:bg-red-600' :
                  ''
                }`}
              >
                {option}
              </Button>
            ))}
          </div>

          {showResult && (
            <div className={`text-center p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="text-lg font-semibold">
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-1">
                  La respuesta correcta es: {question.correctAnswer}
                </p>
              )}
            </div>
          )}

          {!showResult && (
            <div className="text-center">
              <Button 
                onClick={handleAnswer}
                disabled={!selectedAnswer}
                size="lg"
                className="px-8"
              >
                Responder
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    const accuracy = Math.round((correctAnswers / questions.length) * 100)
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">¡Juego Completado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Respuestas Correctas</p>
              <p className="text-2xl font-bold">{correctAnswers}/{questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Precisión</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Puntuación Final</p>
            <p className="text-3xl font-bold text-green-600">{score}</p>
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