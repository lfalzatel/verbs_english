import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = searchParams.get('limit');
    const irregular = searchParams.get('irregular');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    // Build where clause
    const where: any = {};

    // Filtrar por categoría
    if (category && category !== 'all') {
      where.category = category;
    }

    // Filtrar por dificultad
    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    // Filtrar por regulares/irregulares
    if (irregular === 'true') {
      where.category = 'irregular';
    } else if (irregular === 'false') {
      where.category = 'regular';
    }

    // Get verbs from database
    let verbs = await db.verb.findMany({
      where,
      orderBy: [
        { difficulty: 'asc' },
        { infinitive: 'asc' }
      ]
    });

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      verbs = verbs.slice(0, limitNum);
    }

    // If no verbs in database, return mock data
    if (verbs.length === 0) {
      return NextResponse.json({
        success: true,
        data: getMockVerbs(searchParams),
        total: getMockVerbs(searchParams).length,
        message: 'Verbos cargados exitosamente (datos simulados)',
        usingMockData: true
      });
    }

    return NextResponse.json({
      success: true,
      data: verbs,
      total: verbs.length,
      message: 'Verbos cargados exitosamente',
      usingMockData: false
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

// Mock data as fallback
function getMockVerbs(searchParams: URLSearchParams) {
  const mockData = [
    // Basic verbs (15)
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
    
    // Intermediate verbs (25)
    { id: 16, infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', category: 'irregular', difficulty: 'medium' },
    { id: 17, infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', category: 'irregular', difficulty: 'medium' },
    { id: 18, infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', category: 'irregular', difficulty: 'medium' },
    { id: 19, infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'medium' },
    { id: 20, infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', category: 'irregular', difficulty: 'medium' },
    { id: 21, infinitive: 'sleep', past: 'slept', participle: 'slept', translation: 'dormir', category: 'irregular', difficulty: 'medium' },
    { id: 22, infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', category: 'regular', difficulty: 'medium' },
    { id: 23, infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'medium' },
    { id: 24, infinitive: 'begin', past: 'began', participle: 'begun', translation: 'empezar', category: 'irregular', difficulty: 'medium' },
    { id: 25, infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', category: 'irregular', difficulty: 'medium' },
    { id: 26, infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', category: 'irregular', difficulty: 'medium' },
    { id: 27, infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', category: 'irregular', difficulty: 'medium' },
    { id: 28, infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', category: 'irregular', difficulty: 'medium' },
    { id: 29, infinitive: 'forget', past: 'forgot', participle: 'forgotten', translation: 'olvidar', category: 'irregular', difficulty: 'medium' },
    { id: 30, infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', category: 'irregular', difficulty: 'medium' },
    { id: 31, infinitive: 'hear', past: 'heard', participle: 'heard', translation: 'escuchar', category: 'irregular', difficulty: 'medium' },
    { id: 32, infinitive: 'leave', past: 'left', participle: 'left', translation: 'dejar/salir', category: 'irregular', difficulty: 'medium' },
    { id: 33, infinitive: 'lose', past: 'lost', participle: 'lost', translation: 'perder', category: 'irregular', difficulty: 'medium' },
    { id: 34, infinitive: 'meet', past: 'met', participle: 'met', translation: 'conocer/encontrar', category: 'irregular', difficulty: 'medium' },
    { id: 35, infinitive: 'pay', past: 'paid', participle: 'paid', translation: 'pagar', category: 'irregular', difficulty: 'medium' },
    { id: 36, infinitive: 'sit', past: 'sat', participle: 'sat', translation: 'sentarse', category: 'irregular', difficulty: 'medium' },
    { id: 37, infinitive: 'speak', past: 'spoke', participle: 'spoken', translation: 'hablar', category: 'irregular', difficulty: 'medium' },
    { id: 38, infinitive: 'stand', past: 'stood', participle: 'stood', translation: 'levantarse', category: 'irregular', difficulty: 'medium' },
    { id: 39, infinitive: 'swim', past: 'swam', participle: 'swum', translation: 'nadar', category: 'irregular', difficulty: 'medium' },
    { id: 40, infinitive: 'understand', past: 'understood', participle: 'understood', translation: 'entender', category: 'irregular', difficulty: 'medium' }
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