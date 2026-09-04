import type { Metadata } from "next";
import { Gluten, Instrument_Sans, Instrument_Serif, Manjari } from "next/font/google";

import { ClickSpark } from "@/components/portfolio/shared/ClickSpark";
import { paletteBootScript } from "@/components/portfolio/shared/usePalette";

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
    "AI/ML engineer, applied ML and automation, building things that think.",
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
      {/* No manual <head>: rendering one suppresses Next's own metadata injection, which
          is what emits the <link rel="icon"> for app/icon.svg. First child of <body>
          still runs before anything paints, which is all the palette needs. */}
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
        {children}
        {/* Viewport-fixed and pointer-events-none, so it draws over every route without
            intercepting a single click. */}
        <ClickSpark />
      </body>
    </html>
  );
}
