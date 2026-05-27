const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function startBackend() {
  console.log('🚀 Launching background Express Server...');
  // Spawn the node backend server process
  serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'server'),
    env: { ...process.env, PORT: '5000', NODE_ENV: 'production' }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Backend Log] ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'BusiMan ERP Desktop',
    icon: path.join(__dirname, 'client', 'public', 'favicon.ico'),
    backgroundColor: '#0b101c',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the running Vite dev server locally
  mainWindow.loadURL('http://localhost:5174/');

  // Hide default menu bar for clean native app look
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 1. Boot up backend and frontend wrapper
app.on('ready', () => {
  startBackend();
  // Wait a short duration to ensure DB and API are ready before rendering window
  setTimeout(createWindow, 2000);
});

// 2. Handle graceful shutdowns of background child processes
app.on('window-all-closed', () => {
  console.log('🛑 Closing all desktop windows. Shutting down servers...');
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
