@echo off
title Kleos International School - dev server
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies, first run only...
  call npm.cmd install
)
echo.
echo Starting Kleos website at http://localhost:5173
echo Close this window to stop the server.
echo.
call npm.cmd run dev
pause
