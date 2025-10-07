'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Clock, Target, Award, RotateCcw, ArrowRight, Volume2, CheckCircle } from 'lucide-react';

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
  pairCount: number;
  points: number;
  timeLimit: number;
  color: string;
}

interface MatchItem {
  id: string;
  content: string;
  type: 'verb' | 'translation';
  verbId: number;
  isMatched: boolean;
  isSelected: boolean;
}

const gameLevels: GameLevel[] = [
  {
    id: 'easy',
    name: 'Apareamiento Fácil',
    difficulty: 'easy',
    description: '10 pares - Verbos básicos',
    pairCount: 10,
    points: 10,
    timeLimit: 180,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'medium',
    name: 'Apareamiento Medio',
    difficulty: 'medium',
    description: '15 pares - Verbos comunes',
    pairCount: 15,
    points: 15,
    timeLimit: 240,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'hard',
    name: 'Apareamiento Difícil',
    difficulty: 'hard',
    description: '20 pares - Verbos avanzados',
    pairCount: 20,
    points: 20,
    timeLimit: 300,
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export default function MatchingGame() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MatchItem[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastMatch, setLastMatch] = useState<{correct: boolean, items: MatchItem[]} | null>(null);
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

  useEffect(() => {
    if (selectedItems.length === 2) {
      const timer = setTimeout(() => checkMatch(), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedItems]);

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

  const generateItems = (level: GameLevel): MatchItem[] => {
    const filteredVerbs = verbs.filter(verb => verb.difficulty === level.difficulty);
    const selectedVerbs = filteredVerbs.slice(0, level.pairCount);
    
    const gameItems: MatchItem[] = [];
    
    selectedVerbs.forEach((verb, index) => {
      gameItems.push({
        id: `${verb.id}-verb`,
        content: verb.infinitive,
        type: 'verb',
        verbId: verb.id,
        isMatched: false,
        isSelected: false
      });
      
      gameItems.push({
        id: `${verb.id}-translation`,
        content: verb.translation,
        type: 'translation',
        verbId: verb.id,
        isMatched: false,
        isSelected: false
      });
    });
    
    return gameItems.sort(() => Math.random() - 0.5);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    const gameItems = generateItems(level);
    setItems(gameItems);
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setMatchedPairs(0);
    setTimeLeft(level.timeLimit);
    setGameCompleted(false);
    setSelectedItems([]);
    setShowResult(false);
    setLastMatch(null);
  };

  const selectItem = (item: MatchItem) => {
    if (item.isMatched || item.isSelected || showResult) return;
    
    const newSelectedItems = [...selectedItems, item];
    setSelectedItems(newSelectedItems);
    
    setItems(items.map(i => 
      i.id === item.id ? {...i, isSelected: true} : i
    ));
    
    if (newSelectedItems.length === 2) {
      setAttempts(attempts + 1);
    }
  };

  const checkMatch = () => {
    if (selectedItems.length !== 2) return;
    
    const [first, second] = selectedItems;
    const isMatch = first.verbId === second.verbId && first.type !== second.type;
    
    if (isMatch) {
      setItems(items.map(i => 
        i.id === first.id || i.id === second.id 
          ? {...i, isMatched: true, isSelected: false}
          : i
      ));
      setMatchedPairs(matchedPairs + 1);
      setScore(score + selectedLevel!.points);
      
      if (matchedPairs + 1 === selectedLevel!.pairCount) {
        endGame();
      }
    } else {
      setItems(items.map(i => 
        i.id === first.id || i.id === second.id 
          ? {...i, isSelected: false}
          : i
      ));
    }
    
    setLastMatch({correct: isMatch, items: [first, second]});
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      setLastMatch(null);
      setSelectedItems([]);
    }, 1500);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = text.includes(' ') ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
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
    setAttempts(0);
    setMatchedPairs(0);
    setItems([]);
    setSelectedItems([]);
    setShowResult(false);
    setLastMatch(null);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Apareamiento de Verbos</h2>
          <p className="text-gray-600">Conecta los verbos con sus traducciones</p>
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
                      <span>{level.pairCount} pares</span>
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
    const accuracy = Math.round((matchedPairs / attempts) * 100);
    
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
                <div className="text-2xl font-bold text-blue-600">{matchedPairs}</div>
                <div className="text-sm text-gray-600">Pares</div>
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
    <div className="space-y-6">
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
              <div className="text-sm text-gray-600">
                {attempts} intentos
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
                {matchedPairs}/{selectedLevel.pairCount} pares
              </div>
            </div>
          </div>
          <Progress value={(matchedPairs / selectedLevel.pairCount) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Game Result */}
      {showResult && lastMatch && (
        <Alert className={lastMatch.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <CheckCircle className={`h-4 w-4 ${lastMatch.correct ? 'text-green-600' : 'text-red-600'}`} />
          <AlertDescription className={lastMatch.correct ? 'text-green-800' : 'text-red-800'}>
            {lastMatch.correct ? '¡Correcto! Has encontrado un par.' : 'Incorrecto. Intenta de nuevo.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Game Board */}
      <Card>
        <CardHeader>
          <CardTitle>Conecta los verbos con sus traducciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item) => (
              <Button
                key={item.id}
                variant={item.isMatched ? "default" : item.isSelected ? "secondary" : "outline"}
                className={`p-4 h-auto text-left justify-start transition-all duration-300 ${
                  item.isMatched 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : item.isSelected
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'hover:bg-gray-50'
                }`}
                onClick={() => selectItem(item)}
                disabled={item.isMatched}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium truncate">{item.content}</span>
                  <div className="flex items-center gap-1">
                    {item.type === 'verb' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(item.content);
                        }}
                        className="h-4 w-4 p-0 text-white hover:text-blue-200"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                    {item.isMatched && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}