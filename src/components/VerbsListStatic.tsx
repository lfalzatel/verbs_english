'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Volume2, BookOpen } from 'lucide-react'
import { getAllVerbs } from '@/data/verbs'

interface Verb {
  id: number
  infinitive: string
  past: string
  participle: string
  meaning_es: string
  meaning_fr: string
  meaning_de: string
  meaning_it: string
  meaning_pt: string
}

export default function VerbsListStatic() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [filteredVerbs, setFilteredVerbs] = useState<Verb[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es')

  useEffect(() => {
    const allVerbs = getAllVerbs()
    setVerbs(allVerbs)
    setFilteredVerbs(allVerbs)
  }, [])

  useEffect(() => {
    let filtered = verbs

    if (searchTerm) {
      filtered = filtered.filter(verb =>
        verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.past.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.participle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb[`meaning_${selectedLanguage}` as keyof Verb].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredVerbs(filtered)
  }, [verbs, searchTerm, selectedLanguage])

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const getTranslation = (verb: Verb) => {
    return verb[`meaning_${selectedLanguage}` as keyof Verb] as string
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Lista de Verbos en Inglés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar verbos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredVerbs.length} verbos encontrados</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredVerbs.map((verb) => (
          <Card key={verb.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    Verbo #{verb.id}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(verb.infinitive)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Infinitivo</h4>
                  <p className="text-lg font-medium text-blue-600">{verb.infinitive}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pasado</h4>
                  <p className="text-lg font-medium text-green-600">{verb.past}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Participio</h4>
                  <p className="text-lg font-medium text-purple-600">{verb.participle}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Traducción</h4>
                  <p className="text-lg font-medium text-gray-700">{getTranslation(verb)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVerbs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No se encontraron verbos que coincidan con tu búsqueda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}