import type { Metadata } from "next";

import { ContactPage } from "@/components/portfolio/pages/ContactPage";

export const metadata: Metadata = { title: "Original artwork - Contact" };

export default function Page() {
  return <ContactPage packId="original" />;
}
