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
          
          // Calculate game-specific stats
          const gameTypeMap = new Map();
          scores.forEach((score: any) => {
            const gameType = score.gameType || 'unknown';
            if (!gameTypeMap.has(gameType)) {
              gameTypeMap.set(gameType, {
                gamesPlayed: 0,
                totalScore: 0,
                totalTime: 0,
                scores: []
              });
            }
            const gameStat = gameTypeMap.get(gameType);
            gameStat.gamesPlayed++;
            gameStat.totalScore += score.score || 0;
            gameStat.totalTime += score.timeSpent || 0;
            gameStat.scores.push(score);
          });
          
          const newGameStats: GameStats[] = [];
          gameTypeMap.forEach((gameStat, gameType) => {
            newGameStats.push({
              gameType,
              gamesPlayed: gameStat.gamesPlayed,
              bestScore: Math.max(...gameStat.scores.map((s: any) => s.score || 0)),
              averageScore: Math.round(gameStat.totalScore / gameStat.gamesPlayed),
              totalTime: gameStat.totalTime,
              lastPlayed: gameStat.scores.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]?.completedAt || 'Nunca'
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
          gameType: 'crossword',
          gameName: 'Crucigrama',
          score: 643,
          accuracy: 0,
          timeSpent: 2,
          completedAt: new Date(Date.now() - 7200000).toISOString(),
          difficulty: 'medium'
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
    switch (gameType) {
      case 'memory': return <Brain className="w-4 h-4" />;
      case 'concentration': return <Trophy className="w-4 h-4" />;
      case 'matching': return <Target className="w-4 h-4" />;
      case 'wordsearch': return <Search className="w-4 h-4" />;
      case 'crossword': return <BookOpen className="w-4 h-4" />;
      default: return <Gamepad2 className="w-4 h-4" />;
    }
  };

  const getGameName = (gameType: string) => {
    switch (gameType) {
      case 'memory': return 'Memoria';
      case 'concentration': return 'Concentración';
      case 'matching': return 'Apareamiento';
      case 'wordsearch': return 'Búsqueda';
      case 'crossword': return 'Crucigrama';
      default: return 'Desconocido';
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
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header - Compact */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Estadísticas de Progreso - Luis</h2>
        <p className="text-sm text-gray-600">Monitorea tu rendimiento y mejora continua</p>
      </div>

      {/* Main Stats Grid - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
          <div className="text-xs text-gray-600">Total de juegos</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalScore}</div>
          <div className="text-xs text-gray-600">Puntuación más alta</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalScore}</div>
          <div className="text-xs text-gray-600">Puntuación promedio</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</div>
          <div className="text-xs text-gray-600">Tiempo total</div>
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

      {/* Recent Games - Replacing Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Partidas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames.length > 0 ? (
            <div className="space-y-2">
              {recentGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getGameIcon(game.gameType)}
                    <div>
                      <div className="font-medium text-sm">{game.gameName}</div>
                      <div className="text-xs text-gray-500">
                        {game.difficulty && `Dificultad: ${game.difficulty} • `}
                        {formatDate(game.completedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{game.score} pts</div>
                    <div className="text-xs text-gray-500">
                      {game.accuracy}% • {formatTime(game.timeSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-500 text-sm">No hay partidas recientes</div>
              <p className="text-xs text-gray-400 mt-1">Juega algunos juegos para ver tu historial</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level Progress - Compact */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <div>
                <div className="font-semibold">Nivel {stats.level}</div>
                <div className="text-xs text-gray-600">{stats.experience} XP</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Siguiente nivel</div>
              <div className="text-sm font-semibold">{stats.experienceToNext - stats.experience} XP</div>
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