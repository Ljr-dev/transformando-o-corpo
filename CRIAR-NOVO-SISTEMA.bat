@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale o Node.js antes de criar um novo sistema.
  pause
  exit /b 1
)

node scripts\create-system.mjs
echo.
pause
