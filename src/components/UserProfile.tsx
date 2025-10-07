'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Trophy, 
  Star, 
  Target, 
  Clock, 
  TrendingUp, 
  LogOut,
  Settings,
  Award,
  Zap,
  Flame
} from 'lucide-react';

interface UserProfileProps {
  playerName: string;
  onLogout: () => void;
  onSettings?: () => void;
}

interface PlayerStats {
  level: number;
  experience: number;
  totalGames: number;
  totalScore: number;
  bestScore: number;
  averageScore: number;
  totalTime: number;
  streak: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function UserProfile({ playerName, onLogout, onSettings }: UserProfileProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerStats();
  }, [playerName]);

  const loadPlayerStats = async () => {
    try {
      setLoading(true);
      
      // Simular carga de estadísticas del jugador
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la llamada real a la API
      const mockStats: PlayerStats = {
        level: 5,
        experience: 750,
        totalGames: 23,
        totalScore: 1850,
        bestScore: 95,
        averageScore: 80,
        totalTime: 1450, // segundos
        streak: 3,
        achievements: [
          {
            id: 'first_game',
            name: 'Primer Paso',
            description: 'Completa tu primer juego',
            icon: <Star className="w-4 h-4" />,
            unlocked: true,
            unlockedAt: new Date().toISOString()
          },
          {
            id: 'memory_master',
            name: 'Maestro de la Memoria',
            description: 'Obtén 90+ en Memoria',
            icon: <Trophy className="w-4 h-4" />,
            unlocked: true
          },
          {
            id: 'concentration_expert',
            name: 'Experto en Concentración',
            description: 'Completa 5 juegos de concentración',
            icon: <Target className="w-4 h-4" />,
            unlocked: false
          },
          {
            id: 'streak_warrior',
            name: 'Guerrero de Rachas',
            description: 'Mantén una racha de 7 días',
            icon: <Flame className="w-4 h-4" />,
            unlocked: false
          }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getLevelProgress = () => {
    if (!stats) return 0;
    const expForNextLevel = stats.level * 200;
    return (stats.experience / expForNextLevel) * 100;
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'bg-purple-500';
    if (level >= 7) return 'bg-red-500';
    if (level >= 5) return 'bg-orange-500';
    if (level >= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando perfil...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Perfil Principal */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${getLevelColor(stats.level)} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                {playerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{playerName}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-sm">
                    Nivel {stats.level}
                  </Badge>
                  {stats.streak > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      <Flame className="w-3 h-3 mr-1" />
                      {stats.streak} días
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {onSettings && (
                <Button variant="outline" size="sm" onClick={onSettings}>
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Barra de Experiencia */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Experiencia</span>
              <span className="text-sm text-gray-600">
                {stats.experience} / {stats.level * 200} XP
              </span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-900">{stats.totalGames}</p>
              <p className="text-xs text-blue-700">Juegos</p>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-900">{stats.bestScore}</p>
              <p className="text-xs text-green-700">Mejor Puntaje</p>
            </div>
            
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-900">{stats.averageScore}</p>
              <p className="text-xs text-yellow-700">Promedio</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-purple-900">{formatTime(stats.totalTime)}</p>
              <p className="text-xs text-purple-700">Tiempo Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logros */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Logros Desbloqueados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {stats.achievements.filter(a => a.unlocked).length === 0 && (
            <div className="text-center py-8">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                ¡Comienza a jugar para desbloquear tus primeros logros!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}