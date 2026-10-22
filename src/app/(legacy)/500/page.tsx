import { HttpStatusPage } from "@/components/status/http-status-page";

export const metadata = { title: "500", robots: { index: false, follow: false } };

export default function InternalServerErrorPage() {
  return <HttpStatusPage code={500} />;
}
