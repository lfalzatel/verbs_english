'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Trophy, 
  Target, 
  Search as SearchIcon,
  BookOpen,
  Grid3x3,
  BarChart3,
  User,
  Star,
  Zap,
  Clock,
  Award,
  Gamepad2,
  Sparkles,
  Volume2
} from 'lucide-react';

interface GameCard {
  id: string;
  title: string;
  description: string;
  variants: number;
  icon: React.ReactNode;
  features: string[];
  color: string;
  stats?: {
    gamesPlayed: number;
    bestScore: number;
  };
}

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
}

export default function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const [userName, setUserName] = useState('Luis');
  const [userLevel, setUserLevel] = useState(2);
  const [userXP, setUserXP] = useState(128);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [xpToNext, setXpToNext] = useState(200);

  const games: GameCard[] = [
    {
      id: 'memory',
      title: 'Juego de Memoria',
      description: 'Encuentra parejas de verbos con temas: animales, comida, viajes, naturaleza y más',
      variants: 12,
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      features: ['Básico', 'Animales', 'Velocidad', '+9 más'],
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      stats: { gamesPlayed: 0, bestScore: 0 }
    },
    {
      id: 'concentration',
      title: 'Juego de Concentración',
      description: 'Responde preguntas sobre verbos: pasado, participio, traducción y más',
      variants: 15,
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      features: ['Pasado', 'Traducción', 'Velocidad', '+12 más'],
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      stats: { gamesPlayed: 0, bestScore: 0 }
    },
    {
      id: 'matching',
      title: 'Juego de Apareamiento',
      description: 'Conecta verbos con sus traducciones, formas de pasado y más',
      variants: 15,
      icon: <Target className="w-8 h-8 text-blue-600" />,
      features: ['Básico', 'Multilingüe', 'Inverso', '+12 más'],
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      stats: { gamesPlayed: 0, bestScore: 0 }
    },
    {
      id: 'wordsearch',
      title: 'Búsqueda de Palabras',
      description: 'Encuentra verbos escondidos en cuadrículas de diferentes tamaños',
      variants: 15,
      icon: <SearchIcon className="w-8 h-8 text-green-600" />,
      features: ['Básico', 'Animales', 'Mega', '+12 más'],
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      stats: { gamesPlayed: 0, bestScore: 0 }
    },
    {
      id: 'crossword',
      title: 'Crucigramas',
      description: 'Resuelve crucigramas con pistas sobre verbos en inglés',
      variants: 15,
      icon: <Grid3x3 className="w-8 h-8 text-red-600" />,
      features: ['Básico', 'Pasado', 'Velocidad', '+12 más'],
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      stats: { gamesPlayed: 0, bestScore: 0 }
    },
    {
      id: 'verbs',
      title: 'Lista de Verbos',
      description: 'Explora y estudia la lista completa de verbos con traducciones',
      variants: 98,
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      features: ['Regulares', 'Irregulares', '5 idiomas'],
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    },
    {
      id: 'stats',
      title: 'Estadísticas',
      description: 'Revisa tu progreso, mejores puntuaciones y estadísticas',
      variants: 0,
      icon: <BarChart3 className="w-8 h-8 text-gray-600" />,
      features: ['Gráficos', 'Historial', 'Rendimiento'],
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      description: 'Gestiona tu perfil y mira tus logros desbloqueados',
      variants: 0,
      icon: <User className="w-8 h-8 text-pink-600" />,
      features: ['Nivel 2', '128 XP', '0 juegos'],
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    }
  ];

  const handleGameClick = (gameId: string) => {
    // Map game IDs to tab names
    const tabMapping: { [key: string]: string } = {
      'memory': 'memory',
      'concentration': 'concentration', 
      'matching': 'matching',
      'wordsearch': 'wordsearch',
      'crossword': 'crossword',
      'verbs': 'verbs',
      'stats': 'progress',
      'profile': 'home' // Navigate to home for profile
    };
    
    const targetTab = tabMapping[gameId] || 'home';
    console.log(`Game clicked: ${gameId}, navigating to tab: ${targetTab}`);
    onNavigate(targetTab);
  };

  const speakGreeting = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`¡Hola, ${userName}!`);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center pt-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800 mx-3">Verbos English</h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600">¡Aprende verbos en inglés con 70+ juegos divertidos!</p>
        </header>

        {/* User Welcome Card */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-800">¡Hola, {userName}!</h2>
                    <Button variant="ghost" size="sm" onClick={speakGreeting}>
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-semibold">Nivel {userLevel}</span>
                    <span>•</span>
                    <span>{userXP} XP</span>
                    <span>•</span>
                    <span>{gamesPlayed} juegos</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">{xpToNext - userXP} XP para el siguiente nivel</div>
                <div className="w-48">
                  <Progress value={(userXP / xpToNext) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${game.color}`}
              onClick={() => handleGameClick(game.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {game.icon}
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                  </div>
                  {game.stats && (
                    <Badge variant="secondary" className="text-xs">
                      {game.stats.gamesPlayed} juegos
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {game.variants > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {game.variants} {game.variants === 98 ? 'verbos disponibles' : 'variantes diferentes'}
                      </span>
                      {game.stats && game.stats.bestScore > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Trophy className="w-3 h-3" />
                          <span>{game.stats.bestScore}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {game.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs px-2 py-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-xl">Características de Verbos English</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">75+</div>
                <div className="text-sm text-gray-600">Variantes de Juegos</div>
                <div className="text-xs text-gray-500">Memoria, concentración, apareamiento, búsqueda y crucigramas</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98</div>
                <div className="text-sm text-gray-600">Verbos en 5 Idiomas</div>
                <div className="text-xs text-gray-500">Inglés, español, francés, alemán, italiano y portugués</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                <div className="text-sm text-gray-600">Sistema de Niveles</div>
                <div className="text-xs text-gray-500">Gana experiencia y sube de nivel mientras juegas</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">📊</div>
                <div className="text-sm text-gray-600">Estadísticas Detalladas</div>
                <div className="text-xs text-gray-500">Monitorea tu progreso y mejora continua</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}