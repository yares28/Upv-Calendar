#!/bin/bash

echo "UPV Calendar App Startup Script"
echo "=============================="
echo

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed or not in your PATH."
    echo "Please install PostgreSQL and try again."
    exit 1
fi

# Function to handle errors
handle_error() {
    echo
    echo "Error occurred during setup. Setup aborted."
    echo
    exit 1
}

# Setup database
echo "[1/4] Setting up database..."
echo

echo "Running database setup script..."
psql -U postgres -f database_setup.sql || handle_error
echo "Database setup completed successfully."
echo

# Setup backend
echo "[2/4] Installing backend dependencies..."
cd backend || handle_error
npm install || handle_error
echo "Backend dependencies installed successfully."
echo

# Start backend server
echo "[3/4] Starting backend server..."
gnome-terminal -- bash -c "node server.js; read -p 'Press Enter to close'" 2>/dev/null || 
xterm -e "node server.js; read -p 'Press Enter to close'" 2>/dev/null || 
osascript -e 'tell app "Terminal" to do script "cd $(pwd) && node server.js"' 2>/dev/null || 
(node server.js > server.log 2>&1 & echo "Backend server started in background (see server.log)")
echo "Backend server started in a new terminal window or in background."
echo

# Setup and start frontend
echo "[4/4] Installing and starting frontend..."
cd ../frontend || handle_error
npm install || handle_error

# Start Angular development server
gnome-terminal -- bash -c "ng serve --open; read -p 'Press Enter to close'" 2>/dev/null || 
xterm -e "ng serve --open; read -p 'Press Enter to close'" 2>/dev/null || 
osascript -e 'tell app "Terminal" to do script "cd $(pwd) && ng serve --open"' 2>/dev/null || 
(ng serve > angular.log 2>&1 & echo "Frontend started in background (see angular.log)")
echo "Frontend started in a new terminal window or in background."
echo

echo "=============================="
echo "UPV Calendar App is now running!"
echo
echo "- Database: PostgreSQL"
echo "- Backend: http://localhost:3000"
echo "- Frontend: http://localhost:4200"
echo
echo "You can use these test credentials:"
echo "Email: demo@example.com"
echo "Password: password123"
echo

# If we're running in background mode, keep this terminal open
if [[ -f server.log || -f angular.log ]]; then
    echo "Press Ctrl+C to stop the application"
    # Keep the script running
    while true; do
        sleep 60
    done
fi 