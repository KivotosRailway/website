export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").trim().split("\n");
  const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const renderInline = (text: string) =>
    escapeHtml(text)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, source: string) =>
        `<img src="${source.replace(/"/g, "&quot;")}" alt="${alt.replace(/"/g, "&quot;")}" />`,
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ol" | "ul" | null = null;
  let listItems: string[] = [];
  const flushParagraph = () => { if (paragraph.length) { html.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`); paragraph = []; } };
  const flushList = () => { if (listType && listItems.length) html.push(`<${listType}>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${listType}>`); listType = null; listItems = []; };
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); continue; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); html.push(`<h${heading[1].length}>${renderInline(heading[2])}</h${heading[1].length}>`); continue; }
    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) { flushParagraph(); flushList(); html.push(`<p><img src="${image[2].replace(/"/g, "&quot;")}" alt="${image[1].replace(/"/g, "&quot;")}" /></p>`); continue; }
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) { flushParagraph(); const next = unordered ? "ul" : "ol"; if (listType && listType !== next) flushList(); listType = next; listItems.push((unordered ?? ordered)![1]); continue; }
    flushList(); paragraph.push(trimmed);
  }
  flushParagraph(); flushList();
  return html.join("");
}