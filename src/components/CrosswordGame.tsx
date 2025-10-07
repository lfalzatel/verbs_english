'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Play, Clock, Target, Award, RotateCcw, CheckCircle, HelpCircle } from 'lucide-react';

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
  gridSize: number;
  points: number;
  timeLimit: number;
  color: string;
}

interface CrosswordCell {
  letter: string;
  userInput: string;
  isBlack: boolean;
  number?: number;
  partOfWords: string[];
}

interface Clue {
  id: string;
  number: number;
  text: string;
  answer: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
  length: number;
  solved: boolean;
}

const gameLevels: GameLevel[] = [
  {
    id: 'easy',
    name: 'Crucigrama Fácil',
    difficulty: 'easy',
    description: '5x5 - Verbos básicos',
    gridSize: 5,
    points: 10,
    timeLimit: 300,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'medium',
    name: 'Crucigrama Medio',
    difficulty: 'medium',
    description: '10x10 - Verbos comunes',
    gridSize: 10,
    points: 15,
    timeLimit: 420,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'hard',
    name: 'Crucigrama Difícil',
    difficulty: 'hard',
    description: '15x15 - Verbos avanzados',
    gridSize: 15,
    points: 20,
    timeLimit: 600,
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export default function CrosswordGame() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<{across: Clue[], down: Clue[]}>({across: [], down: []});
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [solvedClues, setSolvedClues] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
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

  const generateCrossword = (level: GameLevel) => {
    const filteredVerbs = verbs.filter(verb => verb.difficulty === level.difficulty);
    const selectedVerbs = filteredVerbs.slice(0, Math.min(level.gridSize, filteredVerbs.length));
    
    // Create empty grid
    const newGrid: CrosswordCell[][] = Array(level.gridSize).fill(null).map(() =>
      Array(level.gridSize).fill(null).map(() => ({
        letter: '',
        userInput: '',
        isBlack: true,
        partOfWords: []
      }))
    );

    const newClues: {across: Clue[], down: Clue[]} = {across: [], down: []};
    let clueNumber = 1;

    // Simple crossword placement algorithm
    selectedVerbs.forEach((verb, index) => {
      const words = [verb.infinitive, verb.past, verb.participle, verb.translation];
      const word = words[Math.floor(Math.random() * words.length)];
      
      if (word.length <= level.gridSize) {
        const direction = Math.random() > 0.5 ? 'across' : 'down';
        const startRow = Math.floor(Math.random() * (level.gridSize - word.length + 1));
        const startCol = direction === 'across' 
          ? Math.floor(Math.random() * level.gridSize)
          : Math.floor(Math.random() * level.gridSize);

        // Place word in grid
        for (let i = 0; i < word.length; i++) {
          const row = direction === 'across' ? startRow : startRow + i;
          const col = direction === 'across' ? startCol + i : startCol;
          
          if (newGrid[row][col].letter === '' || newGrid[row][col].letter === word[i]) {
            newGrid[row][col] = {
              ...newGrid[row][col],
              letter: word[i],
              isBlack: false,
              number: i === 0 ? clueNumber : newGrid[row][col].number,
              partOfWords: [...newGrid[row][col].partOfWords, `${direction}_${clueNumber}`]
            };
          }
        }

        const clue: Clue = {
          id: `${direction}_${clueNumber}`,
          number: clueNumber,
          text: direction === 'across' 
            ? `Verbo en ${verb.infinitive} (${word.length} letras)`
            : `Forma de ${verb.infinitive} (${word.length} letras)`,
          answer: word,
          startRow,
          startCol,
          direction,
          length: word.length,
          solved: false
        };

        if (direction === 'across') {
          newClues.across.push(clue);
        } else {
          newClues.down.push(clue);
        }
        
        clueNumber++;
      }
    });

    setGrid(newGrid);
    setClues(newClues);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setScore(0);
    setTimeLeft(level.timeLimit);
    setGameCompleted(false);
    setSolvedClues(new Set());
    setShowHint(false);
    setSelectedCell(null);
    setSelectedClue(null);
    
    generateCrossword(level);
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;
    
    setSelectedCell({row, col});
    
    // Find associated clue
    const cellClues = grid[row][col].partOfWords;
    if (cellClues.length > 0) {
      const clueId = cellClues[0];
      const allClues = [...clues.across, ...clues.down];
      const clue = allClues.find(c => c.id === clueId);
      if (clue) {
        setSelectedClue(clue);
      }
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;
    
    const newGrid = [...grid];
    newGrid[row][col] = {...newGrid[row][col], userInput: value.toUpperCase()};
    setGrid(newGrid);
    
    // Check if any word is completed
    checkCompletedWords();
  };

  const checkCompletedWords = () => {
    const newSolvedClues = new Set<string>();
    
    [...clues.across, ...clues.down].forEach(clue => {
      let completed = true;
      let userAnswer = '';
      
      for (let i = 0; i < clue.length; i++) {
        const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
        
        userAnswer += grid[row][col].userInput;
        if (grid[row][col].userInput !== clue.answer[i]) {
          completed = false;
          break;
        }
      }
      
      if (completed && userAnswer === clue.answer) {
        newSolvedClues.add(clue.id);
      }
    });
    
    if (newSolvedClues.size > solvedClues.size) {
      setScore(score + selectedLevel!.points);
      setSolvedClues(newSolvedClues);
      
      if (newSolvedClues.size === clues.across.length + clues.down.length) {
        endGame();
      }
    }
  };

  const getHint = () => {
    if (!selectedClue || !selectedCell) return;
    
    const {row, col} = selectedCell;
    const letterIndex = selectedClue.direction === 'across' 
      ? col - selectedClue.startCol 
      : row - selectedClue.startRow;
    
    if (letterIndex >= 0 && letterIndex < selectedClue.answer.length) {
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...newGrid[row][col],
        userInput: selectedClue.answer[letterIndex]
      };
      setGrid(newGrid);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
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
    setGrid([]);
    setClues({across: [], down: []});
    setSelectedCell(null);
    setSelectedClue(null);
    setSolvedClues(new Set());
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Crucigramas de Verbos</h2>
          <p className="text-gray-600">Resuelve crucigramas con pistas sobre verbos en inglés</p>
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
                      <span>{level.gridSize}x{level.gridSize}</span>
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
            <CardTitle className="text-2xl">¡Crucigrama Completado!</CardTitle>
            <CardDescription>Resultados de {selectedLevel.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Puntos</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {solvedClues.size}/{clues.across.length + clues.down.length}
                </div>
                <div className="text-sm text-gray-600">Pistas Resueltas</div>
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
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                <span className={timeLeft < 30 ? 'text-red-600 font-bold' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getHint}
                disabled={!selectedClue}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Pista
              </Button>
            </div>
          </div>
          <Progress value={(solvedClues.size / (clues.across.length + clues.down.length)) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Game Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crossword Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Crucigrama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-block">
              <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${selectedLevel.gridSize}, minmax(0, 1fr))`}}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`w-8 h-8 border border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                        cell.isBlack 
                          ? 'bg-gray-800' 
                          : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {cell.number && (
                        <span className="absolute top-0 left-0 text-xs text-gray-500 ml-0.5">
                          {cell.number}
                        </span>
                      )}
                      <Input
                        value={cell.userInput}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        className="w-6 h-6 p-0 text-center border-none bg-transparent"
                        disabled={cell.isBlack}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clues */}
        <Card>
          <CardHeader>
            <CardTitle>Pistas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Horizontal</h3>
              <div className="space-y-2">
                {clues.across.map((clue) => (
                  <div
                    key={clue.id}
                    onClick={() => setSelectedClue(clue)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedClue?.id === clue.id 
                        ? 'bg-blue-100 border border-blue-300' 
                        : solvedClues.has(clue.id)
                          ? 'bg-green-50 text-green-800'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{clue.number}.</span>
                      <span className="text-sm">{clue.text}</span>
                      {solvedClues.has(clue.id) && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Vertical</h3>
              <div className="space-y-2">
                {clues.down.map((clue) => (
                  <div
                    key={clue.id}
                    onClick={() => setSelectedClue(clue)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedClue?.id === clue.id 
                        ? 'bg-blue-100 border border-blue-300' 
                        : solvedClues.has(clue.id)
                          ? 'bg-green-50 text-green-800'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{clue.number}.</span>
                      <span className="text-sm">{clue.text}</span>
                      {solvedClues.has(clue.id) && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showHint && (
        <Alert className="bg-blue-50 border-blue-200">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Pista utilizada: Una letra ha sido revelada.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}