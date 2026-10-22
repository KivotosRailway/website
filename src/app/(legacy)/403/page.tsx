import { HttpStatusPage } from "@/components/status/http-status-page";

export const metadata = { title: "403", robots: { index: false, follow: false } };

export default function ForbiddenPage() {
  return <HttpStatusPage code={403} />;
}
