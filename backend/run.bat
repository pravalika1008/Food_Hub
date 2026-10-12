@echo off
title FoodHub Backend (Port 8080)
cd /d "%~dp0"
echo Starting FoodHub Spring Boot Backend...
mvn spring-boot:run
pause
