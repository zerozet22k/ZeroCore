@echo off
setlocal enabledelayedexpansion

echo Pushing to origin remote...
git push origin master
if errorlevel 1 (
    echo Failed to push to origin. Verify remote and access rights.
    pause
    exit /b 1
) else (
    echo Successfully pushed to origin.
)

echo Pushing to clone remote...
git push clone master --force
if errorlevel 1 (
    echo Failed to push to clone. Verify remote and access rights.
    pause
    exit /b 1
) else (
    echo Successfully pushed to clone.
)

echo All pushes completed successfully!
pause
