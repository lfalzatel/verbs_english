'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { usePlayer } from '@/contexts/PlayerContext'
import { Clock, RotateCcw, Trophy, Grid3X3, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react'

interface CrosswordCell {
  letter: string
  userInput: string
  isBlack: boolean
  number?: number
  row: number
  col: number
  partOfWords: string[]
  isSelected: boolean
  isHighlighted: boolean
}

interface CrosswordWord {
  id: string
  word: string
  clue: string
  startRow: number
  startCol: number
  direction: 'across' | 'down'
  number: number
  length: number
  completed: boolean
}

interface GameVariant {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  theme: string
  gridSize: number
  timeLimit?: number
  wordCount: number
}

const GAME_VARIANTS: GameVariant[] = [
  {
    id: 'easy-crossword',
    name: 'Crucigrama Fácil',
    description: 'Verbos básicos para principiantes, 10 palabras',
    difficulty: 'easy',
    theme: 'basic',
    gridSize: 12,
    wordCount: 10
  },
  {
    id: 'medium-crossword',
    name: 'Crucigrama Medio',
    description: 'Verbos intermedios y formas de pasado, 20 palabras',
    difficulty: 'medium',
    theme: 'mixed',
    gridSize: 16,
    wordCount: 20
  },
  {
    id: 'hard-crossword',
    name: 'Crucigrama Difícil',
    description: 'Verbos avanzados e irregulares, 30 palabras',
    difficulty: 'hard',
    theme: 'advanced',
    gridSize: 20,
    wordCount: 30
  }
]

export default function CrosswordGame() {
  const { player, saveGameScore } = usePlayer()
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [selectedVariant, setSelectedVariant] = useState<GameVariant | null>(null)
  const [grid, setGrid] = useState<CrosswordCell[][]>([])
  const [words, setWords] = useState<CrosswordWord[]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [selectedWord, setSelectedWord] = useState<CrosswordWord | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across')
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [time, setTime] = useState(0)
  const [hints, setHints] = useState(3)
  const [gameVerbs, setGameVerbs] = useState<any[]>([])
  const [wordInput, setWordInput] = useState('')
  const [showClues, setShowClues] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !selectedCell) return
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        navigateGrid(e.key)
      } else if (e.key === ' ') {
        e.preventDefault()
        toggleDirection()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        selectNextWord()
      } else if (e.key === 'Backspace') {
        handleCellInput('')
      } else if (e.key.length === 1 && e.key.match(/[A-Za-z]/)) {
        handleCellInput(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, selectedCell, selectedWord, selectedDirection, grid])

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
      
      // Filter by difficulty and theme
      if (variant.difficulty === 'easy') {
        filteredVerbs = verbs.filter((v: any) => v.difficulty === 'easy')
      } else if (variant.difficulty === 'medium') {
        filteredVerbs = verbs.filter((v: any) => ['easy', 'medium'].includes(v.difficulty))
      }
      
      // For hard difficulty, include all verbs but prioritize irregular and advanced ones
      if (variant.difficulty === 'hard') {
        const irregularVerbs = verbs.filter((v: any) => v.category === 'irregular')
        const advancedVerbs = verbs.filter((v: any) => v.difficulty === 'hard')
        const otherVerbs = verbs.filter((v: any) => !['easy', 'medium'].includes(v.difficulty) && v.category !== 'irregular')
        
        // Mix different types for variety
        filteredVerbs = [
          ...irregularVerbs.slice(0, 6),
          ...advancedVerbs.slice(0, 5),
          ...otherVerbs.slice(0, 4)
        ]
      }
      
      // If filtered results are too small, use all available verbs
      if (filteredVerbs.length < variant.wordCount) {
        filteredVerbs = verbs
      }
      
      // Ensure we have enough verbs by duplicating if necessary
      while (filteredVerbs.length < variant.wordCount && filteredVerbs.length > 0) {
        filteredVerbs = [...filteredVerbs, ...verbs]
      }
      
      // Random selection - this ensures different crossword each time
      const shuffled = filteredVerbs.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, variant.wordCount)
      
      setGameVerbs(selected)
      return selected
    } catch (error) {
      console.error('Error fetching verbs:', error)
      return []
    }
  }

  const generateCrossword = async (variant: GameVariant) => {
    const verbs = await fetchVerbs(variant)
    const size = variant.gridSize
    const newGrid: CrosswordCell[][] = Array(size).fill(null).map((_, rowIndex) => 
      Array(size).fill(null).map((_, colIndex) => ({
        letter: '',
        userInput: '',
        isBlack: true,
        row: rowIndex,
        col: colIndex,
        partOfWords: [],
        isSelected: false,
        isHighlighted: false
      }))
    )
    
    const crosswordWords: CrosswordWord[] = []
    let wordNumber = 1

    // Get words to place with proper clues
    const wordsToPlace = verbs.map((verb: any, index: number) => {
      let word = ''
      let clue = ''
      
      // Randomly choose between different clue types for variety
      const clueType = Math.random()
      
      if (variant.difficulty === 'easy') {
        word = verb.infinitive.toUpperCase()
        if (clueType < 0.5) {
          clue = `${wordNumber}. Es el verbo "${verb.spanish || verb.translation}" en inglés`
        } else {
          clue = `${wordNumber}. Acción de ${verb.spanish || verb.translation} en inglés`
        }
      } else if (variant.difficulty === 'medium') {
        // Mix between infinitive and past tense
        if (clueType < 0.6) {
          word = verb.infinitive.toUpperCase()
          clue = `${wordNumber}. Es el verbo "${verb.spanish || verb.translation}" en inglés`
        } else {
          word = verb.past ? verb.past.toUpperCase() : verb.infinitive.toUpperCase()
          clue = `${wordNumber}. Verbo "to ${verb.infinitive}" en pasado (ej: I ___ yesterday)`
        }
      } else {
        // Hard difficulty - mix all forms
        if (clueType < 0.4) {
          word = verb.infinitive.toUpperCase()
          clue = `${wordNumber}. Es el verbo "${verb.spanish || verb.translation}" en inglés`
        } else if (clueType < 0.7) {
          word = verb.past ? verb.past.toUpperCase() : verb.infinitive.toUpperCase()
          clue = `${wordNumber}. Verbo "to ${verb.infinitive}" en pasado (ej: I ___ yesterday)`
        } else {
          word = verb.participle ? verb.participle.toUpperCase() : verb.infinitive.toUpperCase()
          clue = `${wordNumber}. Participio de "to ${verb.infinitive}" (ej: I have ___)`
        }
      }
      
      return { word, clue, verb }
    })

    // Filter out words that are too long for the grid
    const validWords = wordsToPlace.filter(({ word }) => word.length <= size - 2)
    
    if (validWords.length === 0) {
      console.error('No valid words for crossword generation')
      return
    }

    // Sort words by length (longer first) for better placement
    validWords.sort((a, b) => b.word.length - a.word.length)

    // Improve placement algorithm to ensure minimum word count
    let placementAttempts = 0
    const maxAttempts = 1000
    
    // Place words in grid with improved algorithm
    validWords.forEach(({ word, clue, verb }) => {
      let placed = false
      let attempts = 0
      
      while (!placed && attempts < maxAttempts && placementAttempts < maxAttempts) {
        const direction = Math.random() < 0.5 ? 'across' : 'down'
        
        // Smart placement strategy
        let row, col
        if (crosswordWords.length === 0) {
          // First word: place near center
          row = Math.floor(size / 2)
          col = Math.floor(size / 2)
        } else if (crosswordWords.length < validWords.length / 2) {
          // First half: try to intersect with existing words
          const existingWord = crosswordWords[Math.floor(Math.random() * crosswordWords.length)]
          const intersectionPoint = Math.floor(Math.random() * existingWord.length)
          
          if (direction === 'across') {
            row = existingWord.startRow + (existingWord.direction === 'down' ? intersectionPoint : 0)
            col = existingWord.startCol - intersectionPoint
          } else {
            row = existingWord.startRow - intersectionPoint
            col = existingWord.startCol + (existingWord.direction === 'across' ? intersectionPoint : 0)
          }
          
          // Ensure within bounds
          row = Math.max(0, Math.min(size - 1, row))
          col = Math.max(0, Math.min(size - 1, col))
        } else {
          // Second half: random placement with preference for edges
          if (Math.random() < 0.7) {
            // Try edges
            if (Math.random() < 0.5) {
              row = Math.random() < 0.5 ? 0 : size - 1
              col = Math.floor(Math.random() * size)
            } else {
              row = Math.floor(Math.random() * size)
              col = Math.random() < 0.5 ? 0 : size - 1
            }
          } else {
            row = Math.floor(Math.random() * size)
            col = Math.floor(Math.random() * size)
          }
        }
        
        // Check if can place
        let canPlace = true
        let intersectionCount = 0
        let intersectionPositions: number[] = []
        
        if (direction === 'across' && col + word.length <= size && col >= 0) {
          // Check boundaries and existing letters
          for (let i = 0; i < word.length; i++) {
            if (col + i >= size) {
              canPlace = false
              break
            }
            
            const cell = newGrid[row][col + i]
            
            // Check if cell already has a different letter
            if (cell.letter !== '' && cell.letter !== word[i]) {
              canPlace = false
              break
            }
            
            // Check for intersections
            if (cell.letter === word[i]) {
              intersectionCount++
              intersectionPositions.push(i)
            }
            
            // Check adjacent cells (no words should be adjacent)
            if (row > 0 && newGrid[row - 1][col + i].letter !== '' && !intersectionPositions.includes(i)) {
              canPlace = false
              break
            }
            if (row < size - 1 && newGrid[row + 1][col + i].letter !== '' && !intersectionPositions.includes(i)) {
              canPlace = false
              break
            }
          }
          
          // Check before and after the word
          if (col > 0 && newGrid[row][col - 1].letter !== '') {
            canPlace = false
          }
          if (col + word.length < size && newGrid[row][col + word.length].letter !== '') {
            canPlace = false
          }
          
          // Placement rules - more lenient for better word count
          const isFirstWord = crosswordWords.length === 0
          const hasValidIntersection = intersectionCount > 0 && intersectionCount < word.length
          const canPlaceStandalone = crosswordWords.length < 3 // Allow first few words to be standalone
          
          if (canPlace && (isFirstWord || hasValidIntersection || canPlaceStandalone)) {
            // Place the word
            for (let i = 0; i < word.length; i++) {
              newGrid[row][col + i].letter = word[i]
              newGrid[row][col + i].isBlack = false
              newGrid[row][col + i].partOfWords.push(`${wordNumber}`)
            }
            
            // Add number to first cell
            if (newGrid[row][col].partOfWords.length === 1) {
              newGrid[row][col].number = wordNumber
            }
            
            crosswordWords.push({
              id: `word-${wordNumber}`,
              word,
              clue,
              startRow: row,
              startCol: col,
              direction,
              number: wordNumber,
              length: word.length,
              completed: false
            })
            
            wordNumber++
            placed = true
          }
        } else if (direction === 'down' && row + word.length <= size && row >= 0) {
          // Similar logic for down direction
          for (let i = 0; i < word.length; i++) {
            if (row + i >= size) {
              canPlace = false
              break
            }
            
            const cell = newGrid[row + i][col]
            
            if (cell.letter !== '' && cell.letter !== word[i]) {
              canPlace = false
              break
            }
            
            if (cell.letter === word[i]) {
              intersectionCount++
              intersectionPositions.push(i)
            }
            
            // Check adjacent cells
            if (col > 0 && newGrid[row + i][col - 1].letter !== '' && !intersectionPositions.includes(i)) {
              canPlace = false
              break
            }
            if (col < size - 1 && newGrid[row + i][col + 1].letter !== '' && !intersectionPositions.includes(i)) {
              canPlace = false
              break
            }
          }
          
          // Check before and after the word
          if (row > 0 && newGrid[row - 1][col].letter !== '') {
            canPlace = false
          }
          if (row + word.length < size && newGrid[row + word.length][col].letter !== '') {
            canPlace = false
          }
          
          const isFirstWord = crosswordWords.length === 0
          const hasValidIntersection = intersectionCount > 0 && intersectionCount < word.length
          const canPlaceStandalone = crosswordWords.length < 3
          
          if (canPlace && (isFirstWord || hasValidIntersection || canPlaceStandalone)) {
            // Place the word
            for (let i = 0; i < word.length; i++) {
              newGrid[row + i][col].letter = word[i]
              newGrid[row + i][col].isBlack = false
              newGrid[row + i][col].partOfWords.push(`${wordNumber}`)
            }
            
            // Add number to first cell
            if (newGrid[row][col].partOfWords.length === 1) {
              newGrid[row][col].number = wordNumber
            }
            
            crosswordWords.push({
              id: `word-${wordNumber}`,
              word,
              clue,
              startRow: row,
              startCol: col,
              direction,
              number: wordNumber,
              length: word.length,
              completed: false
            })
            
            wordNumber++
            placed = true
          }
        }
        
        attempts++
        placementAttempts++
      }
    })

    console.log(`Generated crossword with ${crosswordWords.length} words out of ${variant.wordCount} requested`)
    
    // If we didn't get enough words, try to add more with relaxed rules
    if (crosswordWords.length < variant.wordCount && crosswordWords.length > 0) {
      const remainingWords = validWords.filter(({ word }) => 
        !crosswordWords.some(cw => cw.word === word)
      )
      
      // Try to place remaining words with very relaxed rules
      remainingWords.forEach(({ word, clue }) => {
        if (crosswordWords.length >= variant.wordCount) return
        
        // Try to place word anywhere it fits
        for (let row = 0; row < size && crosswordWords.length < variant.wordCount; row++) {
          for (let col = 0; col < size && crosswordWords.length < variant.wordCount; col++) {
            for (const direction of ['across', 'down'] as const) {
              if (direction === 'across' && col + word.length <= size) {
                let canPlace = true
                for (let i = 0; i < word.length; i++) {
                  const cell = newGrid[row][col + i]
                  if (!cell.isBlack && cell.letter !== '' && cell.letter !== word[i]) {
                    canPlace = false
                    break
                  }
                }
                
                if (canPlace) {
                  // Place the word
                  for (let i = 0; i < word.length; i++) {
                    newGrid[row][col + i].letter = word[i]
                    newGrid[row][col + i].isBlack = false
                    newGrid[row][col + i].partOfWords.push(`${wordNumber}`)
                  }
                  
                  if (newGrid[row][col].partOfWords.length === 1) {
                    newGrid[row][col].number = wordNumber
                  }
                  
                  crosswordWords.push({
                    id: `word-${wordNumber}`,
                    word,
                    clue,
                    startRow: row,
                    startCol: col,
                    direction,
                    number: wordNumber,
                    length: word.length,
                    completed: false
                  })
                  
                  wordNumber++
                  break
                }
              } else if (direction === 'down' && row + word.length <= size) {
                let canPlace = true
                for (let i = 0; i < word.length; i++) {
                  const cell = newGrid[row + i][col]
                  if (!cell.isBlack && cell.letter !== '' && cell.letter !== word[i]) {
                    canPlace = false
                    break
                  }
                }
                
                if (canPlace) {
                  // Place the word
                  for (let i = 0; i < word.length; i++) {
                    newGrid[row + i][col].letter = word[i]
                    newGrid[row + i][col].isBlack = false
                    newGrid[row + i][col].partOfWords.push(`${wordNumber}`)
                  }
                  
                  if (newGrid[row][col].partOfWords.length === 1) {
                    newGrid[row][col].number = wordNumber
                  }
                  
                  crosswordWords.push({
                    id: `word-${wordNumber}`,
                    word,
                    clue,
                    startRow: row,
                    startCol: col,
                    direction,
                    number: wordNumber,
                    length: word.length,
                    completed: false
                  })
                  
                  wordNumber++
                  break
                }
              }
            }
          }
        }
      })
    }
    
    console.log(`Final crossword has ${crosswordWords.length} words`)
    setGrid(newGrid)
    setWords(crosswordWords)
  }

  const startGame = async (variant: GameVariant) => {
    setSelectedVariant(variant)
    setGameState('playing')
    setTime(0)
    setHints(3)
    setCompletedWords(new Set())
    setSelectedCell(null)
    setSelectedWord(null)
    setWordInput('')
    await generateCrossword(variant)
  }

  const navigateGrid = (direction: string) => {
    if (!selectedCell) return
    
    const [row, col] = selectedCell
    let newRow = row
    let newCol = col
    
    switch (direction) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1)
        break
      case 'ArrowDown':
        newRow = Math.min(grid.length - 1, row + 1)
        break
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1)
        break
      case 'ArrowRight':
        newCol = Math.min(grid[0].length - 1, col + 1)
        break
    }
    
    if (!grid[newRow][newCol].isBlack) {
      selectCell(newRow, newCol)
    }
  }

  const toggleDirection = () => {
    setSelectedDirection(prev => prev === 'across' ? 'down' : 'across')
    if (selectedCell) {
      const [row, col] = selectedCell
      selectCell(row, col)
    }
  }

  const selectNextWord = () => {
    const currentWordIndex = words.findIndex(w => w.id === selectedWord?.id)
    const nextWord = words[(currentWordIndex + 1) % words.length]
    selectWord(nextWord)
  }

  const selectCell = (row: number, col: number) => {
    if (grid[row][col].isBlack) return
    
    setSelectedCell([row, col])
    
    // Find word at this position in the selected direction
    const wordAtPosition = words.find(word => {
      if (word.direction !== selectedDirection) return false
      
      if (word.direction === 'across') {
        return word.startRow === row && col >= word.startCol && col < word.startCol + word.length
      } else {
        return word.startCol === col && row >= word.startRow && row < word.startRow + word.length
      }
    })
    
    if (wordAtPosition) {
      selectWord(wordAtPosition)
    }
    
    // Update grid highlights
    const newGrid = [...grid]
    newGrid.forEach((r, rIdx) => {
      r.forEach((cell, cIdx) => {
        cell.isSelected = rIdx === row && cIdx === col
        cell.isHighlighted = wordAtPosition ? (
          (wordAtPosition.direction === 'across' && 
           rIdx === wordAtPosition.startRow && 
           cIdx >= wordAtPosition.startCol && 
           cIdx < wordAtPosition.startCol + wordAtPosition.length) ||
          (wordAtPosition.direction === 'down' && 
           cIdx === wordAtPosition.startCol && 
           rIdx >= wordAtPosition.startRow && 
           rIdx < wordAtPosition.startRow + wordAtPosition.length)
        ) : false
      })
    })
    setGrid(newGrid)
    
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const selectWord = (word: CrosswordWord) => {
    setSelectedWord(word)
    setSelectedDirection(word.direction)
    selectCell(word.startRow, word.startCol)
    
    // Set input to current user input for this word
    const currentInput = getCurrentWordInput(word)
    setWordInput(currentInput)
  }

  const getCurrentWordInput = (word: CrosswordWord) => {
    let input = ''
    for (let i = 0; i < word.length; i++) {
      const row = word.direction === 'across' ? word.startRow : word.startRow + i
      const col = word.direction === 'across' ? word.startCol + i : word.startCol
      input += grid[row][col].userInput || ''
    }
    return input
  }

  const handleCellInput = (letter: string) => {
    if (!selectedCell || !selectedWord) return
    
    const [row, col] = selectedCell
    const newGrid = [...grid]
    newGrid[row][col].userInput = letter
    setGrid(newGrid)
    
    // Check if word is complete
    checkWordCompletion(selectedWord)
    
    // Move to next cell
    if (letter) {
      if (selectedWord.direction === 'across' && col < selectedWord.startCol + selectedWord.length - 1) {
        selectCell(row, col + 1)
      } else if (selectedWord.direction === 'down' && row < selectedWord.startRow + selectedWord.length - 1) {
        selectCell(row + 1, col)
      }
    }
  }

  const handleWordInput = (input: string) => {
    if (!selectedWord) return
    
    const newGrid = [...grid]
    const upperInput = input.toUpperCase()
    
    // Fill the word with the input
    for (let i = 0; i < selectedWord.length; i++) {
      const row = selectedWord.direction === 'across' ? selectedWord.startRow : selectedWord.startRow + i
      const col = selectedWord.direction === 'across' ? selectedWord.startCol + i : selectedWord.startCol
      newGrid[row][col].userInput = upperInput[i] || ''
    }
    
    setGrid(newGrid)
    setWordInput(upperInput)
    
    // Check if word is complete
    checkWordCompletion(selectedWord)
  }

  const checkWordCompletion = (word: CrosswordWord) => {
    let userInput = ''
    for (let i = 0; i < word.length; i++) {
      const row = word.direction === 'across' ? word.startRow : word.startRow + i
      const col = word.direction === 'across' ? word.startCol + i : word.startCol
      userInput += grid[row][col].userInput
    }
    
    if (userInput === word.word) {
      setCompletedWords(prev => new Set([...prev, word.id]))
      
      // Clear the input field when word is completed correctly
      setWordInput('')
      
      // Auto-select next word
      const currentWordIndex = words.findIndex(w => w.id === word.id)
      const nextIncompleteWord = words.find((w, index) => 
        index > currentWordIndex && !completedWords.has(w.id) && w.id !== word.id
      )
      
      if (nextIncompleteWord) {
        // Small delay to show the completion before moving to next word
        setTimeout(() => {
          selectWord(nextIncompleteWord)
        }, 300)
      } else {
        // If no next incomplete word, try to find any incomplete word
        const anyIncompleteWord = words.find(w => !completedWords.has(w.id) && w.id !== word.id)
        if (anyIncompleteWord) {
          setTimeout(() => {
            selectWord(anyIncompleteWord)
          }, 300)
        }
      }
      
      // Check if all words are completed
      if (completedWords.size + 1 === words.length) {
        endGame()
      }
    }
  }

  const useHint = () => {
    if (hints <= 0 || !selectedWord) return
    
    const newGrid = [...grid]
    const word = selectedWord
    
    // Find first empty or incorrect cell
    for (let i = 0; i < word.length; i++) {
      const row = word.direction === 'across' ? word.startRow : word.startRow + i
      const col = word.direction === 'across' ? word.startCol + i : word.startCol
      
      if (newGrid[row][col].userInput !== word.word[i]) {
        newGrid[row][col].userInput = word.word[i]
        setGrid(newGrid)
        setHints(prev => prev - 1)
        checkWordCompletion(word)
        break
      }
    }
  }

  const endGame = () => {
    setGameState('finished')
    
    if (player && selectedVariant) {
      const completedCount = completedWords.size
      const totalWords = words.length
      const accuracy = totalWords > 0 ? (completedCount / totalWords) * 100 : 0
      const timeBonus = selectedVariant.timeLimit ? Math.max(0, selectedVariant.timeLimit - time) : Math.max(0, 600 - time)
      const hintBonus = hints * 15
      const score = Math.floor((completedCount * 100) + (accuracy * 30) + timeBonus + hintBonus)
      
      saveGameScore('crossword', score, time, accuracy)
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setSelectedVariant(null)
    setGrid([])
    setWords([])
    setSelectedCell(null)
    setSelectedWord(null)
    setCompletedWords(new Set())
    setTime(0)
    setHints(3)
    setWordInput('')
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

  if (gameState === 'menu') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-purple-600" />
              Crucigramas de Verbos en Inglés
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
                      <span>{variant.wordCount} palabras</span>
                      <span>{variant.gridSize}×{variant.gridSize}</span>
                    </div>
                    <Button 
                      onClick={() => startGame(variant)} 
                      className="w-full"
                    >
                      Comenzar Crucigrama
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

  if (gameState === 'finished') {
    const completedCount = completedWords.size
    const totalWords = words.length
    const accuracy = totalWords > 0 ? Math.round((completedCount / totalWords) * 100) : 0
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              ¡Crucigrama Completado!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900">¡Excelente trabajo!</h3>
            <p className="text-gray-600">
              Completaste {completedCount} de {totalWords} palabras ({accuracy}% de precisión)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Palabras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatTime(time)}</div>
                <div className="text-sm text-gray-600">Tiempo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{hints}</div>
                <div className="text-sm text-gray-600">Pistas restantes</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => startGame(selectedVariant!)} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Jugar de Nuevo
              </Button>
              <Button onClick={resetGame} variant="outline">
                Volver al Menú
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const acrossWords = words.filter(w => w.direction === 'across')
  const downWords = words.filter(w => w.direction === 'down')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-purple-600" />
              {selectedVariant?.name}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(time)}</span>
              </div>
              <Badge variant="outline">
                {completedWords.size}/{words.length}
              </Badge>
              <Button onClick={useHint} disabled={hints === 0} size="sm" variant="outline">
                <Lightbulb className="w-4 h-4 mr-1" />
                {hints}
              </Button>
              <Button onClick={endGame} size="sm" variant="destructive">
                Terminar
              </Button>
              <Button onClick={resetGame} size="sm" variant="outline">
                Salir
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Crossword Grid */}
            <div className="lg:col-span-2">
              <div className="inline-block bg-white p-4 rounded-lg border">
                <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${selectedVariant?.gridSize || 12}, 1fr)` }}>
                  {grid.map((row, rowIdx) => 
                    row.map((cell, colIdx) => (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className={`
                          relative border border-gray-300 w-8 h-8 flex items-center justify-center
                          text-xs font-bold cursor-pointer transition-all
                          ${cell.isBlack ? 'bg-black' : 'bg-white hover:bg-blue-50'}
                          ${cell.isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                          ${cell.isHighlighted ? 'bg-blue-50' : ''}
                          ${completedWords.has(cell.partOfWords[0]) ? 'text-green-600' : 'text-gray-900'}
                        `}
                        onClick={() => selectCell(rowIdx, colIdx)}
                      >
                        {cell.number && (
                          <span className="absolute top-0 left-0 text-xs text-gray-500 leading-none">
                            {cell.number}
                          </span>
                        )}
                        {!cell.isBlack && (
                          <span className="text-sm">
                            {cell.userInput || ''}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Word Input */}
              {selectedWord && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Palabra {selectedWord.number} ({selectedWord.direction === 'across' ? 'Horizontal' : 'Vertical'})
                      </label>
                      <Input
                        ref={inputRef}
                        value={wordInput}
                        onChange={(e) => handleWordInput(e.target.value)}
                        placeholder="Escribe la palabra completa"
                        className="font-mono uppercase"
                        maxLength={selectedWord.length}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedWord.length} letras
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Pista:</strong> {selectedWord.clue}
                  </div>
                </div>
              )}
            </div>
            
            {/* Clues */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Pistas</h3>
                <Button
                  onClick={() => setShowClues(!showClues)}
                  size="sm"
                  variant="outline"
                >
                  {showClues ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
              
              {showClues && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Horizontal
                    </h4>
                    <div className="space-y-2">
                      {acrossWords.map(word => (
                        <div
                          key={word.id}
                          className={`
                            p-2 rounded cursor-pointer text-sm transition-all
                            ${selectedWord?.id === word.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
                            ${completedWords.has(word.id) ? 'text-green-600 line-through' : 'text-gray-700'}
                          `}
                          onClick={() => selectWord(word)}
                        >
                          <span className="font-medium">{word.number}.</span> {word.clue}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                      Vertical
                    </h4>
                    <div className="space-y-2">
                      {downWords.map(word => (
                        <div
                          key={word.id}
                          className={`
                            p-2 rounded cursor-pointer text-sm transition-all
                            ${selectedWord?.id === word.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
                            ${completedWords.has(word.id) ? 'text-green-600 line-through' : 'text-gray-700'}
                          `}
                          onClick={() => selectWord(word)}
                        >
                          <span className="font-medium">{word.number}.</span> {word.clue}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Controles:</strong></p>
                <p>• Haz clic en una casilla para seleccionarla</p>
                <p>• Escribe la palabra completa en el campo de texto</p>
                <p>• Usa las flechas para navegar</p>
                <p>• Espacio para cambiar dirección</p>
                <p>• Tab para siguiente palabra</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}