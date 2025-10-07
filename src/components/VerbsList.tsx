'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Volume2, BookOpen, RefreshCw } from 'lucide-react'

interface Verb {
  id: number
  infinitive: string
  past: string
  participle: string
  translation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: string
  updatedAt: string
}

export default function VerbsList() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [filteredVerbs, setFilteredVerbs] = useState<Verb[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = ['all', 'regular', 'irregular']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  useEffect(() => {
    fetchVerbs()
  }, [])

  useEffect(() => {
    let filtered = verbs

    if (searchTerm) {
      filtered = filtered.filter(verb =>
        verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.past.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.participle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.translation.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(verb => verb.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(verb => verb.difficulty === selectedDifficulty)
    }

    setFilteredVerbs(filtered)
  }, [verbs, searchTerm, selectedCategory, selectedDifficulty])

  const fetchVerbs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/verbs')
      if (!response.ok) {
        throw new Error('Failed to fetch verbs')
      }
      const data = await response.json()
      setVerbs(data)
      setFilteredVerbs(data)
    } catch (err) {
      setError('Error al cargar los verbos. Por favor intenta de nuevo.')
      console.error('Error fetching verbs:', err)
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/verbs/seed', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to seed database')
      }
      await fetchVerbs()
    } catch (err) {
      setError('Error al inicializar la base de datos.')
      console.error('Error seeding database:', err)
    } finally {
      setLoading(false)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regular': return 'bg-blue-100 text-blue-800'
      case 'irregular': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando verbos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-2">
              <Button onClick={fetchVerbs} variant="outline">
                Reintentar
              </Button>
              <Button onClick={seedDatabase}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Inicializar Base de Datos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Lista de Verbos en Inglés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar verbos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Categoría:</span>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Todas' : category === 'regular' ? 'Regulares' : 'Irregulares'}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Dificultad:</span>
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty === 'all' ? 'Todas' : 
                 difficulty === 'easy' ? 'Fácil' : 
                 difficulty === 'medium' ? 'Media' : 'Difícil'}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredVerbs.length} verbos encontrados</span>
            <Button onClick={seedDatabase} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Recargar Datos
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredVerbs.map((verb) => (
          <Card key={verb.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <Badge className={getCategoryColor(verb.category)}>
                    {verb.category === 'regular' ? 'Regular' : 'Irregular'}
                  </Badge>
                  <Badge className={getDifficultyColor(verb.difficulty)}>
                    {verb.difficulty === 'easy' ? 'Fácil' : 
                     verb.difficulty === 'medium' ? 'Media' : 'Difícil'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(verb.infinitive)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Infinitivo</p>
                  <p className="text-lg font-semibold text-gray-900">{verb.infinitive}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pasado</p>
                  <p className="text-lg font-semibold text-gray-900">{verb.past}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Participio</p>
                  <p className="text-lg font-semibold text-gray-900">{verb.participle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Traducción</p>
                  <p className="text-lg font-semibold text-gray-900">{verb.translation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVerbs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No se encontraron verbos que coincidan con tu búsqueda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}