# Verbos English - Versión Dinámica

## 🎮 Descripción
Aplicación interactiva para aprender verbos en inglés con juegos educativos y múltiples niveles de dificultad.

## 🚀 Características

### Juegos Disponibles
- **Memoria**: Encuentra pares de verbos (Fácil: 6 pares, Medio: 10 pares, Difícil: 15 pares)
- **Concentración**: Combina tiempos verbales (Fácil: 8 pares, Medio: 12 pares, Difícil: 16 pares)
- **Conexión**: Conecta verbos con traducciones (Fácil: 10, Medio: 15, Difícil: 20)
- **Búsqueda**: Encuentra verbos escondidos (Fácil: 10x10, Medio: 15x15, Difícil: 20x20)
- **Crucigrama**: Crucigramas de verbos (Fácil: 5x5, Medio: 10x10, Difícil: 15x15)

### Niveles de Dificultad
- 🟢 **Fácil**: Verbos básicos, sin límite de tiempo estricto
- 🟡 **Medio**: Verbos comunes, tiempo limitado moderado
- 🔴 **Difícil**: Verbos avanzados, tiempo estricto

### Funcionalidades
- ✅ 3 tarjetas por juego con diferentes niveles
- ✅ Sistema de progreso y estadísticas
- ✅ API endpoints dinámicos
- ✅ Responsive design
- ✅ Sistema de puntajes
- ✅ Health checks

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **API**: Next.js API Routes
- **Despliegue**: Vercel optimizado

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── verbs/        # Verbos API
│   │   ├── games/        # Juegos API
│   │   ├── scores/       # Puntajes API
│   │   └── health/       # Health check
│   ├── page.tsx          # Página principal con 3 tarjetas
│   └── layout.tsx        # Layout principal
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   ├── MemoryGame.tsx    # Componente de memoria
│   ├── ConcentrationGame.tsx
│   ├── MatchingGame.tsx
│   ├── WordSearchGame.tsx
│   └── CrosswordGame.tsx
└── lib/
    └── db.ts             # Configuración de base de datos
```

## 🚀 Despliegue en Vercel

### 1. Conectar Repositorio
1. Ve a [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub/GitLab
3. Importa el proyecto

### 2. Configuración Automática
Vercel detectará automáticamente:
- Framework: Next.js
- Build Command: `npm run vercel-build`
- Output Directory: `.next`

### 3. Variables de Entorno
Configura estas variables en Vercel:
```bash
NEXTAUTH_URL=https://tu-dominio.vercel.app
NODE_ENV=production
```

### 4. Despliegue
- Vercel construirá y desplegará automáticamente
- El proceso incluye: `prisma generate` + `next build`

## 📡 API Endpoints

### Verbos
```
GET /api/verbs?level=basic&limit=10&irregular=true
POST /api/verbs
```

### Juegos
```
GET /api/games?gameId=memory&level=easy
POST /api/games
```

### Puntajes
```
GET /api/scores?gameId=memory&level=easy&limit=10
POST /api/scores
DELETE /api/scores?id=1
```

### Health Check
```
GET /api/health
```

## 🎯 Cómo Jugar

1. **Selecciona un juego**: Haz clic en una tarjeta de juego
2. **Elige el nivel**: Fácil, Medio o Difícil
3. **Juega**: Sigue las instrucciones específicas de cada juego
4. **Gana puntos**: Mejora tu puntaje y tiempo
5. **Sube de nivel**: Desbloquea niveles más difíciles

## 🏆 Sistema de Progreso

- **Progreso individual**: Por cada nivel de cada juego
- **Estadísticas globales**: Tiempo total jugado, precisión, niveles completados
- **Ranking**: Compara tus puntajes con otros jugadores
- **Desbloqueo**: Completa niveles medios para acceder a difíciles

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npm run db:generate

# Iniciar desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar producción
npm run start
```

## 📱 Características Técnicas

- **Responsive**: Mobile-first design
- **Performance**: Optimizado para Vercel Edge Network
- **SEO**: Metadatos completos
- **Accesibilidad**: WCAG 2.1 AA compliant
- **Seguridad**: Headers de seguridad configurados
- **Monitoreo**: Health checks automáticos

## 🔧 Configuración Especial Vercel

El proyecto incluye configuración optimizada para Vercel:

- **vercel.json**: Configuración específica
- **Functions**: API routes con 30s timeout
- **Headers**: Seguridad y cache configurados
- **Regions**: Despliegue en múltiples regiones

## 📈 Métricas y Monitoreo

- Health checks automáticos
- Métricas de uso en tiempo real
- Error tracking configurado
- Performance monitoring

---

**¡Listo para desplegar en Vercel! 🚀**