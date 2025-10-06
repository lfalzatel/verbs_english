# Guía de Despliegue: Verbos English en Netlify

## 🚀 Preparación del Proyecto

Tu proyecto Verbos English ya está configurado para despliegue en Netlify con los siguientes archivos:

- `netlify.toml` - Configuración de construcción y redirecciones
- `package.json` - Scripts de construcción ya configurados
- `.env.production` - Variables de entorno para producción

## 📋 Requisitos Previos

1. **Cuenta en Netlify** - Crea una cuenta gratuita en [netlify.com](https://netlify.com)
2. **Repositorio Git** - Sube tu código a GitHub, GitLab o Bitbucket
3. **Netlify CLI** (opcional) - Para despliegue desde terminal

## 🌐 Método 1: Despliegue Automático (Recomendado)

### Paso 1: Subir a GitHub

```bash
git init
git add .
git commit -m "Listo para despliegue en Netlify"
git branch -M main
git remote add origin https://github.com/tu-usuario/verbos-english.git
git push -u origin main
```

### Paso 2: Conectar con Netlify

1. Inicia sesión en [Netlify](https://app.netlify.com)
2. Haz clic en "Add new site" → "Import an existing project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `verbos-english`
5. Configura las opciones de construcción:

```
Build command: npm run build
Publish directory: .next
```

### Paso 3: Configurar Variables de Entorno

En Netlify Dashboard → Site settings → Environment variables:

```
NODE_ENV = production
NEXTAUTH_URL = https://tu-dominio.netlify.app
NEXTAUTH_SECRET = tu-secreto-aqui
ZAI_API_KEY = tu-api-key-aqui
```

### Paso 4: Despliegue

Haz clic en "Deploy site" y espera unos minutos.

## 💻 Método 2: Despliegue Manual con Netlify CLI

### Paso 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Paso 2: Construir el Proyecto

```bash
npm run build
```

### Paso 3: Desplegar

```bash
# Iniciar sesión
netlify login

# Desplegar
netlify deploy --prod --dir=.next
```

## ⚠️ Consideraciones Importantes

### Base de Datos

**Netlify no soporta SQLite directamente**. Tu aplicación usa SQLite localmente, pero para producción necesitas:

1. **Opción A: Usar Base de Datos Externa**
   - PlanetScale (MySQL)
   - Supabase (PostgreSQL)
   - MongoDB Atlas

2. **Opción B: Usar Netlify Functions**
   - Mover la lógica de base de datos a funciones serverless
   - Usar base de datos externa

### Modificación para Producción

Debes modificar tu configuración para usar una base de datos externa:

1. Actualiza `prisma/schema.prisma` para usar PostgreSQL/MySQL
2. Cambia `DATABASE_URL` en variables de entorno
3. Actualiza el código de API si es necesario

## 🔧 Configuración Adicional

### Dominio Personalizado

1. En Netlify Dashboard → Domain settings
2. Añade tu dominio personalizado
3. Configura los DNS según las instrucciones de Netlify

### HTTPS

Netlify proporciona HTTPS automáticamente para todos los sitios.

### Formularios y Funciones

Si necesitas funcionalidades del lado del servidor:

1. Crea funciones en el directorio `netlify/functions`
2. Configúralas en `netlify.toml`

## 🚀 Verificación del Despliegue

Una vez desplegado, verifica:

1. ✅ El sitio carga correctamente
2. ✅ Los verbos se muestran sin errores
3. ✅ Los juegos funcionan
4. ✅ La navegación es correcta
5. ✅ Las imágenes y assets cargan

## 🐛 Solución de Problemas

### Error 404

- Verifica las redirecciones en `netlify.toml`
- Asegúrate que el directorio de publicación es `.next`

### Error de Base de Datos

- Configura una base de datos externa
- Verifica las variables de entorno
- Revisa los logs de despliegue

### Problemas con Assets

- Verifica la configuración de `assetPrefix` en `next.config.ts`
- Asegúrate que las imágenes tienen `unoptimized: true`

## 📞 Soporte

- Documentación de Netlify: [docs.netlify.com](https://docs.netlify.com)
- Documentación de Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Soporte de Verbos English: Revisa los issues en GitHub

---

🎉 **¡Felicidades!** Tu aplicación Verbos English está lista para ser usada por estudiantes de inglés en todo el mundo.