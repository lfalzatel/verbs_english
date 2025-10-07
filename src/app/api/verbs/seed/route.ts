import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Simular inicialización de base de datos
    // En un caso real, aquí conectarías con tu base de datos
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada exitosamente',
      data: {
        verbsCount: 30,
        categories: ['regular', 'irregular'],
        difficulties: ['easy', 'medium'],
        levels: ['basic', 'intermediate']
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al inicializar la base de datos',
        message: 'Por favor intenta de nuevo más tarde'
      },
      { status: 500 }
    );
  }
}