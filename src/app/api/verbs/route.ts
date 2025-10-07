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

// Mock data as fallback - SOLO 30 VERBOS OPTIMIZADOS PARA VERCEL
function getMockVerbs(searchParams: URLSearchParams) {
  const mockData = [
    // Easy verbs (10)
    { id: 1, infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', category: 'irregular', difficulty: 'easy' },
    { id: 2, infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', category: 'irregular', difficulty: 'easy' },
    { id: 3, infinitive: 'have', past: 'had', participle: 'had', translation: 'tener/haber', category: 'irregular', difficulty: 'easy' },
    { id: 4, infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', category: 'irregular', difficulty: 'easy' },
    { id: 5, infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', category: 'irregular', difficulty: 'easy' },
    { id: 6, infinitive: 'get', past: 'got', participle: 'got/gotten', translation: 'conseguir/obtener', category: 'irregular', difficulty: 'easy' },
    { id: 7, infinitive: 'make', past: 'made', participle: 'made', translation: 'hacer/crear', category: 'irregular', difficulty: 'easy' },
    { id: 8, infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber/conocer', category: 'irregular', difficulty: 'easy' },
    { id: 9, infinitive: 'want', past: 'wanted', participle: 'wanted', translation: 'querer', category: 'regular', difficulty: 'easy' },
    { id: 10, infinitive: 'look', past: 'looked', participle: 'looked', translation: 'mirar', category: 'regular', difficulty: 'easy' },
    
    // Medium verbs (10)
    { id: 11, infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', category: 'irregular', difficulty: 'medium' },
    { id: 12, infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', category: 'irregular', difficulty: 'medium' },
    { id: 13, infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', category: 'irregular', difficulty: 'medium' },
    { id: 14, infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'medium' },
    { id: 15, infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', category: 'irregular', difficulty: 'medium' },
    { id: 16, infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', category: 'regular', difficulty: 'medium' },
    { id: 17, infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'medium' },
    { id: 18, infinitive: 'begin', past: 'began', participle: 'begun', translation: 'empezar', category: 'irregular', difficulty: 'medium' },
    { id: 19, infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', category: 'irregular', difficulty: 'medium' },
    { id: 20, infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', category: 'irregular', difficulty: 'medium' },
    
    // Hard verbs (10)
    { id: 21, infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', category: 'irregular', difficulty: 'hard' },
    { id: 22, infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', category: 'irregular', difficulty: 'hard' },
    { id: 23, infinitive: 'forget', past: 'forgot', participle: 'forgotten', translation: 'olvidar', category: 'irregular', difficulty: 'hard' },
    { id: 24, infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', category: 'irregular', difficulty: 'hard' },
    { id: 25, infinitive: 'grow', past: 'grew', participle: 'grown', translation: 'crecer', category: 'irregular', difficulty: 'hard' },
    { id: 26, infinitive: 'choose', past: 'chose', participle: 'chosen', translation: 'elegir', category: 'irregular', difficulty: 'hard' },
    { id: 27, infinitive: 'steal', past: 'stole', participle: 'stolen', translation: 'robar', category: 'irregular', difficulty: 'hard' },
    { id: 28, infinitive: 'wear', past: 'wore', participle: 'worn', translation: 'usar/vestir', category: 'irregular', difficulty: 'hard' },
    { id: 29, infinitive: 'swim', past: 'swam', participle: 'swum', translation: 'nadar', category: 'irregular', difficulty: 'hard' },
    { id: 30, infinitive: 'speak', past: 'spoke', participle: 'spoken', translation: 'hablar', category: 'irregular', difficulty: 'hard' }
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