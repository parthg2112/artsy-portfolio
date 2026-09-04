import type { Metadata } from "next";

import { AboutPage } from "@/components/portfolio/pages/AboutPage";

export const metadata: Metadata = {
  title: "About - Shreya Chourasia",
  description:
    "B.Tech student in Artificial Intelligence and Machine Learning, working across machine learning, systems programming and automation.",
};

export default function Page() {
  return <AboutPage packId="code" />;
}
