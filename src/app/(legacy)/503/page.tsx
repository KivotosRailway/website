import { HttpStatusPage } from "@/components/status/http-status-page";

export const metadata = { title: "503", robots: { index: false, follow: false } };

export default function ServiceUnavailablePage() {
  return <HttpStatusPage code={503} />;
}
