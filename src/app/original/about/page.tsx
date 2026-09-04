import type { Metadata } from "next";

import { AboutPage } from "@/components/portfolio/pages/AboutPage";

export const metadata: Metadata = { title: "Original artwork - About" };

export default function Page() {
  return <AboutPage packId="original" />;
}
