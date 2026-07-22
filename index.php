<?php
declare(strict_types=1);

/**
 * Routeur simple de l'application avec sécurité renforcée
 * - /editeurhtml/                => landingpage.php
 * - /editeurhtml/?page=landing   => landingpage.php
 * - /editeurhtml/?page=editeur   => editeur.php
 * 
 * Sécurité : Validation stricte + Headers défensifs
 */

// ========== HEADERS DE SÉCURITÉ ==========
// Content Security Policy : deuxième ligne de défense contre XSS/injection
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self';");

// Protections standards HTTP
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

// ========== ROUTEUR AVEC VALIDATION STRICTE ==========
$allowed_pages = ['landing', 'editeur'];
$page = $_GET['page'] ?? 'landing';

// Validation explicite : type-checking + whitelist
if (!is_string($page) || !in_array($page, $allowed_pages, true)) {
    http_response_code(404);
    echo '<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>404 - Page introuvable</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body{
                font-family: Arial, sans-serif;
                background:#0f172a;
                color:#e2e8f0;
                display:flex;
                align-items:center;
                justify-content:center;
                min-height:100vh;
                margin:0;
                padding:20px;
                text-align:center;
            }
            .box{
                max-width:700px;
                background:#111827;
                border:1px solid rgba(255,255,255,.08);
                border-radius:16px;
                padding:32px;
            }
            a{
                color:#38bdf8;
                text-decoration:none;
                font-weight:bold;
            }
        </style>
    </head>
    <body>
        <div class="box">
            <h1>404 - Page introuvable</h1>
            <p>La route demandée n\'existe pas.</p>
            <p><a href="index.php">Retour à la landing page</a></p>
        </div>
    </body>
    </html>';
    exit;
}

// Table de routes statique : mappée après validation stricte
$routes = [
    'landing' => __DIR__ . '/landingpage.php',
    'editeur' => __DIR__ . '/editeur.php',
];

require $routes[$page];