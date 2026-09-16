import { HttpStatusPage } from "@/components/status/http-status-page";

export default function GatewayTimeoutPage() {
  return <HttpStatusPage code={504} />;
}
