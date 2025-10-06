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
  ArrowRight,
  Grid3X3,
  Sparkles
} from 'lucide-react'
import VerbsListStatic from '@/components/VerbsListStatic'

export default function StaticPage() {
  const [activeTab, setActiveTab] = useState('home')

  const gameTabs = [
    { value: 'home', label: 'Inicio', icon: Gamepad2 },
    { value: 'verbs', label: 'Verbos', icon: BookOpen },
    { value: 'memory', label: 'Memoria', icon: Brain },
    { value: 'concentration', label: 'Concentración', icon: Trophy },
    { value: 'matching', label: 'Conexión', icon: ArrowRight },
    { value: 'wordsearch', label: 'Búsqueda', icon: Grid3X3 },
    { value: 'crossword', label: 'Crucigrama', icon: Grid3X3 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800 mx-3">Verbos English</h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600">¡Aprende verbos en inglés con juegos divertidos!</p>
          <p className="text-sm text-gray-500 mt-2">Versión Estática para Netlify</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-8 gap-1">
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
            <div className="text-center mb-6">
              <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
                <CardContent className="py-6">
                  <h3 className="text-xl font-bold text-purple-800">¡Bienvenido a Verbos English!</h3>
                  <p className="text-purple-600">Explora nuestros juegos de aprendizaje de verbos en inglés</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('verbs')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    Lista de Verbos
                  </CardTitle>
                  <CardDescription>
                    10+ verbos disponibles
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

              <Card className="hover:shadow-lg transition-all cursor-pointer group opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                    Juego de Memoria
                  </CardTitle>
                  <CardDescription>
                    Próximamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Encuentra parejas de verbos con diferentes temas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">En desarrollo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                    Juego de Concentración
                  </CardTitle>
                  <CardDescription>
                    Próximamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Responde preguntas sobre verbos: pasado, participio, traducción
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">En desarrollo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    Juego de Conexión
                  </CardTitle>
                  <CardDescription>
                    Próximamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Conecta verbos con sus traducciones y formas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">En desarrollo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                    Búsqueda de Palabras
                  </CardTitle>
                  <CardDescription>
                    Próximamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Encuentra verbos escondidos en cuadrículas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">En desarrollo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group opacity-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                    Crucigramas
                  </CardTitle>
                  <CardDescription>
                    Próximamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Resuelve crucigramas con pistas sobre verbos
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">En desarrollo</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verbs">
            <VerbsListStatic />
          </TabsContent>

          <TabsContent value="memory">
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Juego de Memoria</h3>
                <p className="text-gray-600 mb-4">Esta función está en desarrollo para la versión estática.</p>
                <p className="text-sm text-gray-500">Prueba la versión completa con servidor para acceder a todos los juegos.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concentration">
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Juego de Concentración</h3>
                <p className="text-gray-600 mb-4">Esta función está en desarrollo para la versión estática.</p>
                <p className="text-sm text-gray-500">Prueba la versión completa con servidor para acceder a todos los juegos.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matching">
            <Card>
              <CardContent className="text-center py-8">
                <ArrowRight className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Juego de Conexión</h3>
                <p className="text-gray-600 mb-4">Esta función está en desarrollo para la versión estática.</p>
                <p className="text-sm text-gray-500">Prueba la versión completa con servidor para acceder a todos los juegos.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wordsearch">
            <Card>
              <CardContent className="text-center py-8">
                <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Búsqueda de Palabras</h3>
                <p className="text-gray-600 mb-4">Esta función está en desarrollo para la versión estática.</p>
                <p className="text-sm text-gray-500">Prueba la versión completa con servidor para acceder a todos los juegos.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crossword">
            <Card>
              <CardContent className="text-center py-8">
                <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Crucigramas</h3>
                <p className="text-gray-600 mb-4">Esta función está en desarrollo para la versión estática.</p>
                <p className="text-sm text-gray-500">Prueba la versión completa con servidor para acceder a todos los juegos.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}