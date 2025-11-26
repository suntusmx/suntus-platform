@echo off
REM Script para limpiar TODAS las cachés de Metro y Expo en Windows
REM Metro es como una novia tóxica: se acuerda de todo

echo Limpiando cachés de Metro y Expo...

REM Cachés locales de cada app
if exist apps\suntus-app\.expo rmdir /s /q apps\suntus-app\.expo
if exist apps\suntus-app\node_modules\.cache rmdir /s /q apps\suntus-app\node_modules\.cache
if exist apps\suntus-app\.metro rmdir /s /q apps\suntus-app\.metro
if exist apps\suntus-pro\.expo rmdir /s /q apps\suntus-pro\.expo
if exist apps\suntus-pro\node_modules\.cache rmdir /s /q apps\suntus-pro\node_modules\.cache
if exist apps\suntus-pro\.metro rmdir /s /q apps\suntus-pro\.metro

REM Cachés del workspace
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .expo rmdir /s /q .expo
if exist .metro rmdir /s /q .metro

REM Cachés de pnpm
if exist node_modules\.pnpm\.cache rmdir /s /q node_modules\.pnpm\.cache

echo Cachés limpiadas. Ahora ejecuta: pnpm install
