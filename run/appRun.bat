@echo off
setlocal

rem 
cd /d "%~dp0"

echo Starting API...
start "" /d "%~dp0publish" "api.exe"

echo Starting Mongoose for Angular...
start "" /d "%~dp0dist" "mongoose.exe" -d client/browser -l http://localhost:8080

echo Opening the web browser...
start "" http://localhost:8080

pause
endlocal
