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
  const [isInMemoryMode, setIsInMemoryMode] = useState(false)

  const categories = ['all', 'regular', 'irregular']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  useEffect(() => {
    fetchVerbs()
  }, [])

  // Add a retry mechanism for when the component shows an error
  useEffect(() => {
    if (error && !loading) {
      // Auto-retry after 3 seconds if there's an error
      const timer = setTimeout(() => {
        console.log('Auto-retrying due to previous error...')
        fetchVerbs()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [error, loading])

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
      setError(null)
      
      console.log('Fetching verbs from /api/verbs...')
      const response = await fetch('/api/verbs')
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        
        if (response.status === 503) {
          throw new Error('El servicio no está disponible temporalmente. Por favor intenta en unos momentos.')
        } else if (response.status === 500) {
          throw new Error('Error interno del servidor. La base de datos podría estar inicializándose.')
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      }
      
      const data = await response.json()
      console.log('Received data:', data.length, 'verbs')
      
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', typeof data, data)
        throw new Error('La respuesta del servidor no es válida.')
      }
      
      setVerbs(data)
      setFilteredVerbs(data)
      
      // Check if we're in memory mode by checking if there's a warning in the console
      // or if the data seems like mock data
      if (data.length > 0 && data[0].id && typeof data[0].id === 'number') {
        setIsInMemoryMode(false)
      } else {
        setIsInMemoryMode(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching verbs:', err)
      
      // If there's a network error, try to use fallback data
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        console.log('Network error detected, using fallback data...')
        const fallbackData = [
          { id: 1, infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'easy' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'medium' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 3, infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', category: 'irregular', difficulty: 'medium' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 4, infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', category: 'irregular', difficulty: 'hard' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 5, infinitive: 'have', past: 'had', participle: 'had', translation: 'tener', category: 'irregular', difficulty: 'hard' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]
        setVerbs(fallbackData)
        setFilteredVerbs(fallbackData)
        setIsInMemoryMode(true)
        setError(`Modo de emergencia: ${errorMessage}`)
      } else {
        setError(`Error al cargar los verbos: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Seeding database...')
      const response = await fetch('/api/verbs/seed', { method: 'POST' })
      
      console.log('Seed response status:', response.status)
      console.log('Seed response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Seed error response text:', errorText)
        
        if (response.status === 503) {
          throw new Error('El servicio no está disponible temporalmente. Por favor intenta en unos momentos.')
        } else if (response.status === 500) {
          throw new Error('Error al inicializar la base de datos. Por favor intenta de nuevo.')
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      }
      
      const result = await response.json()
      console.log('Seed result:', result)
      
      // Wait a moment for the database to be ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Fetch verbs after seeding
      await fetchVerbs()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error seeding database:', err)
      setError(`Error al inicializar la base de datos: ${errorMessage}`)
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
            <p className="mt-2 text-gray-600">
              {error ? 'Reintentando...' : 'Cargando verbos...'}
            </p>
            {error && (
              <p className="text-xs text-gray-500 mt-1">
                Error anterior: {error}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && verbs.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error al cargar los verbos
              </h3>
              <p className="text-red-600 mb-6 text-sm leading-relaxed">
                {error}
              </p>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={fetchVerbs} variant="outline" className="w-full sm:w-auto">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                  <Button onClick={seedDatabase} className="w-full sm:w-auto">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Inicializar Base de Datos
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Si el problema persiste, recarga la página o contacta al administrador.
                </p>
                <details className="text-left text-xs text-gray-400 mt-2">
                  <summary className="cursor-pointer">Información de depuración</summary>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                    <p>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                    <p>Timestamp: {new Date().toISOString()}</p>
                    <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</p>
                  </div>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency Mode Banner */}
      {error && verbs.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-orange-800">
                  ⚠️ Modo de Emergencia
                </h3>
                <p className="text-xs text-orange-700">
                  {error}
                </p>
              </div>
              <Button onClick={fetchVerbs} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory Mode Banner */}
      {isInMemoryMode && !error && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800">
                  🚀 Modo Demo Activo
                </h3>
                <p className="text-xs text-amber-700">
                  La aplicación está funcionando en modo de memoria. Las estadísticas no se guardarán permanentemente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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