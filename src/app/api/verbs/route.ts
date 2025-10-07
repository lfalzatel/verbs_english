import { NextRequest, NextResponse } from 'next/server';

// Base de datos simulada de verbos
const verbsData = [
  {
    id: 1,
    infinitive: 'be',
    past: 'was/were',
    participle: 'been',
    translation: 'ser/estar',
    level: 'basic',
    irregular: true
  },
  {
    id: 2,
    infinitive: 'go',
    past: 'went',
    participle: 'gone',
    translation: 'ir',
    level: 'basic',
    irregular: true
  },
  {
    id: 3,
    infinitive: 'have',
    past: 'had',
    participle: 'had',
    translation: 'tener/haber',
    level: 'basic',
    irregular: true
  },
  {
    id: 4,
    infinitive: 'do',
    past: 'did',
    participle: 'done',
    translation: 'hacer',
    level: 'basic',
    irregular: true
  },
  {
    id: 5,
    infinitive: 'say',
    past: 'said',
    participle: 'said',
    translation: 'decir',
    level: 'basic',
    irregular: true
  },
  {
    id: 6,
    infinitive: 'get',
    past: 'got',
    participle: 'got/gotten',
    translation: 'conseguir/obtener',
    level: 'basic',
    irregular: true
  },
  {
    id: 7,
    infinitive: 'make',
    past: 'made',
    participle: 'made',
    translation: 'hacer/crear',
    level: 'basic',
    irregular: true
  },
  {
    id: 8,
    infinitive: 'know',
    past: 'knew',
    participle: 'known',
    translation: 'saber/conocer',
    level: 'basic',
    irregular: true
  },
  {
    id: 9,
    infinitive: 'think',
    past: 'thought',
    participle: 'thought',
    translation: 'pensar',
    level: 'basic',
    irregular: true
  },
  {
    id: 10,
    infinitive: 'take',
    past: 'took',
    participle: 'taken',
    translation: 'tomar/tomar',
    level: 'basic',
    irregular: true
  },
  {
    id: 11,
    infinitive: 'come',
    past: 'came',
    participle: 'come',
    translation: 'venir',
    level: 'basic',
    irregular: true
  },
  {
    id: 12,
    infinitive: 'see',
    past: 'saw',
    participle: 'seen',
    translation: 'ver',
    level: 'basic',
    irregular: true
  },
  {
    id: 13,
    infinitive: 'want',
    past: 'wanted',
    participle: 'wanted',
    translation: 'querer',
    level: 'basic',
    irregular: false
  },
  {
    id: 14,
    infinitive: 'look',
    past: 'looked',
    participle: 'looked',
    translation: 'mirar',
    level: 'basic',
    irregular: false
  },
  {
    id: 15,
    infinitive: 'use',
    past: 'used',
    participle: 'used',
    translation: 'usar',
    level: 'basic',
    irregular: false
  },
  {
    id: 16,
    infinitive: 'find',
    past: 'found',
    participle: 'found',
    translation: 'encontrar',
    level: 'basic',
    irregular: true
  },
  {
    id: 17,
    infinitive: 'give',
    past: 'gave',
    participle: 'given',
    translation: 'dar',
    level: 'basic',
    irregular: true
  },
  {
    id: 18,
    infinitive: 'tell',
    past: 'told',
    participle: 'told',
    translation: 'contar/decir',
    level: 'basic',
    irregular: true
  },
  {
    id: 19,
    infinitive: 'work',
    past: 'worked',
    participle: 'worked',
    translation: 'trabajar',
    level: 'basic',
    irregular: false
  },
  {
    id: 20,
    infinitive: 'call',
    past: 'called',
    participle: 'called',
    translation: 'llamar',
    level: 'basic',
    irregular: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = searchParams.get('limit');
    const irregular = searchParams.get('irregular');

    let filteredVerbs = [...verbsData];

    // Filtrar por nivel
    if (level && level !== 'all') {
      filteredVerbs = filteredVerbs.filter(verb => verb.level === level);
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

    // Mezclar aleatoriamente
    const shuffled = filteredVerbs.sort(() => 0.5 - Math.random());

    return NextResponse.json({
      success: true,
      data: shuffled,
      total: shuffled.length,
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