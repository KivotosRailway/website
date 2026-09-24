import type { CSSProperties } from "react";

export function PageTitleHero({
  title,
  image,
  imagePosition = "center",
}: {
  title: string;
  image: string;
  imagePosition?: string;
}) {
  const mediaStyle = {
    "--page-title-hero-image": `url("${image}")`,
    "--page-title-hero-position": imagePosition,
  } as CSSProperties;

  return (
    <section className="page-title-hero" aria-labelledby="page-title">
      <div className="page-title-hero-media" style={mediaStyle} aria-hidden="true" />
      <div className="page-title-hero-label"><h1 id="page-title">{title}</h1></div>
    </section>
  );
}
