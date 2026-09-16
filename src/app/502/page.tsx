import { HttpStatusPage } from "@/components/status/http-status-page";

export default function BadGatewayPage() {
  return <HttpStatusPage code={502} />;
}
