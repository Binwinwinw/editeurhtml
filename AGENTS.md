# AGENTS — editeurhtml

Éditeur HTML/CSS/JS temps réel (WinBuilder). Entrée: `index.php`.

## Mémoire (lire en session)

| Fichier | Quand |
|---------|--------|
| [.memory/instructions.md](.memory/instructions.md) | Comportement / scope |
| [.memory/security.md](.memory/security.md) | **Toujours avant un patch** |
| [.memory/preferences.md](.memory/preferences.md) | UI / style |
| [.memory/decisions.md](.memory/decisions.md) | Architecture |
| [.memory/quirks.md](.memory/quirks.md) | Pièges connus |

## Structure utile

- `index.php` — routeur + headers sécurité
- `landingpage.php` — landing
- `editeur.php` — UI éditeur
- `main.js` — logique client (CodeMirror, preview, export)
- `styles.css` — thème / layout
- `.htaccess` — Apache local (PHP restreint à localhost)
- `.htaccessprod` — Apache production Hostinger (à renommer en `.htaccess` sur l’hébergeur)
- `docs/` — sécurité, headers, SRI

## Skills pertinents

`memory-session-skill`, `frontend-design`, `frontend-accessibility-skill`, `gitnexus-*`.

Sécurité documentée dans `docs/` et `.memory/security.md` (pas de skill MCS).

## GitNexus

```bash
npx gitnexus analyze
npx gitnexus status
```

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **editeurhtml** (228 symbols, 387 relationships, 20 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/editeurhtml/context` | Codebase overview, check index freshness |
| `gitnexus://repo/editeurhtml/clusters` | All functional areas |
| `gitnexus://repo/editeurhtml/processes` | All execution flows |
| `gitnexus://repo/editeurhtml/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
