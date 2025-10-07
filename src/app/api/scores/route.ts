import { NextRequest, NextResponse } from 'next/server';

interface Score {
  id: string;
  playerName: string;
  gameId: string;
  level: string;
  score: number;
  time: number;
  accuracy: number;
  date: string;
}

// Base de datos simulada de puntajes
let scores: Score[] = [
  {
    id: '1',
    playerName: 'Luis',
    gameId: 'memory',
    level: 'easy',
    score: 100,
    time: 45,
    accuracy: 100,
    date: new Date().toISOString()
  },
  {
    id: '2',
    playerName: 'Ana',
    gameId: 'memory',
    level: 'medium',
    score: 85,
    time: 120,
    accuracy: 90,
    date: new Date().toISOString()
  },
  {
    id: '3',
    playerName: 'Carlos',
    gameId: 'concentration',
    level: 'easy',
    score: 95,
    time: 60,
    accuracy: 95,
    date: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const level = searchParams.get('level');
    const playerName = searchParams.get('playerName');
    const limit = searchParams.get('limit');

    let filteredScores = [...scores];

    // Filtrar por juego
    if (gameId) {
      filteredScores = filteredScores.filter(score => score.gameId === gameId);
    }

    // Filtrar por nivel
    if (level) {
      filteredScores = filteredScores.filter(score => score.level === level);
    }

    // Filtrar por jugador
    if (playerName) {
      filteredScores = filteredScores.filter(score => 
        score.playerName.toLowerCase().includes(playerName.toLowerCase())
      );
    }

    // Ordenar por puntaje (descendente)
    filteredScores.sort((a, b) => b.score - a.score);

    // Limitar resultados
    if (limit) {
      const limitNum = parseInt(limit);
      filteredScores = filteredScores.slice(0, limitNum);
    }

    return NextResponse.json({
      success: true,
      data: filteredScores,
      total: filteredScores.length
    });

  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar los puntajes',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, gameId, level, score, time, accuracy } = body;

    // Validar datos
    if (!playerName || !gameId || !level || score === undefined || time === undefined || accuracy === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos incompletos',
          message: 'Todos los campos son requeridos'
        },
        { status: 400 }
      );
    }

    // Crear nuevo puntaje
    const newScore: Score = {
      id: Date.now().toString(),
      playerName,
      gameId,
      level,
      score: Math.max(0, Math.min(100, score)), // Asegurar que esté entre 0 y 100
      time: Math.max(0, time),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      date: new Date().toISOString()
    };

    // Agregar a la base de datos
    scores.push(newScore);

    // Obtener ranking
    const ranking = scores
      .filter(s => s.gameId === gameId && s.level === level)
      .sort((a, b) => b.score - a.score)
      .findIndex(s => s.id === newScore.id) + 1;

    return NextResponse.json({
      success: true,
      data: {
        score: newScore,
        ranking,
        message: 'Puntaje guardado exitosamente'
      }
    });

  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al guardar el puntaje',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scoreId = searchParams.get('id');

    if (!scoreId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de puntaje no proporcionado',
          message: 'Se requiere el ID del puntaje a eliminar'
        },
        { status: 400 }
      );
    }

    // Eliminar puntaje
    const initialLength = scores.length;
    scores = scores.filter(score => score.id !== scoreId);

    if (scores.length === initialLength) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Puntaje no encontrado',
          message: 'El puntaje especificado no existe'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Puntaje eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting score:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar el puntaje',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}