'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Gamepad2, 
  TrendingUp, 
  ArrowRight,
  Grid3X3,
  User,
  LogIn,
  Sparkles,
  Star
} from 'lucide-react'
import VerbsList from '@/components/VerbsList'
import MemoryGame from '@/components/MemoryGame'
import ConcentrationGame from '@/components/ConcentrationGame'
import MatchingGame from '@/components/MatchingGame'
import WordSearchGame from '@/components/WordSearchGame'
import CrosswordGame from '@/components/CrosswordGame'
import ProgressStats from '@/components/ProgressStats'
import PlayerNameForm from '@/components/PlayerNameForm'
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext'

function AppContent() {
  const { player, logout } = usePlayer()
  const [activeTab, setActiveTab] = useState('home')
  const [showPlayerForm, setShowPlayerForm] = useState(false)

  const gameTabs = [
    { value: 'home', label: 'Inicio', icon: Gamepad2 },
    { value: 'verbs', label: 'Verbos', icon: BookOpen },
    { value: 'memory', label: 'Memoria', icon: Brain },
    { value: 'concentration', label: 'Concentración', icon: Trophy },
    { value: 'matching', label: 'Conexión', icon: ArrowRight },
    { value: 'wordsearch', label: 'Búsqueda', icon: Grid3X3 },
    { value: 'crossword', label: 'Crucigrama', icon: Grid3X3 },
    { value: 'progress', label: 'Progreso', icon: TrendingUp },
    ...(player ? [{ value: 'profile', label: 'Perfil', icon: User }] : [])
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800">Verbos English</h1>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            
            <div className="flex items-center gap-4">
              {player ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-600">Nivel {player.level} • {player.experience} XP</p>
                  </div>
                  <div className="relative">
                    <img 
                      src={player.avatar} 
                      alt={player.name}
                      className="w-10 h-10 rounded-full border-2 border-purple-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {player.level}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Cambiar
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowPlayerForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <User className="w-4 h-4 mr-2" />
                  Tu Nombre
                </Button>
              )}
            </div>
          </div>
          <p className="text-lg text-gray-600">¡Aprende verbos en inglés con 70+ juegos divertidos!</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-8 gap-1">
            {gameTabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="flex items-center gap-1 text-xs md:text-sm"
              >
                <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.label.substring(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {!player ? (
              <div className="text-center mb-8">
                <PlayerNameForm />
              </div>
            ) : (
              <div className="text-center mb-6">
                <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <img 
                        src={player.avatar} 
                        alt={player.name}
                        className="w-16 h-16 rounded-full border-3 border-purple-400"
                      />
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-purple-800">¡Hola, {player.name}!</h3>
                        <p className="text-purple-600">Nivel {player.level} • {player.experience} XP • {player.totalGames} juegos</p>
                      </div>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(player.experience % 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-purple-700">
                      {100 - (player.experience % 100)} XP para el siguiente nivel
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('memory')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                    Juego de Memoria
                  </CardTitle>
                  <CardDescription>
                    12+ variantes diferentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Encuentra parejas de verbos con temas: animales, comida, viajes, naturaleza y más
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Básico</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Animales</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Velocidad</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">+9 más</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('concentration')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                    Juego de Concentración
                  </CardTitle>
                  <CardDescription>
                    15+ variantes desafiantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Responde preguntas sobre verbos: pasado, participio, traducción y más
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Pasado</span>
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Traducción</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Velocidad</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">+12 más</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('matching')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    Juego de Conexión
                  </CardTitle>
                  <CardDescription>
                    15+ variantes interactivas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Conecta verbos con sus traducciones, formas de pasado y más
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Básico</span>
                    <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">Multilingüe</span>
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Inverso</span>
                    <span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded">+12 más</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('wordsearch')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                    Búsqueda de Palabras
                  </CardTitle>
                  <CardDescription>
                    15+ variantes emocionantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Encuentra verbos escondidos en cuadrículas de diferentes tamaños
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Básico</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Animales</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Mega</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">+12 más</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('crossword')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                    Crucigramas
                  </CardTitle>
                  <CardDescription>
                    15+ variantes mentales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Resuelve crucigramas con pistas sobre verbos en inglés
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Básico</span>
                    <span className="text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded">Pasado</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Velocidad</span>
                    <span className="text-xs bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded">+12 más</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('verbs')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    Lista de Verbos
                  </CardTitle>
                  <CardDescription>
                    98 verbos disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Explora y estudia la lista completa de verbos con traducciones
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Regulares</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Irregulares</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">5 idiomas</span>
                  </div>
                </CardContent>
              </Card>

              {player && (
                <>
                  <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('progress')}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                        Estadísticas
                      </CardTitle>
                      <CardDescription>
                        Tu rendimiento detallado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Revisa tu progreso, mejores puntuaciones y estadísticas
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Gráficos</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Historial</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Rendimiento</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('profile')}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                        Mi Perfil
                      </CardTitle>
                      <CardDescription>
                        Tu información personal
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        Gestiona tu perfil y mira tus logros desbloqueados
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Nivel {player.level}</span>
                        <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">{player.experience} XP</span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{player.totalGames} juegos</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <Card className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                  Características de Verbos English
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">75+ Variantes de Juegos</h4>
                    <p className="text-sm text-gray-600">Memoria, concentración, conexión, búsqueda y crucigramas</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">98 Verbos en 5 Idiomas</h4>
                    <p className="text-sm text-gray-600">Inglés, español, francés, alemán, italiano y portugués</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Sistema de Niveles</h4>
                    <p className="text-sm text-gray-600">Gana experiencia y sube de nivel mientras juegas</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Estadísticas Detalladas</h4>
                    <p className="text-sm text-gray-600">Monitorea tu progreso y mejora continua</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verbs">
            <VerbsList />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryGame />
          </TabsContent>

          <TabsContent value="concentration">
            <ConcentrationGame />
          </TabsContent>

          <TabsContent value="matching">
            <MatchingGame />
          </TabsContent>

          <TabsContent value="wordsearch">
            <WordSearchGame />
          </TabsContent>

          <TabsContent value="crossword">
            <CrosswordGame />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressStats />
          </TabsContent>

          <TabsContent value="profile">
            <PlayerNameForm />
          </TabsContent>
        </Tabs>

        {showPlayerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <PlayerNameForm />
              <div className="mt-4 text-center">
                <Button onClick={() => setShowPlayerForm(false)} variant="outline">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  )
}