import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const VERBS_DATA = [
  // Regular Verbs - Easy
  { infinitive: 'play', past: 'played', participle: 'played', translation: 'jugar', spanish: 'jugar', french: 'jouer', german: 'spielen', italian: 'giocare', portuguese: 'jogar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 95 },
  { infinitive: 'walk', past: 'walked', participle: 'walked', translation: 'caminar', spanish: 'caminar', french: 'marcher', german: 'gehen', italian: 'camminare', portuguese: 'caminhar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 88 },
  { infinitive: 'talk', past: 'talked', participle: 'talked', translation: 'hablar', spanish: 'hablar', french: 'parler', german: 'sprechen', italian: 'parlare', portuguese: 'falar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 92 },
  { infinitive: 'work', past: 'worked', participle: 'worked', translation: 'trabajar', spanish: 'trabajar', french: 'travailler', german: 'arbeiten', italian: 'lavorare', portuguese: 'trabalhar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 90 },
  { infinitive: 'study', past: 'studied', participle: 'studied', translation: 'estudiar', spanish: 'estudiar', french: 'étudier', german: 'studieren', italian: 'studiare', portuguese: 'estudar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 85 },
  { infinitive: 'cook', past: 'cooked', participle: 'cooked', translation: 'cocinar', spanish: 'cocinar', french: 'cuisiner', german: 'kochen', italian: 'cucinare', portuguese: 'cozinhar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 78 },
  { infinitive: 'clean', past: 'cleaned', participle: 'cleaned', translation: 'limpiar', spanish: 'limpiar', french: 'nettoyer', german: 'putzen', italian: 'pulire', portuguese: 'limpar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 75 },
  { infinitive: 'watch', past: 'watched', participle: 'watched', translation: 'ver/mirar', spanish: 'ver', french: 'regarder', german: 'ansehen', italian: 'guardare', portuguese: 'assistir', category: 'regular', difficulty: 'easy', type: 'action', frequency: 87 },
  { infinitive: 'listen', past: 'listened', participle: 'listened', translation: 'escuchar', spanish: 'escuchar', french: 'écouter', german: 'zuhören', italian: 'ascoltare', portuguese: 'ouvir', category: 'regular', difficulty: 'easy', type: 'action', frequency: 83 },
  { infinitive: 'dance', past: 'danced', participle: 'danced', translation: 'bailar', spanish: 'bailar', french: 'danser', german: 'tanzen', italian: 'ballare', portuguese: 'dançar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 70 },

  // Regular Verbs - Medium
  { infinitive: 'visit', past: 'visited', participle: 'visited', translation: 'visitar', spanish: 'visitar', french: 'visiter', german: 'besuchen', italian: 'visitare', portuguese: 'visitar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 72 },
  { infinitive: 'travel', past: 'traveled', participle: 'traveled', translation: 'viajar', spanish: 'viajar', french: 'voyager', german: 'reisen', italian: 'viaggiare', portuguese: 'viajar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 76 },
  { infinitive: 'exercise', past: 'exercised', participle: 'exercised', translation: 'hacer ejercicio', spanish: 'hacer ejercicio', french: 'faire de l\'exercice', german: 'trainieren', italian: 'fare esercizio', portuguese: 'fazer exercício', category: 'regular', difficulty: 'medium', type: 'action', frequency: 65 },
  { infinitive: 'paint', past: 'painted', participle: 'painted', translation: 'pintar', spanish: 'pintar', french: 'peindre', german: 'malen', italian: 'dipingere', portuguese: 'pintar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 60 },
  { infinitive: 'write', past: 'wrote', participle: 'written', translation: 'escribir', spanish: 'escribir', french: 'écrire', german: 'schreiben', italian: 'scrivere', portuguese: 'escrever', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 82 },
  { infinitive: 'read', past: 'read', participle: 'read', translation: 'leer', spanish: 'leer', french: 'lire', german: 'lesen', italian: 'leggere', portuguese: 'ler', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 80 },
  { infinitive: 'swim', past: 'swam', participle: 'swum', translation: 'nadar', spanish: 'nadar', french: 'nager', german: 'schwimmen', italian: 'nuotare', portuguese: 'nadar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 68 },
  { infinitive: 'run', past: 'ran', participle: 'run', translation: 'correr', spanish: 'correr', french: 'courir', german: 'rennen', italian: 'correre', portuguese: 'correr', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 77 },
  { infinitive: 'sing', past: 'sang', participle: 'sung', translation: 'cantar', spanish: 'cantar', french: 'chanter', german: 'singen', italian: 'cantare', portuguese: 'cantar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 71 },
  { infinitive: 'sleep', past: 'slept', participle: 'slept', translation: 'dormir', spanish: 'dormir', french: 'dormir', german: 'schlafen', italian: 'dormire', portuguese: 'dormir', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 86 },

  // Irregular Verbs - Medium
  { infinitive: 'eat', past: 'ate', participle: 'eaten', translation: 'comer', spanish: 'comer', french: 'manger', german: 'essen', italian: 'mangiare', portuguese: 'comer', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 94 },
  { infinitive: 'drink', past: 'drank', participle: 'drunk', translation: 'beber', spanish: 'beber', french: 'boire', german: 'trinken', italian: 'bere', portuguese: 'beber', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 89 },
  { infinitive: 'drive', past: 'drove', participle: 'driven', translation: 'conducir', spanish: 'conducir', french: 'conduire', german: 'fahren', italian: 'guidare', portuguese: 'dirigir', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 73 },
  { infinitive: 'fly', past: 'flew', participle: 'flown', translation: 'volar', spanish: 'volar', french: 'voler', german: 'fliegen', italian: 'volare', portuguese: 'voar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 62 },
  { infinitive: 'give', past: 'gave', participle: 'given', translation: 'dar', spanish: 'dar', french: 'donner', german: 'geben', italian: 'dare', portuguese: 'dar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 91 },
  { infinitive: 'take', past: 'took', participle: 'taken', translation: 'tomar', spanish: 'tomar', french: 'prendre', german: 'nehmen', italian: 'prendere', portuguese: 'pegar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 93 },
  { infinitive: 'make', past: 'made', participle: 'made', translation: 'hacer', spanish: 'hacer', french: 'faire', german: 'machen', italian: 'fare', portuguese: 'fazer', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 96 },
  { infinitive: 'come', past: 'came', participle: 'come', translation: 'venir', spanish: 'venir', french: 'venir', german: 'kommen', italian: 'venire', portuguese: 'vir', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 90 },
  { infinitive: 'go', past: 'went', participle: 'gone', translation: 'ir', spanish: 'ir', french: 'aller', german: 'gehen', italian: 'andare', portuguese: 'ir', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 98 },
  { infinitive: 'see', past: 'saw', participle: 'seen', translation: 'ver', spanish: 'ver', french: 'voir', german: 'sehen', italian: 'vedere', portuguese: 'ver', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 95 },

  // Irregular Verbs - Hard
  { infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', spanish: 'ser/estar', french: 'être', german: 'sein', italian: 'essere', portuguese: 'ser/estar', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 100 },
  { infinitive: 'have', past: 'had', participle: 'had', translation: 'tener', spanish: 'tener', french: 'avoir', german: 'haben', italian: 'avere', portuguese: 'ter', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 99 },
  { infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', spanish: 'hacer', french: 'faire', german: 'tun', italian: 'fare', portuguese: 'fazer', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 97 },
  { infinitive: 'say', past: 'said', participle: 'said', translation: 'decir', spanish: 'decir', french: 'dire', german: 'sagen', italian: 'dire', portuguese: 'dizer', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 94 },
  { infinitive: 'tell', past: 'told', participle: 'told', translation: 'contar', spanish: 'contar', french: 'raconter', german: 'erzählen', italian: 'raccontare', portuguese: 'contar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 88 },
  { infinitive: 'think', past: 'thought', participle: 'thought', translation: 'pensar', spanish: 'pensar', french: 'penser', german: 'denken', italian: 'pensare', portuguese: 'pensar', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 92 },
  { infinitive: 'know', past: 'knew', participle: 'known', translation: 'saber', spanish: 'saber', french: 'savoir', german: 'wissen', italian: 'sapere', portuguese: 'saber', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 91 },
  { infinitive: 'get', past: 'got', participle: 'gotten', translation: 'obtener', spanish: 'obtener', french: 'obtenir', german: 'bekommen', italian: 'ottenere', portuguese: 'obter', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 95 },
  { infinitive: 'become', past: 'became', participle: 'become', translation: 'llegar a ser', spanish: 'llegar a ser', french: 'devenir', german: 'werden', italian: 'diventare', portuguese: 'tornar-se', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 84 },
  { infinitive: 'leave', past: 'left', participle: 'left', translation: 'dejar/salir', spanish: 'dejar', french: 'partir', german: 'verlassen', italian: 'lasciare', portuguese: 'deixar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 87 },

  // Modal Verbs
  { infinitive: 'can', past: 'could', participle: 'could', translation: 'poder', spanish: 'poder', french: 'pouvoir', german: 'können', italian: 'potere', portuguese: 'poder', category: 'irregular', difficulty: 'hard', type: 'modal', frequency: 93 },
  { infinitive: 'will', past: 'would', participle: 'would', translation: 'querer/futuro', spanish: 'querer', french: 'vouloir', german: 'wollen', italian: 'volere', portuguese: 'querer', category: 'irregular', difficulty: 'hard', type: 'modal', frequency: 89 },
  { infinitive: 'shall', past: 'should', participle: 'should', translation: 'deber', spanish: 'deber', french: 'devoir', german: 'sollen', italian: 'dovere', portuguese: 'dever', category: 'irregular', difficulty: 'hard', type: 'modal', frequency: 67 },
  { infinitive: 'may', past: 'might', participle: 'might', translation: 'poder', spanish: 'poder', french: 'pouvoir', german: 'dürfen', italian: 'potere', portuguese: 'poder', category: 'irregular', difficulty: 'hard', type: 'modal', frequency: 71 },
  { infinitive: 'must', past: 'must', participle: 'must', translation: 'deber', spanish: 'deber', french: 'devoir', german: 'müssen', italian: 'dovere', portuguese: 'dever', category: 'irregular', difficulty: 'hard', type: 'modal', frequency: 79 },

  // Auxiliary Verbs
  { infinitive: 'be', past: 'was/were', participle: 'been', translation: 'ser/estar', spanish: 'ser/estar', french: 'être', german: 'sein', italian: 'essere', portuguese: 'ser/estar', category: 'irregular', difficulty: 'hard', type: 'auxiliary', frequency: 100 },
  { infinitive: 'have', past: 'had', participle: 'had', translation: 'tener', spanish: 'tener', french: 'avoir', german: 'haben', italian: 'avere', portuguese: 'ter', category: 'irregular', difficulty: 'hard', type: 'auxiliary', frequency: 99 },
  { infinitive: 'do', past: 'did', participle: 'done', translation: 'hacer', spanish: 'hacer', french: 'faire', german: 'tun', italian: 'fare', portuguese: 'fazer', category: 'irregular', difficulty: 'hard', type: 'auxiliary', frequency: 97 },

  // More Regular Verbs - Different Categories
  { infinitive: 'jump', past: 'jumped', participle: 'jumped', translation: 'saltar', spanish: 'saltar', french: 'sauter', german: 'springen', italian: 'saltare', portuguese: 'pular', category: 'regular', difficulty: 'easy', type: 'action', frequency: 66 },
  { infinitive: 'laugh', past: 'laughed', participle: 'laughed', translation: 'reír', spanish: 'reír', french: 'rire', german: 'lachen', italian: 'ridere', portuguese: 'rir', category: 'regular', difficulty: 'easy', type: 'action', frequency: 74 },
  { infinitive: 'cry', past: 'cried', participle: 'cried', translation: 'llorar', spanish: 'llorar', french: 'pleurer', german: 'weinen', italian: 'piangere', portuguese: 'chorar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 69 },
  { infinitive: 'smile', past: 'smiled', participle: 'smiled', translation: 'sonreír', spanish: 'sonreír', french: 'sourire', german: 'lächeln', italian: 'sorridere', portuguese: 'sorrir', category: 'regular', difficulty: 'easy', type: 'action', frequency: 77 },
  { infinitive: 'open', past: 'opened', participle: 'opened', translation: 'abrir', spanish: 'abrir', french: 'ouvrir', german: 'öffnen', italian: 'aprire', portuguese: 'abrir', category: 'regular', difficulty: 'easy', type: 'action', frequency: 81 },
  { infinitive: 'close', past: 'closed', participle: 'closed', translation: 'cerrar', spanish: 'cerrar', french: 'fermer', german: 'schließen', italian: 'chiudere', portuguese: 'fechar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 80 },
  { infinitive: 'start', past: 'started', participle: 'started', translation: 'empezar', spanish: 'empezar', french: 'commencer', german: 'starten', italian: 'iniziare', portuguese: 'começar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 85 },
  { infinitive: 'finish', past: 'finished', participle: 'finished', translation: 'terminar', spanish: 'terminar', french: 'finir', german: 'beenden', italian: 'finire', portuguese: 'terminar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 83 },
  { infinitive: 'stop', past: 'stopped', participle: 'stopped', translation: 'parar', spanish: 'parar', french: 'arrêter', german: 'stoppen', italian: 'fermare', portuguese: 'parar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 86 },
  { infinitive: 'turn', past: 'turned', participle: 'turned', translation: 'girar', spanish: 'girar', french: 'tourner', german: 'drehen', italian: 'girare', portuguese: 'girar', category: 'regular', difficulty: 'easy', type: 'action', frequency: 78 },

  // More Irregular Verbs - Animals Theme
  { infinitive: 'bite', past: 'bit', participle: 'bitten', translation: 'morder', spanish: 'morder', french: 'mordre', german: 'beißen', italian: 'mordere', portuguese: 'morder', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 56 },
  { infinitive: 'hide', past: 'hid', participle: 'hidden', translation: 'esconder', spanish: 'esconder', french: 'cacher', german: 'verstecken', italian: 'nascondere', portuguese: 'esconder', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 64 },
  { infinitive: 'fight', past: 'fought', participle: 'fought', translation: 'pelear', spanish: 'pelear', french: 'se battre', german: 'kämpfen', italian: 'combattere', portuguese: 'lutar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 72 },
  { infinitive: 'catch', past: 'caught', participle: 'caught', translation: 'atrapar', spanish: 'atrapar', french: 'attraper', german: 'fangen', italian: 'catturare', portuguese: 'pegar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 76 },
  { infinitive: 'teach', past: 'taught', participle: 'taught', translation: 'enseñar', spanish: 'enseñar', french: 'enseigner', german: 'lehren', italian: 'insegnare', portuguese: 'ensinar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 68 },
  { infinitive: 'buy', past: 'bought', participle: 'bought', translation: 'comprar', spanish: 'comprar', french: 'acheter', german: 'kaufen', italian: 'comprare', portuguese: 'comprar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 82 },
  { infinitive: 'bring', past: 'brought', participle: 'brought', translation: 'traer', spanish: 'traer', french: 'apporter', german: 'bringen', italian: 'portare', portuguese: 'trazer', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 84 },
  { infinitive: 'sell', past: 'sold', participle: 'sold', translation: 'vender', spanish: 'vender', french: 'vendre', german: 'verkaufen', italian: 'vendere', portuguese: 'vender', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 75 },
  { infinitive: 'pay', past: 'paid', participle: 'paid', translation: 'pagar', spanish: 'pagar', french: 'payer', german: 'bezahlen', italian: 'pagare', portuguese: 'pagar', category: 'irregular', difficulty: 'hard', type: 'action', frequency: 88 },
  { infinitive: 'cost', past: 'cost', participle: 'cost', translation: 'costar', spanish: 'costar', french: 'coûter', german: 'kosten', italian: 'costare', portuguese: 'custar', category: 'irregular', difficulty: 'hard', type: 'state', frequency: 70 },

  // Food Theme Verbs
  { infinitive: 'bake', past: 'baked', participle: 'baked', translation: 'hornear', spanish: 'hornear', french: 'cuire au four', german: 'backen', italian: 'cuocere', portuguese: 'assar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 58 },
  { infinitive: 'fry', past: 'fried', participle: 'fried', translation: 'freír', spanish: 'freír', french: 'frire', german: 'braten', italian: 'friggere', portuguese: 'fritar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 61 },
  { infinitive: 'boil', past: 'boiled', participle: 'boiled', translation: 'hervir', spanish: 'hervir', french: 'bouillir', german: 'kochen', italian: 'bollire', portuguese: 'ferver', category: 'regular', difficulty: 'medium', type: 'action', frequency: 59 },
  { infinitive: 'chop', past: 'chopped', participle: 'chopped', translation: 'cortar', spanish: 'cortar', french: 'hacher', german: 'hacken', italian: 'tritare', portuguese: 'picar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 55 },
  { infinitive: 'mix', past: 'mixed', participle: 'mixed', translation: 'mezclar', spanish: 'mezclar', french: 'mélanger', german: 'mischen', italian: 'mescolare', portuguese: 'misturar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 63 },
  { infinitive: 'serve', past: 'served', participle: 'served', translation: 'servir', spanish: 'servir', french: 'servir', german: 'servieren', italian: 'servire', portuguese: 'servir', category: 'regular', difficulty: 'medium', type: 'action', frequency: 67 },
  { infinitive: 'taste', past: 'tasted', participle: 'tasted', translation: 'probar', spanish: 'probar', french: 'goûter', german: 'kosten', italian: 'assaggiare', portuguese: 'provar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 73 },
  { infinitive: 'smell', past: 'smelled', participle: 'smelled', translation: 'oler', spanish: 'oler', french: 'sentir', german: 'riechen', italian: 'sentire', portuguese: 'cheirar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 65 },
  { infinitive: 'chew', past: 'chewed', participle: 'chewed', translation: 'masticar', spanish: 'masticar', french: 'mâcher', german: 'kauen', italian: 'masticare', portuguese: 'mastigar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 57 },
  { infinitive: 'swallow', past: 'swallowed', participle: 'swallowed', translation: 'tragar', spanish: 'tragar', french: 'avaler', german: 'schlucken', italian: 'deglutire', portuguese: 'engolir', category: 'regular', difficulty: 'medium', type: 'action', frequency: 60 },

  // Travel Theme Verbs
  { infinitive: 'explore', past: 'explored', participle: 'explored', translation: 'explorar', spanish: 'explorar', french: 'explorer', german: 'erforschen', italian: 'esplorare', portuguese: 'explorar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 64 },
  { infinitive: 'discover', past: 'discovered', participle: 'discovered', translation: 'descubrir', spanish: 'descubrir', french: 'découvrir', german: 'entdecken', italian: 'scoprire', portuguese: 'descobrir', category: 'regular', difficulty: 'medium', type: 'action', frequency: 71 },
  { infinitive: 'adventure', past: 'adventured', participle: 'adventured', translation: 'aventurar', spanish: 'aventurar', french: 'aventurer', german: 'abenteuern', italian: 'avventurarsi', portuguese: 'aventurar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 52 },
  { infinitive: 'navigate', past: 'navigated', participle: 'navigated', translation: 'navegar', spanish: 'navegar', french: 'naviguer', german: 'navigieren', italian: 'navigare', portuguese: 'navegar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 54 },
  { infinitive: 'climb', past: 'climbed', participle: 'climbed', translation: 'escalar', spanish: 'escalar', french: 'grimper', german: 'klettern', italian: 'arrampicarsi', portuguese: 'escalar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 66 },
  { infinitive: 'camp', past: 'camped', participle: 'camped', translation: 'acampar', spanish: 'acampar', french: 'camper', german: 'cAMPen', italian: 'campeggiare', portuguese: 'acampar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 53 },
  { infinitive: 'hike', past: 'hiked', participle: 'hiked', translation: 'hacer senderismo', spanish: 'hacer senderismo', french: 'randonner', german: 'wandern', italian: 'fare escursioni', portuguese: 'caminhar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 58 },
  { infinitive: 'sail', past: 'sailed', participle: 'sailed', translation: 'navegar', spanish: 'navegar', french: 'naviguer', german: 'segeln', italian: 'vegliare', portuguese: 'navegar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 51 },
  { infinitive: 'dive', past: 'dived', participle: 'dived', translation: 'bucear', spanish: 'bucear', french: 'plonger', german: 'tauchen', italian: 'tuffare', portuguese: 'mergulhar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 49 },
  { infinitive: 'surf', past: 'surfed', participle: 'surfed', translation: 'hacer surf', spanish: 'hacer surf', french: 'faire du surf', german: 'surfen', italian: 'fare surf', portuguese: 'fazer surf', category: 'regular', difficulty: 'medium', type: 'action', frequency: 47 },

  // Nature Theme Verbs
  { infinitive: 'grow', past: 'grew', participle: 'grown', translation: 'crecer', spanish: 'crecer', french: 'grandir', german: 'wachsen', italian: 'crescere', portuguese: 'crescer', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 79 },
  { infinitive: 'bloom', past: 'bloomed', participle: 'bloomed', translation: 'florecer', spanish: 'florecer', french: 'fleurir', german: 'blühen', italian: 'fiorire', portuguese: 'florescer', category: 'regular', difficulty: 'medium', type: 'action', frequency: 48 },
  { infinitive: 'shine', past: 'shone', participle: 'shone', translation: 'brillar', spanish: 'brillar', french: 'briller', german: 'scheinen', italian: 'splendere', portuguese: 'brilhar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 74 },
  { infinitive: 'rain', past: 'rained', participle: 'rained', translation: 'llover', spanish: 'llover', french: 'pleuvoir', german: 'regnen', italian: 'piovere', portuguese: 'chover', category: 'regular', difficulty: 'medium', type: 'action', frequency: 76 },
  { infinitive: 'snow', past: 'snowed', participle: 'snowed', translation: 'nevar', spanish: 'nevar', french: 'neiger', german: 'schneien', italian: 'nevicare', portuguese: 'nevar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 62 },
  { infinitive: 'wind', past: 'winded', participle: 'winded', translation: 'soplar', spanish: 'soplar', french: 'souffler', german: 'wehen', italian: 'soffiare', portuguese: 'soprar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 54 },
  { infinitive: 'storm', past: 'stormed', participle: 'stormed', translation: 'tormentar', spanish: 'tormentar', french: 'tempêter', german: 'stürmen', italian: 'tempestare', portuguese: 'tempestuar', category: 'regular', difficulty: 'medium', type: 'action', frequency: 46 },
  { infinitive: 'freeze', past: 'froze', participle: 'frozen', translation: 'helar', spanish: 'helar', french: 'geler', german: 'frieren', italian: 'gelare', portuguese: 'gelar', category: 'irregular', difficulty: 'medium', type: 'action', frequency: 59 },
  { infinitive: 'melt', past: 'melted', participle: 'melted', translation: 'derretir', spanish: 'derretir', french: 'fondre', german: 'schmelzen', italian: 'sciogliere', portuguese: 'derreter', category: 'regular', difficulty: 'medium', type: 'action', frequency: 57 },
  { infinitive: 'flow', past: 'flowed', participle: 'flowed', translation: 'fluir', spanish: 'fluir', french: 'couler', german: 'fließen', italian: 'scorrere', portuguese: 'fluir', category: 'regular', difficulty: 'medium', type: 'action', frequency: 61 }
]

export async function POST(request: NextRequest) {
  try {
    console.log('Starting verbs seeding with expanded dataset...')
    
    // Clear existing verbs
    await db.verb.deleteMany()
    console.log('Cleared existing verbs')
    
    // Insert new verbs with all the additional data
    const verbs = await db.verb.createMany({
      data: VERBS_DATA
    })
    
    console.log(`Successfully created ${verbs.count} verbs`)
    
    return NextResponse.json({ 
      message: 'Verbs seeded successfully',
      count: verbs.count,
      categories: ['regular', 'irregular'],
      difficulties: ['easy', 'medium', 'hard'],
      types: ['action', 'state', 'modal', 'auxiliary'],
      themes: ['basic', 'animals', 'food', 'travel', 'nature']
    })
  } catch (error) {
    console.error('Error seeding verbs:', error)
    return NextResponse.json(
      { error: 'Failed to seed verbs' },
      { status: 500 }
    )
  }
}