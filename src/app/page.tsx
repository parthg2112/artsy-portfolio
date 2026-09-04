import type { Metadata } from "next";

import { HomePage } from "@/components/portfolio/pages/HomePage";

export const metadata: Metadata = {
  title: "Shreya Chourasia - AI/ML engineer",
  description:
    "AI/ML engineer building intelligent systems: machine learning, C++ systems and automation. Selected work, writing and contact.",
};

export default function Page() {
  return <HomePage packId="code" />;
}
