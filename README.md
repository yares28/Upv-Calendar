# UPV Calendar Application

A dynamic calendar application for viewing and managing exam schedules at UPV.

## Features

- View scheduled exams by clicking on calendar dates
- Filter exams by degree, semester, and subject using checkboxes
- Modern, responsive UI with a clean design
- Detailed exam information in popups

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Usage

### Starting the Application

Simply run the start script:

```bash
start-app.bat
```

This will:
- Start the backend server on port 3000
- Start the frontend server on port 4200
- Automatically open the application in your default browser
- Create log files in the `logs` directory

### Stopping the Application

To stop both servers:

```bash
stop-app.bat
```

## Development

### Backend (Express.js)

The backend server is located in the `backend` directory and runs on port 3000.

### Frontend (Angular)

The frontend application is located in the `frontend` directory and runs on port 4200.

Key components:
- `landing.component.ts` - Main calendar logic
- `landing.component.html` - Calendar UI
- `landing.component.css` - Styling

## Troubleshooting

If you encounter issues:

1. Check the log files in the `logs` directory
2. Ensure both ports (3000 and 4200) are available
3. If servers won't stop, manually end the Node.js processes in Task Manager

## License

MIT 