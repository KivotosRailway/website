import { marked } from "marked";
import { imageMap } from "@/lib/image-map.generated";

export function markdownToHtml(markdown: string): string {
  const localizedMarkdown = markdown.replace(/https?:\/\/[^\s)>'"]+/g, (url) => imageMap[url.replace(/[.,;:!?]+$/, "")] ?? url);
  return marked.parse(localizedMarkdown, { gfm: true, breaks: false }) as string;
}