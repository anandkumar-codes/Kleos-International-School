@echo off
title Kleos School app - Expo
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies, first run only...
  call npm.cmd install
)
echo.
echo Scan the QR code with the Expo Go app on your phone.
echo Press w to open it in a browser. Close this window to stop.
echo.
call npx.cmd expo start
pause
