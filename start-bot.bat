@echo off
title Zalo AI Bot - Omnipotent Dashboard & Auto-Research Engine
color 0B
cd /d "%~dp0"
echo ======================================================
echo    🧠 Starting Zalo AI Bot Omnipotent Brain & Dashboard
echo    👉 Web UI: http://localhost:3000
echo    🔬 Continuous Auto-Research Loop: ACTIVE
echo ======================================================
echo.
start http://localhost:3000
node dashboard-server.js
pause
