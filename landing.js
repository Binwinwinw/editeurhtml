(function () {
  const THEME_KEY = "rt_ui_theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function readStoredTheme() {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      /* private mode / quota */
    }
    return null;
  }

  function writeStoredTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode / quota */
    }
  }

  function labelFor(theme) {
    return theme === "dark"
      ? "Passer au thème clair"
      : "Passer au thème sombre";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.setAttribute("aria-label", labelFor(theme));
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.setAttribute("title", labelFor(theme));
    }
  }

  let theme = readStoredTheme() || systemTheme();
  applyTheme(theme);

  if (toggle) {
    toggle.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      writeStoredTheme(theme);
      applyTheme(theme);
    });
  }
})();
