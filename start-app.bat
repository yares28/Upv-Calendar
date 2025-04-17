@echo off
echo Starting UPV Calendar Application...

:: Create logs directory if it doesn't exist
if not exist logs mkdir logs

:: Check if servers are already running
netstat -ano | findstr :3000 | findstr LISTENING > nul
if %errorlevel% equ 0 (
    echo Backend server is already running on port 3000.
) else (
    :: Start backend server
    echo Starting backend server on port 3000...
    start "UPV Calendar Backend" cmd /c "cd backend && node server.js > ..\logs\backend.log 2>&1"
    timeout /t 2 > nul
    netstat -ano | findstr :3000 | findstr LISTENING > nul
    if %errorlevel% equ 0 (
        echo Backend server started successfully.
    ) else (
        echo Failed to start backend server. Check logs\backend.log for details.
    )
)

:: Check if frontend server is already running
netstat -ano | findstr :4200 | findstr LISTENING > nul
if %errorlevel% equ 0 (
    echo Frontend server is already running on port 4200.
) else (
    :: Start frontend server
    echo Starting frontend server on port 4200...
    start "UPV Calendar Frontend" cmd /c "cd frontend && ng serve > ..\logs\frontend.log 2>&1"
    timeout /t 5 > nul
    netstat -ano | findstr :4200 | findstr LISTENING > nul
    if %errorlevel% equ 0 (
        echo Frontend server started successfully.
    ) else (
        echo Failed to start frontend server. Check logs\frontend.log for details.
    )
)

:: Open application in default browser
echo Opening application in browser...
timeout /t 3 > nul
start http://localhost:4200

echo.
echo UPV Calendar Application started successfully.
echo.
echo To stop the application, run stop-app.bat
echo Logs are available in the logs directory. 