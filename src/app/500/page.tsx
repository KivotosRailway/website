import { HttpStatusPage } from "@/components/status/http-status-page";

export default function InternalServerErrorPage() {
  return <HttpStatusPage code={500} />;
}
