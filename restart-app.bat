@echo off
echo =================================================
echo Restarting UPV Calendar Application
echo =================================================
echo.

echo [1/3] Stopping current application processes...
call stop-app.bat
echo.

echo [2/3] Waiting 3 seconds before starting application...
timeout /t 3 /nobreak >nul

echo [3/3] Starting application...
call start-app.bat
echo.

echo =================================================
echo UPV Calendar Application has been restarted
echo ================================================= 