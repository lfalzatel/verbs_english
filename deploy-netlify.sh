#!/bin/bash

# Script para desplegar Verbos English en Netlify

echo "🚀 Preparando despliegue de Verbos English a Netlify..."

# Verificar si Netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo "📦 Instalando Netlify CLI..."
    npm install -g netlify-cli
fi

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir el proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

# Verificar si la construcción fue exitosa
if [ ! -d ".next" ]; then
    echo "❌ Error: La construcción falló. No se encontró el directorio .next"
    exit 1
fi

echo "✅ Construcción completada exitosamente!"

# Preguntar si quiere desplegar ahora
read -p "¿Quieres desplegar a Netlify ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Iniciando despliegue a Netlify..."
    
    # Iniciar sesión en Netlify si no está autenticado
    if ! netlify status &> /dev/null; then
        echo "🔐 Por favor, inicia sesión en Netlify:"
        netlify login
    fi
    
    # Desplegar
    netlify deploy --prod --dir=.next
else
    echo "💡 Para desplegar manualmente, ejecuta:"
    echo "   netlify deploy --prod --dir=.next"
fi

echo "🎉 Listo! Tu aplicación Verbos English está lista para Netlify."