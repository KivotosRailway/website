import { PageBreadcrumb } from "@/components/layout/page-breadcrumb";

export function PageLocation({
  items,
  ariaLabel,
}: {
  items: Array<{ label: string; href?: string }>;
  ariaLabel: string;
}) {
  return <div className="page-location"><PageBreadcrumb items={items} ariaLabel={ariaLabel} /></div>;
}
