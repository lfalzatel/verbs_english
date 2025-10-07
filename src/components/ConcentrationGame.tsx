'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Clock, Target, Zap, RotateCcw } from 'lucide-react'

interface Question {
  id: number
  english: string
  spanish: string
  options: string[]
  correct: string
}

const questions: Question[] = [
  {
    id: 1,
    english: 'to be',
    spanish: 'ser/estar',
    options: ['tener', 'ser/estar', 'hacer', 'ir'],
    correct: 'ser/estar'
  },
  {
    id: 2,
    english: 'to have',
    spanish: 'tener',
    options: ['tener', 'ser', 'hacer', 'comer'],
    correct: 'tener'
  },
  {
    id: 3,
    english: 'to do',
    spanish: 'hacer',
    options: ['jugar', 'trabajar', 'hacer', 'estudiar'],
    correct: 'hacer'
  },
  {
    id: 4,
    english: 'to go',
    spanish: 'ir',
    options: ['venir', 'ir', 'salir', 'llegar'],
    correct: 'ir'
  },
  {
    id: 5,
    english: 'to eat',
    spanish: 'comer',
    options: ['beber', 'comer', 'cocinar', 'probar'],
    correct: 'comer'
  },
  {
    id: 6,
    english: 'to sleep',
    spanish: 'dormir',
    options: ['descansar', 'jugar', 'dormir', 'soñar'],
    correct: 'dormir'
  },
  {
    id: 7,
    english: 'to study',
    spanish: 'estudiar',
    options: ['aprender', 'enseñar', 'leer', 'estudiar'],
    correct: 'estudiar'
  },
  {
    id: 8,
    english: 'to work',
    spanish: 'trabajar',
    options: ['descansar', 'jugar', 'trabajar', 'viajar'],
    correct: 'trabajar'
  },
  {
    id: 9,
    english: 'to play',
    spanish: 'jugar',
    options: ['ganar', 'perder', 'jugar', 'competir'],
    correct: 'jugar'
  },
  {
    id: 10,
    english: 'to write',
    spanish: 'escribir',
    options: ['leer', 'escribir', 'dibujar', 'pintar'],
    correct: 'escribir'
  },
  {
    id: 11,
    english: 'to read',
    spanish: 'leer',
    options: ['escuchar', 'hablar', 'leer', 'ver'],
    correct: 'leer'
  },
  {
    id: 12,
    english: 'to run',
    spanish: 'correr',
    options: ['caminar', 'saltar', 'correr', 'nadar'],
    correct: 'correr'
  },
  {
    id: 13,
    english: 'to swim',
    spanish: 'nadar',
    options: ['volar', 'nadar', 'bucear', 'flotar'],
    correct: 'nadar'
  },
  {
    id: 14,
    english: 'to drive',
    spanish: 'conducir',
    options: ['caminar', 'correr', 'conducir', 'viajar'],
    correct: 'conducir'
  },
  {
    id: 15,
    english: 'to teach',
    spanish: 'enseñar',
    options: ['aprender', 'estudiar', 'enseñar', 'practicar'],
    correct: 'enseñar'
  }
]

export default function ConcentrationGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [usedQuestions, setUsedQuestions] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('concentrationGameBestScore')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameCompleted && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !gameCompleted) {
      handleTimeout()
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameCompleted, timeLeft, showResult])

  const getRandomQuestion = useCallback(() => {
    const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id))
    if (availableQuestions.length === 0) {
      return null
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    return availableQuestions[randomIndex]
  }, [usedQuestions])

  const startGame = () => {
    setGameStarted(true)
    setGameCompleted(false)
    setScore(0)
    setTimeLeft(30)
    setStreak(0)
    setUsedQuestions([])
    setSelectedAnswer('')
    setShowResult(false)
    loadNewQuestion()
  }

  const loadNewQuestion = () => {
    const question = getRandomQuestion()
    if (!question) {
      completeGame()
      return
    }
    setCurrentQuestion(question)
    setUsedQuestions(prev => [...prev, question.id])
    setSelectedAnswer('')
    setShowResult(false)
    setTimeLeft(30)
  }

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    const correct = answer === currentQuestion?.correct
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const points = Math.max(10, Math.floor(timeLeft / 3) * 10)
      const streakBonus = streak * 5
      setScore(prev => prev + points + streakBonus)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (correct) {
        loadNewQuestion()
      } else {
        completeGame()
      }
    }, 2000)
  }

  const handleTimeout = () => {
    setShowResult(true)
    setIsCorrect(false)
    setStreak(0)
    setTimeout(() => {
      completeGame()
    }, 2000)
  }

  const completeGame = () => {
    setGameCompleted(true)
    if (!bestScore || score > bestScore) {
      setBestScore(score)
      localStorage.setItem('concentrationGameBestScore', score.toString())
    }
  }

  const formatTime = (seconds: number) => {
    return `${seconds}s`
  }

  const getDifficultyColor = (timeLeft: number) => {
    if (timeLeft > 20) return 'text-green-600'
    if (timeLeft > 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 5) return 'bg-purple-500'
    if (streak >= 3) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Juego de Concentración - Velocidad y Precisión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Responde correctamente antes de que se acabe el tiempo. 
              ¡Construye una racha de respuestas correctas para obtener bonus!
            </p>

            {!gameStarted && (
              <Button onClick={startGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Zap className="w-5 h-5 mr-2" />
                Comenzar Desafío
              </Button>
            )}

            {gameStarted && currentQuestion && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Puntuación</p>
                  <p className="text-2xl font-bold text-purple-600">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Tiempo</p>
                  <p className={`text-2xl font-bold ${getDifficultyColor(timeLeft)}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Racha</p>
                  <div className="flex items-center justify-center gap-1">
                    <div className={`w-8 h-8 rounded-full ${getStreakColor(streak)} text-white flex items-center justify-center text-sm font-bold`}>
                      {streak}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Mejor Puntuación</p>
                  <p className="text-2xl font-bold text-yellow-600">{bestScore || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {gameStarted && currentQuestion && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <Badge variant="outline" className="text-sm">
                  Pregunta {usedQuestions.length}
                </Badge>
                <h3 className="text-2xl font-bold text-gray-800">
                  ¿Cuál es la traducción de:
                </h3>
                <div className="text-4xl font-bold text-purple-600 py-4">
                  "{currentQuestion.english}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    variant={showResult ? (option === currentQuestion.correct ? 'default' : 
                                   option === selectedAnswer ? 'destructive' : 'outline') : 'outline'}
                    className={`p-4 text-lg font-medium transition-all
                      ${!showResult && 'hover:bg-purple-100 hover:border-purple-300'}
                      ${showResult && option === currentQuestion.correct ? 'bg-green-600 hover:bg-green-700' : ''}
                      ${showResult && option === selectedAnswer && option !== currentQuestion.correct ? 'bg-red-600 hover:bg-red-700' : ''}
                    `}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓ ¡Correcto!' : '✗ Incorrecto'}
                  {isCorrect && streak > 0 && (
                    <div className="text-sm text-purple-600 mt-1">
                      +{Math.max(10, Math.floor(timeLeft / 3) * 10)} puntos 
                      {streak > 1 && ` +${streak * 5} bonus de racha`}
                    </div>
                  )}
                </div>
              )}

              {timeLeft <= 10 && !showResult && (
                <div className="text-red-600 font-bold animate-pulse">
                  ¡Apúrate! Queda poco tiempo.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {gameCompleted && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="text-center py-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 mb-2">
              {score > 50 ? '¡Excelente!' : score > 20 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
            </h3>
            <p className="text-gray-700 mb-4">
              Tu puntuación final: <span className="font-bold text-purple-600">{score}</span> puntos
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Respondiste correctamente {usedQuestions.length - (showResult && !isCorrect ? 1 : 0)} preguntas
            </p>
            {bestScore === score && score > 0 && (
              <p className="text-sm text-purple-600 font-medium mb-4">
                ¡Nueva mejor puntuación!
              </p>
            )}
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Jugar de Nuevo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}