'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Clock, Target, Award, RotateCcw, Search as SearchIcon } from 'lucide-react';

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
  wordCount: number;
  points: number;
  timeLimit: number;
  color: string;
}

interface FoundWord {
  word: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

const gameLevels: GameLevel[] = [
  {
    id: 'easy',
    name: 'Búsqueda Fácil',
    difficulty: 'easy',
    description: '10x10 - 8 verbos',
    gridSize: 10,
    wordCount: 8,
    points: 10,
    timeLimit: 240,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'medium',
    name: 'Búsqueda Media',
    difficulty: 'medium',
    description: '15x15 - 12 verbos',
    gridSize: 15,
    wordCount: 12,
    points: 15,
    timeLimit: 300,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  {
    id: 'hard',
    name: 'Búsqueda Difícil',
    difficulty: 'hard',
    description: '20x20 - 15 verbos',
    gridSize: 20,
    wordCount: 15,
    points: 20,
    timeLimit: 360,
    color: 'bg-red-50 border-red-200 hover:bg-red-100'
  }
];

export default function WordSearchGame() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordsToFind, setWordsToFind] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
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

  const generateGrid = (level: GameLevel) => {
    const filteredVerbs = verbs.filter(verb => verb.difficulty === level.difficulty);
    const selectedVerbs = filteredVerbs.slice(0, level.wordCount);
    const words = selectedVerbs.map(verb => verb.infinitive.toUpperCase());
    
    // Create empty grid
    const newGrid: string[][] = Array(level.gridSize).fill(null).map(() =>
      Array(level.gridSize).fill('')
    );

    // Place words in grid
    const placedWords: FoundWord[] = [];
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 50) {
        const direction = Math.random() < 0.33 ? 'horizontal' : Math.random() < 0.5 ? 'vertical' : 'diagonal';
        const startRow = Math.floor(Math.random() * level.gridSize);
        const startCol = Math.floor(Math.random() * level.gridSize);
        
        if (canPlaceWord(newGrid, word, startRow, startCol, direction, level.gridSize)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          placedWords.push({
            word,
            startRow,
            startCol,
            endRow: direction === 'horizontal' ? startRow : direction === 'vertical' ? startRow + word.length - 1 : startRow + word.length - 1,
            endCol: direction === 'horizontal' ? startCol + word.length - 1 : direction === 'vertical' ? startCol : startCol + word.length - 1,
            direction
          });
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < level.gridSize; i++) {
      for (let j = 0; j < level.gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
    setWordsToFind(words);
  };

  const canPlaceWord = (grid: string[][], word: string, startRow: number, startCol: number, direction: string, gridSize: number) => {
    if (direction === 'horizontal' && startCol + word.length > gridSize) return false;
    if (direction === 'vertical' && startRow + word.length > gridSize) return false;
    if (direction === 'diagonal' && startRow + word.length > gridSize || startCol + word.length > gridSize) return false;

    for (let i = 0; i < word.length; i++) {
      const row = direction === 'horizontal' ? startRow : direction === 'vertical' ? startRow + i : startRow + i;
      const col = direction === 'horizontal' ? startCol + i : direction === 'vertical' ? startCol : startCol + i;
      
      if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, startRow: number, startCol: number, direction: string) => {
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'horizontal' ? startRow : direction === 'vertical' ? startRow + i : startRow + i;
      const col = direction === 'horizontal' ? startCol + i : direction === 'vertical' ? startCol : startCol + i;
      grid[row][col] = word[i];
    }
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setGameStarted(true);
    setScore(0);
    setTimeLeft(level.timeLimit);
    setGameCompleted(false);
    setFoundWords([]);
    setSelectedCells([]);
    setIsSelecting(false);
    
    generateGrid(level);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{row, col}]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells(prev => {
        const exists = prev.some(cell => cell.row === row && cell.col === col);
        if (!exists) {
          return [...prev, {row, col}];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectedCells.length > 1) {
      checkWord();
    }
    setIsSelecting(false);
    setSelectedCells([]);
  };

  const checkWord = () => {
    if (selectedCells.length < 2) return;

    const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedWord = word.split('').reverse().join('');
    
    const foundWord = wordsToFind.find(w => w === word || w === reversedWord);
    
    if (foundWord && !foundWords.some(fw => fw.word === foundWord)) {
      const newFoundWord: FoundWord = {
        word: foundWord,
        startRow: selectedCells[0].row,
        startCol: selectedCells[0].col,
        endRow: selectedCells[selectedCells.length - 1].row,
        endCol: selectedCells[selectedCells.length - 1].col,
        direction: selectedCells[0].row === selectedCells[selectedCells.length - 1].row ? 'horizontal' :
                  selectedCells[0].col === selectedCells[selectedCells.length - 1].col ? 'vertical' : 'diagonal'
      };
      
      setFoundWords([...foundWords, newFoundWord]);
      setScore(score + selectedLevel!.points);
      
      if (foundWords.length + 1 === wordsToFind.length) {
        endGame();
      }
    }
  };

  const isCellInFoundWord = (row: number, col: number) => {
    return foundWords.some(fw => {
      if (fw.direction === 'horizontal') {
        return row === fw.startRow && col >= fw.startCol && col <= fw.endCol;
      } else if (fw.direction === 'vertical') {
        return col === fw.startCol && row >= fw.startRow && row <= fw.endRow;
      } else {
        const minRow = Math.min(fw.startRow, fw.endRow);
        const maxRow = Math.max(fw.startRow, fw.endRow);
        const minCol = Math.min(fw.startCol, fw.endCol);
        const maxCol = Math.max(fw.startCol, fw.endCol);
        return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
      }
    });
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
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
    setWordsToFind([]);
    setFoundWords([]);
    setSelectedCells([]);
    setIsSelecting(false);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Búsqueda de Palabras</h2>
          <p className="text-gray-600">Encuentra verbos escondidos en la cuadrícula</p>
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
                      <SearchIcon className="w-4 h-4" />
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
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">¡Búsqueda Completada!</CardTitle>
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
                  {foundWords.length}/{wordsToFind.length}
                </div>
                <div className="text-sm text-gray-600">Palabras Encontradas</div>
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
              <div className="text-sm text-gray-600">
                {foundWords.length}/{wordsToFind.length}
              </div>
            </div>
          </div>
          <Progress value={(foundWords.length / wordsToFind.length) * 100} className="mt-2" />
        </CardContent>
      </Card>

      {/* Game Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word Search Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Busca las palabras</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="inline-block select-none"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div 
                  className="grid gap-1 p-2 bg-gray-50 rounded"
                  style={{gridTemplateColumns: `repeat(${selectedLevel.gridSize}, minmax(0, 1fr))`}}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        className={`w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                          isCellInFoundWord(rowIndex, colIndex)
                            ? 'bg-green-200 text-green-800'
                            : isCellSelected(rowIndex, colIndex)
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {cell}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Words to Find */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Palabras a encontrar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {wordsToFind.map((word, index) => {
                  const found = foundWords.some(fw => fw.word === word);
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded text-center font-medium transition-colors ${
                        found 
                          ? 'bg-green-100 text-green-800 line-through' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {word}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}