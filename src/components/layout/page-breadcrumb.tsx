import Link from "next/link";
import { getLocaleMessages } from "@/lib/i18n";

export function PageBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="page-breadcrumb" aria-label={getLocaleMessages("zh-CN").common.pagePosition}>
      {items.map((item, index) => (
        <span className="page-breadcrumb-item" key={`${item.label}-${index}`}>
          {index > 0 && <span className="page-breadcrumb-separator" aria-hidden="true">›</span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
