@echo off
echo.
echo  Deploiement Agrumen sur GitHub + Vercel
echo  ========================================
echo.

set /p MSG="Decris tes changements (ex: ajout page contact) : "

if "%MSG%"=="" set MSG=mise a jour

git add .
git commit -m "%MSG%"
git push

echo.
echo  Termine ! Vercel met a jour le site dans 1-2 minutes.
echo.
pause
