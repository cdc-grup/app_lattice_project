#!/bin/bash

# --- CONFIGURATION (UPDATE THESE) ---
# Paste your GitHub Runner Token here
RUNNER_TOKEN="TU_TOKEN_AQUI"
REPO_URL="https://github.com/TU_USUARIO/app_lattice_project"
# ------------------------------------

echo "🚀 Iniciando configuración de Circuit Copilot en el servidor..."

# 1. Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instálalo primero."
    exit 1
fi

# 2. Configurar el Runner de GitHub
echo "📦 Configurando GitHub Actions Runner..."
mkdir -p ~/actions-runner && cd ~/actions-runner

if [ ! -f "config.sh" ]; then
    curl -o actions-runner-linux-x64-2.316.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.316.1/actions-runner-linux-x64-2.316.1.tar.gz
    tar xzf ./actions-runner-linux-x64-2.316.1.tar.gz
    
    ./config.sh --url $REPO_URL --token $RUNNER_TOKEN --labels self-hosted --unattended
    
    sudo ./svc.sh install
    sudo ./svc.sh start
    echo "✅ Runner instalado y funcionando como servicio."
else
    echo "ℹ️ El runner ya parece estar configurado."
fi

# 3. Verificar PostGIS en la base de datos local
echo "🔍 Verificando PostGIS..."
# Intentamos detectar si postgres está corriendo localmente
if sudo lsof -i :5432 &> /dev/null; then
    echo "✅ Detectado Postgres en el puerto 5432."
    echo "⚠️ Recuerda ejecutar 'CREATE EXTENSION postgis;' si aún no lo has hecho."
else
    echo "❓ No se detectó Postgres en el puerto local 5432."
    echo "Si tu base de datos está en otro host, asegúrate de que tiene PostGIS."
fi

echo "✨ ¡Configuración básica lista!"
echo "Próximos pasos:"
echo "1. Haz push de los archivos (docker-compose.prod.yml y el workflow) a main."
echo "2. Configura los SECRETOS en GitHub (DATABASE_URL y JWT_SECRET)."
