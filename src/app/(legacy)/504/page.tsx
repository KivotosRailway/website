import { HttpStatusPage } from "@/components/status/http-status-page";

export const metadata = { title: "504", robots: { index: false, follow: false } };

export default function GatewayTimeoutPage() {
  return <HttpStatusPage code={504} />;
}
