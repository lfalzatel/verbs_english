'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  LogOut, 
  Settings,
  TrendingUp,
  Award
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserProfile() {
  const { user, logout } = useAuth()
  const [showSettings, setShowSettings] = useState(false)

  if (!user) return null

  const getLevelProgress = () => {
    const currentLevel = user.level
    const currentLevelXP = (currentLevel - 1) * 100
    const nextLevelXP = currentLevel * 100
    const progress = ((user.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const getXPToNextLevel = () => {
    const nextLevelXP = user.level * 100
    return Math.max(0, nextLevelXP - user.experience)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            Perfil de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar || ''} />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                {user.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{user.displayName}</h3>
              <p className="text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">
                  Nivel {user.level}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {user.experience} XP
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso al Nivel {user.level + 1}</span>
              <span className="text-sm text-gray-600">{getXPToNextLevel()} XP restantes</span>
            </div>
            <Progress value={getLevelProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.totalGames || 0}</p>
            <p className="text-sm text-gray-600">Juegos Totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.bestScores ? Math.max(...Object.values(user.bestScores as Record<string, number>)) : 0}</p>
            <p className="text-sm text-gray-600">Mejor Puntuación</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.level}</p>
            <p className="text-sm text-gray-600">Nivel Actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Logros</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Estadísticas Detalladas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Rendimiento por Juego</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Juego de Memoria</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Juego de Concentración</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Información de Cuenta</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Miembro desde:</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experiencia total:</span>
                  <span className="font-medium">{user.experience} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasa de éxito:</span>
                  <span className="font-medium">68%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-600" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preferencias de Juego</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Efectos de sonido</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Notificaciones de logros</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Modo oscuro</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dificultad Preferida</h4>
                <select className="w-full p-2 border rounded-md">
                  <option value="all">Todas</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Media</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}