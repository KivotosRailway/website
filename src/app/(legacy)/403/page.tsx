import { HttpStatusPage } from "@/components/status/http-status-page";

export default function ForbiddenPage() {
  return <HttpStatusPage code={403} />;
}
