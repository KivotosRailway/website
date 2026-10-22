export type ThemePreference = "light" | "system" | "dark";

function isTheme(value: string | null | undefined): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function getInitialThemePreference(): ThemePreference {
  try {
    const cookie = document.cookie.split(";").map((entry) => entry.trim())
      .find((entry) => entry.startsWith("kr-theme="))?.slice("kr-theme=".length);
    if (isTheme(cookie)) return cookie;
  } catch { /* Storage may be disabled independently of cookies. */ }
  try {
    const saved = window.localStorage.getItem("kr-theme");
    if (isTheme(saved)) return saved;
  } catch { /* System preference works without browser storage. */ }
  return "system";
}

export function applyTheme(preference: ThemePreference) {
  const theme = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;
  const color = theme === "dark" ? "#10151d" : "#ffffff";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = color;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", color));
  try { window.localStorage.setItem("kr-theme", preference); } catch { /* Keep the current theme usable. */ }
  try { document.cookie = `kr-theme=${preference}; Path=/; Max-Age=31536000; SameSite=Lax`; } catch { /* Optional persistence. */ }
}
