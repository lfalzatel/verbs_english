'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  Award,
  Calendar,
  Gamepad2,
  Brain,
  BookOpen,
  Search,
  RotateCcw
} from 'lucide-react';

interface GameStats {
  gameType: string;
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  totalTime: number;
  lastPlayed: string;
}

interface OverallStats {
  totalGames: number;
  totalScore: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  currentStreak: number;
  bestStreak: number;
  favoriteGame: string;
  achievementsUnlocked: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

export default function ProgressStats() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Simulate loading stats from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockStats: OverallStats = {
        totalGames: 0,
        totalScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        bestStreak: 0,
        favoriteGame: 'memory',
        achievementsUnlocked: 0,
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
          gamesPlayed: 0,
          bestScore: 0,
          averageScore: 0,
          totalTime: 0,
          lastPlayed: 'Nunca'
        }
      ];

      setStats(mockStats);
      setGameStats(mockGameStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'memory': return <Brain className="w-5 h-5" />;
      case 'concentration': return <Trophy className="w-5 h-5" />;
      case 'matching': return <Target className="w-5 h-5" />;
      case 'wordsearch': return <Search className="w-5 h-5" />;
      case 'crossword': return <BookOpen className="w-5 h-5" />;
      default: return <Gamepad2 className="w-5 h-5" />;
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'Nunca') return dateString;
    const date = new Date(dateString);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas de Progreso</h2>
        <p className="text-gray-600">Monitorea tu rendimiento y mejora continua</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border p-1">
          {(['week', 'month', 'all'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Todo'}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Gamepad2 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
            <div className="text-sm text-gray-600">Juegos Jugados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalScore}</div>
            <div className="text-sm text-gray-600">Puntuación Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.averageAccuracy}%</div>
            <div className="text-sm text-gray-600">Precisión Promedio</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</div>
            <div className="text-sm text-gray-600">Tiempo Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Progreso de Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Nivel {stats.level}</div>
                <div className="text-sm text-gray-600">{stats.experience} / {stats.experienceToNext} XP</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Siguiente nivel</div>
                <div className="text-lg font-semibold">{stats.experienceToNext - stats.experience} XP</div>
              </div>
            </div>
            <Progress value={(stats.experience / stats.experienceToNext) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Game-specific Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Estadísticas por Juego
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gameStats.map((game) => (
              <div key={game.gameType} className="border rounded-lg p-4">
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

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Logros Desbloqueados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏆</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{stats.achievementsUnlocked}</div>
            <div className="text-gray-600 mb-4">Logros desbloqueados</div>
            <p className="text-sm text-gray-500">Sigue jugando para desbloquear más logros</p>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={loadStats} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Actualizar Estadísticas
        </Button>
      </div>
    </div>
  );
}