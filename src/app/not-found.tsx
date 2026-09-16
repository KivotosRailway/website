import { SiteShell } from "@/components/layout/site-shell";
import { HttpStatusPage } from "@/components/status/http-status-page";

export default function NotFound() {
  return <SiteShell locale="zh-Hans"><HttpStatusPage code={404} /></SiteShell>;
}
