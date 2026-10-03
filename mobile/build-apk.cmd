@echo off
setlocal
title Kleos School - build APK
rem Builds an installable Android APK locally and copies it to the School folder.
rem Needs the toolchain in C:\Users\APPLE\Android (JDK 17 + Android SDK).
rem The build runs from C:\kb because Windows path-length limits break React Native's C++ build in long folders.

set "JAVA_HOME=C:\Users\APPLE\Android\jdk-17.0.20.1+1"
set "ANDROID_HOME=C:\Users\APPLE\Android\sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"
set "NODE_ENV=production"
set "SRC=%~dp0"
set "ROOT=%~dp0.."

echo Syncing project to C:\kb ...
robocopy "%ROOT%\src" "C:\kb\src" /MIR /NFL /NDL /NJH /NJS /NP /MT:16 >nul
robocopy "%SRC%." "C:\kb\mobile" /MIR /NFL /NDL /NJH /NJS /NP /MT:16 /XD "%SRC%android\build" "%SRC%android\app\build" "%SRC%android\.gradle" "%SRC%.expo" >nul

echo Building release APK (first build ~15 min, later builds are faster) ...
pushd C:\kb\mobile\android
call gradlew.bat assembleRelease --console=plain
if errorlevel 1 (
  popd
  echo.
  echo BUILD FAILED - see the messages above.
  pause
  exit /b 1
)
popd

copy /Y "C:\kb\mobile\android\app\build\outputs\apk\release\app-release.apk" "%ROOT%\Kleos-School-v1.0.0.apk" >nul
echo.
echo Done: %ROOT%\Kleos-School-v1.0.0.apk
pause
