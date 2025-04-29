@echo off
echo UPV Calendar Database Seeder

cd %~dp0
echo.
echo Choose an option:
echo 1. Import sample data
echo 2. Delete all data
echo 3. Import exam data
echo.
set /p option="Enter option (1, 2, or 3): "

if "%option%"=="1" (
  echo.
  echo Importing sample data...
  cd src\utils
  ts-node seeder.ts -i
) else if "%option%"=="2" (
  echo.
  echo Deleting all data...
  cd src\utils
  ts-node seeder.ts -d
) else if "%option%"=="3" (
  echo.
  echo Importing exam data from ETSINFexams.txt...
  npm run import:exams
) else (
  echo.
  echo Invalid option. Please run again and select 1, 2, or 3.
)

echo.
pause 