@echo off
REM Script de vérification des headers de sécurité
REM Usage: test-headers.bat http://localhost:8001/editeurhtml

if "%1"=="" (
    set URL=http://localhost:8001/editeurhtml
) else (
    set URL=%1
)

echo.
echo ====================================================
echo Verification des headers de securite
echo URL: %URL%
echo ====================================================
echo.

REM Utiliser curl pour récupérer les headers
for /f "delims=" %%A in ('curl -s -I "%URL%"') do (
    if not "%%A"=="" echo %%A
)

echo.
echo ====================================================
echo Verification rapide des headers importants:
echo ====================================================

REM Vérification CSP
echo.
echo [1] Content-Security-Policy
curl -s -I "%URL%" | find /I "Content-Security-Policy" > nul
if errorlevel 1 (
    echo  [X] MANQUANT
) else (
    echo  [✓] Present
    curl -s -I "%URL%" | find /I "Content-Security-Policy"
)

REM Vérification X-Frame-Options
echo.
echo [2] X-Frame-Options
curl -s -I "%URL%" | find /I "X-Frame-Options" > nul
if errorlevel 1 (
    echo  [X] MANQUANT
) else (
    echo  [✓] Present
    curl -s -I "%URL%" | find /I "X-Frame-Options"
)

REM Vérification X-Content-Type-Options
echo.
echo [3] X-Content-Type-Options
curl -s -I "%URL%" | find /I "X-Content-Type-Options" > nul
if errorlevel 1 (
    echo  [X] MANQUANT
) else (
    echo  [✓] Present
    curl -s -I "%URL%" | find /I "X-Content-Type-Options"
)

REM Vérification Referrer-Policy
echo.
echo [4] Referrer-Policy
curl -s -I "%URL%" | find /I "Referrer-Policy" > nul
if errorlevel 1 (
    echo  [X] MANQUANT
) else (
    echo  [✓] Present
    curl -s -I "%URL%" | find /I "Referrer-Policy"
)

REM Vérification Permissions-Policy
echo.
echo [5] Permissions-Policy
curl -s -I "%URL%" | find /I "Permissions-Policy" > nul
if errorlevel 1 (
    echo  [X] MANQUANT
) else (
    echo  [✓] Present
    curl -s -I "%URL%" | find /I "Permissions-Policy"
)

echo.
echo ====================================================
echo Test termine.
echo ====================================================
