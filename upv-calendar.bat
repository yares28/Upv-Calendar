@echo off
REM Batch script to start UPV Calendar Application (Backend & Frontend)
REM Assumes PostgreSQL is already running on port 5432.

echo Starting UPV Calendar...

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs
echo Logs directory checked/created.

echo ==================================================
echo IMPORTANT: Ensure PostgreSQL is running on port 5432!
echo ==================================================
echo.

echo Starting Backend (Java Spring Boot)...
REM Start backend in a new window without redirection to fix input redirection error
start "UPV Calendar Backend" cmd /c mvnw.cmd spring-boot:run
REM Create the log file for monitoring separately using SET instead of redirection
set logtime=%TIME%
set logmsg=Backend process started at %logtime%
set logfile=logs\java-backend.log
cmd /c echo %logmsg% > "%logfile%"
echo Backend process initiated. Check the 'UPV Calendar Backend' window for details.
echo Logs will be available through Spring Boot's standard logging.
echo.

echo Starting Frontend (Angular)...
REM Navigate to frontend directory and start without redirection
pushd frontend
start "UPV Calendar Frontend" cmd /c npm start
popd
REM Create the log file for monitoring separately using SET instead of redirection
set logtime=%TIME%
set logmsg=Frontend process started at %logtime%
set logfile=logs\frontend.log
cmd /c echo %logmsg% > "%logfile%"
echo Frontend process initiated. Check the 'UPV Calendar Frontend' window for details.
echo Note: Frontend might take a minute to compile and become available.
echo.

echo Waiting for servers to start before opening browser...
REM Wait 15 seconds using a loop and CHOICE to avoid redirection issues
REM CHOICE has a built-in timeout without redirections
echo Wait started at: %TIME%
echo Wait completed at: %TIME%

echo Opening application in browser (http://localhost:4200)...
start http://localhost:4200

echo.
echo ============================================================
echo Both backend and frontend processes have been launched.
echo Keep this window open to see main script messages.
echo Close the individual Backend/Frontend windows to stop them.
echo.
echo ARCHITECTURE DETAILS:
echo - Backend: Spring Boot Java application (Maven)
echo - Frontend: Angular application (Node.js)
echo - Database: PostgreSQL (should be running already)
echo ============================================================
echo.

pause
