#!/bin/bash
# Script para limpiar TODAS las cachés de Metro y Expo
# Metro es como una novia tóxica: se acuerda de todo

echo "🧹 Limpiando cachés de Metro y Expo..."

# Cachés locales de cada app
rm -rf apps/suntus-app/.expo
rm -rf apps/suntus-app/node_modules/.cache
rm -rf apps/suntus-app/.metro
rm -rf apps/suntus-pro/.expo
rm -rf apps/suntus-pro/node_modules/.cache
rm -rf apps/suntus-pro/.metro

# Cachés del workspace
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .metro

# Cachés de pnpm
rm -rf node_modules/.pnpm/.cache

# Cachés de watchman (si está instalado)
watchman watch-del-all 2>/dev/null || true

echo "✅ Cachés limpiadas. Ahora ejecuta: pnpm install"
