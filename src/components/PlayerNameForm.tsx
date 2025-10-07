'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Sparkles, Trophy } from 'lucide-react';

interface PlayerNameFormProps {
  onSubmit: (name: string) => void;
  initialName?: string;
}

export default function PlayerNameForm({ onSubmit, initialName = '' }: PlayerNameFormProps) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular guardado del nombre
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Guardar en localStorage
      localStorage.setItem('playerName', playerName.trim());
      
      onSubmit(playerName.trim());
    } catch (error) {
      console.error('Error saving player name:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo letras, números y espacios, máximo 20 caracteres
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 20);
    setPlayerName(sanitizedValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              ¡Bienvenido a Verbos English!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tu nombre para comenzar a aprender verbos en inglés
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="playerName" className="text-sm font-medium text-gray-700">
                  Tu Nombre
                </label>
                <Input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={handleInputChange}
                  placeholder="Ej: María, Carlos, Ana..."
                  className="text-center text-lg py-3 border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  maxLength={20}
                  autoFocus
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 text-center">
                  {playerName.length}/20 caracteres
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  Puntajes guardados
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Progreso personal
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Perfil único
                </Badge>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-200 transform hover:scale-105"
                disabled={!playerName.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Preparando tu aventura...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Comenzar a Jugar
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">¿Qué encontrarás?</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 rounded p-2">
                    🧠 5 juegos educativos
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    🎯 3 niveles de dificultad
                  </div>
                  <div className="bg-yellow-50 rounded p-2">
                    📊 Sistema de progreso
                  </div>
                  <div className="bg-purple-50 rounded p-2">
                    🏆 Rankings y logros
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}