@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py server.py
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python server.py
  goto :eof
)
echo.
echo Python tidak ditemukan.
echo Instal Python 3, lalu jalankan file ini lagi.
echo.
pause
