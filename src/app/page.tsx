'use client';

import { useState, useEffect } from 'react';
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
  Award
} from 'lucide-react';

interface GameLevel {
  id: string;
  name: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  description: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  isLocked: boolean;
  requirements?: string;
}

interface Game {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  levels: GameLevel[];
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    // Simular carga de datos dinámicos
    const loadGames = async () => {
      try {
        setLoading(true);
        // Aquí iría la llamada a la API real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const gamesData: Game[] = [
          {
            id: 'memory',
            name: 'Memoria',
            icon: <Brain className="w-5 h-5" />,
            description: 'Encuentra los pares de verbos',
            levels: [
              {
                id: 'memory-easy',
                name: 'Memoria Fácil',
                difficulty: 'Fácil',
                description: '12 cartas (6 pares) - Verbos básicos',
                icon: <Star className="w-4 h-4 text-green-500" />,
                color: 'bg-green-50 border-green-200 hover:bg-green-100',
                progress: 100,
                isLocked: false
              },
              {
                id: 'memory-medium',
                name: 'Memoria Medio',
                difficulty: 'Medio',
                description: '20 cartas (10 pares) - Verbos comunes',
                icon: <Zap className="w-4 h-4 text-yellow-500" />,
                color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                progress: 65,
                isLocked: false
              },
              {
                id: 'memory-hard',
                name: 'Memoria Difícil',
                difficulty: 'Difícil',
                description: '30 cartas (15 pares) - Verbos avanzados',
                icon: <Target className="w-4 h-4 text-red-500" />,
                color: 'bg-red-50 border-red-200 hover:bg-red-100',
                progress: 30,
                isLocked: false,
                requirements: 'Completa el nivel medio'
              }
            ]
          },
          {
            id: 'concentration',
            name: 'Concentración',
            icon: <Trophy className="w-5 h-5" />,
            description: 'Combina tiempos verbales',
            levels: [
              {
                id: 'concentration-easy',
                name: 'Concentración Fácil',
                difficulty: 'Fácil',
                description: 'Presente simple - 8 verbos',
                icon: <Star className="w-4 h-4 text-green-500" />,
                color: 'bg-green-50 border-green-200 hover:bg-green-100',
                progress: 100,
                isLocked: false
              },
              {
                id: 'concentration-medium',
                name: 'Concentración Medio',
                difficulty: 'Medio',
                description: 'Presente y Pasado - 12 verbos',
                icon: <Zap className="w-4 h-4 text-yellow-500" />,
                color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                progress: 45,
                isLocked: false
              },
              {
                id: 'concentration-hard',
                name: 'Concentración Difícil',
                difficulty: 'Difícil',
                description: 'Todos los tiempos - 16 verbos',
                icon: <Target className="w-4 h-4 text-red-500" />,
                color: 'bg-red-50 border-red-200 hover:bg-red-100',
                progress: 0,
                isLocked: true,
                requirements: 'Completa el nivel medio'
              }
            ]
          },
          {
            id: 'matching',
            name: 'Conexión',
            icon: <ArrowRight className="w-5 h-5" />,
            description: 'Conecta verbos con traducciones',
            levels: [
              {
                id: 'matching-easy',
                name: 'Conexión Fácil',
                difficulty: 'Fácil',
                description: '10 verbos básicos',
                icon: <Star className="w-4 h-4 text-green-500" />,
                color: 'bg-green-50 border-green-200 hover:bg-green-100',
                progress: 80,
                isLocked: false
              },
              {
                id: 'matching-medium',
                name: 'Conexión Medio',
                difficulty: 'Medio',
                description: '15 verbos irregulares',
                icon: <Zap className="w-4 h-4 text-yellow-500" />,
                color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                progress: 50,
                isLocked: false
              },
              {
                id: 'matching-hard',
                name: 'Conexión Difícil',
                difficulty: 'Difícil',
                description: '20 verbos compuestos',
                icon: <Target className="w-4 h-4 text-red-500" />,
                color: 'bg-red-50 border-red-200 hover:bg-red-100',
                progress: 20,
                isLocked: false
              }
            ]
          },
          {
            id: 'wordsearch',
            name: 'Búsqueda',
            icon: <Grid3x3 className="w-5 h-5" />,
            description: 'Encuentra verbos escondidos',
            levels: [
              {
                id: 'wordsearch-easy',
                name: 'Búsqueda Fácil',
                difficulty: 'Fácil',
                description: '10x10 grid - 8 verbos',
                icon: <Star className="w-4 h-4 text-green-500" />,
                color: 'bg-green-50 border-green-200 hover:bg-green-100',
                progress: 90,
                isLocked: false
              },
              {
                id: 'wordsearch-medium',
                name: 'Búsqueda Medio',
                difficulty: 'Medio',
                description: '15x15 grid - 12 verbos',
                icon: <Zap className="w-4 h-4 text-yellow-500" />,
                color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                progress: 60,
                isLocked: false
              },
              {
                id: 'wordsearch-hard',
                name: 'Búsqueda Difícil',
                difficulty: 'Difícil',
                description: '20x20 grid - 15 verbos',
                icon: <Target className="w-4 h-4 text-red-500" />,
                color: 'bg-red-50 border-red-200 hover:bg-red-100',
                progress: 25,
                isLocked: false
              }
            ]
          },
          {
            id: 'crossword',
            name: 'Crucigrama',
            icon: <Grid3x3 className="w-5 h-5" />,
            description: 'Crucigramas de verbos',
            levels: [
              {
                id: 'crossword-easy',
                name: 'Crucigrama Fácil',
                difficulty: 'Fácil',
                description: '5x5 - Verbos básicos',
                icon: <Star className="w-4 h-4 text-green-500" />,
                color: 'bg-green-50 border-green-200 hover:bg-green-100',
                progress: 75,
                isLocked: false
              },
              {
                id: 'crossword-medium',
                name: 'Crucigrama Medio',
                difficulty: 'Medio',
                description: '10x10 - Verbos comunes',
                icon: <Zap className="w-4 h-4 text-yellow-500" />,
                color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                progress: 40,
                isLocked: false
              },
              {
                id: 'crossword-hard',
                name: 'Crucigrama Difícil',
                difficulty: 'Difícil',
                description: '15x15 - Verbos avanzados',
                icon: <Target className="w-4 h-4 text-red-500" />,
                color: 'bg-red-50 border-red-200 hover:bg-red-100',
                progress: 10,
                isLocked: true,
                requirements: 'Completa el nivel medio'
              }
            ]
          }
        ];

        setGames(gamesData);
      } catch (err) {
        setError('Error al cargar los juegos. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId === selectedGame ? null : gameId);
  };

  const handleLevelPlay = (gameId: string, levelId: string) => {
    // Aquí iría la lógica para iniciar el juego
    console.log(`Iniciando juego ${gameId}, nivel ${levelId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Cargando juegos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Alert className="max-w-md">
              <AlertDescription>{error}</AlertDescription>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Reintentar
              </Button>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800 mx-3">Verbos English</h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600">¡Aprende verbos en inglés con juegos divertidos!</p>
          <p className="text-sm text-gray-500 mt-2">Versión Dinámica para Vercel</p>
        </header>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedGame === game.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
              onClick={() => handleGameSelect(game.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {game.icon}
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                  </div>
                  <Play className="w-5 h-5 text-purple-600" />
                </div>
                <CardDescription className="text-sm">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              {selectedGame === game.id && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {game.levels.map((level) => (
                      <div 
                        key={level.id}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          level.isLocked 
                            ? 'bg-gray-50 border-gray-200 opacity-60' 
                            : level.color
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {level.icon}
                            <span className="font-medium text-sm">{level.name}</span>
                            <Badge className={`text-xs ${getDifficultyColor(level.difficulty)}`}>
                              {level.difficulty}
                            </Badge>
                          </div>
                          {level.isLocked && (
                            <div className="text-xs text-gray-500">🔒</div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{level.description}</p>
                        
                        {!level.isLocked && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Progreso</span>
                              <span className="font-medium">{level.progress}%</span>
                            </div>
                            <Progress value={level.progress} className="h-2" />
                            <Button 
                              size="sm" 
                              className="w-full text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLevelPlay(game.id, level.id);
                              }}
                            >
                              {level.progress > 0 ? 'Continuar' : 'Jugar'}
                            </Button>
                          </div>
                        )}
                        
                        {level.isLocked && level.requirements && (
                          <p className="text-xs text-gray-500 italic">
                            {level.requirements}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-800">12</span>
              </div>
              <p className="text-sm text-green-700">Niveles Completados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-yellow-600 mr-2" />
                <span className="text-2xl font-bold text-yellow-800">45</span>
              </div>
              <p className="text-sm text-yellow-700">Minutos Jugados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-800">85%</span>
              </div>
              <p className="text-sm text-purple-700">Precisión Total</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}