@echo off
echo ========================================
echo   CampusFlow GitHub Push Script
echo ========================================

:: Initialize git if it hasn't been initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    git branch -M main
)

:: Ensure git remote is set correctly to the new URL (runs every time just to be safe)
git remote add origin https://github.com/Finu-call/campusflow.git 2>nul
git remote set-url origin https://github.com/Finu-call/campusflow.git

:: Stage all changes
git add .

:: Prompt for commit message
set /p commit_msg="Enter commit message (or press enter for 'Auto-update'): "

:: Default message if empty
if "%commit_msg%"=="" set commit_msg=Auto-update

:: Commit and Push
echo.
echo Committing changes...
git commit -m "%commit_msg%"

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo   Push Complete!
echo ========================================
pause
