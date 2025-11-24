# Script PowerShell para eliminar todos los node_modules
Write-Host "Eliminando node_modules..." -ForegroundColor Yellow

$directories = @(
    "node_modules",
    "apps\suntus-app\node_modules",
    "apps\suntus-pro\node_modules",
    "apps\suntus-core\node_modules",
    "apps\suntus-landing\node_modules",
    "apps\suntus-services\node_modules",
    "packages\core\node_modules",
    "packages\ui\node_modules",
    "packages\config\node_modules"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "Eliminando $dir..." -ForegroundColor Cyan
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if (Test-Path "pnpm-lock.yaml") {
    Write-Host "Eliminando pnpm-lock.yaml..." -ForegroundColor Cyan
    Remove-Item -Path "pnpm-lock.yaml" -Force
}

Write-Host "`n¡Limpieza completada! Ahora ejecuta: pnpm install" -ForegroundColor Green

