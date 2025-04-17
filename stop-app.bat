@echo off
echo Stopping UPV Calendar Application...

:: Kill backend server process (Express on port 3000)
echo Stopping Backend Server...
set "backendFound=false"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Found backend process: %%a
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Error stopping backend process %%a.
    ) else (
        echo Backend process %%a stopped successfully.
        set "backendFound=true"
    )
)
if "%backendFound%"=="false" (
    echo No backend process found running on port 3000.
)

:: Kill frontend server process (Angular on port 4200)
echo Stopping Frontend Server...
set "frontendFound=false"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200 ^| findstr LISTENING') do (
    echo Found frontend process: %%a
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Error stopping frontend process %%a.
    ) else (
        echo Frontend process %%a stopped successfully.
        set "frontendFound=true"
    )
)
if "%frontendFound%"=="false" (
    echo No frontend process found running on port 4200.
)

:: Additional safety measure: kill any remaining Node.js processes related to the app
echo Checking for any remaining processes with specific window titles...
taskkill /F /FI "WINDOWTITLE eq UPV Calendar Frontend" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq UPV Calendar Backend" /T >nul 2>&1

echo.
echo UPV Calendar Application has been stopped.
echo You can restart it by running start-app.bat.
echo.
pause 