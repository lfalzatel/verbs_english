'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { usePlayer } from '@/contexts/PlayerContext'
import { Clock, RotateCcw, Trophy, Search, Eye, Grid3X3 } from 'lucide-react'

interface WordPosition {
  word: string
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  found: boolean
  direction: string
}

interface GameVariant {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  theme: string
  gridSize: number
  timeLimit?: number
  wordsToFind: number
}

const GAME_VARIANTS: GameVariant[] = [
  {
    id: 'easy-wordsearch',
    name: 'Búsqueda Fácil',
    description: 'Verbos básicos en cuadrícula pequeña, 15 palabras',
    difficulty: 'easy',
    theme: 'basic',
    gridSize: 12,
    wordsToFind: 15
  },
  {
    id: 'medium-wordsearch',
    name: 'Búsqueda Media',
    description: 'Verbos intermedios en cuadrícula mediana, 25 palabras',
    difficulty: 'medium',
    theme: 'mixed',
    gridSize: 16,
    wordsToFind: 25
  },
  {
    id: 'hard-wordsearch',
    name: 'Búsqueda Difícil',
    description: 'Verbos avanzados en cuadrícula grande, 35 palabras',
    difficulty: 'hard',
    theme: 'advanced',
    gridSize: 20,
    wordsToFind: 35
  }
]

export default function WordSearchGame() {
  const { player, saveGameScore } = usePlayer()
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [selectedVariant, setSelectedVariant] = useState<GameVariant | null>(null)
  const [grid, setGrid] = useState<string[][]>([])
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([])
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [time, setTime] = useState(0)
  const [hints, setHints] = useState(3)
  const [gameVerbs, setGameVerbs] = useState<any[]>([])
  const [wordsToPlace, setWordsToPlace] = useState<any[]>([])

  const gridRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting && selectedCells.length > 1) {
        checkWord()
      }
      setIsSelecting(false)
      setSelectedCells([])
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isSelecting, selectedCells, wordPositions])

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
        filteredVerbs = [...irregularVerbs.slice(0, 15), ...hardVerbs.slice(0, 20)]
      }
      
      // Additional difficulty filtering
      if (variant.difficulty === 'easy') {
        filteredVerbs = filteredVerbs.filter((v: any) => v.difficulty === 'easy')
      } else if (variant.difficulty === 'medium') {
        filteredVerbs = filteredVerbs.filter((v: any) => ['easy', 'medium'].includes(v.difficulty))
      }
      
      // If filtered results are too small, use all available verbs
      if (filteredVerbs.length < variant.wordsToFind) {
        filteredVerbs = verbs
      }
      
      // Ensure we have enough verbs by duplicating if necessary
      while (filteredVerbs.length < variant.wordsToFind && filteredVerbs.length > 0) {
        filteredVerbs = [...filteredVerbs, ...verbs]
      }
      
      // Random selection
      const shuffled = filteredVerbs.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, variant.wordsToFind)
      
      console.log(`Theme: ${variant.theme}, Required: ${variant.wordsToFind}, Available: ${filteredVerbs.length}, Selected: ${selected.length}`)
      
      setGameVerbs(selected)
      return selected
    } catch (error) {
      console.error('Error fetching verbs:', error)
      return []
    }
  }

  const generateGrid = async (variant: GameVariant) => {
    const verbs = await fetchVerbs(variant)
    const size = variant.gridSize
    const newGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''))
    const wordPositions: WordPosition[] = []

    // Get words to place
    const newWordsToPlace = verbs.map((verb: any) => {
      if (variant.theme === 'basic') {
        return verb.infinitive.toUpperCase()
      } else if (variant.theme === 'mixed') {
        // Mix between infinitive and past
        if (Math.random() < 0.6) {
          return verb.infinitive.toUpperCase()
        } else {
          return verb.past ? verb.past.toUpperCase() : verb.infinitive.toUpperCase()
        }
      } else if (variant.theme === 'advanced') {
        // Mix of all forms randomly
        const forms = ['infinitive', 'past', 'participle']
        const selectedForm = forms[Math.floor(Math.random() * forms.length)]
        return (verb[selectedForm] || verb.infinitive).toUpperCase()
      } else {
        return verb.infinitive.toUpperCase()
      }
    })

    // Update state
    setWordsToPlace(newWordsToPlace)

    // Sort words by length (longer first) for better placement
    newWordsToPlace.sort((a, b) => b.length - a.length)

    // Place words in grid with improved algorithm
    newWordsToPlace.forEach((originalWord, wordIndex) => {
      let placed = false
      let attempts = 0
      let word = originalWord
      
      while (!placed && attempts < 200) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'
        const reverse = variant.theme === 'reverse' ? false : Math.random() < 0.3
        
        if (reverse) {
          word = word.split('').reverse().join('')
        }
        
        if (direction === 'horizontal') {
          const row = Math.floor(Math.random() * size)
          const col = Math.floor(Math.random() * (size - word.length + 1))
          
          // Check if can place
          let canPlace = true
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) {
              canPlace = false
              break
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row][col + i] = word[i]
            }
            wordPositions.push({
              word: originalWord, // Keep original word for display
              startRow: row,
              startCol: col,
              endRow: row,
              endCol: col + word.length - 1,
              found: false,
              direction: 'horizontal'
            })
            placed = true
            console.log(`Placed word "${originalWord}" horizontally at ${row},${col}`)
          }
        } else {
          const row = Math.floor(Math.random() * (size - word.length + 1))
          const col = Math.floor(Math.random() * size)
          
          // Check if can place
          let canPlace = true
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col] !== '' && newGrid[row + i][col] !== word[i]) {
              canPlace = false
              break
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row + i][col] = word[i]
            }
            wordPositions.push({
              word: originalWord, // Keep original word for display
              startRow: row,
              startCol: col,
              endRow: row + word.length - 1,
              endCol: col,
              found: false,
              direction: 'vertical'
            })
            placed = true
            console.log(`Placed word "${originalWord}" vertically at ${row},${col}`)
          }
        }
        
        attempts++
      }
      
      if (!placed) {
        console.warn(`Failed to place word "${originalWord}" after ${attempts} attempts`)
      }
    })

    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    console.log(`Generated grid with ${wordPositions.length} words out of ${newWordsToPlace.length} requested`)
    setGrid(newGrid)
    setWordPositions(wordPositions)
    setFoundWords(new Set())
  }

  const startGame = async (variant: GameVariant) => {
    console.log('Starting game with variant:', variant)
    setSelectedVariant(variant)
    await generateGrid(variant)
    setGameState('playing')
    setFoundWords(new Set())
    setSelectedCells([])
    setTime(0)
    setHints(3)
  }

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectedCells([[row, col]])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells(prev => {
        const exists = prev.some(([r, c]) => r === row && c === col)
        if (!exists) {
          return [...prev, [row, col]]
        }
        return prev
      })
    }
  }

  const handleMouseUp = () => {
    if (isSelecting && selectedCells.length > 1) {
      checkWord()
    }
    setIsSelecting(false)
    setSelectedCells([])
  }

  const checkWord = () => {
    const [startRow, startCol] = selectedCells[0]
    const [endRow, endCol] = selectedCells[selectedCells.length - 1]
    
    // Check if selection forms a straight line
    const isHorizontal = startRow === endRow
    const isVertical = startCol === endCol
    
    if (!isHorizontal && !isVertical) return
    
    // Get the selected word
    let selectedWord = ''
    if (isHorizontal) {
      const minCol = Math.min(startCol, endCol)
      const maxCol = Math.max(startCol, endCol)
      for (let col = minCol; col <= maxCol; col++) {
        selectedWord += grid[startRow][col]
      }
    } else {
      const minRow = Math.min(startRow, endRow)
      const maxRow = Math.max(startRow, endRow)
      for (let row = minRow; row <= maxRow; row++) {
        selectedWord += grid[row][startCol]
      }
    }
    
    // Check if matches any word
    const foundWord = wordPositions.find(w => 
      !foundWords.has(w.word) && (
        w.word === selectedWord || 
        w.word === selectedWord.split('').reverse().join('')
      )
    )
    
    if (foundWord) {
      setFoundWords(prev => new Set([...prev, foundWord.word]))
      setWordPositions(prev => prev.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      ))
      
      // Check if game is finished
      if (foundWords.size + 1 === wordPositions.length) {
        endGame()
      }
    }
  }

  const useHint = () => {
    if (hints <= 0) return
    
    const unfoundWords = wordsToPlace.filter(w => !foundWords.has(w.word))
    if (unfoundWords.length === 0) return
    
    const hintWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)]
    setHints(hints - 1)
    
    // Highlight the first letter of the hint word
    const cells = document.querySelectorAll(`[data-row="${hintWord.startRow}"][data-col="${hintWord.startCol}"]`)
    cells.forEach(cell => {
      cell.classList.add('bg-yellow-200')
      setTimeout(() => {
        cell.classList.remove('bg-yellow-200')
      }, 2000)
    })
  }

  const endGame = () => {
    setGameState('finished')
    
    if (player && selectedVariant) {
      const foundCount = foundWords.size
      const totalWords = wordPositions.length
      const accuracy = totalWords > 0 ? (foundCount / totalWords) * 100 : 0
      const timeBonus = selectedVariant.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 300 - time)
      const hintBonus = hints * 10
      const score = Math.floor((foundCount * 50) + (accuracy * 20) + timeBonus + hintBonus)
      
      saveGameScore('wordsearch', score, time, accuracy)
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setSelectedVariant(null)
    setGrid([])
    setWordPositions([])
    setFoundWords(new Set())
    setSelectedCells([])
    setTime(0)
    setHints(3)
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

  const isCellInFoundWord = (row: number, col: number) => {
    return wordPositions.some(w => 
      foundWords.has(w.word) && (
        (w.direction === 'horizontal' && w.startRow === row && col >= w.startCol && col <= w.endCol) ||
        (w.direction === 'vertical' && w.startCol === col && row >= w.startRow && row <= w.endRow)
      )
    )
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col)
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
              <Search className="w-6 h-6 text-orange-600" />
              Búsqueda de Palabras de Verbos
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
                      <span>{variant.gridSize}×{variant.gridSize}</span>
                      <span>{variant.wordsToFind} palabras</span>
                    </div>
                    <Button 
                      onClick={() => startGame(variant)} 
                      className="w-full"
                    >
                      Comenzar Búsqueda
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
              <Badge variant="outline">Encontradas: {foundWords.size}/{wordPositions.length}</Badge>
              <Badge variant="outline">
                {selectedVariant?.timeLimit ? `Tiempo: ${selectedVariant.timeLimit - time}s` : `Tiempo: ${formatTime(time)}`}
              </Badge>
              <Badge variant="outline">Pistas: {hints}</Badge>
              <Button onClick={useHint} disabled={hints === 0} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Pista
              </Button>
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
          <div className="flex gap-8">
            {/* Grid */}
            <div 
              ref={gridRef}
              className="select-none"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                className="inline-block border-2 border-gray-300"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${selectedVariant?.gridSize}, 1fr)`,
                  gap: '1px',
                  backgroundColor: '#e5e7eb'
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      data-row={rowIndex}
                      data-col={colIndex}
                      className={`w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors ${
                        isCellInFoundWord(rowIndex, colIndex)
                          ? 'bg-green-200 text-green-800'
                          : isCellSelected(rowIndex, colIndex)
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Words List */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Palabras a encontrar:</h3>
              <div className="space-y-2">
                {wordPositions.map((word, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded transition-all ${
                      foundWords.has(word.word)
                        ? 'bg-green-100 text-green-800 line-through'
                        : 'bg-gray-100'
                    }`}
                  >
                    {word.word}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    const accuracy = wordPositions.length > 0 ? Math.round((foundWords.size / wordPositions.length) * 100) : 0
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">¡Búsqueda Completada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Palabras Encontradas</p>
              <p className="text-2xl font-bold">{foundWords.size}/{wordPositions.length}</p>
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
              {Math.floor((foundWords.size * 50) + (accuracy * 20) + (selectedVariant?.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 300 - time)) + (hints * 10))}
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