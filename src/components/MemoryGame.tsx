'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Clock, Target, Award, Volume2, RotateCcw, Eye, EyeOff } from 'lucide-react';

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
  cardCount: number;
  pairsCount: number;
  points: number;
  timeLimit: number;
  color: string;
}

interface Card {
  id: string;
  content: string;
  type: 'verb' | 'translation';
  verbId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const gameLevels: GameLevel[] = [
  {
    id: 'easy',
    name: 'Memoria Fácil',
    difficulty: 'easy',
    description: '12 cartas (6 pares) - Verbos básicos',
    cardCount: 12,
    pairsCount: 6,
    points: 10,
    timeLimit: 180,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'medium',
    name: 'Memoria Medio',
    difficulty: 'medium',
    description: '20 cartas (10 pares) - Verbos comunes',
    cardCount: 20,
    pairsCount: 10,
    points: 15,
    timeLimit: 240,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'hard',
    name: 'Memoria Difícil',
    difficulty: 'hard',
    description: '30 cartas (15 pares) - Verbos avanzados',
    cardCount: 30,
    pairsCount: 15,
    points: 20,
    timeLimit: 300,
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export default function MemoryGame() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(0);
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
    if (showPreview && previewTimeLeft > 0) {
      const timer = setTimeout(() => setPreviewTimeLeft(previewTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (previewTimeLeft === 0 && showPreview) {
      setShowPreview(false);
      hideAllCards();
    }
  }, [previewTimeLeft, showPreview]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const timer = setTimeout(() => checkMatch(), 1000);
      return () => clearTimeout(timer);
    }
  }, [flippedCards]);

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

  const generateCards = (level: GameLevel): Card[] => {
    let filteredVerbs = verbs.filter(verb => verb.difficulty === level.difficulty);
    
    // If not enough verbs for the requested difficulty, use verbs from other difficulties
    if (filteredVerbs.length < level.pairsCount) {
      if (level.difficulty === 'hard') {
        // For hard mode, use medium and easy verbs
        filteredVerbs = verbs.filter(verb => verb.difficulty === 'medium' || verb.difficulty === 'easy');
      } else if (level.difficulty === 'medium') {
        // For medium mode, use easy verbs if needed
        filteredVerbs = [...filteredVerbs, ...verbs.filter(verb => verb.difficulty === 'easy')];
      }
    }
    
    const selectedVerbs = filteredVerbs.slice(0, level.pairsCount);
    
    // If still not enough verbs, use any available verbs
    const finalVerbs = selectedVerbs.length < level.pairsCount 
      ? [...selectedVerbs, ...verbs.filter(v => !selectedVerbs.includes(v))].slice(0, level.pairsCount)
      : selectedVerbs;
    
    const gameCards: Card[] = [];
    
    finalVerbs.forEach((verb, index) => {
      gameCards.push({
        id: `${verb.id}-verb`,
        content: verb.infinitive,
        type: 'verb',
        verbId: verb.id,
        isFlipped: false,
        isMatched: false
      });
      
      gameCards.push({
        id: `${verb.id}-translation`,
        content: verb.translation,
        type: 'translation',
        verbId: verb.id,
        isFlipped: false,
        isMatched: false
      });
    });
    
    return gameCards.sort(() => Math.random() - 0.5);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    const gameCards = generateCards(level);
    setCards(gameCards);
    setGameStarted(true);
    setScore(0);
    setMoves(0);
    setMatchedPairs(0);
    setTimeLeft(level.timeLimit);
    setGameCompleted(false);
    setFlippedCards([]);
    
    // Show preview of all cards
    setShowPreview(true);
    setPreviewTimeLeft(5); // 5 seconds preview
    setCards(gameCards.map(card => ({ ...card, isFlipped: true })));
  };

  const hideAllCards = () => {
    setCards(cards.map(card => ({ ...card, isFlipped: false })));
  };

  const flipCard = (cardId: string) => {
    if (showPreview || gameCompleted) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (flippedCards.length < 2) {
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
      setFlippedCards([...flippedCards, cardId]);
      setMoves(moves + 1);
    }
  };

  const checkMatch = () => {
    const [first, second] = flippedCards;
    const firstCard = cards.find(c => c.id === first);
    const secondCard = cards.find(c => c.id === second);
    
    if (firstCard && secondCard && firstCard.verbId === secondCard.verbId) {
      // Match found
      setCards(cards.map(c => 
        c.id === first || c.id === second 
          ? { ...c, isMatched: true }
          : c
      ));
      setMatchedPairs(matchedPairs + 1);
      setScore(score + selectedLevel!.points);
      
      if (matchedPairs + 1 === selectedLevel!.pairsCount) {
        endGame();
      }
    } else {
      // No match
      setCards(cards.map(c => 
        c.id === first || c.id === second 
          ? { ...c, isFlipped: false }
          : c
      ));
    }
    
    setFlippedCards([]);
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
    setMoves(0);
    setMatchedPairs(0);
    setCards([]);
    setFlippedCards([]);
    setShowPreview(false);
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

  const getGridCols = (cardCount: number) => {
    if (cardCount <= 12) return 'grid-cols-4';
    if (cardCount <= 20) return 'grid-cols-5';
    return 'grid-cols-6';
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Memoria de Verbos</h2>
          <p className="text-gray-600">Encuentra los pares de verbos y sus traducciones</p>
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
                      <span>{level.pairsCount} pares</span>
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
                <div className="text-2xl font-bold text-blue-600">{moves}</div>
                <div className="text-sm text-gray-600">Movimientos</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{matchedPairs}</div>
                <div className="text-sm text-gray-600">Pares</div>
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
                {moves} movimientos
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
                {matchedPairs}/{selectedLevel.pairsCount} pares
              </div>
            </div>
          </div>
          <Progress value={(matchedPairs / selectedLevel.pairsCount) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Preview Alert */}
      {showPreview && (
        <Alert className="bg-blue-50 border-blue-200">
          <Eye className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Memoriza las cartas:</strong> Tienes {previewTimeLeft} segundos para ver todas las cartas antes de que se den la vuelta.
          </AlertDescription>
        </Alert>
      )}

      {/* Game Board */}
      <Card>
        <CardContent className="p-6">
          <div className={`grid ${getGridCols(selectedLevel.cardCount)} gap-3 max-w-4xl mx-auto`}>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => flipCard(card.id)}
                className={`relative aspect-square cursor-pointer transition-all duration-300 transform-gpu ${
                  card.isFlipped || card.isMatched ? 'rotate-0' : 'rotate-y-180'
                }`}
              >
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? card.isMatched 
                      ? 'bg-green-100 border-2 border-green-300' 
                      : 'bg-white border-2 border-blue-300'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}>
                  {card.isFlipped || card.isMatched ? (
                    <div className="flex items-center justify-center h-full p-2">
                      <div className="text-center">
                        <div className="font-semibold text-sm mb-1">
                          {card.type === 'verb' ? '🇬🇧' : '🇪🇸'}
                        </div>
                        <div className="text-sm font-medium">
                          {card.content}
                        </div>
                        {card.type === 'verb' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(card.content);
                            }}
                            className="mt-1 h-6 px-2 text-xs"
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-white text-2xl font-bold">?</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}