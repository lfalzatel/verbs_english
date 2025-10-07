import { NextRequest, NextResponse } from 'next/server';

// Complete verbs data for production fallback
const completeVerbs = [
  // Basic Regular Verbs (20)
  { id: 1, infinitive: 'ask', past: 'asked', participle: 'asked', translation: 'preguntar', category: 'regular', difficulty: 'easy' },
  { id: 2, infinitive: 'call', past: 'called', participle: 'called', translation: 'llamar', category: 'regular', difficulty: 'easy' },
  { id: 3, infinitive: 'clean', past: 'cleaned', participle: 'cleaned', translation: 'limpiar', category: 'regular', difficulty: 'easy' },
  { id: 4, infinitive: 'cook', past: 'cooked', participle: 'cooked', translation: 'cocinar', category: 'regular', difficulty: 'easy' },
  { id: 5, infinitive: 'dance', past: 'danced', participle: 'danced', translation: 'bailar', category: 'regular', difficulty: 'easy' },
  { id: 6, infinitive: 'dream', past: 'dreamed', participle: 'dreamed', translation: 'soñar', category: 'regular', difficulty: 'easy' },
  { id: 7, infinitive: 'enjoy', past: 'enjoyed', participle: 'enjoyed', translation: 'disfrutar', category: 'regular', difficulty: 'easy' },
  { id: 8, infinitive: 'help', past: 'helped', participle: 'helped', translation: 'ayudar', category: 'regular', difficulty: 'easy' },
  { id: 9, infinitive: 'jump', past: 'jumped', participle: 'jumped', translation: 'saltar', category: 'regular', difficulty: 'easy' },
  { id: 10, infinitive: 'laugh', past: 'laughed', participle: 'laughed', translation: 'reír', category: 'regular', difficulty: 'easy' },
  { id: 11, infinitive: 'learn', past: 'learned', participle: 'learned', translation: 'aprender', category: 'regular', difficulty: 'easy' },
  { id: 12, infinitive: 'listen', past: 'listened', participle: 'listened', translation: 'escuchar', category: 'regular', difficulty: 'easy' },
  { id: 13, infinitive: 'look', past: 'looked', participle: 'looked', translation: 'mirar', category: 'regular', difficulty: 'easy' },
  { id: 14, infinitive: 'love', past: 'loved', participle: 'loved', translation: 'amar', category: 'regular', difficulty: 'easy' },
  { id: 15, infinitive: 'open', past: 'opened', participle: 'opened', translation: 'abrir', category: 'regular', difficulty: 'easy' },
  { id: 16, infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'easy' },
  { id: 17, infinitive: 'rain', past: 'rained', participle: 'rained', translation: 'llover', category: 'regular', difficulty: 'easy' },
  { id: 18, infinitive: 'stay', past: 'stayed', participle: 'stayed', translation: 'quedarse', category: 'regular', difficulty: 'easy' },
  { id: 19, infinitive: 'talk', past: 'talked', participle: 'talked', translation: 'hablar', category: 'regular', difficulty: 'easy' },
  { id: 20, infinitive: 'want', past: 'wanted', participle: 'wanted', translation: 'querer', category: 'regular', difficulty: 'easy' },
  
  // Basic Irregular Verbs (15)
  { id: 21, infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', category: 'irregular', difficulty: 'easy' },
  { id: 22, infinitive: 'come', past: 'came', participle: 'come', translation: 'venir', category: 'irregular', difficulty: 'easy' },
  { id: 23, infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', category: 'irregular', difficulty: 'easy' },
  { id: 24, infinitive: 'find', past: 'found', participle: 'found', translation: 'encontrar', category: 'irregular', difficulty: 'easy' },
  { id: 25, infinitive: 'get', past: 'got', participle: 'got/gotten', translation: 'conseguir', category: 'irregular', difficulty: 'easy' },
  { id: 26, infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', category: 'irregular', difficulty: 'easy' },
  { id: 27, infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', category: 'irregular', difficulty: 'easy' },
  { id: 28, infinitive: 'have', past: 'had', participle: 'had', translation: 'tener/haber', category: 'irregular', difficulty: 'easy' },
  { id: 29, infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber/conocer', category: 'irregular', difficulty: 'easy' },
  { id: 30, infinitive: 'make', past: 'made', participle: 'made', translation: 'hacer/crear', category: 'irregular', difficulty: 'easy' },
  { id: 31, infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', category: 'irregular', difficulty: 'easy' },
  { id: 32, infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', category: 'irregular', difficulty: 'easy' },
  { id: 33, infinitive: 'see', past: 'saw', participle: 'seen', translation: 'ver', category: 'irregular', difficulty: 'easy' },
  { id: 34, infinitive: 'take', past: 'took', participle: 'taken', translation: 'tomar', category: 'irregular', difficulty: 'easy' },
  { id: 35, infinitive: 'think', past: 'thought', participle: 'thought', translation: 'pensar', category: 'irregular', difficulty: 'easy' },
  
  // Intermediate Regular Verbs (20)
  { id: 36, infinitive: 'answer', past: 'answered', participle: 'answered', translation: 'responder', category: 'regular', difficulty: 'medium' },
  { id: 37, infinitive: 'arrive', past: 'arrived', participle: 'arrived', translation: 'llegar', category: 'regular', difficulty: 'medium' },
  { id: 38, infinitive: 'change', past: 'changed', participle: 'changed', translation: 'cambiar', category: 'regular', difficulty: 'medium' },
  { id: 39, infinitive: 'close', past: 'closed', participle: 'closed', translation: 'cerrar', category: 'regular', difficulty: 'medium' },
  { id: 40, infinitive: 'decide', past: 'decided', participle: 'decided', translation: 'decidir', category: 'regular', difficulty: 'medium' },
  { id: 41, infinitive: 'explain', past: 'explained', participle: 'explained', translation: 'explicar', category: 'regular', difficulty: 'medium' },
  { id: 42, infinitive: 'finish', past: 'finished', participle: 'finished', translation: 'terminar', category: 'regular', difficulty: 'medium' },
  { id: 43, infinitive: 'happen', past: 'happened', participle: 'happened', translation: 'suceder', category: 'regular', difficulty: 'medium' },
  { id: 44, infinitive: 'live', past: 'lived', participle: 'lived', translation: 'vivir', category: 'regular', difficulty: 'medium' },
  { id: 45, infinitive: 'need', past: 'needed', participle: 'needed', translation: 'necesitar', category: 'regular', difficulty: 'medium' },
  { id: 46, infinitive: 'paint', past: 'painted', participle: 'painted', translation: 'pintar', category: 'regular', difficulty: 'medium' },
  { id: 47, infinitive: 'prefer', past: 'preferred', participle: 'preferred', translation: 'preferir', category: 'regular', difficulty: 'medium' },
  { id: 48, infinitive: 'remember', past: 'remembered', participle: 'remembered', translation: 'recordar', category: 'regular', difficulty: 'medium' },
  { id: 49, infinitive: 'start', past: 'started', participle: 'started', translation: 'empezar', category: 'regular', difficulty: 'medium' },
  { id: 50, infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', category: 'regular', difficulty: 'medium' },
  { id: 51, infinitive: 'turn', past: 'turned', participle: 'turned', translation: 'girar', category: 'regular', difficulty: 'medium' },
  { id: 52, infinitive: 'use', past: 'used', participle: 'used', translation: 'usar', category: 'regular', difficulty: 'medium' },
  { id: 53, infinitive: 'visit', past: 'visited', participle: 'visited', translation: 'visitar', category: 'regular', difficulty: 'medium' },
  { id: 54, infinitive: 'wait', past: 'waited', participle: 'waited', translation: 'esperar', category: 'regular', difficulty: 'medium' },
  { id: 55, infinitive: 'work', past: 'worked', participle: 'worked', translation: 'trabajar', category: 'regular', difficulty: 'medium' },
  
  // Intermediate Irregular Verbs (18)
  { id: 56, infinitive: 'begin', past: 'began', participle: 'begun', translation: 'empezar', category: 'irregular', difficulty: 'medium' },
  { id: 57, infinitive: 'break', past: 'broke', participle: 'broken', translation: 'romper', category: 'irregular', difficulty: 'medium' },
  { id: 58, infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', category: 'irregular', difficulty: 'medium' },
  { id: 59, infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', category: 'irregular', difficulty: 'medium' },
  { id: 60, infinitive: 'catch', past: 'caught', participle: 'caught', translation: 'atrapar', category: 'irregular', difficulty: 'medium' },
  { id: 61, infinitive: 'choose', past: 'chose', participle: 'chosen', translation: 'elegir', category: 'irregular', difficulty: 'medium' },
  { id: 62, infinitive: 'cost', past: 'cost', participle: 'cost', translation: 'costar', category: 'irregular', difficulty: 'medium' },
  { id: 63, infinitive: 'cut', past: 'cut', participle: 'cut', translation: 'cortar', category: 'irregular', difficulty: 'medium' },
  { id: 64, infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', category: 'irregular', difficulty: 'medium' },
  { id: 65, infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', category: 'irregular', difficulty: 'medium' },
  { id: 66, infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'medium' },
  { id: 67, infinitive: 'fall', past: 'fell', participle: 'fallen', translation: 'caer', category: 'irregular', difficulty: 'medium' },
  { id: 68, infinitive: 'feel', past: 'felt', participle: 'felt', translation: 'sentir', category: 'irregular', difficulty: 'medium' },
  { id: 69, infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', category: 'irregular', difficulty: 'medium' },
  { id: 70, infinitive: 'forget', past: 'forgot', participle: 'forgotten', translation: 'olvidar', category: 'irregular', difficulty: 'medium' },
  { id: 71, infinitive: 'hear', past: 'heard', participle: 'heard', translation: 'escuchar', category: 'irregular', difficulty: 'medium' },
  { id: 72, infinitive: 'hold', past: 'held', participle: 'held', translation: 'sostener', category: 'irregular', difficulty: 'medium' },
  { id: 73, infinitive: 'keep', past: 'kept', participle: 'kept', translation: 'mantener', category: 'irregular', difficulty: 'medium' },
  
  // Advanced Regular Verbs (15)
  { id: 74, infinitive: 'achieve', past: 'achieved', participle: 'achieved', translation: 'lograr', category: 'regular', difficulty: 'hard' },
  { id: 75, infinitive: 'believe', past: 'believed', participle: 'believed', translation: 'creer', category: 'regular', difficulty: 'hard' },
  { id: 76, infinitive: 'consider', past: 'considered', participle: 'considered', translation: 'considerar', category: 'regular', difficulty: 'hard' },
  { id: 77, infinitive: 'continue', past: 'continued', participle: 'continued', translation: 'continuar', category: 'regular', difficulty: 'hard' },
  { id: 78, infinitive: 'develop', past: 'developed', participle: 'developed', translation: 'desarrollar', category: 'regular', difficulty: 'hard' },
  { id: 79, infinitive: 'discover', past: 'discovered', participle: 'discovered', translation: 'descubrir', category: 'regular', difficulty: 'hard' },
  { id: 80, infinitive: 'discuss', past: 'discussed', participle: 'discussed', translation: 'discutir', category: 'regular', difficulty: 'hard' },
  { id: 81, infinitive: 'experience', past: 'experienced', participle: 'experienced', translation: 'experimentar', category: 'regular', difficulty: 'hard' },
  { id: 82, infinitive: 'imagine', past: 'imagined', participle: 'imagined', translation: 'imaginar', category: 'regular', difficulty: 'hard' },
  { id: 83, infinitive: 'improve', past: 'improved', participle: 'improved', translation: 'mejorar', category: 'regular', difficulty: 'hard' },
  { id: 84, infinitive: 'include', past: 'included', participle: 'included', translation: 'incluir', category: 'regular', difficulty: 'hard' },
  { id: 85, infinitive: 'introduce', past: 'introduced', participle: 'introduced', translation: 'presentar', category: 'regular', difficulty: 'hard' },
  { id: 86, infinitive: 'mention', past: 'mentioned', participle: 'mentioned', translation: 'mencionar', category: 'regular', difficulty: 'hard' },
  { id: 87, infinitive: 'practice', past: 'practiced', participle: 'practiced', translation: 'practicar', category: 'regular', difficulty: 'hard' },
  { id: 88, infinitive: 'realize', past: 'realized', participle: 'realized', translation: 'darse cuenta', category: 'regular', difficulty: 'hard' },
  
  // Advanced Irregular Verbs (10)
  { id: 89, infinitive: 'become', past: 'became', participle: 'become', translation: 'convertirse', category: 'irregular', difficulty: 'hard' },
  { id: 90, infinitive: 'build', past: 'built', participle: 'built', translation: 'construir', category: 'irregular', difficulty: 'hard' },
  { id: 91, infinitive: 'hide', past: 'hid', participle: 'hidden', translation: 'esconder', category: 'irregular', difficulty: 'hard' },
  { id: 92, infinitive: 'leave', past: 'left', participle: 'left', translation: 'dejar', category: 'irregular', difficulty: 'hard' },
  { id: 93, infinitive: 'lose', past: 'lost', participle: 'lost', translation: 'perder', category: 'irregular', difficulty: 'hard' },
  { id: 94, infinitive: 'mean', past: 'meant', participle: 'meant', translation: 'significar', category: 'irregular', difficulty: 'hard' },
  { id: 95, infinitive: 'pay', past: 'paid', participle: 'paid', translation: 'pagar', category: 'irregular', difficulty: 'hard' },
  { id: 96, infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', category: 'irregular', difficulty: 'hard' },
  { id: 97, infinitive: 'sleep', past: 'slept', participle: 'slept', translation: 'dormir', category: 'irregular', difficulty: 'hard' },
  { id: 98, infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', category: 'irregular', difficulty: 'hard' }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = searchParams.get('limit');
    const irregular = searchParams.get('irregular');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    let verbs = [...completeVerbs];

    // Apply filters
    if (category && category !== 'all') {
      verbs = verbs.filter(verb => verb.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      verbs = verbs.filter(verb => verb.difficulty === difficulty);
    }

    if (irregular === 'true') {
      verbs = verbs.filter(verb => verb.category === 'irregular');
    } else if (irregular === 'false') {
      verbs = verbs.filter(verb => verb.category === 'regular');
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      verbs = verbs.slice(0, limitNum);
    }

    // Sort by difficulty and infinitive
    verbs.sort((a, b) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      const aDifficulty = difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
      const bDifficulty = difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      
      if (aDifficulty !== bDifficulty) {
        return aDifficulty - bDifficulty;
      }
      
      return a.infinitive.localeCompare(b.infinitive);
    });

    return NextResponse.json({
      success: true,
      data: verbs,
      total: verbs.length,
      message: 'Verbos cargados exitosamente',
      usingMockData: true
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
          id: completeVerbs.length + 1,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
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