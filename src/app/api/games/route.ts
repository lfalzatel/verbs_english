import { NextRequest, NextResponse } from 'next/server';

interface GameConfig {
  id: string;
  name: string;
  levels: {
    easy: {
      pairs: number;
      timeLimit?: number;
      verbs: string[];
    };
    medium: {
      pairs: number;
      timeLimit?: number;
      verbs: string[];
    };
    hard: {
      pairs: number;
      timeLimit?: number;
      verbs: string[];
    };
  };
}

const gamesConfig: GameConfig[] = [
  {
    id: 'memory',
    name: 'Memoria',
    levels: {
      easy: {
        pairs: 6,
        timeLimit: 120,
        verbs: ['basic']
      },
      medium: {
        pairs: 10,
        timeLimit: 180,
        verbs: ['basic', 'common']
      },
      hard: {
        pairs: 15,
        timeLimit: 240,
        verbs: ['basic', 'common', 'advanced']
      }
    }
  },
  {
    id: 'concentration',
    name: 'Concentración',
    levels: {
      easy: {
        pairs: 8,
        timeLimit: 150,
        verbs: ['basic']
      },
      medium: {
        pairs: 12,
        timeLimit: 200,
        verbs: ['basic', 'common']
      },
      hard: {
        pairs: 16,
        timeLimit: 300,
        verbs: ['basic', 'common', 'advanced']
      }
    }
  },
  {
    id: 'matching',
    name: 'Conexión',
    levels: {
      easy: {
        pairs: 10,
        timeLimit: 180,
        verbs: ['basic']
      },
      medium: {
        pairs: 15,
        timeLimit: 240,
        verbs: ['basic', 'common']
      },
      hard: {
        pairs: 20,
        timeLimit: 360,
        verbs: ['basic', 'common', 'advanced']
      }
    }
  },
  {
    id: 'wordsearch',
    name: 'Búsqueda',
    levels: {
      easy: {
        pairs: 8,
        timeLimit: 300,
        verbs: ['basic']
      },
      medium: {
        pairs: 12,
        timeLimit: 400,
        verbs: ['basic', 'common']
      },
      hard: {
        pairs: 15,
        timeLimit: 600,
        verbs: ['basic', 'common', 'advanced']
      }
    }
  },
  {
    id: 'crossword',
    name: 'Crucigrama',
    levels: {
      easy: {
        pairs: 5,
        timeLimit: 600,
        verbs: ['basic']
      },
      medium: {
        pairs: 10,
        timeLimit: 900,
        verbs: ['basic', 'common']
      },
      hard: {
        pairs: 15,
        timeLimit: 1200,
        verbs: ['basic', 'common', 'advanced']
      }
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const level = searchParams.get('level') as 'easy' | 'medium' | 'hard';

    if (gameId && level) {
      // Obtener configuración específica
      const game = gamesConfig.find(g => g.id === gameId);
      
      if (!game) {
        return NextResponse.json(
          { success: false, error: 'Juego no encontrado' },
          { status: 404 }
        );
      }

      const gameConfig = game.levels[level];
      
      // Obtener verbos para este nivel
      const verbsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/verbs?level=${gameConfig.verbs.join(',')}&limit=${gameConfig.pairs}`);
      const verbsData = await verbsResponse.json();

      return NextResponse.json({
        success: true,
        data: {
          game: {
            id: game.id,
            name: game.name,
            level,
            config: gameConfig,
            verbs: verbsData.data || []
          }
        }
      });
    }

    // Retornar todos los juegos
    return NextResponse.json({
      success: true,
      data: gamesConfig
    });

  } catch (error) {
    console.error('Error in games API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar la configuración del juego',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, gameId, level, data } = body;

    switch (action) {
      case 'start_game':
        // Lógica para iniciar un juego
        return NextResponse.json({
          success: true,
          data: {
            sessionId: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            startTime: new Date().toISOString(),
            config: gamesConfig.find(g => g.id === gameId)?.levels[level]
          }
        });

      case 'end_game':
        // Lógica para finalizar un juego
        return NextResponse.json({
          success: true,
          data: {
            endTime: new Date().toISOString(),
            results: data
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST games API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la solicitud del juego',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}