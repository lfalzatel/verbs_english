import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // SIMPRE usar datos simulados para estabilidad en Vercel
    console.log('Usando modo simulado con 30 verbos para máxima estabilidad en Vercel');
    
    return NextResponse.json({
      success: true,
      data: getMockVerbs(searchParams),
      total: getMockVerbs(searchParams).length,
      message: 'Verbos cargados exitosamente (modo optimizado para Vercel)',
      usingMockData: true,
      deploymentMode: 'vercel-optimized'
    });

  } catch (error) {
    console.error('Error fetching verbs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar los verbos',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}

// Mock data as fallback - 100 VERBOS OPTIMIZADOS PARA VERCEL
function getMockVerbs(searchParams: URLSearchParams) {
  const mockData = [
    // Easy verbs (35)
    { id: 1, infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', category: 'irregular', difficulty: 'easy' },
    { id: 2, infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', category: 'irregular', difficulty: 'easy' },
    { id: 3, infinitive: 'have', past: 'had', participle: 'had', translation: 'tener/haber', category: 'irregular', difficulty: 'easy' },
    { id: 4, infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', category: 'irregular', difficulty: 'easy' },
    { id: 5, infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', category: 'irregular', difficulty: 'easy' },
    { id: 6, infinitive: 'get', past: 'got', participle: 'got/gotten', translation: 'conseguir/obtener', category: 'irregular', difficulty: 'easy' },
    { id: 7, infinitive: 'make', past: 'made', participle: 'made', translation: 'hacer/crear', category: 'irregular', difficulty: 'easy' },
    { id: 8, infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber/conocer', category: 'irregular', difficulty: 'easy' },
    { id: 9, infinitive: 'think', past: 'thought', participle: 'thought', translation: 'pensar', category: 'irregular', difficulty: 'easy' },
    { id: 10, infinitive: 'take', past: 'took', participle: 'taken', translation: 'tomar/llevar', category: 'irregular', difficulty: 'easy' },
    { id: 11, infinitive: 'come', past: 'came', participle: 'come', translation: 'venir', category: 'irregular', difficulty: 'easy' },
    { id: 12, infinitive: 'see', past: 'saw', participle: 'seen', translation: 'ver', category: 'irregular', difficulty: 'easy' },
    { id: 13, infinitive: 'want', past: 'wanted', participle: 'wanted', translation: 'querer', category: 'regular', difficulty: 'easy' },
    { id: 14, infinitive: 'look', past: 'looked', participle: 'looked', translation: 'mirar', category: 'regular', difficulty: 'easy' },
    { id: 15, infinitive: 'use', past: 'used', participle: 'used', translation: 'usar', category: 'regular', difficulty: 'easy' },
    { id: 16, infinitive: 'work', past: 'worked', participle: 'worked', translation: 'trabajar', category: 'regular', difficulty: 'easy' },
    { id: 17, infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'easy' },
    { id: 18, infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', category: 'regular', difficulty: 'easy' },
    { id: 19, infinitive: 'live', past: 'lived', participle: 'lived', translation: 'vivir', category: 'regular', difficulty: 'easy' },
    { id: 20, infinitive: 'talk', past: 'talked', participle: 'talked', translation: 'hablar', category: 'regular', difficulty: 'easy' },
    { id: 21, infinitive: 'ask', past: 'asked', participle: 'asked', translation: 'preguntar', category: 'regular', difficulty: 'easy' },
    { id: 22, infinitive: 'call', past: 'called', participle: 'called', translation: 'llamar', category: 'regular', difficulty: 'easy' },
    { id: 23, infinitive: 'help', past: 'helped', participle: 'helped', translation: 'ayudar', category: 'regular', difficulty: 'easy' },
    { id: 24, infinitive: 'cook', past: 'cooked', participle: 'cooked', translation: 'cocinar', category: 'regular', difficulty: 'easy' },
    { id: 25, infinitive: 'clean', past: 'cleaned', participle: 'cleaned', translation: 'limpiar', category: 'regular', difficulty: 'easy' },
    { id: 26, infinitive: 'dance', past: 'danced', participle: 'danced', translation: 'bailar', category: 'regular', difficulty: 'easy' },
    { id: 27, infinitive: 'dream', past: 'dreamed', participle: 'dreamed', translation: 'soñar', category: 'regular', difficulty: 'easy' },
    { id: 28, infinitive: 'enjoy', past: 'enjoyed', participle: 'enjoyed', translation: 'disfrutar', category: 'regular', difficulty: 'easy' },
    { id: 29, infinitive: 'jump', past: 'jumped', participle: 'jumped', translation: 'saltar', category: 'regular', difficulty: 'easy' },
    { id: 30, infinitive: 'laugh', past: 'laughed', participle: 'laughed', translation: 'reír', category: 'regular', difficulty: 'easy' },
    { id: 31, infinitive: 'learn', past: 'learned', participle: 'learned', translation: 'aprender', category: 'regular', difficulty: 'easy' },
    { id: 32, infinitive: 'listen', past: 'listened', participle: 'listened', translation: 'escuchar', category: 'regular', difficulty: 'easy' },
    { id: 33, infinitive: 'love', past: 'loved', participle: 'loved', translation: 'amar', category: 'regular', difficulty: 'easy' },
    { id: 34, infinitive: 'open', past: 'opened', participle: 'opened', translation: 'abrir', category: 'regular', difficulty: 'easy' },
    { id: 35, infinitive: 'stay', past: 'stayed', participle: 'stayed', translation: 'quedarse', category: 'regular', difficulty: 'easy' },

    // Medium verbs (35)
    { id: 36, infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', category: 'irregular', difficulty: 'medium' },
    { id: 37, infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', category: 'irregular', difficulty: 'medium' },
    { id: 38, infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', category: 'irregular', difficulty: 'medium' },
    { id: 39, infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'medium' },
    { id: 40, infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', category: 'irregular', difficulty: 'medium' },
    { id: 41, infinitive: 'sleep', past: 'slept', participle: 'slept', translation: 'dormir', category: 'irregular', difficulty: 'medium' },
    { id: 42, infinitive: 'begin', past: 'began', participle: 'begun', translation: 'empezar', category: 'irregular', difficulty: 'medium' },
    { id: 43, infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', category: 'irregular', difficulty: 'medium' },
    { id: 44, infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', category: 'irregular', difficulty: 'medium' },
    { id: 45, infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', category: 'irregular', difficulty: 'medium' },
    { id: 46, infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', category: 'irregular', difficulty: 'medium' },
    { id: 47, infinitive: 'forget', past: 'forgot', participle: 'forgotten', translation: 'olvidar', category: 'irregular', difficulty: 'medium' },
    { id: 48, infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', category: 'irregular', difficulty: 'medium' },
    { id: 49, infinitive: 'grow', past: 'grew', participle: 'grown', translation: 'crecer', category: 'irregular', difficulty: 'medium' },
    { id: 50, infinitive: 'choose', past: 'chose', participle: 'chosen', translation: 'elegir', category: 'irregular', difficulty: 'medium' },
    { id: 51, infinitive: 'steal', past: 'stole', participle: 'stolen', translation: 'robar', category: 'irregular', difficulty: 'medium' },
    { id: 52, infinitive: 'wear', past: 'wore', participle: 'worn', translation: 'usar/vestir', category: 'irregular', difficulty: 'medium' },
    { id: 53, infinitive: 'swim', past: 'swam', participle: 'swum', translation: 'nadar', category: 'irregular', difficulty: 'medium' },
    { id: 54, infinitive: 'speak', past: 'spoke', participle: 'spoken', translation: 'hablar', category: 'irregular', difficulty: 'medium' },
    { id: 55, infinitive: 'break', past: 'broke', participle: 'broken', translation: 'romper', category: 'irregular', difficulty: 'medium' },
    { id: 56, infinitive: 'catch', past: 'caught', participle: 'caught', translation: 'atrapar', category: 'irregular', difficulty: 'medium' },
    { id: 57, infinitive: 'cost', past: 'cost', participle: 'cost', translation: 'costar', category: 'irregular', difficulty: 'medium' },
    { id: 58, infinitive: 'cut', past: 'cut', participle: 'cut', translation: 'cortar', category: 'irregular', difficulty: 'medium' },
    { id: 59, infinitive: 'fall', past: 'fell', participle: 'fallen', translation: 'caer', category: 'irregular', difficulty: 'medium' },
    { id: 60, infinitive: 'feel', past: 'felt', participle: 'felt', translation: 'sentir', category: 'irregular', difficulty: 'medium' },
    { id: 61, infinitive: 'hear', past: 'heard', participle: 'heard', translation: 'escuchar', category: 'irregular', difficulty: 'medium' },
    { id: 62, infinitive: 'hold', past: 'held', participle: 'held', translation: 'sostener', category: 'irregular', difficulty: 'medium' },
    { id: 63, infinitive: 'keep', past: 'kept', participle: 'kept', translation: 'mantener', category: 'irregular', difficulty: 'medium' },
    { id: 64, infinitive: 'answer', past: 'answered', participle: 'answered', translation: 'responder', category: 'regular', difficulty: 'medium' },
    { id: 65, infinitive: 'arrive', past: 'arrived', participle: 'arrived', translation: 'llegar', category: 'regular', difficulty: 'medium' },
    { id: 66, infinitive: 'change', past: 'changed', participle: 'changed', translation: 'cambiar', category: 'regular', difficulty: 'medium' },
    { id: 67, infinitive: 'close', past: 'closed', participle: 'closed', translation: 'cerrar', category: 'regular', difficulty: 'medium' },
    { id: 68, infinitive: 'decide', past: 'decided', participle: 'decided', translation: 'decidir', category: 'regular', difficulty: 'medium' },
    { id: 69, infinitive: 'explain', past: 'explained', participle: 'explained', translation: 'explicar', category: 'regular', difficulty: 'medium' },
    { id: 70, infinitive: 'finish', past: 'finished', participle: 'finished', translation: 'terminar', category: 'regular', difficulty: 'medium' },

    // Hard verbs (30)
    { id: 71, infinitive: 'become', past: 'became', participle: 'become', translation: 'convertirse', category: 'irregular', difficulty: 'hard' },
    { id: 72, infinitive: 'build', past: 'built', participle: 'built', translation: 'construir', category: 'irregular', difficulty: 'hard' },
    { id: 73, infinitive: 'hide', past: 'hid', participle: 'hidden', translation: 'esconder', category: 'irregular', difficulty: 'hard' },
    { id: 74, infinitive: 'leave', past: 'left', participle: 'left', translation: 'dejar', category: 'irregular', difficulty: 'hard' },
    { id: 75, infinitive: 'lose', past: 'lost', participle: 'lost', translation: 'perder', category: 'irregular', difficulty: 'hard' },
    { id: 76, infinitive: 'mean', past: 'meant', participle: 'meant', translation: 'significar', category: 'irregular', difficulty: 'hard' },
    { id: 77, infinitive: 'pay', past: 'paid', participle: 'paid', translation: 'pagar', category: 'irregular', difficulty: 'hard' },
    { id: 78, infinitive: 'ride', past: 'rode', participle: 'ridden', translation: 'montar/cabalgar', category: 'irregular', difficulty: 'hard' },
    { id: 79, infinitive: 'ring', past: 'rang', participle: 'rung', translation: 'sonar', category: 'irregular', difficulty: 'hard' },
    { id: 80, infinitive: 'rise', past: 'rose', participle: 'risen', translation: 'levantarse/crecer', category: 'irregular', difficulty: 'hard' },
    { id: 81, infinitive: 'send', past: 'sent', participle: 'sent', translation: 'enviar', category: 'irregular', difficulty: 'hard' },
    { id: 82, infinitive: 'sing', past: 'sang', participle: 'sung', translation: 'cantar', category: 'irregular', difficulty: 'hard' },
    { id: 83, infinitive: 'sit', past: 'sat', participle: 'sat', translation: 'sentarse', category: 'irregular', difficulty: 'hard' },
    { id: 84, infinitive: 'spend', past: 'spent', participle: 'spent', translation: 'gastar', category: 'irregular', difficulty: 'hard' },
    { id: 85, infinitive: 'stand', past: 'stood', participle: 'stood', translation: 'estar de pie', category: 'irregular', difficulty: 'hard' },
    { id: 86, infinitive: 'teach', past: 'taught', participle: 'taught', translation: 'enseñar', category: 'irregular', difficulty: 'hard' },
    { id: 87, infinitive: 'tell', past: 'told', participle: 'told', translation: 'contar/decir', category: 'irregular', difficulty: 'hard' },
    { id: 88, infinitive: 'understand', past: 'understood', participle: 'understood', translation: 'entender', category: 'irregular', difficulty: 'hard' },
    { id: 89, infinitive: 'wake', past: 'woke', participle: 'woken', translation: 'despertarse', category: 'irregular', difficulty: 'hard' },
    { id: 90, infinitive: 'win', past: 'won', participle: 'won', translation: 'ganar', category: 'irregular', difficulty: 'hard' },
    { id: 91, infinitive: 'achieve', past: 'achieved', participle: 'achieved', translation: 'lograr/ alcanzar', category: 'regular', difficulty: 'hard' },
    { id: 92, infinitive: 'believe', past: 'believed', participle: 'believed', translation: 'creer', category: 'regular', difficulty: 'hard' },
    { id: 93, infinitive: 'consider', past: 'considered', participle: 'considered', translation: 'considerar', category: 'regular', difficulty: 'hard' },
    { id: 94, infinitive: 'continue', past: 'continued', participle: 'continued', translation: 'continuar', category: 'regular', difficulty: 'hard' },
    { id: 95, infinitive: 'develop', past: 'developed', participle: 'developed', translation: 'desarrollar', category: 'regular', difficulty: 'hard' },
    { id: 96, infinitive: 'discover', past: 'discovered', participle: 'discovered', translation: 'descubrir', category: 'regular', difficulty: 'hard' },
    { id: 97, infinitive: 'discuss', past: 'discussed', participle: 'discussed', translation: 'discutir', category: 'regular', difficulty: 'hard' },
    { id: 98, infinitive: 'experience', past: 'experienced', participle: 'experienced', translation: 'experimentar', category: 'regular', difficulty: 'hard' },
    { id: 99, infinitive: 'imagine', past: 'imagined', participle: 'imagined', translation: 'imaginar', category: 'regular', difficulty: 'hard' },
    { id: 100, infinitive: 'improve', past: 'improved', participle: 'improved', translation: 'mejorar', category: 'regular', difficulty: 'hard' }
  ];

  let filteredVerbs = [...mockData];

  // Apply filters
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const irregular = searchParams.get('irregular');
  const limit = searchParams.get('limit');

  if (category && category !== 'all') {
    filteredVerbs = filteredVerbs.filter(verb => verb.category === category);
  }

  if (difficulty && difficulty !== 'all') {
    filteredVerbs = filteredVerbs.filter(verb => verb.difficulty === difficulty);
  }

  if (irregular === 'true') {
    filteredVerbs = filteredVerbs.filter(verb => verb.category === 'irregular');
  } else if (irregular === 'false') {
    filteredVerbs = filteredVerbs.filter(verb => verb.category === 'regular');
  }

  if (limit) {
    const limitNum = parseInt(limit);
    filteredVerbs = filteredVerbs.slice(0, limitNum);
  }

  return filteredVerbs;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Aquí podrías agregar lógica para guardar progreso, puntajes, etc.
    const { action, data } = body;

    switch (action) {
      case 'save_progress':
        // Lógica para guardar progreso
        return NextResponse.json({
          success: true,
          message: 'Progreso guardado exitosamente'
        });

      case 'save_score':
        // Lógica para guardar puntaje
        return NextResponse.json({
          success: true,
          message: 'Puntaje guardado exitosamente'
        });

      case 'add_verb':
        // Lógica para agregar nuevo verbo
        const newVerb = {
          id: verbsData.length + 1,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        verbsData.push(newVerb);
        
        return NextResponse.json({
          success: true,
          data: newVerb,
          message: 'Verbo agregado exitosamente'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/verbs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la solicitud',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}