import type { Metadata } from "next";

import { HomePage } from "@/components/portfolio/pages/HomePage";

export const metadata: Metadata = { title: "Original artwork - reference" };

export default function Page() {
  return <HomePage packId="original" />;
}
