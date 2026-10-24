@echo off
title CampusFlow - College Timetable Hub
echo Starting CampusFlow College Timetable & Life Hub...

REM Try running using local scratch node if available, otherwise default system node or open directly in browser
if exist "%~dp0..\node-v22.14.0-win-x64\node.exe" (
    start http://localhost:3000
    "%~dp0..\node-v22.14.0-win-x64\node.exe" "%~dp0server.js"
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        start http://localhost:3000
        node "%~dp0server.js"
    ) else (
        echo Node.js not detected in PATH, opening directly in your default web browser...
        start "" "%~dp0index.html"
    )
)
pause
