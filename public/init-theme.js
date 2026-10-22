(() => {
  const isTheme = (value) => value === "light" || value === "system" || value === "dark";
  let preference = "system";
  try {
    const cookieTheme = document.cookie.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("kr-theme="))?.slice("kr-theme=".length);
    if (isTheme(cookieTheme)) preference = cookieTheme;
    else {
      try {
        const saved = localStorage.getItem("kr-theme");
        if (isTheme(saved)) preference = saved;
      } catch {}
    }
  } catch {}
  const theme = preference === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const color = theme === "dark" ? "#10151d" : "#ffffff";
  document.documentElement.style.backgroundColor = color;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", color));
})();
