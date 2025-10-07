'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Clock, Target, Award, Volume2, RotateCcw, CheckCircle } from 'lucide-react';

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
  questionCount: number;
  points: number;
  timeLimit: number;
  color: string;
}

interface Question {
  verb: Verb;
  questionType: 'infinitive' | 'past' | 'participle';
  correctAnswer: string;
  options: string[];
}

const gameLevels: GameLevel[] = [
  {
    id: 'easy',
    name: 'Concentración Fácil',
    difficulty: 'easy',
    description: 'Verbos básicos - 10 preguntas',
    questionCount: 10,
    points: 10,
    timeLimit: 240,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'medium',
    name: 'Concentración Media',
    difficulty: 'medium',
    description: 'Tiempos mixtos - 10 preguntas',
    questionCount: 10,
    points: 15,
    timeLimit: 300,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'hard',
    name: 'Concentración Difícil',
    difficulty: 'hard',
    description: 'Verbos irregulares - 10 preguntas',
    questionCount: 10,
    points: 20,
    timeLimit: 360,
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export default function ConcentrationGame() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<{question: Question, userAnswer: string, correct: boolean}[]>([]);
  const [showResult, setShowResult] = useState(false);
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

  const generateQuestions = (level: GameLevel): Question[] => {
    let filteredVerbs = verbs.filter(verb => verb.difficulty === level.difficulty);
    
    // If not enough verbs for the requested difficulty, use verbs from other difficulties
    if (filteredVerbs.length < level.questionCount) {
      if (level.difficulty === 'hard') {
        // For hard mode, use medium and easy verbs
        filteredVerbs = verbs.filter(verb => verb.difficulty === 'medium' || verb.difficulty === 'easy');
      } else if (level.difficulty === 'medium') {
        // For medium mode, use easy verbs if needed
        filteredVerbs = [...filteredVerbs, ...verbs.filter(verb => verb.difficulty === 'easy')];
      }
    }
    
    const selectedVerbs = filteredVerbs.slice(0, level.questionCount);
    
    // If still not enough verbs, use any available verbs
    const finalVerbs = selectedVerbs.length < level.questionCount 
      ? [...selectedVerbs, ...verbs.filter(v => !selectedVerbs.includes(v))].slice(0, level.questionCount)
      : selectedVerbs;
    
    return finalVerbs.map(verb => {
      const questionTypes: Array<'infinitive' | 'past' | 'participle'> = ['infinitive', 'past', 'participle'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      let correctAnswer: string;
      
      switch (questionType) {
        case 'infinitive':
          correctAnswer = verb.infinitive;
          break;
        case 'past':
          correctAnswer = verb.past;
          break;
        case 'participle':
          correctAnswer = verb.participle;
          break;
      }
      
      // Generate options
      const allOptions = verbs.map(v => {
        switch (questionType) {
          case 'infinitive': return v.infinitive;
          case 'past': return v.past;
          case 'participle': return v.participle;
        }
      });
      
      // Remove correct answer and get random wrong options
      const wrongOptions = allOptions.filter(opt => opt !== correctAnswer);
      const randomWrongOptions = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correctAnswer, ...randomWrongOptions].sort(() => 0.5 - Math.random());
      
      return {
        verb,
        questionType,
        correctAnswer,
        options
      };
    });
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(level.timeLimit);
    setGameCompleted(false);
    setShowResult(false);
    setSelectedAnswer('');

    const gameQuestions = generateQuestions(level);
    setQuestions(gameQuestions);
    setCurrentQuestion(gameQuestions[0]);
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

  const selectAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion!.correctAnswer;
    const newAnswers = [...answers, { question: currentQuestion!, userAnswer: answer, correct: isCorrect }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + selectedLevel!.points);
    }

    // Auto advance after showing result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        endGame();
      }
    }, 2000);
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
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setCurrentQuestion(null);
    setShowResult(false);
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

  const getQuestionText = (question: Question) => {
    switch (question.questionType) {
      case 'infinitive':
        return `¿Cuál es el infinitivo de "${question.verb.translation}"?`;
      case 'past':
        return `¿Cuál es el pasado de "${question.verb.infinitive}"?`;
      case 'participle':
        return `¿Cuál es el participio de "${question.verb.infinitive}"?`;
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Concentración</h2>
          <p className="text-gray-600">Pon a prueba tu conocimiento de los tiempos verbales</p>
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
                      <span>{level.questionCount} preguntas</span>
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
                    Comenzar Juego
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

            <Button onClick={resetGame} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
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
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          </div>
          <Progress value={(currentQuestionIndex / questions.length) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Game Content */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {getQuestionText(currentQuestion)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg text-gray-600">
                    {currentQuestion.questionType === 'infinitive' && `Traducción: ${currentQuestion.verb.translation}`}
                    {currentQuestion.questionType === 'past' && `Infinitivo: ${currentQuestion.verb.infinitive}`}
                    {currentQuestion.questionType === 'participle' && `Infinitivo: ${currentQuestion.verb.infinitive}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(currentQuestion.verb.infinitive)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <Button
                    key={index}
                    variant={showCorrect ? "default" : showWrong ? "destructive" : "outline"}
                    className={`p-4 h-auto text-left justify-start ${
                      showCorrect ? 'bg-green-600 hover:bg-green-700' : 
                      showWrong ? 'bg-red-600 hover:bg-red-700' : ''
                    }`}
                    onClick={() => selectAnswer(option)}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {showCorrect && <CheckCircle className="w-4 h-4" />}
                    </div>
                  </Button>
                );
              })}
            </div>

            {showResult && (
              <div className={`text-center p-3 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {selectedAnswer === currentQuestion.correctAnswer 
                  ? '✓ ¡Correcto!' 
                  : `✗ Incorrecto. La respuesta correcta es: ${currentQuestion.correctAnswer}`
                }
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}