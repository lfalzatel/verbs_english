'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Player {
  name: string;
  level: number;
  experience: number;
  totalGames: number;
  totalScore: number;
  bestScore: number;
  achievements: string[];
  createdAt: string;
  lastLoginAt: string;
}

interface PlayerContextType {
  player: Player | null;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
  updateStats: (stats: Partial<Player>) => void;
  addAchievement: (achievementId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del jugador desde localStorage al iniciar
    const loadPlayer = () => {
      try {
        const savedPlayer = localStorage.getItem('player');
        if (savedPlayer) {
          const parsedPlayer = JSON.parse(savedPlayer);
          setPlayer(parsedPlayer);
          
          // Actualizar último login
          const updatedPlayer = {
            ...parsedPlayer,
            lastLoginAt: new Date().toISOString()
          };
          setPlayer(updatedPlayer);
          localStorage.setItem('player', JSON.stringify(updatedPlayer));
        }
      } catch (error) {
        console.error('Error loading player data:', error);
        localStorage.removeItem('player');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayer();
  }, []);

  const login = (name: string) => {
    const newPlayer: Player = {
      name: name.trim(),
      level: 1,
      experience: 0,
      totalGames: 0,
      totalScore: 0,
      bestScore: 0,
      achievements: [],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    setPlayer(newPlayer);
    localStorage.setItem('player', JSON.stringify(newPlayer));
  };

  const logout = () => {
    setPlayer(null);
    localStorage.removeItem('player');
  };

  const updateStats = (stats: Partial<Player>) => {
    if (!player) return;

    const updatedPlayer = {
      ...player,
      ...stats,
      lastLoginAt: new Date().toISOString()
    };

    setPlayer(updatedPlayer);
    localStorage.setItem('player', JSON.stringify(updatedPlayer));
  };

  const addAchievement = (achievementId: string) => {
    if (!player) return;

    if (player.achievements.includes(achievementId)) return;

    const updatedPlayer = {
      ...player,
      achievements: [...player.achievements, achievementId],
      experience: player.experience + 50, // Bonus de experiencia por logro
      lastLoginAt: new Date().toISOString()
    };

    setPlayer(updatedPlayer);
    localStorage.setItem('player', JSON.stringify(updatedPlayer));
  };

  const value: PlayerContextType = {
    player,
    isLoggedIn: !!player,
    login,
    logout,
    updateStats,
    addAchievement
  };

  // Mostrar loading mientras se carga el jugador
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}