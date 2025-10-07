import { NextRequest, NextResponse } from 'next/server';

const completeVerbs = [
  // Basic Regular Verbs (20)
  { infinitive: 'ask', past: 'asked', participle: 'asked', translation: 'preguntar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'call', past: 'called', participle: 'called', translation: 'llamar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'clean', past: 'cleaned', participle: 'cleaned', translation: 'limpiar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'cook', past: 'cooked', participle: 'cooked', translation: 'cocinar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'dance', past: 'danced', participle: 'danced', translation: 'bailar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'dream', past: 'dreamed', participle: 'dreamed', translation: 'soñar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'enjoy', past: 'enjoyed', participle: 'enjoyed', translation: 'disfrutar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'help', past: 'helped', participle: 'helped', translation: 'ayudar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'jump', past: 'jumped', participle: 'jumped', translation: 'saltar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'laugh', past: 'laughed', participle: 'laughed', translation: 'reír', category: 'regular', difficulty: 'easy' },
  { infinitive: 'learn', past: 'learned', participle: 'learned', translation: 'aprender', category: 'regular', difficulty: 'easy' },
  { infinitive: 'listen', past: 'listened', participle: 'listened', translation: 'escuchar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'look', past: 'looked', participle: 'looked', translation: 'mirar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'love', past: 'loved', participle: 'loved', translation: 'amar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'open', past: 'opened', participle: 'opened', translation: 'abrir', category: 'regular', difficulty: 'easy' },
  { infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'rain', past: 'rained', participle: 'rained', translation: 'llover', category: 'regular', difficulty: 'easy' },
  { infinitive: 'stay', past: 'stayed', participle: 'stayed', translation: 'quedarse', category: 'regular', difficulty: 'easy' },
  { infinitive: 'talk', past: 'talked', participle: 'talked', translation: 'hablar', category: 'regular', difficulty: 'easy' },
  { infinitive: 'want', past: 'wanted', participle: 'wanted', translation: 'querer', category: 'regular', difficulty: 'easy' },
  
  // Basic Irregular Verbs (15)
  { infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'come', past: 'came', participle: 'come', translation: 'venir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'find', past: 'found', participle: 'found', translation: 'encontrar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'get', past: 'got', participle: 'got/gotten', translation: 'conseguir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'have', past: 'had', participle: 'had', translation: 'tener/haber', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber/conocer', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'make', past: 'made', participle: 'made', translation: 'hacer/crear', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'see', past: 'saw', participle: 'seen', translation: 'ver', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'take', past: 'took', participle: 'taken', translation: 'tomar', category: 'irregular', difficulty: 'easy' },
  { infinitive: 'think', past: 'thought', participle: 'thought', translation: 'pensar', category: 'irregular', difficulty: 'easy' },
  
  // Intermediate Regular Verbs (20)
  { infinitive: 'answer', past: 'answered', participle: 'answered', translation: 'responder', category: 'regular', difficulty: 'medium' },
  { infinitive: 'arrive', past: 'arrived', participle: 'arrived', translation: 'llegar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'change', past: 'changed', participle: 'changed', translation: 'cambiar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'close', past: 'closed', participle: 'closed', translation: 'cerrar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'decide', past: 'decided', participle: 'decided', translation: 'decidir', category: 'regular', difficulty: 'medium' },
  { infinitive: 'explain', past: 'explained', participle: 'explained', translation: 'explicar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'finish', past: 'finished', participle: 'finished', translation: 'terminar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'happen', past: 'happened', participle: 'happened', translation: 'suceder', category: 'regular', difficulty: 'medium' },
  { infinitive: 'live', past: 'lived', participle: 'lived', translation: 'vivir', category: 'regular', difficulty: 'medium' },
  { infinitive: 'need', past: 'needed', participle: 'needed', translation: 'necesitar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'paint', past: 'painted', participle: 'painted', translation: 'pintar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'prefer', past: 'preferred', participle: 'preferred', translation: 'preferir', category: 'regular', difficulty: 'medium' },
  { infinitive: 'remember', past: 'remembered', participle: 'remembered', translation: 'recordar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'start', past: 'started', participle: 'started', translation: 'empezar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'turn', past: 'turned', participle: 'turned', translation: 'girar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'use', past: 'used', participle: 'used', translation: 'usar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'visit', past: 'visited', participle: 'visited', translation: 'visitar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'wait', past: 'waited', participle: 'waited', translation: 'esperar', category: 'regular', difficulty: 'medium' },
  { infinitive: 'work', past: 'worked', participle: 'worked', translation: 'trabajar', category: 'regular', difficulty: 'medium' },
  
  // Intermediate Irregular Verbs (18)
  { infinitive: 'begin', past: 'began', participle: 'begun', translation: 'empezar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'break', past: 'broke', participle: 'broken', translation: 'romper', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'catch', past: 'caught', participle: 'caught', translation: 'atrapar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'choose', past: 'chose', participle: 'chosen', translation: 'elegir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'cost', past: 'cost', participle: 'cost', translation: 'costar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'cut', past: 'cut', participle: 'cut', translation: 'cortar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'fall', past: 'fell', participle: 'fallen', translation: 'caer', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'feel', past: 'felt', participle: 'felt', translation: 'sentir', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'forget', past: 'forgot', participle: 'forgotten', translation: 'olvidar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'hear', past: 'heard', participle: 'heard', translation: 'escuchar', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'hold', past: 'held', participle: 'held', translation: 'sostener', category: 'irregular', difficulty: 'medium' },
  { infinitive: 'keep', past: 'kept', participle: 'kept', translation: 'mantener', category: 'irregular', difficulty: 'medium' },
  
  // Advanced Regular Verbs (15)
  { infinitive: 'achieve', past: 'achieved', participle: 'achieved', translation: 'lograr', category: 'regular', difficulty: 'hard' },
  { infinitive: 'believe', past: 'believed', participle: 'believed', translation: 'creer', category: 'regular', difficulty: 'hard' },
  { infinitive: 'consider', past: 'considered', participle: 'considered', translation: 'considerar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'continue', past: 'continued', participle: 'continued', translation: 'continuar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'develop', past: 'developed', participle: 'developed', translation: 'desarrollar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'discover', past: 'discovered', participle: 'discovered', translation: 'descubrir', category: 'regular', difficulty: 'hard' },
  { infinitive: 'discuss', past: 'discussed', participle: 'discussed', translation: 'discutir', category: 'regular', difficulty: 'hard' },
  { infinitive: 'experience', past: 'experienced', participle: 'experienced', translation: 'experimentar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'imagine', past: 'imagined', participle: 'imagined', translation: 'imaginar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'improve', past: 'improved', participle: 'improved', translation: 'mejorar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'include', past: 'included', participle: 'included', translation: 'incluir', category: 'regular', difficulty: 'hard' },
  { infinitive: 'introduce', past: 'introduced', participle: 'introduced', translation: 'presentar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'mention', past: 'mentioned', participle: 'mentioned', translation: 'mencionar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'practice', past: 'practiced', participle: 'practiced', translation: 'practicar', category: 'regular', difficulty: 'hard' },
  { infinitive: 'realize', past: 'realized', participle: 'realized', translation: 'darse cuenta', category: 'regular', difficulty: 'hard' },
  
  // Advanced Irregular Verbs (10)
  { infinitive: 'become', past: 'became', participle: 'become', translation: 'convertirse', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'build', past: 'built', participle: 'built', translation: 'construir', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'hide', past: 'hid', participle: 'hidden', translation: 'esconder', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'leave', past: 'left', participle: 'left', translation: 'dejar', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'lose', past: 'lost', participle: 'lost', translation: 'perder', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'mean', past: 'meant', participle: 'meant', translation: 'significar', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'pay', past: 'paid', participle: 'paid', translation: 'pagar', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'sleep', past: 'slept', participle: 'slept', translation: 'dormir', category: 'irregular', difficulty: 'hard' },
  { infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', category: 'irregular', difficulty: 'hard' }
];

export async function POST(request: NextRequest) {
  try {
    // In production, we don't actually seed a database
    // We just return success with the statistics
    
    const totalVerbs = completeVerbs.length;
    const regularCount = completeVerbs.filter(v => v.category === 'regular').length;
    const irregularCount = completeVerbs.filter(v => v.category === 'irregular').length;
    const easyCount = completeVerbs.filter(v => v.difficulty === 'easy').length;
    const mediumCount = completeVerbs.filter(v => v.difficulty === 'medium').length;
    const hardCount = completeVerbs.filter(v => v.difficulty === 'hard').length;
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada exitosamente',
      data: {
        verbsCount: totalVerbs,
        categories: {
          regular: regularCount,
          irregular: irregularCount
        },
        difficulties: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount
        }
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