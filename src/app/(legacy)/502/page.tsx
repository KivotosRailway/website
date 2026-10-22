import { HttpStatusPage } from "@/components/status/http-status-page";

export const metadata = { title: "502", robots: { index: false, follow: false } };

export default function BadGatewayPage() {
  return <HttpStatusPage code={502} />;
}
