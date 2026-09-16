import { HttpStatusPage } from "@/components/status/http-status-page";

export default function ServiceUnavailablePage() {
  return <HttpStatusPage code={503} />;
}
