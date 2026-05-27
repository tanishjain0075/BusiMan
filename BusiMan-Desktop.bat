@echo off
title BusiMan ERP Desktop Console
color 0B
cls

echo ==================================================
echo   🚀 BUSIMAN ERP — STANDALONE OFFLINE LAUNCHER
echo ==================================================
echo.
echo [1/4] Verifying database connection...

:: Check if MongoDB is listening locally
netstat -ano | findstr :27017 > nul
if %errorlevel% equ 0 (
    echo   ✔ MongoDB Database is active and listening on port 27017.
) else (
    echo   ⚠ MongoDB database does not appear to be running!
    echo     Starting MongoDB local service...
    net start MongoDB > nul 2>&1
    if %errorlevel% neq 0 (
        echo   ❌ Could not automatically start local MongoDB service.
        echo      Please ensure MongoDB Community Server is installed locally.
    ) else (
        echo   ✔ MongoDB Service successfully started.
    )
)
echo.

echo [2/4] Starting BusiMan Express backend server...
:: Start the server minimized so it doesn't crowd the screen
start "BusiMan Backend Server" /min cmd /c "cd server && npm run dev"
echo   ✔ Backend booted in background. (Port: 5000)
echo.

echo [3/4] Starting BusiMan React frontend client...
:: Start the client minimized
start "BusiMan Frontend Client" /min cmd /c "cd client && npm run dev"
echo   ✔ Frontend booted in background. (Port: 5174)
echo.

echo [4/4] Launching BusiMan ERP in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5174/
echo   ✔ Browser loaded. Offline ERP dashboard active!
echo.

echo ==================================================
echo         🎉 BUSIMAN ERP DESKTOP SYSTEM ACTIVE
echo ==================================================
echo   Feel free to close this window, or press any key
echo   to gracefully stop all background servers when done.
echo ==================================================
pause > nul

echo.
echo 🛑 Shutting down background Node.js processes...
taskkill /fi "windowtitle eq BusiMan Backend Server*" /t /f > nul 2>&1
taskkill /fi "windowtitle eq BusiMan Frontend Client*" /t /f > nul 2>&1
echo   ✔ Background servers gracefully closed.
echo.
echo Have a great day!
timeout /t 2 > nul
exit
