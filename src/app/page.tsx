import type { Metadata } from "next";

import { HomePage } from "@/components/portfolio/pages/HomePage";

export const metadata: Metadata = {
  title: "Shreya Chourasia - AI/ML engineer",
  description:
    "AI/ML engineer building intelligent systems: applied machine learning, graph search and automation. Selected work and contact.",
};

export default function Page() {
  return <HomePage packId="code" />;
}
