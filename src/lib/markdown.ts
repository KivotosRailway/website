import { marked, Renderer } from "marked";
import { imageMap } from "@/lib/image-map.generated";

export function markdownToHtml(markdown: string): string {
  const localizedMarkdown = markdown.replace(/https?:\/\/[^\s)>'"]+/g, (url) => imageMap[url.replace(/[.,;:!?]+$/, "")] ?? url);
  const renderer = new Renderer();
  const renderImage = renderer.image.bind(renderer);
  renderer.image = (token) => renderImage(token).replace("<img ", '<img loading="lazy" decoding="async" ');
  return marked.parse(localizedMarkdown, { gfm: true, breaks: false, renderer }) as string;
}
