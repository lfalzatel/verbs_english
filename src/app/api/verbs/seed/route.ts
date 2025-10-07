import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const verbsData = [
  { infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'have', past: 'had', participle: 'had', translation: 'tener/haber', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'sleep', past: 'slept', participle: 'slept', translation: 'dormir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'work', past: 'worked', participle: 'worked', translation: 'trabajar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'swim', past: 'swam', participle: 'swum', translation: 'nadar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'begin', past: 'began', participle: 'begun', translation: 'empezar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'choose', past: 'chose', participle: 'chosen', translation: 'elegir', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'forget', past: 'forgot', participle: 'forgotten', translation: 'olvidar', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'understand', past: 'understood', participle: 'understood', translation: 'entender', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'teach', past: 'taught', participle: 'taught', translation: 'enseñar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'think', past: 'thought', participle: 'thought', translation: 'pensar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'catch', past: 'caught', participle: 'caught', translation: 'atrapar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'find', past: 'found', participle: 'found', translation: 'encontrar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'get', past: 'got', participle: 'gotten', translation: 'conseguir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber/conocer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'make', past: 'made', participle: 'made', translation: 'hacer/fabricar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'put', past: 'put', participle: 'put', translation: 'poner', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'see', past: 'saw', participle: 'seen', translation: 'ver', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'take', past: 'took', participle: 'taken', translation: 'tomar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'tell', past: 'told', participle: 'told', translation: 'contar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'come', past: 'came', participle: 'come', translation: 'venir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'become', past: 'became', participle: 'become', translation: 'llegar a ser', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'leave', past: 'left', participle: 'left', translation: 'dejar/salir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'feel', past: 'felt', participle: 'felt', translation: 'sentir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'hear', past: 'heard', participle: 'heard', translation: 'oír', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'keep', past: 'kept', participle: 'kept', translation: 'mantener', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'lose', past: 'lost', participle: 'lost', translation: 'perder', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'mean', past: 'meant', participle: 'meant', translation: 'significar', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'meet', past: 'met', participle: 'met', translation: 'conocer/encontrar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'pay', past: 'paid', participle: 'paid', translation: 'pagar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'sit', past: 'sat', participle: 'sat', translation: 'sentarse', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'speak', past: 'spoke', participle: 'spoken', translation: 'hablar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'spend', past: 'spent', participle: 'spent', translation: 'gastar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'stand', past: 'stood', participle: 'stood', translation: 'estar de pie', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'win', past: 'won', participle: 'won', translation: 'ganar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'stop', past: 'stopped', participle: 'stopped', translation: 'parar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'talk', past: 'talked', participle: 'talked', translation: 'hablar/conversar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'walk', past: 'walked', participle: 'walked', translation: 'caminar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'ask', past: 'asked', participle: 'asked', translation: 'preguntar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'answer', past: 'answered', participle: 'answered', translation: 'responder', category: 'regular', difficulty: 'easy' },
  { infinitive: 'open', past: 'opened', participle: 'opened', translation: 'abrir', category: 'regular', difficulty: 'easy' },
  { infinitive: 'close', past: 'closed', participle: 'closed', translation: 'cerrar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'start', past: 'started', participle: 'started', translation: 'empezar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'finish', past: 'finished', participle: 'finished', translation: 'terminar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'watch', past: 'watched', participle: 'watched', translation: 'ver/mirar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'listen', past: 'listened', participle: 'listened', translation: 'escuchar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'wait', past: 'waited', participle: 'waited', translation: 'esperar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'help', past: 'helped', participle: 'helped', translation: 'ayudar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'learn', past: 'learned', participle: 'learned', translation: 'aprender', category: 'regular', difficulty: 'easy' },
  { infinitive: 'try', past: 'tried', participle: 'tried', translation: 'intentar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'call', past: 'called', participle: 'called', translation: 'llamar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'clean', past: 'cleaned', participle: 'cleaned', translation: 'limpiar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'cook', past: 'cooked', participle: 'cooked', translation: 'cocinar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'dance', past: 'danced', participle: 'danced', translation: 'bailar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'draw', past: 'drew', participle: 'drawn', translation: 'dibujar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'dream', past: 'dreamed', participle: 'dreamed', translation: 'soñar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'fall', past: 'fell', participle: 'fallen', translation: 'caer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'grow', past: 'grew', participle: 'grown', translation: 'crecer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'hurt', past: 'hurt', participle: 'hurt', translation: 'herir/doler', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'lead', past: 'led', participle: 'led', translation: 'liderar', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'lend', past: 'lent', participle: 'lent', translation: 'prestar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'let', past: 'let', participle: 'let', translation: 'dejar/permitir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'lie', past: 'lay', participle: 'lain', translation: 'estar acostado', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'light', past: 'lit', participle: 'lit', translation: 'encender', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'lose', past: 'lost', participle: 'lost', translation: 'perder', category: 'irregular', difficulty: 'medium' }
]

export async function POST() {
  try {
    // First, clear existing verbs
    await db.verb.deleteMany({})
    
    // Insert new verbs
    const verbs = await db.verb.createMany({
      data: verbsData
    })

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      count: verbs.count 
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}