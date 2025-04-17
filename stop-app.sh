#!/bin/bash

echo "UPV Calendar App Termination Script"
echo "=============================="
echo

echo "Stopping Angular frontend server..."
pkill -f "ng serve" || echo "No Angular process found"

echo "Stopping Express backend server..."
pkill -f "node server.js" || echo "No Node.js server process found"

# Check if background logs exist and remove them
if [ -f "frontend/angular.log" ]; then
    rm frontend/angular.log
    echo "Removed Angular log file"
fi

if [ -f "backend/server.log" ]; then
    rm backend/server.log
    echo "Removed Server log file"
fi

echo
echo "Application servers have been stopped."
echo 