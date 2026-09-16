(() => {
  const isTheme = (value) => value === "light" || value === "system" || value === "dark";
  let preference = "system";
  try {
    const cookieTheme = document.cookie.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("kr-theme="))?.slice("kr-theme=".length);
    const savedTheme = isTheme(cookieTheme) ? cookieTheme : localStorage.getItem("kr-theme");
    if (isTheme(savedTheme)) preference = savedTheme;
  } catch {}
  const theme = preference === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
