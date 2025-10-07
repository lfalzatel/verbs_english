'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Player {
  name: string;
  level: number;
  xp: number;
  gamesPlayed: number;
}

interface PlayerContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  updateXP: (amount: number) => void;
  incrementGamesPlayed: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayerState] = useState<Player | null>(null);

  // Load player from localStorage on mount
  useEffect(() => {
    const savedPlayer = localStorage.getItem('verbosPlayer');
    if (savedPlayer) {
      try {
        setPlayerState(JSON.parse(savedPlayer));
      } catch (error) {
        console.error('Error loading player data:', error);
        localStorage.removeItem('verbosPlayer');
      }
    }
  }, []);

  const setPlayer = (newPlayer: Player | null) => {
    setPlayerState(newPlayer);
    if (newPlayer) {
      localStorage.setItem('verbosPlayer', JSON.stringify(newPlayer));
    } else {
      localStorage.removeItem('verbosPlayer');
    }
  };

  const updateXP = (amount: number) => {
    if (!player) return;
    
    const newXP = player.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level
    
    const updatedPlayer = {
      ...player,
      xp: newXP,
      level: newLevel
    };
    
    setPlayer(updatedPlayer);
  };

  const incrementGamesPlayed = () => {
    if (!player) return;
    
    const updatedPlayer = {
      ...player,
      gamesPlayed: player.gamesPlayed + 1
    };
    
    setPlayer(updatedPlayer);
  };

  return (
    <PlayerContext.Provider value={{
      player,
      setPlayer,
      updateXP,
      incrementGamesPlayed
    }}>
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