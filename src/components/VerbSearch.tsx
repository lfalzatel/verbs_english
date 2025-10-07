'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Volume2, Play, Clock, Target, Award, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface Verb {
  id: number;
  infinitive: string;
  past: string;
  participle: string;
  translation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameLevel {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  wordCount: number;
  points: number;
  timeLimit: number;
  color: string;
}

const gameLevels: GameLevel[] = [
  {
    id: 'easy',
    name: 'Búsqueda Fácil',
    difficulty: 'easy',
    description: 'Verbos básicos - 15 palabras',
    wordCount: 15,
    points: 10,
    timeLimit: 180,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'medium',
    name: 'Búsqueda Media',
    difficulty: 'medium',
    description: 'Verbos intermedios - 20 palabras',
    wordCount: 20,
    points: 15,
    timeLimit: 240,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'hard',
    name: 'Búsqueda Difícil',
    difficulty: 'hard',
    description: 'Verbos avanzados - 15 palabras',
    wordCount: 15,
    points: 20,
    timeLimit: 300,
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export default function VerbSearch() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [gameVerbs, setGameVerbs] = useState<Verb[]>([]);
  const [currentVerb, setCurrentVerb] = useState<Verb | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<{verb: Verb, userAnswer: string, correct: boolean}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVerbs();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !gameCompleted) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const fetchVerbs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verbs');
      if (!response.ok) throw new Error('Failed to fetch verbs');
      const result = await response.json();
      if (result.success && result.data) {
        setVerbs(result.data);
      }
    } catch (err) {
      setError('Error al cargar los verbos');
      console.error('Error fetching verbs:', err);
    } finally {
      setLoading(false);
    }
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setScore(0);
    setCurrentIndex(0);
    setAnswers([]);
    setTimeLeft(level.timeLimit);
    setGameCompleted(false);

    // Filtrar verbos según la dificultad
    const filteredVerbs = verbs.filter(verb => verb.difficulty === level.difficulty);
    const selectedVerbs = filteredVerbs.slice(0, level.wordCount);
    setGameVerbs(selectedVerbs);
    setCurrentVerb(selectedVerbs[0]);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    if (!currentVerb || !userInput.trim()) return;

    const isCorrect = userInput.toLowerCase().trim() === currentVerb.translation.toLowerCase().trim();
    const newAnswers = [...answers, { verb: currentVerb, userAnswer: userInput, correct: isCorrect }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + selectedLevel!.points);
    }

    if (currentIndex < gameVerbs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentVerb(gameVerbs[nextIndex]);
      setUserInput('');
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
  };

  const resetGame = () => {
    setSelectedLevel(null);
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setCurrentIndex(0);
    setAnswers([]);
    setUserInput('');
    setCurrentVerb(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!selectedLevel) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Búsqueda de Verbos</h2>
          <p className="text-gray-600">Selecciona un nivel para comenzar a practicar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gameLevels.map((level) => (
            <Card 
              key={level.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${level.color}`}
              onClick={() => startGame(level)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{level.name}</span>
                  <Badge className={getDifficultyColor(level.difficulty)}>
                    {level.difficulty === 'easy' ? 'Fácil' : 
                     level.difficulty === 'medium' ? 'Media' : 'Difícil'}
                  </Badge>
                </CardTitle>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{level.wordCount} palabras</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{level.points} pts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(level.timeLimit)}</span>
                  </div>
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar Búsqueda
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const correctAnswers = answers.filter(a => a.correct).length;
    const accuracy = Math.round((correctAnswers / answers.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">¡Juego Completado!</CardTitle>
            <CardDescription>Resultados de {selectedLevel.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Puntos</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{correctAnswers}/{answers.length}</div>
                <div className="text-sm text-gray-600">Correctas</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Precisión</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Revisión de Respuestas:</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {answer.correct ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-red-500" />
                      }
                      <span className="text-sm">{answer.verb.infinitive}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{answer.userAnswer}</div>
                      {!answer.correct && (
                        <div className="text-xs text-green-600">{answer.verb.translation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={resetGame} className="w-full">
              Jugar de Nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Game Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(selectedLevel.difficulty)}>
                {selectedLevel.name}
              </Badge>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{score} pts</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                <span className={timeLeft < 30 ? 'text-red-600 font-bold' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {currentIndex + 1}/{gameVerbs.length}
              </div>
            </div>
          </div>
          <Progress value={(currentIndex / gameVerbs.length) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Game Content */}
      {currentVerb && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Traduce este verbo al español:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-3xl font-bold text-gray-900">{currentVerb.infinitive}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(currentVerb.infinitive)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Pasado: </span>
                    <span className="font-medium">{currentVerb.past}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Participio: </span>
                    <span className="font-medium">{currentVerb.participle}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Escribe la traducción en español..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                className="text-lg"
                autoFocus
              />
              <Button 
                onClick={checkAnswer} 
                className="w-full" 
                size="lg"
                disabled={!userInput.trim()}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Comprobar Respuesta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}