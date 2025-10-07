'use client';

import { useState, useEffect } from 'react';
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
  Search,
  Volume2
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

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

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadGames();
    }
  }, [isAuthenticated]);

  const loadGames = async () => {
    try {
      setLoading(true);
      
      // Simular carga de datos dinámicos
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
              progress: 0,
              isLocked: false
            },
            {
              id: 'memory-medium',
              name: 'Memoria Medio',
              difficulty: 'Medio',
              description: '20 cartas (10 pares) - Verbos comunes',
              icon: <Zap className="w-4 h-4 text-yellow-500" />,
              color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'memory-hard',
              name: 'Memoria Difícil',
              difficulty: 'Difícil',
              description: '30 cartas (15 pares) - Verbos avanzados',
              icon: <Target className="w-4 h-4 text-red-500" />,
              color: 'bg-red-50 border-red-200 hover:bg-red-100',
              progress: 0,
              isLocked: false
            }
          ]
        },
        {
          id: 'search',
          name: 'Búsqueda',
          icon: <Search className="w-5 h-5" />,
          description: 'Traduce verbos al español',
          levels: [
            {
              id: 'search-easy',
              name: 'Búsqueda Fácil',
              difficulty: 'Fácil',
              description: '15 verbos básicos',
              icon: <Star className="w-4 h-4 text-green-500" />,
              color: 'bg-green-50 border-green-200 hover:bg-green-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'search-medium',
              name: 'Búsqueda Media',
              difficulty: 'Medio',
              description: '25 verbos intermedios',
              icon: <Zap className="w-4 h-4 text-yellow-500" />,
              color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'search-hard',
              name: 'Búsqueda Difícil',
              difficulty: 'Difícil',
              description: '35 verbos avanzados',
              icon: <Target className="w-4 h-4 text-red-500" />,
              color: 'bg-red-50 border-red-200 hover:bg-red-100',
              progress: 0,
              isLocked: false
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
              description: '10 preguntas - 10 puntos',
              icon: <Star className="w-4 h-4 text-green-500" />,
              color: 'bg-green-50 border-green-200 hover:bg-green-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'concentration-medium',
              name: 'Concentración Media',
              difficulty: 'Medio',
              description: '15 preguntas - 15 puntos',
              icon: <Zap className="w-4 h-4 text-yellow-500" />,
              color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'concentration-hard',
              name: 'Concentración Difícil',
              difficulty: 'Difícil',
              description: '20 preguntas - 20 puntos',
              icon: <Target className="w-4 h-4 text-red-500" />,
              color: 'bg-red-50 border-red-200 hover:bg-red-100',
              progress: 0,
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
              progress: 0,
              isLocked: false
            },
            {
              id: 'crossword-medium',
              name: 'Crucigrama Medio',
              difficulty: 'Medio',
              description: '10x10 - Verbos comunes',
              icon: <Zap className="w-4 h-4 text-yellow-500" />,
              color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'crossword-hard',
              name: 'Crucigrama Difícil',
              difficulty: 'Difícil',
              description: '15x15 - Verbos avanzados',
              icon: <Target className="w-4 h-4 text-red-500" />,
              color: 'bg-red-50 border-red-200 hover:bg-red-100',
              progress: 0,
              isLocked: false
            }
          ]
        },
        {
          id: 'wordsearch',
          name: 'Sopa de Letras',
          icon: <Grid3x3 className="w-5 h-5" />,
          description: 'Encuentra verbos escondidos',
          levels: [
            {
              id: 'wordsearch-easy',
              name: 'Sopa Fácil',
              difficulty: 'Fácil',
              description: '10x10 - 8 verbos',
              icon: <Star className="w-4 h-4 text-green-500" />,
              color: 'bg-green-50 border-green-200 hover:bg-green-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'wordsearch-medium',
              name: 'Sopa Media',
              difficulty: 'Medio',
              description: '15x15 - 12 verbos',
              icon: <Zap className="w-4 h-4 text-yellow-500" />,
              color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'wordsearch-hard',
              name: 'Sopa Difícil',
              difficulty: 'Difícil',
              description: '20x20 - 15 verbos',
              icon: <Target className="w-4 h-4 text-red-500" />,
              color: 'bg-red-50 border-red-200 hover:bg-red-100',
              progress: 0,
              isLocked: false
            }
          ]
        },
        {
          id: 'matching',
          name: 'Apareamiento',
          icon: <ArrowRight className="w-5 h-5" />,
          description: 'Conecta verbos con traducciones',
          levels: [
            {
              id: 'matching-easy',
              name: 'Apareamiento Fácil',
              difficulty: 'Fácil',
              description: '10 verbos básicos',
              icon: <Star className="w-4 h-4 text-green-500" />,
              color: 'bg-green-50 border-green-200 hover:bg-green-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'matching-medium',
              name: 'Apareamiento Medio',
              difficulty: 'Medio',
              description: '15 verbos irregulares',
              icon: <Zap className="w-4 h-4 text-yellow-500" />,
              color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              progress: 0,
              isLocked: false
            },
            {
              id: 'matching-hard',
              name: 'Apareamiento Difícil',
              difficulty: 'Difícil',
              description: '20 verbos compuestos',
              icon: <Target className="w-4 h-4 text-red-500" />,
              color: 'bg-red-50 border-red-200 hover:bg-red-100',
              progress: 0,
              isLocked: false
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

  const handleLevelPlay = async (gameId: string, levelId: string) => {
    try {
      // Simular inicio del juego
      console.log(`Iniciando juego ${gameId}, nivel ${levelId}`);
      
      // Aquí iría la lógica para abrir el juego específico
      // Por ahora, solo mostramos un mensaje
      alert(`Juego ${gameId} - Nivel ${levelId} iniciado!`);
      
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  // Mostrar loading
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

  // Mostrar error
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
        {/* Header con información del usuario */}
        <header className="text-center mb-8 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{user?.name}</p>
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
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </Button>
          </div>
          <p className="text-lg text-gray-600">¡Aprende verbos en inglés con juegos divertidos!</p>
        </header>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedGame === game.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
              onClick={() => handleGameSelect(game.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {game.icon}
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                  </div>
                  <Play className="w-4 h-4 text-gray-400" />
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              
              {selectedGame === game.id && (
                <CardContent className="space-y-3">
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Niveles disponibles:</h4>
                    <div className="space-y-2">
                      {game.levels.map((level) => (
                        <div
                          key={level.id}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            level.isLocked 
                              ? 'bg-gray-50 border-gray-200 opacity-60' 
                              : level.color + ' border cursor-pointer hover:shadow-md'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!level.isLocked) {
                              handleLevelPlay(game.id, level.id);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {level.icon}
                              <div>
                                <p className="font-medium text-sm">{level.name}</p>
                                <p className="text-xs text-gray-600">{level.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getDifficultyColor(level.difficulty)}>
                                {level.difficulty}
                              </Badge>
                              {level.isLocked ? (
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-xs">🔒</span>
                                </div>
                              ) : (
                                <Button size="sm" variant="outline">
                                  Jugar
                                </Button>
                              )}
                            </div>
                          </div>
                          {level.progress > 0 && (
                            <div className="mt-2">
                              <Progress value={level.progress} className="h-2" />
                              <p className="text-xs text-gray-500 mt-1">{level.progress}% completado</p>
                            </div>
                          )}
                          {level.requirements && (
                            <p className="text-xs text-amber-600 mt-1">
                              <span className="font-medium">Requisito:</span> {level.requirements}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">6</div>
              <div className="text-sm text-blue-700">Juegos Disponibles</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">18</div>
              <div className="text-sm text-green-700">Niveles Totales</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900">30+</div>
              <div className="text-sm text-purple-700">Verbos con Audio</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}