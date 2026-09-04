import type { Metadata } from "next";

import { ContactPage } from "@/components/portfolio/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact - Shreya Chourasia",
  description: "Every good build starts with a conversation. Get in touch with Shreya.",
};

export default function Page() {
  return <ContactPage packId="code" />;
}
