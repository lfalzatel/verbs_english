'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Gamepad2, 
  BookOpen, 
  Brain, 
  Trophy, 
  ArrowRight, 
  Grid3x3, 
  Sparkles,
  Play,
  Star,
  Target,
  Zap,
  Clock,
  Award,
  User,
  BarChart3,
  LogOut,
  Search
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import VerbsList from '@/components/VerbsList';
import VerbSearch from '@/components/VerbSearch';
import ConcentrationGame from '@/components/ConcentrationGame';
import MemoryGame from '@/components/MemoryGame';
import CrosswordGame from '@/components/CrosswordGame';
import WordSearchGame from '@/components/WordSearchGame';
import MatchingGame from '@/components/MatchingGame';
import ProgressStats from '@/components/ProgressStats';
import HomeDashboard from '@/components/HomeDashboard';

export default function Home() {
  const { user, isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const handlePlayerLogin = async (name: string) => {
    try {
      await login(name);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Si no está autenticado, mostrar formulario simple
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-800 mx-3">Verbos English</h1>
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <CardDescription className="text-lg">
                ¡Aprende verbos en inglés con juegos divertidos!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ingresa tu nombre"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handlePlayerLogin(e.currentTarget.value.trim());
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={() => {
                    const input = document.getElementById('name') as HTMLInputElement;
                    if (input?.value.trim()) {
                      handlePlayerLogin(input.value.trim());
                    }
                  }}
                  className="w-full"
                >
                  Comenzar a Jugar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header con información del usuario */}
      <header className="text-center mb-8 pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">Nivel 1</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800 mx-3">Verbos English</h1>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </Button>
          </div>
          <p className="text-lg text-gray-600">¡Aprende verbos en inglés con juegos divertidos!</p>
        </div>
      </header>

      {/* Tabs principales */}
      <div className="max-w-7xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Memoria</span>
            </TabsTrigger>
            <TabsTrigger value="concentration" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Concentración</span>
            </TabsTrigger>
            <TabsTrigger value="matching" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Apareamiento</span>
            </TabsTrigger>
            <TabsTrigger value="wordsearch" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Búsqueda</span>
            </TabsTrigger>
            <TabsTrigger value="crossword" className="flex items-center space-x-2">
              <Grid3x3 className="w-4 h-4" />
              <span>Crucigrama</span>
            </TabsTrigger>
            <TabsTrigger value="verbs" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Verbos</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Progreso</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab de Inicio */}
          <TabsContent value="home">
            <HomeDashboard onNavigate={setActiveTab} />
          </TabsContent>

          {/* Tab de Memoria */}
          <TabsContent value="memory">
            <MemoryGame />
          </TabsContent>

          {/* Tab de Concentración */}
          <TabsContent value="concentration">
            <ConcentrationGame />
          </TabsContent>

          {/* Tab de Apareamiento */}
          <TabsContent value="matching">
            <MatchingGame />
          </TabsContent>

          {/* Tab de Búsqueda */}
          <TabsContent value="wordsearch">
            <WordSearchGame />
          </TabsContent>

          {/* Tab de Crucigrama */}
          <TabsContent value="crossword">
            <CrosswordGame />
          </TabsContent>

          {/* Tab de Verbos */}
          <TabsContent value="verbs">
            <VerbsList />
          </TabsContent>

          {/* Tab de Progreso */}
          <TabsContent value="progress">
            <ProgressStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}