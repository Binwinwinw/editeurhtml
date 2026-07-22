<?php
declare(strict_types=1);

$appUrl = 'index.php?page=editeur';
?>
<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
  <meta charset="UTF-8">
  <title>Éditeur HTML Temps Réel — Prototyper, tester, exporter</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Un éditeur HTML, CSS et JavaScript en temps réel avec aperçu isolé, export ZIP et interface pensée pour le prototypage rapide." />

  <link rel="preconnect" href="https://api.fontshare.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=zodiak@400,500,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    /* Art direction: éditeur front-end premium → studio tool sobre, précis, crédible
       Palette: neutre chaud + teal technique
       Typography: Zodiak + General Sans pour distinguer promesse et produit
       Density: équilibrée, avec hero ample et sections compactes */

    :root,
    [data-theme="light"] {
      --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
      --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
      --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
      --text-lg: clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
      --text-xl: clamp(1.5rem, 1.2rem + 1.25vw, 2.25rem);
      --text-2xl: clamp(2rem, 1.2rem + 2.5vw, 3.5rem);
      --text-3xl: clamp(2.5rem, 1rem + 4vw, 5rem);

      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-10: 2.5rem;
      --space-12: 3rem;
      --space-16: 4rem;
      --space-20: 5rem;
      --space-24: 6rem;

      --color-bg: #f6f4ef;
      --color-surface: #fcfbf8;
      --color-surface-2: #f4f1ea;
      --color-surface-offset: #ede9e1;
      --color-border: #d9d4cc;
      --color-divider: #e2ddd5;

      --color-text: #221f19;
      --color-text-muted: #6d6a64;
      --color-text-faint: #aca79f;
      --color-text-inverse: #f8f6f1;

      --color-primary: #0d6b6e;
      --color-primary-hover: #0c585b;
      --color-primary-active: #0a4446;
      --color-primary-soft: #d5e4e1;

      --color-success: #3d6d25;
      --color-code-bg: #0f141b;
      --color-code-surface: #121b24;
      --color-code-border: rgba(255,255,255,.08);

      --radius-sm: 0.5rem;
      --radius-md: 0.75rem;
      --radius-lg: 1rem;
      --radius-xl: 1.5rem;
      --radius-full: 9999px;

      --shadow-sm: 0 1px 2px rgba(28, 24, 17, 0.06);
      --shadow-md: 0 8px 24px rgba(28, 24, 17, 0.08);
      --shadow-lg: 0 18px 60px rgba(28, 24, 17, 0.12);

      --content-narrow: 720px;
      --content-default: 1120px;
      --content-wide: 1280px;

      --font-body: 'General Sans', 'Inter', sans-serif;
      --font-display: 'Zodiak', Georgia, serif;
      --font-mono: 'IBM Plex Mono', monospace;

      --transition-interactive: 180ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    [data-theme="dark"] {
      --color-bg: #151412;
      --color-surface: #1b1a18;
      --color-surface-2: #201f1c;
      --color-surface-offset: #25231f;
      --color-border: #383632;
      --color-divider: #2b2926;

      --color-text: #d3d0ca;
      --color-text-muted: #8d8a84;
      --color-text-faint: #63615d;
      --color-text-inverse: #131210;

      --color-primary: #4a98a0;
      --color-primary-hover: #3f858c;
      --color-primary-active: #316a70;
      --color-primary-soft: #283838;

      --color-success: #79a858;
      --color-code-bg: #0d1117;
      --color-code-surface: #11161e;
      --color-code-border: rgba(255,255,255,.08);

      --shadow-sm: 0 1px 2px rgba(0,0,0,.2);
      --shadow-md: 0 8px 24px rgba(0,0,0,.3);
      --shadow-lg: 0 18px 60px rgba(0,0,0,.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      scroll-behavior: smooth;
    }

    body {
      min-height: 100dvh;
      font-family: var(--font-body);
      font-size: var(--text-base);
      line-height: 1.6;
      color: var(--color-text);
      background: var(--color-bg);
    }

    img,
    svg {
      display: block;
      max-width: 100%;
      height: auto;
    }

    a,
    button {
      transition:
        color var(--transition-interactive),
        background var(--transition-interactive),
        border-color var(--transition-interactive),
        transform var(--transition-interactive),
        box-shadow var(--transition-interactive);
    }

    button {
      border: 0;
      background: none;
      cursor: pointer;
      color: inherit;
      font: inherit;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 3px;
      border-radius: var(--radius-sm);
    }

    .container {
      width: min(var(--content-default), calc(100% - 2rem));
      margin-inline: auto;
    }

    .skip-link {
      position: absolute;
      left: -9999px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }

    .skip-link:focus {
      left: 1rem;
      top: 1rem;
      width: auto;
      height: auto;
      padding: .75rem 1rem;
      background: var(--color-primary);
      color: white;
      z-index: 9999;
      border-radius: var(--radius-md);
    }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(16px);
      background: color-mix(in srgb, var(--color-bg) 82%, transparent);
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
    }

    .site-header .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      min-height: 76px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: .875rem;
      min-width: 0;
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      color: var(--color-primary);
      flex: 0 0 auto;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand-text strong {
      font-size: var(--text-sm);
      font-weight: 700;
      letter-spacing: .02em;
    }

    .brand-text span {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: .75rem;
    }

    .theme-toggle,
    .ghost-link,
    .primary-link {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding-inline: 1rem;
      border-radius: var(--radius-full);
      border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
      font-size: var(--text-sm);
      font-weight: 600;
    }

    .theme-toggle,
    .ghost-link {
      background: color-mix(in srgb, var(--color-surface) 88%, transparent);
    }

    .theme-toggle:hover,
    .ghost-link:hover {
      background: var(--color-surface-2);
      transform: translateY(-1px);
    }

    .primary-link {
      color: var(--color-text-inverse);
      background: var(--color-primary);
      border-color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }

    .primary-link:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      transform: translateY(-1px);
    }

    main {
      overflow: clip;
    }

    .hero {
      padding-block: clamp(var(--space-10), 8vw, var(--space-24));
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.02fr .98fr;
      gap: clamp(var(--space-6), 4vw, var(--space-16));
      align-items: center;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: .6rem;
      padding: .5rem .85rem;
      border-radius: var(--radius-full);
      background: var(--color-primary-soft);
      color: var(--color-primary-active);
      font-size: var(--text-xs);
      letter-spacing: .06em;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: var(--space-6);
    }

    .hero-copy h1 {
      font-family: var(--font-display);
      font-size: clamp(2.8rem, 2rem + 4vw, 5.6rem);
      line-height: .95;
      letter-spacing: -0.03em;
      max-width: 11ch;
    }

    .hero-copy .lead {
      margin-top: var(--space-6);
      max-width: 58ch;
      color: var(--color-text-muted);
      font-size: var(--text-lg);
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: var(--space-8);
    }

    .hero-actions a {
      min-height: 50px;
      padding-inline: 1.2rem;
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: .75rem;
      margin-top: var(--space-8);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }

    .hero-meta span {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      padding: .55rem .8rem;
      border-radius: var(--radius-full);
      background: color-mix(in srgb, var(--color-surface) 90%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
    }

    .hero-panel-wrap {
      position: relative;
    }

    .hero-panel-wrap::before {
      content: "";
      position: absolute;
      inset: auto -8% -10% 18%;
      height: 50%;
      background: color-mix(in srgb, var(--color-primary) 14%, transparent);
      filter: blur(48px);
      border-radius: 50%;
      pointer-events: none;
    }

    .product-card {
      position: relative;
      border-radius: 28px;
      background: var(--color-surface);
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .product-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.1rem;
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
      background: color-mix(in srgb, var(--color-surface-2) 86%, transparent);
    }

    .product-dots {
      display: flex;
      gap: .4rem;
    }

    .product-dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-text) 18%, transparent);
    }

    .product-dots span:nth-child(1) { background: #e97a7a; }
    .product-dots span:nth-child(2) { background: #e8b467; }
    .product-dots span:nth-child(3) { background: #65b985; }

    .product-pill {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      padding: .35rem .7rem;
      border-radius: var(--radius-full);
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      background: color-mix(in srgb, var(--color-bg) 60%, transparent);
    }

    .product-body {
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      min-height: 540px;
    }

    .code-shell {
      background: var(--color-code-bg);
      color: #d7e5f3;
      border-right: 1px solid var(--color-code-border);
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .code-tabs {
      display: flex;
      gap: .5rem;
      padding: 1rem;
      border-bottom: 1px solid var(--color-code-border);
      background: color-mix(in srgb, var(--color-code-surface) 94%, transparent);
    }

    .code-tabs span {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      padding: .35rem .65rem;
      border-radius: var(--radius-full);
      background: rgba(255,255,255,.04);
      color: rgba(255,255,255,.76);
    }

    .code-tabs span.is-active {
      background: rgba(74, 152, 160, .18);
      color: #9bd7db;
    }

    .code-pane {
      padding: 1.1rem 1.15rem 1.25rem;
      font-family: var(--font-mono);
      font-size: .88rem;
      line-height: 1.9;
      overflow: hidden;
    }

    .code-line {
      display: grid;
      grid-template-columns: 2rem 1fr;
      gap: .85rem;
      white-space: pre;
    }

    .line-number {
      color: rgba(255,255,255,.28);
      user-select: none;
      text-align: right;
    }

    .token-tag { color: #7dd3fc; }
    .token-attr { color: #f9a8d4; }
    .token-string { color: #86efac; }
    .token-css { color: #c4b5fd; }
    .token-js { color: #fcd34d; }
    .token-text { color: #e2e8f0; }

    .preview-shell {
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 86%, transparent), color-mix(in srgb, var(--color-surface-2) 100%, transparent));
      padding: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-canvas {
      width: min(100%, 360px);
      border-radius: 24px;
      background: white;
      box-shadow:
        0 10px 30px rgba(16, 24, 40, .08),
        0 28px 80px rgba(16, 24, 40, .14);
      overflow: hidden;
    }

    .preview-banner {
      height: 120px;
      background: linear-gradient(160deg, #d8ebef, #ecf3f5 50%, #f8fbfb 100%);
      border-bottom: 1px solid rgba(16, 24, 40, .08);
      position: relative;
    }

    .preview-badge {
      position: absolute;
      top: 18px;
      left: 18px;
      padding: .4rem .7rem;
      border-radius: var(--radius-full);
      font-size: .72rem;
      font-weight: 700;
      color: #0c585b;
      background: rgba(13, 107, 110, .10);
      border: 1px solid rgba(13, 107, 110, .14);
    }

    .preview-content {
      padding: 1.25rem;
      color: #18212d;
    }

    .preview-content h3 {
      font-size: 1.3rem;
      line-height: 1.1;
      margin-bottom: .6rem;
    }

    .preview-content p {
      color: #58667a;
      font-size: .95rem;
    }

    .preview-actions {
      display: flex;
      gap: .6rem;
      margin-top: 1rem;
    }

    .preview-actions span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding-inline: .85rem;
      border-radius: 999px;
      font-size: .84rem;
      font-weight: 600;
    }

    .preview-actions span:first-child {
      background: #0d6b6e;
      color: white;
    }

    .preview-actions span:last-child {
      background: #eef3f7;
      color: #344054;
    }

    .proof-strip {
      padding-bottom: var(--space-10);
    }

    .proof-grid {
      display: grid;
      grid-template-columns: 1.2fr .8fr .8fr .8fr;
      gap: 1rem;
      align-items: stretch;
    }

    .proof-card {
      background: color-mix(in srgb, var(--color-surface) 88%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      border-radius: var(--radius-xl);
      padding: 1.15rem 1.15rem 1.25rem;
      box-shadow: var(--shadow-sm);
    }

    .proof-card strong {
      display: block;
      font-size: var(--text-lg);
      line-height: 1.1;
      margin-bottom: .45rem;
    }

    .proof-card p {
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      max-width: 34ch;
    }

    .section {
      padding-block: clamp(var(--space-10), 7vw, var(--space-20));
    }

    .section-header {
      display: grid;
      grid-template-columns: .9fr 1.1fr;
      gap: var(--space-8);
      align-items: end;
      margin-bottom: var(--space-8);
    }

    .section-header h2 {
      font-family: var(--font-display);
      font-size: clamp(2rem, 1.4rem + 2vw, 3.2rem);
      line-height: 1.02;
      letter-spacing: -0.025em;
      max-width: 12ch;
    }

    .section-header p {
      color: var(--color-text-muted);
      max-width: 58ch;
      justify-self: end;
    }

    .editor-journey {
      display: grid;
      grid-template-columns: 1.15fr .85fr;
      gap: var(--space-6);
      align-items: start;
    }

    .journey-panel,
    .stack-panel,
    .cta-panel {
      background: color-mix(in srgb, var(--color-surface) 90%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      border-radius: 24px;
      box-shadow: var(--shadow-sm);
    }

    .journey-panel {
      padding: 1.25rem;
    }

    .journey-steps {
      display: grid;
      gap: 1rem;
    }

    .journey-step {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1rem;
      align-items: start;
      padding: 1rem;
      border-radius: 18px;
      background: color-mix(in srgb, var(--color-bg) 56%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
    }

    .journey-index {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary-soft);
      color: var(--color-primary-active);
      font-family: var(--font-mono);
      font-size: .9rem;
      font-weight: 600;
    }

    .journey-step h3 {
      font-size: 1.08rem;
      line-height: 1.15;
      margin-bottom: .35rem;
    }

    .journey-step p {
      font-size: .96rem;
      color: var(--color-text-muted);
      max-width: 42ch;
    }

    .stack-panel {
      padding: 1.25rem;
      display: grid;
      gap: 1rem;
    }

    .stack-card {
      padding: 1rem;
      border-radius: 18px;
      background: color-mix(in srgb, var(--color-surface-2) 90%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
    }

    .stack-card small {
      display: inline-block;
      margin-bottom: .55rem;
      color: var(--color-text-faint);
      text-transform: uppercase;
      letter-spacing: .08em;
      font-size: .74rem;
      font-weight: 700;
    }

    .stack-card h3 {
      font-size: 1.05rem;
      margin-bottom: .35rem;
    }

    .stack-card p {
      color: var(--color-text-muted);
      font-size: .94rem;
    }

    .feature-matrix {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1rem;
    }

    .feature-card {
      padding: 1.2rem;
      border-radius: 22px;
      background: color-mix(in srgb, var(--color-surface) 92%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      box-shadow: var(--shadow-sm);
    }

    .feature-card.large {
      grid-column: span 7;
      min-height: 260px;
    }

    .feature-card.medium {
      grid-column: span 5;
    }

    .feature-card.small {
      grid-column: span 4;
    }

    .feature-card h3 {
      font-size: 1.1rem;
      margin-bottom: .45rem;
    }

    .feature-card p {
      font-size: .96rem;
      color: var(--color-text-muted);
      max-width: 38ch;
    }

    .feature-card .mini-kicker {
      display: inline-flex;
      align-items: center;
      gap: .45rem;
      margin-bottom: .8rem;
      color: var(--color-text-faint);
      font-size: .76rem;
      letter-spacing: .08em;
      text-transform: uppercase;
      font-weight: 700;
    }

    .outcome-list {
      display: grid;
      gap: .75rem;
      margin-top: 1rem;
    }

    .outcome-list li {
      list-style: none;
      padding: .85rem .95rem;
      border-radius: 16px;
      background: color-mix(in srgb, var(--color-bg) 60%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
      color: var(--color-text);
      font-size: .95rem;
    }

    .cta-section {
      padding-bottom: var(--space-20);
    }

    .cta-panel {
      padding: clamp(1.4rem, 2.5vw, 2rem);
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      gap: var(--space-6);
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .cta-panel::after {
      content: "";
      position: absolute;
      inset: auto -10% -35% auto;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      filter: blur(28px);
      pointer-events: none;
    }

    .cta-copy h2 {
      font-family: var(--font-display);
      font-size: clamp(1.9rem, 1.3rem + 2vw, 3rem);
      line-height: 1.02;
      margin-bottom: .75rem;
      max-width: 12ch;
    }

    .cta-copy p {
      color: var(--color-text-muted);
      max-width: 52ch;
    }

    .cta-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: .9rem;
      margin-top: var(--space-6);
    }

    .cta-side {
      justify-self: end;
      width: min(100%, 360px);
      padding: 1rem;
      border-radius: 22px;
      background: color-mix(in srgb, var(--color-bg) 60%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
    }

    .terminal-line {
      display: flex;
      gap: .8rem;
      font-family: var(--font-mono);
      font-size: .9rem;
      color: var(--color-text-muted);
      padding: .55rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
    }

    .terminal-line:last-child {
      border-bottom: 0;
    }

    .terminal-line strong {
      color: var(--color-primary);
      font-weight: 500;
    }

    .site-footer {
      padding-bottom: var(--space-8);
    }

    .footer-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding-top: var(--space-8);
      border-top: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }

    @media (max-width: 1080px) {
      .hero-grid,
      .section-header,
      .editor-journey,
      .cta-panel,
      .proof-grid {
        grid-template-columns: 1fr;
      }

      .proof-grid {
        gap: .85rem;
      }

      .product-body {
        grid-template-columns: 1fr;
      }

      .code-shell {
        min-height: 300px;
      }

      .preview-shell {
        min-height: 280px;
      }

      .cta-side,
      .section-header p {
        justify-self: start;
      }
    }

    @media (max-width: 820px) {
      .feature-card.large,
      .feature-card.medium,
      .feature-card.small {
        grid-column: span 12;
      }

      .site-header .container {
        min-height: auto;
        padding-block: .85rem;
        align-items: flex-start;
      }

      .nav-actions {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }

    @media (max-width: 640px) {
      .container {
        width: min(var(--content-default), calc(100% - 1.25rem));
      }

      .hero-copy h1 {
        max-width: 9ch;
      }

      .hero-actions,
      .cta-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .primary-link,
      .ghost-link {
        width: 100%;
      }

      .footer-row {
        flex-direction: column;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>

  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.php" aria-label="Retour à l’accueil">
        <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="8" y="10" width="48" height="44" rx="12" fill="none" stroke="currentColor" stroke-width="4"></rect>
          <path d="M24 24L16 32L24 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M40 24L48 32L40 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M31 45H43" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
        </svg>
        <span class="brand-text">
          <strong>Éditeur HTML Temps Réel</strong>
          <span>Prototype, teste, exporte.</span>
        </span>
      </a>

      <nav class="nav-actions" aria-label="Navigation principale">
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Basculer le thème">◐</button>
        <a class="ghost-link" href="#fonctionnalites">Fonctionnement</a>
        <a class="primary-link" href="<?= htmlspecialchars($appUrl, ENT_QUOTES, 'UTF-8') ?>">Ouvrir l’éditeur</a>
      </nav>
    </div>
  </header>

  <main id="contenu">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Éditeur front-end • aperçu instantané • export projet</span>
          <h1>Écris, visualise et livre ton prototype sans casser ton flux.</h1>
          <p class="lead">
            Un espace unique pour travailler le HTML, le CSS et le JavaScript en parallèle, voir le rendu immédiatement,
            isoler l’exécution dans un aperçu sandboxé et exporter un projet propre en quelques secondes.
          </p>

          <div class="hero-actions">
            <a class="primary-link" href="<?= htmlspecialchars($appUrl, ENT_QUOTES, 'UTF-8') ?>">Lancer l’éditeur</a>
            <a class="ghost-link" href="#demo">Voir le parcours</a>
          </div>

          <div class="hero-meta" aria-label="Points clés">
            <span>Aperçu en temps réel</span>
            <span>Export ZIP</span>
            <span>Travail HTML / CSS / JS côte à côte</span>
          </div>
        </div>

        <div class="hero-panel-wrap" aria-hidden="true">
          <div class="product-card">
            <div class="product-topbar">
              <div class="product-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="product-pill">local / rapide / sans friction</div>
            </div>

            <div class="product-body">
              <div class="code-shell">
                <div class="code-tabs">
                  <span class="is-active">index.html</span>
                  <span>styles.css</span>
                  <span>script.js</span>
                </div>

                <div class="code-pane">
                  <div class="code-line"><span class="line-number">1</span><span><span class="token-tag">&lt;main</span> <span class="token-attr">class</span>=<span class="token-string">"hero-card"</span><span class="token-tag">&gt;</span></span></div>
                  <div class="code-line"><span class="line-number">2</span><span>  <span class="token-tag">&lt;h1&gt;</span><span class="token-text">Bonjour</span><span class="token-tag">&lt;/h1&gt;</span></span></div>
                  <div class="code-line"><span class="line-number">3</span><span>  <span class="token-tag">&lt;p&gt;</span><span class="token-text">Prototype front-end prêt en quelques minutes.</span><span class="token-tag">&lt;/p&gt;</span></span></div>
                  <div class="code-line"><span class="line-number">4</span><span>  <span class="token-tag">&lt;button&gt;</span><span class="token-text">Tester</span><span class="token-tag">&lt;/button&gt;</span></span></div>
                  <div class="code-line"><span class="line-number">5</span><span><span class="token-tag">&lt;/main&gt;</span></span></div>
                  <div class="code-line"><span class="line-number">6</span><span></span></div>
                  <div class="code-line"><span class="line-number">7</span><span><span class="token-css">.hero-card {</span></span></div>
                  <div class="code-line"><span class="line-number">8</span><span>  <span class="token-css">padding: 2rem;</span></span></div>
                  <div class="code-line"><span class="line-number">9</span><span>  <span class="token-css">border-radius: 24px;</span></span></div>
                  <div class="code-line"><span class="line-number">10</span><span><span class="token-css">}</span></span></div>
                  <div class="code-line"><span class="line-number">11</span><span></span></div>
                  <div class="code-line"><span class="line-number">12</span><span><span class="token-js">document.querySelector</span><span class="token-text">(</span><span class="token-string">'button'</span><span class="token-text">)</span></span></div>
                  <div class="code-line"><span class="line-number">13</span><span>  <span class="token-text">?.addEventListener(</span><span class="token-string">'click'</span><span class="token-text">, () =&gt; alert(</span><span class="token-string">'OK'</span><span class="token-text">));</span></span></div>
                </div>
              </div>

              <div class="preview-shell">
                <div class="preview-canvas">
                  <div class="preview-banner">
                    <span class="preview-badge">APERÇU</span>
                  </div>
                  <div class="preview-content">
                    <h3>Bonjour</h3>
                    <p>Prototype front-end prêt en quelques minutes.</p>
                    <div class="preview-actions">
                      <span>Tester</span>
                      <span>Exporter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="proof-strip">
      <div class="container proof-grid">
        <article class="proof-card">
          <strong>Conçu pour aller vite.</strong>
          <p>Tu écris dans trois panneaux parallèles, tu vois le résultat tout de suite et tu gardes une séparation claire entre code et rendu.</p>
        </article>
        <article class="proof-card">
          <strong>Aperçu isolé</strong>
          <p>Le rendu s’exécute dans un cadre sandboxé pour mieux compartimenter les essais.</p>
        </article>
        <article class="proof-card">
          <strong>Export propre</strong>
          <p>Ton travail peut sortir en fichiers séparés ou en archive ZIP prête à partager.</p>
        </article>
        <article class="proof-card">
          <strong>Usage pédagogique</strong>
          <p>Parfait pour enseigner, démontrer ou prototyper sans installation lourde.</p>
        </article>
      </div>
    </section>

    <section id="demo" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Un parcours pensé pour rester fluide.</h2>
          <p>
            La page ne vend pas seulement un éditeur. Elle montre une manière de travailler : écrire, vérifier, corriger,
            sauvegarder et livrer sans sortir de l’interface.
          </p>
        </div>

        <div class="editor-journey">
          <div class="journey-panel">
            <div class="journey-steps">
              <article class="journey-step">
                <span class="journey-index">01</span>
                <div>
                  <h3>Écris ton HTML, ton CSS et ton JS en parallèle</h3>
                  <p>Pas de vue cachée inutile, pas d’allers-retours permanents. Les trois blocs restent visibles et compréhensibles au premier coup d’œil.</p>
                </div>
              </article>

              <article class="journey-step">
                <span class="journey-index">02</span>
                <div>
                  <h3>Observe le résultat sans quitter ton contexte</h3>
                  <p>L’aperçu se met à jour rapidement pour transformer ton éditeur en espace de test, pas seulement en zone de saisie.</p>
                </div>
              </article>

              <article class="journey-step">
                <span class="journey-index">03</span>
                <div>
                  <h3>Exporte un projet réutilisable</h3>
                  <p>Quand le prototype tient la route, tu récupères une structure simple à relancer, corriger ou transmettre.</p>
                </div>
              </article>
            </div>
          </div>

          <aside class="stack-panel">
            <article class="stack-card">
              <small>édition</small>
              <h3>Trois zones, une seule logique</h3>
              <p>Chaque panneau a son rôle, sans compliquer la lecture de l’interface.</p>
            </article>

            <article class="stack-card">
              <small>sécurité</small>
              <h3>Exécution séparée</h3>
              <p>L’aperçu n’est pas mélangé au shell principal, ce qui rend les essais plus propres et plus prévisibles.</p>
            </article>

            <article class="stack-card">
              <small>livraison</small>
              <h3>Du test à l’archive</h3>
              <p>Tu passes du brouillon à un mini-projet exportable sans reconstituer les fichiers à la main.</p>
            </article>
          </aside>
        </div>
      </div>
    </section>

    <section id="fonctionnalites" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Des capacités utiles, montrées comme des usages.</h2>
          <p>
            Au lieu d’empiler une liste de features, la page relie chaque bloc à un moment concret du travail :
            prototypage, démonstration, correction, export.
          </p>
        </div>

        <div class="feature-matrix">
          <article class="feature-card large">
            <span class="mini-kicker">prototype</span>
            <h3>Travaille comme dans un mini studio front-end.</h3>
            <p>
              Tu peux monter une interface, ajuster le style, brancher une interaction et vérifier le rendu dans la même session,
              ce qui convient aussi bien à un atelier pédagogique qu’à un prototype rapide pour un client ou une idée interne.
            </p>
            <ul class="outcome-list">
              <li>Tester une interface en direct sans lancer une stack complète.</li>
              <li>Montrer un exemple HTML/CSS/JS à un élève ou à un collègue sans configuration complexe.</li>
              <li>Préparer un point de départ propre avant intégration dans un vrai projet.</li>
            </ul>
          </article>

          <article class="feature-card medium">
            <span class="mini-kicker">aperçu</span>
            <h3>Voir ce que le code produit, pas seulement ce qu’il contient.</h3>
            <p>
              Le produit prend de la valeur au moment où le rendu devient immédiat. C’est ce basculement qui fait gagner du temps.
            </p>
          </article>

          <article class="feature-card small">
            <span class="mini-kicker">export</span>
            <h3>Fichiers séparés</h3>
            <p>HTML, CSS et JS peuvent sortir comme base de travail réutilisable.</p>
          </article>

          <article class="feature-card small">
            <span class="mini-kicker">zip</span>
            <h3>Archive projet</h3>
            <p>Pratique pour envoyer, sauvegarder ou déposer rapidement un prototype.</p>
          </article>

          <article class="feature-card small">
            <span class="mini-kicker">transmission</span>
            <h3>Contexte pédagogique</h3>
            <p>Très utile pour montrer le lien direct entre code source et résultat visuel.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section cta-section">
      <div class="container">
        <div class="cta-panel">
          <div class="cta-copy">
            <h2>Le plus simple est encore de l’ouvrir et de coder.</h2>
            <p>
              La promesse tient si l’interface disparaît vite derrière l’usage. Ouvre l’éditeur, écris quelques lignes,
              et vois immédiatement si le flux te convient.
            </p>

            <div class="cta-buttons">
              <a class="primary-link" href="<?= htmlspecialchars($appUrl, ENT_QUOTES, 'UTF-8') ?>">Accéder à l’éditeur</a>
              <a class="ghost-link" href="#contenu">Revenir en haut</a>
            </div>
          </div>

          <div class="cta-side" aria-label="Résumé du flux">
            <div class="terminal-line"><strong>$</strong><span>ouvrir l’éditeur</span></div>
            <div class="terminal-line"><strong>$</strong><span>écrire le prototype</span></div>
            <div class="terminal-line"><strong>$</strong><span>tester dans l’aperçu</span></div>
            <div class="terminal-line"><strong>$</strong><span>exporter le projet</span></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-row">
      <span>Éditeur HTML Temps Réel</span>
      <span>Prototypage front-end, aperçu isolé, export rapide.</span>
    </div>
  </footer>

  <script>
    (function () {
      const root = document.documentElement;
      const toggle = document.querySelector('[data-theme-toggle]');
      let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      root.setAttribute('data-theme', theme);

      if (toggle) {
        toggle.addEventListener('click', function () {
          theme = theme === 'dark' ? 'light' : 'dark';
          root.setAttribute('data-theme', theme);
          toggle.setAttribute('aria-label', theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre');
        });
      }
    })();
  </script>
</body>
</html>