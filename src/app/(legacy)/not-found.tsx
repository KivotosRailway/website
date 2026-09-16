import { HttpStatusPage } from "@/components/status/http-status-page";

export default function NotFound() {
  return <HttpStatusPage code={404} />;
}
