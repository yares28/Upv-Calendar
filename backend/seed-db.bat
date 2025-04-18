@echo off
echo UPV Calendar Database Seeder

cd src\utils
echo.
echo Choose an option:
echo 1. Import sample data
echo 2. Delete all data
echo.
set /p option="Enter option (1 or 2): "

if "%option%"=="1" (
  echo.
  echo Importing sample data...
  node seeder.js -i
) else if "%option%"=="2" (
  echo.
  echo Deleting all data...
  node seeder.js -d
) else (
  echo.
  echo Invalid option. Please run again and select 1 or 2.
)

echo.
pause 