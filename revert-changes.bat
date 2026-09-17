@echo off
echo Reverting all changes...
git checkout .
git clean -fd
echo All changes have been reverted!
pause
