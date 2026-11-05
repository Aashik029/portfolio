@echo off
REM AASHIK — Portfolio launcher. Serves the folder on http://localhost:8347 and opens your browser.
setlocal
cd /d "%~dp0"

if not exist "index.html" (
  echo [ERROR] index.html not found. Run this from the portfolio folder.
  pause
  exit /b 1
)

REM If something is already serving on 8347, just open it.
powershell -NoProfile -Command "try { (New-Object Net.Sockets.TcpClient('127.0.0.1',8347)).Close(); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel%==0 (
  echo AASHIK portfolio is already running on http://localhost:8347/
  start "" "http://localhost:8347/"
  exit /b 0
)

where node >nul 2>&1
if %errorlevel%==0 (
  echo Starting AASHIK portfolio on http://localhost:8347 ...
  node serve.js
  echo.
  echo Server stopped. Press any key to close.
  pause >nul
  exit /b 0
)

where python >nul 2>&1
if %errorlevel%==0 (
  echo Node not found; using Python on http://localhost:8347 ...
  start "" "http://localhost:8347/"
  python -m http.server 8347 --bind 127.0.0.1
  echo.
  echo Server stopped. Press any key to close.
  pause >nul
  exit /b 0
)

echo [ERROR] Neither Node.js nor Python is available.
echo Install one of them, or serve this folder with any static host.
pause
exit /b 1