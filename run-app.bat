@echo off
title FoodHub - Launcher
echo =====================================================================
echo               STARTING FOODHUB FULL STACK APPLICATION
echo =====================================================================
echo.

echo [1/2] Starting Backend Server (Spring Boot on port 8080)...
start "FoodHub Backend (Port 8080)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"

echo [2/2] Starting Frontend Client (Vite on port 5173)...
start "FoodHub Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo =====================================================================
echo FoodHub is launching!
echo - Backend API:  http://localhost:8080
echo - H2 Console:   http://localhost:8080/h2-console
echo - Frontend UI:  http://localhost:5173
echo.
echo Demo Accounts:
echo - Customer:    customer@foodhub.com / password123
echo - Restaurant:  restaurant@foodhub.com / password123
echo - Admin:       admin@foodhub.com / password123
echo - Delivery:    delivery@foodhub.com / password123
echo =====================================================================
pause
