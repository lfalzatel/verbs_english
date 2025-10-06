'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePlayer } from '@/contexts/PlayerContext'
import { User, LogIn, Sparkles } from 'lucide-react'

export default function PlayerNameForm() {
  const [playerName, setPlayerName] = useState('')
  const { setPlayerName: setPlayer, player, logout } = usePlayer()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      setPlayer(playerName.trim())
    }
  }

  const handleLogout = () => {
    logout()
    setPlayerName('')
  }

  if (player) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <img 
                src={player.avatar} 
                alt={player.name}
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
              <Badge className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs">
                Nivel {player.level}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg">¡Hola, {player.name}!</CardTitle>
          <CardDescription>
            Experiencia: {player.experience} XP | Juegos: {player.totalGames}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                Progreso al siguiente nivel: {player.experience % 100}/100 XP
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(player.experience % 100)}%` }}
            />
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Cambiar de jugador
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <User className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-xl">¡Bienvenido!</CardTitle>
        <CardDescription>
          Ingresa tu nombre para comenzar a aprender verbos en inglés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tu nombre
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: María, Carlos, Ana..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              minLength={2}
              maxLength={20}
              className="text-center"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!playerName.trim()}>
            <LogIn className="w-4 h-4 mr-2" />
            Comenzar a jugar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}