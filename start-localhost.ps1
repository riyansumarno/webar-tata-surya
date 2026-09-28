Set-Location $PSScriptRoot
if (Get-Command py -ErrorAction SilentlyContinue) { py .\server.py; exit }
if (Get-Command python -ErrorAction SilentlyContinue) { python .\server.py; exit }
Write-Host "Python 3 tidak ditemukan." -ForegroundColor Red
Read-Host "Tekan Enter untuk keluar"
