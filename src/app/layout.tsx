import type { Metadata } from "next";
import { Gluten, Instrument_Sans, Instrument_Serif, Manjari } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const manjari = Manjari({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Variable weight axis; the site only ever renders the 900 end.
const gluten = Gluten({ variable: "--font-logo", subsets: ["latin"] });

const instrumentSans = Instrument_Sans({ variable: "--font-sans-alt", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://shreya.codes"),
  title: {
    default: "Shreya Chourasia - AI/ML engineer",
    template: "%s",
  },
  description:
    "AI/ML engineer, C++ systems and automation, building things that think.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${manjari.variable} ${gluten.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
