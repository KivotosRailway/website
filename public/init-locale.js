(() => {
  const canonicalLocale = (value) => {
    const language = value?.toLowerCase().replaceAll("_", "-");
    if (!language) return null;
    if (/^zh(?:-|$)/.test(language)) return /^zh-(tw|hk|mo)(-|$)|-hant(?:-|$)/.test(language) ? "zh-Hant" : "zh-Hans";
    if (/^en(?:-|$)/.test(language)) return "en";
    if (/^(ja|jp)(?:-|$)/.test(language)) return "jp";
    return null;
  };
  const parts = location.pathname.split("/");
  const firstSegment = parts[1];
  const pathLocale = canonicalLocale(firstSegment);
  const isUnknownLanguagePath = !pathLocale && /^[a-z]{2,3}(?:-[a-z0-9]+)*$/i.test(firstSegment ?? "");
  let locale = pathLocale;
  if (!locale) {
    try { locale = canonicalLocale(localStorage.getItem("kr-locale")); } catch {}
  }
  if (!locale) {
    for (const language of navigator.languages?.length ? navigator.languages : [navigator.language]) {
      locale = canonicalLocale(language);
      if (locale) break;
    }
  }
  locale ??= "en";
  const path = pathLocale || isUnknownLanguagePath ? `/${parts.slice(2).join("/")}` : location.pathname;
  const normalizedPath = path.replace(/\/$/, "");
  const destination = `/${locale}${normalizedPath}/`;
  const search = new URLSearchParams(location.search);
  search.delete("lang");
  const canonicalUrl = destination + (search.size ? `?${search}` : "") + location.hash;
  if (location.pathname + location.search + location.hash !== canonicalUrl) location.replace(canonicalUrl);
})();
