import { NextRequest, NextResponse } from 'next/server';

// Base de datos simulada de verbos - extendida con más verbos y categorías
const verbsData = [
  {
    id: 1,
    infinitive: 'be',
    past: 'was/were',
    participle: 'been',
    translation: 'ser/estar',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 2,
    infinitive: 'go',
    past: 'went',
    participle: 'gone',
    translation: 'ir',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 3,
    infinitive: 'have',
    past: 'had',
    participle: 'had',
    translation: 'tener/haber',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 4,
    infinitive: 'do',
    past: 'did',
    participle: 'done',
    translation: 'hacer',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 5,
    infinitive: 'say',
    past: 'said',
    participle: 'said',
    translation: 'decir',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 6,
    infinitive: 'get',
    past: 'got',
    participle: 'got/gotten',
    translation: 'conseguir/obtener',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 7,
    infinitive: 'make',
    past: 'made',
    participle: 'made',
    translation: 'hacer/crear',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 8,
    infinitive: 'know',
    past: 'knew',
    participle: 'known',
    translation: 'saber/conocer',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 9,
    infinitive: 'think',
    past: 'thought',
    participle: 'thought',
    translation: 'pensar',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 10,
    infinitive: 'take',
    past: 'took',
    participle: 'taken',
    translation: 'tomar/llevar',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 11,
    infinitive: 'come',
    past: 'came',
    participle: 'come',
    translation: 'venir',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 12,
    infinitive: 'see',
    past: 'saw',
    participle: 'seen',
    translation: 'ver',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 13,
    infinitive: 'want',
    past: 'wanted',
    participle: 'wanted',
    translation: 'querer',
    level: 'basic',
    irregular: false,
    category: 'regular',
    difficulty: 'easy'
  },
  {
    id: 14,
    infinitive: 'look',
    past: 'looked',
    participle: 'looked',
    translation: 'mirar',
    level: 'basic',
    irregular: false,
    category: 'regular',
    difficulty: 'easy'
  },
  {
    id: 15,
    infinitive: 'use',
    past: 'used',
    participle: 'used',
    translation: 'usar',
    level: 'basic',
    irregular: false,
    category: 'regular',
    difficulty: 'easy'
  },
  {
    id: 16,
    infinitive: 'find',
    past: 'found',
    participle: 'found',
    translation: 'encontrar',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 17,
    infinitive: 'give',
    past: 'gave',
    participle: 'given',
    translation: 'dar',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 18,
    infinitive: 'tell',
    past: 'told',
    participle: 'told',
    translation: 'contar/decir',
    level: 'basic',
    irregular: true,
    category: 'irregular',
    difficulty: 'easy'
  },
  {
    id: 19,
    infinitive: 'work',
    past: 'worked',
    participle: 'worked',
    translation: 'trabajar',
    level: 'basic',
    irregular: false,
    category: 'regular',
    difficulty: 'easy'
  },
  {
    id: 20,
    infinitive: 'call',
    past: 'called',
    participle: 'called',
    translation: 'llamar',
    level: 'basic',
    irregular: false,
    category: 'regular',
    difficulty: 'easy'
  },
  {
    id: 21,
    infinitive: 'write',
    past: 'wrote',
    participle: 'written',
    translation: 'escribir',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 22,
    infinitive: 'read',
    past: 'read',
    participle: 'read',
    translation: 'leer',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 23,
    infinitive: 'run',
    past: 'ran',
    participle: 'run',
    translation: 'correr',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 24,
    infinitive: 'eat',
    past: 'ate',
    participle: 'eaten',
    translation: 'comer',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 25,
    infinitive: 'drink',
    past: 'drank',
    participle: 'drunk',
    translation: 'beber',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 26,
    infinitive: 'sleep',
    past: 'slept',
    participle: 'slept',
    translation: 'dormir',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 27,
    infinitive: 'study',
    past: 'studied',
    participle: 'studied',
    translation: 'estudiar',
    level: 'intermediate',
    irregular: false,
    category: 'regular',
    difficulty: 'medium'
  },
  {
    id: 28,
    infinitive: 'play',
    past: 'played',
    participle: 'played',
    translation: 'jugar',
    level: 'intermediate',
    irregular: false,
    category: 'regular',
    difficulty: 'medium'
  },
  {
    id: 29,
    infinitive: 'begin',
    past: 'began',
    participle: 'begun',
    translation: 'empezar',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  },
  {
    id: 30,
    infinitive: 'buy',
    past: 'bought',
    participle: 'bought',
    translation: 'comprar',
    level: 'intermediate',
    irregular: true,
    category: 'irregular',
    difficulty: 'medium'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = searchParams.get('limit');
    const irregular = searchParams.get('irregular');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    let filteredVerbs = [...verbsData];

    // Filtrar por nivel
    if (level && level !== 'all') {
      filteredVerbs = filteredVerbs.filter(verb => verb.level === level);
    }

    // Filtrar por categoría
    if (category && category !== 'all') {
      filteredVerbs = filteredVerbs.filter(verb => verb.category === category);
    }

    // Filtrar por dificultad
    if (difficulty && difficulty !== 'all') {
      filteredVerbs = filteredVerbs.filter(verb => verb.difficulty === difficulty);
    }

    // Filtrar por regulares/irregulares
    if (irregular === 'true') {
      filteredVerbs = filteredVerbs.filter(verb => verb.irregular);
    } else if (irregular === 'false') {
      filteredVerbs = filteredVerbs.filter(verb => !verb.irregular);
    }

    // Limitar resultados
    if (limit) {
      const limitNum = parseInt(limit);
      filteredVerbs = filteredVerbs.slice(0, limitNum);
    }

    // Mezclar aleatoriamente si no hay filtros específicos
    if (!level && !category && !difficulty && !irregular) {
      filteredVerbs = filteredVerbs.sort(() => 0.5 - Math.random());
    }

    return NextResponse.json({
      success: true,
      data: filteredVerbs,
      total: filteredVerbs.length,
      message: 'Verbos cargados exitosamente'
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