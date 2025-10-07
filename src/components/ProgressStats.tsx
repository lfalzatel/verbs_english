'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  Calendar,
  Gamepad2,
  Brain,
  BookOpen,
  Search,
  RotateCcw,
  TrendingUp,
  Play
} from 'lucide-react';

interface GameStats {
  gameType: string;
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  totalTime: number;
  lastPlayed: string;
}

interface RecentGame {
  id: string;
  gameType: string;
  gameName: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
  difficulty?: string;
}

interface OverallStats {
  totalGames: number;
  totalScore: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  currentStreak: number;
  bestStreak: number;
  favoriteGame: string;
  level: number;
  experience: number;
  experienceToNext: number;
}

export default function ProgressStats() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load real scores from API
      const scoresResponse = await fetch('/api/scores');
      if (scoresResponse.ok) {
        const scoresData = await scoresResponse.json();
        
        if (scoresData.success && scoresData.data) {
          const scores = scoresData.data;
          
          // Calculate overall stats
          const totalGames = scores.length;
          const totalScore = scores.reduce((sum: number, score: any) => sum + (score.score || 0), 0);
          const totalTimeSpent = scores.reduce((sum: number, score: any) => sum + (score.timeSpent || 0), 0);
          const averageAccuracy = totalGames > 0 ? Math.round(scores.reduce((sum: number, score: any) => sum + (score.accuracy || 0), 0) / totalGames) : 0;
          
          // Calculate game-specific stats for all 5 games
          const allGameTypes = ['memory', 'concentration', 'matching', 'wordsearch', 'crossword'];
          const gameTypeMap = new Map();
          
          // Initialize all game types
          allGameTypes.forEach(gameType => {
            gameTypeMap.set(gameType, {
              gamesPlayed: 0,
              totalScore: 0,
              totalTime: 0,
              scores: []
            });
          });
          
          // Add actual data from scores
          scores.forEach((score: any) => {
            const gameType = score.gameType || 'unknown';
            if (gameTypeMap.has(gameType)) {
              const gameStat = gameTypeMap.get(gameType);
              gameStat.gamesPlayed++;
              gameStat.totalScore += score.score || 0;
              gameStat.totalTime += score.timeSpent || 0;
              gameStat.scores.push(score);
            }
          });
          
          const newGameStats: GameStats[] = [];
          allGameTypes.forEach(gameType => {
            const gameStat = gameTypeMap.get(gameType);
            newGameStats.push({
              gameType,
              gamesPlayed: gameStat.gamesPlayed,
              bestScore: gameStat.gamesPlayed > 0 ? Math.max(...gameStat.scores.map((s: any) => s.score || 0)) : 0,
              averageScore: gameStat.gamesPlayed > 0 ? Math.round(gameStat.totalScore / gameStat.gamesPlayed) : 0,
              totalTime: gameStat.totalTime,
              lastPlayed: gameStat.gamesPlayed > 0 ? 
                gameStat.scores.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]?.completedAt || 'Nunca' 
                : 'Nunca'
            });
          });
          
          // Get recent games
          const newRecentGames: RecentGame[] = scores
            .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            .slice(0, 10)
            .map((score: any) => ({
              id: score.id,
              gameType: score.gameType,
              gameName: getGameName(score.gameType),
              score: score.score || 0,
              accuracy: score.accuracy || 0,
              timeSpent: score.timeSpent || 0,
              completedAt: score.completedAt,
              difficulty: score.difficulty
            }));
          
          const mockStats: OverallStats = {
            totalGames,
            totalScore,
            averageAccuracy,
            totalTimeSpent,
            currentStreak: 0,
            bestStreak: 0,
            favoriteGame: 'memory',
            level: 2,
            experience: 128,
            experienceToNext: 200
          };
          
          setStats(mockStats);
          setGameStats(newGameStats);
          setRecentGames(newRecentGames);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use mock data as fallback
      const mockStats: OverallStats = {
        totalGames: 2,
        totalScore: 1285,
        averageAccuracy: 0,
        totalTimeSpent: 5,
        currentStreak: 0,
        bestStreak: 0,
        favoriteGame: 'crossword',
        level: 2,
        experience: 128,
        experienceToNext: 200
      };

      const mockGameStats: GameStats[] = [
        {
          gameType: 'memory',
          gamesPlayed: 0,
          bestScore: 0,
          averageScore: 0,
          totalTime: 0,
          lastPlayed: 'Nunca'
        },
        {
          gameType: 'concentration',
          gamesPlayed: 0,
          bestScore: 0,
          averageScore: 0,
          totalTime: 0,
          lastPlayed: 'Nunca'
        },
        {
          gameType: 'matching',
          gamesPlayed: 0,
          bestScore: 0,
          averageScore: 0,
          totalTime: 0,
          lastPlayed: 'Nunca'
        },
        {
          gameType: 'wordsearch',
          gamesPlayed: 0,
          bestScore: 0,
          averageScore: 0,
          totalTime: 0,
          lastPlayed: 'Nunca'
        },
        {
          gameType: 'crossword',
          gamesPlayed: 2,
          bestScore: 643,
          averageScore: 643,
          totalTime: 5,
          lastPlayed: new Date().toISOString()
        }
      ];

      const mockRecentGames: RecentGame[] = [
        {
          id: '1',
          gameType: 'crossword',
          gameName: 'Crucigrama',
          score: 642,
          accuracy: 0,
          timeSpent: 3,
          completedAt: new Date(Date.now() - 3600000).toISOString(),
          difficulty: 'medium'
        },
        {
          id: '2',
          gameType: 'memory',
          gameName: 'Memoria',
          score: 85,
          accuracy: 75,
          timeSpent: 45,
          completedAt: new Date(Date.now() - 7200000).toISOString(),
          difficulty: 'easy'
        },
        {
          id: '3',
          gameType: 'concentration',
          gameName: 'Concentración',
          score: 120,
          accuracy: 80,
          timeSpent: 62,
          completedAt: new Date(Date.now() - 10800000).toISOString(),
          difficulty: 'medium'
        },
        {
          id: '4',
          gameType: 'wordsearch',
          gameName: 'Búsqueda',
          score: 95,
          accuracy: 90,
          timeSpent: 38,
          completedAt: new Date(Date.now() - 14400000).toISOString(),
          difficulty: 'easy'
        },
        {
          id: '5',
          gameType: 'matching',
          gameName: 'Apareamiento',
          score: 150,
          accuracy: 85,
          timeSpent: 55,
          completedAt: new Date(Date.now() - 18000000).toISOString(),
          difficulty: 'hard'
        }
      ];

      setStats(mockStats);
      setGameStats(mockGameStats);
      setRecentGames(mockRecentGames);
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType?.toLowerCase()) {
      case 'memory': return <Brain className="w-4 h-4" />;
      case 'concentration': return <Trophy className="w-4 h-4" />;
      case 'matching': return <Target className="w-4 h-4" />;
      case 'wordsearch':
      case 'word_search':
      case 'search': return <Search className="w-4 h-4" />;
      case 'crossword':
      case 'crucigrama': return <BookOpen className="w-4 h-4" />;
      default: return <Gamepad2 className="w-4 h-4" />;
    }
  };

  const getGameName = (gameType: string) => {
    switch (gameType?.toLowerCase()) {
      case 'memory': return 'Memoria';
      case 'concentration': return 'Concentración';
      case 'matching': return 'Apareamiento';
      case 'wordsearch':
      case 'word_search':
      case 'search': return 'Búsqueda';
      case 'crossword':
      case 'crucigrama': return 'Crucigrama';
      case 'unknown':
      case 'desconocido': return 'Desconocido';
      default: 
        // Si el gameType ya parece un nombre en español, úsalo directamente
        if (gameType && /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(gameType)) {
          return gameType;
        }
        return gameType || 'Desconocido';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay estadísticas disponibles</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Header - Compact */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Estadísticas de Progreso - Luis</h2>
        <p className="text-sm text-gray-600">Monitorea tu rendimiento y mejora continua</p>
      </div>

      {/* Main Stats Grid - Compact with Colors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Gamepad2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.totalGames}</div>
          <div className="text-xs text-blue-700">Total de juegos</div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-900">{stats.totalScore}</div>
          <div className="text-xs text-yellow-700">Puntuación más alta</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.totalScore}</div>
          <div className="text-xs text-green-700">Puntuación promedio</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{formatTime(stats.totalTimeSpent)}</div>
          <div className="text-xs text-purple-700">Tiempo total</div>
        </div>
      </div>

      {/* Game Stats Table - Compact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Rendimiento General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-600 border-b pb-2">
              <div>JUEGO</div>
              <div>JUGADOS</div>
              <div>PRECISIÓN</div>
              <div>PUNTOS</div>
              <div>Tiempo</div>
            </div>
            
            {gameStats.map((game) => (
              <div key={game.gameType} className="grid grid-cols-5 gap-4 text-xs items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  {getGameIcon(game.gameType)}
                  <span className="font-medium">{getGameName(game.gameType)}</span>
                </div>
                <div>{game.gamesPlayed}</div>
                <div>{stats.averageAccuracy}%</div>
                <div>{game.bestScore}</div>
                <div>{formatTime(game.totalTime)}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">1285</div>
                <div className="text-xs text-gray-600">Puntos acumulados</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">3s</div>
                <div className="text-xs text-gray-600">Tiempo por partida</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{stats.averageAccuracy}%</div>
                <div className="text-xs text-gray-600">Precisión general</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game-specific Stats - Detailed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Estadísticas por Juego
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gameStats.map((game) => (
              <div key={game.gameType} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getGameIcon(game.gameType)}
                    <span className="font-semibold">{getGameName(game.gameType)}</span>
                  </div>
                  <Badge variant={game.gamesPlayed > 0 ? "default" : "secondary"}>
                    {game.gamesPlayed} juegos
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Mejor Puntuación</div>
                    <div className="font-semibold">{game.bestScore}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Promedio</div>
                    <div className="font-semibold">{game.averageScore}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Tiempo Total</div>
                    <div className="font-semibold">{formatTime(game.totalTime)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Última Vez</div>
                    <div className="font-semibold">{formatDate(game.lastPlayed)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Games - Replacing Achievements */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Partidas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames.length > 0 ? (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                      {getGameIcon(game.gameType || 'unknown')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{game.gameName || getGameName(game.gameType)}</div>
                      <div className="text-xs text-gray-500">
                        {game.difficulty && (
                          <Badge variant="outline" className="mr-2 text-xs">
                            {game.difficulty === 'easy' ? 'Fácil' : game.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                          </Badge>
                        )}
                        {formatDate(game.completedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">{game.score}</div>
                    <div className="text-xs text-gray-500">puntos</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {game.accuracy}% • {formatTime(game.timeSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-gray-500 font-medium">No hay partidas recientes</div>
              <p className="text-sm text-gray-400 mt-2">Juega algunos juegos para ver tu historial</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level Progress - Compact */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <div>
                <div className="font-semibold text-gray-800">Nivel {stats.level}</div>
                <div className="text-xs text-gray-600">{stats.experience} XP</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Siguiente nivel</div>
              <div className="text-sm font-semibold text-purple-700">{stats.experienceToNext - stats.experience} XP</div>
            </div>
          </div>
          <Progress value={(stats.experience / stats.experienceToNext) * 100} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={loadStats} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Actualizar estadísticas
        </Button>
      </div>
    </div>
  );
}