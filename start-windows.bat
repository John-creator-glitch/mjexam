@echo off
setlocal
cd /d "%~dp0"

REM PF Exam Preparation Portal - Windows launcher
set "SESSION_SECRET=pf-portal-secret-key-change-this-to-something-long-12345"
set "TEACHER_PASSWORD=teacher123"
set "STUDENT_CODE=pf2026"
set "ANTHROPIC_API_KEY="
set "MODEL=claude-sonnet-5-5"

if not exist "server.js" (
  echo ERROR: server.js was not found in:
  echo %CD%
  pause
  exit /b 1
)

if not exist "node_modules\express" (
  echo Installing required packages...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Please copy the error above.
    pause
    exit /b 1
  )
)

echo.
echo Starting PF Exam Preparation Portal...
echo Project: %CD%
echo Open http://localhost:3000 when you see the listening message.
echo.
call npm start
pause
