import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/portfolio/pages/AboutPage";

export const metadata: Metadata = { title: "Original artwork - About" };

/**
 * Reference-only route. The artwork it renders is Aditi Kulkarni's and is gitignored,
 * so in production every image here would 404 - it is a local comparison surface and the
 * parity gate, nothing more.
 */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();

  return <AboutPage packId="original" />;
}
