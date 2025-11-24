#!/bin/bash
# Script Bash para eliminar todos los node_modules

echo "🧹 Eliminando node_modules..."

rm -rf node_modules
rm -rf apps/suntus-app/node_modules
rm -rf apps/suntus-pro/node_modules
rm -rf apps/suntus-core/node_modules
rm -rf apps/suntus-landing/node_modules
rm -rf apps/suntus-services/node_modules
rm -rf packages/core/node_modules
rm -rf packages/ui/node_modules
rm -rf packages/config/node_modules

if [ -f "pnpm-lock.yaml" ]; then
    echo "🗑️  Eliminando pnpm-lock.yaml..."
    rm -f pnpm-lock.yaml
fi

echo "✅ ¡Limpieza completada! Ahora ejecuta: pnpm install"

