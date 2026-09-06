import Link from "next/link";

export function PageBreadcrumb({
  items,
  ariaLabel = "Page position",
}: {
  items: Array<{ label: string; href?: string }>;
  ariaLabel?: string;
}) {
  return (
    <nav className="page-breadcrumb" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <span className="page-breadcrumb-item" key={`${item.label}-${index}`}>
          {index > 0 && <span className="page-breadcrumb-separator" aria-hidden="true">›</span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
