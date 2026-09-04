import type { PortfolioContent } from "@/types/portfolio";

const GITHUB = "https://github.com/ShreyaChourasia";

/**
 * Hero word boxes are measured, not guessed: each `width` is the rendered width at
 * 106px Instrument Serif / -3.18px tracking, times ~1.28 for the airy spacing the
 * design uses. The four rows must each stay under the 990px container (gap 16px):
 *   260+140+388 +32 = 820 | 473+68+184 +32 = 757
 *   460+140+330 +32 = 962 | 140+730+69  +32 = 971
 * There are no explicit breaks - the rows come from wrapping, so a box that is too
 * NARROW is also a bug: row 2 has 233px spare and the next slot needs 476, which is
 * what keeps it on its own line. Re-measure and re-check both bounds after any edit;
 * `hero.rows` sets the container height as rows * 136.
 */
export const content: PortfolioContent = {
  name: "Shreya Chourasia",
  wordmark: "shreya",
  shortName: "shreya",
  role: "AI/ML engineer",
  email: "shreyachourasia58@gmail.com",

  socials: [
    { label: "GitHub", href: GITHUB, external: true },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shreya-chourasia-11b404318/",
      external: true,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/_delulu._.shreya_",
      external: true,
    },
  ],

  navLinks: [
    { label: "Work", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  hero: {
    rows: 4,
    ariaLabel: "AI/ML engineer, applied ML and automation building things that think",
    slots: [
      { kind: "word", word: { text: "AI/ML", width: 260 } },
      { kind: "chip", slot: 0 },
      { kind: "word", word: { text: "engineer,", width: 388 } },

      { kind: "word", word: { text: "applied ML", width: 473 } },
      { kind: "emoji", icon: "outline", size: 68 },
      { kind: "word", word: { text: "and", width: 184 } },

      { kind: "word", word: { text: "automation", width: 460 } },
      { kind: "chip", slot: 1 },
      { kind: "word", word: { text: "building", width: 330 } },

      { kind: "chip", slot: 2 },
      { kind: "word", word: { text: "things that think", width: 730, italic: true } },
      { kind: "emoji", icon: "wink", size: 69 },
    ],
  },

  // Order matches `AssetPack.projectCovers`. Titles must stay one line - a wrapping
  // title breaks the card-height invariant the Work grid depends on.
  projects: [
    {
      title: "Atlas Pathfinder",
      href: `${GITHUB}/Atlas-pathfinder`,
      blurb:
        "A* shortest-path engine over real OpenStreetMap street networks, written in C++ with a Haversine heuristic and a deck.gl visualiser.",
    },
    {
      title: "Breast Cancer ML",
      href: `${GITHUB}/Application-of-ML-models-on-Breast-Cancer-Datasets`,
      blurb:
        "Five classifiers compared on the Wisconsin Diagnostic dataset with SMOTE balancing. SVM topped the table at about 97% accuracy.",
    },
    {
      title: "RAG Knowledge Base",
      href: `${GITHUB}/Rag-based_knowledge`,
      blurb:
        "Upload PDFs, search them semantically, get grounded answers with citations. TypeScript, Postgres + pgvector, local Ollama.",
    },
    {
      title: "Daily Email Digest",
      href: `${GITHUB}/Daily-email-digest-n8n`,
      blurb:
        "An n8n workflow that reads unread Gmail every morning, summarises it with Gemini, and posts the digest to Slack.",
    },
    {
      title: "n8n Workflows",
      href: `${GITHUB}/n8n-Journey-Projects`,
      blurb:
        "Form capture routed through Google Sheets and conditional logic into personalised Gmail replies.",
    },
  ],

  services: [
    {
      index: "01",
      title: "Machine Learning",
      // Breast Cancer ML - the classifier comparison this row describes.
      coverIndex: 1,
      description:
        "Training and evaluating models on real datasets. Preprocessing, balancing, and comparing classifiers until the numbers actually mean something.",
    },
    {
      index: "02",
      title: "Systems & Algorithms",
      // Atlas Pathfinder - the A* graph search over real streets.
      coverIndex: 0,
      description:
        "Graph search and pathfinding over real street networks, sized for real-world data and measured rather than assumed.",
    },
    {
      index: "03",
      title: "Automation",
      // n8n Workflows.
      coverIndex: 4,
      description:
        "n8n workflows that wire Gmail, Sheets, Slack and LLMs together so the repetitive work runs itself.",
    },
  ],

  aboutStatement:
    "I like problems where the answer has to be built rather than looked up. A graph that needs searching, a workflow that should have automated itself months ago. Most of what I know, I learned by shipping it.",

  fullBleed: {
    title: "I broke it first",
    hint: "Keep scrolling",
    line: "Everything here started as something that did not work yet.",
  },

  sectionIndex: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  about: {
    heading: "Hi, I'm Shreya. Nice to meet you!",
    // Desktop honours these breaks; mobile reflows them into one paragraph.
    paragraphOneLines: [
      "I am a B.Tech Computer Engineering",
      "student working across machine learning,",
      "systems programming and automation.",
    ],
    paragraphTwo:
      "Most of my projects start as a question I could not answer by reading, and end as a repository.",
    /** Caption on the taped polaroid; picks up the question in paragraph two. */
    noteCaption: "still asking the question",
  },

  contact: {
    // Unlike the hero, this heading uses natural widths (measured ratio ~1.00).
    // 768px container, gap 16px, wrapping 4 + 3:
    //   183.81+164.84+174.59+177.14 +48 = 748.38 | 151.48+39.13+457.19 +32 = 679.8
    ariaLabel: "Every good build starts with a conversation",
    headingWords: [
      { text: "Every", width: 183.81 },
      { text: "good", width: 164.84 },
      { text: "build", width: 174.59 },
      { text: "starts", width: 177.14 },
      { text: "with", width: 151.48 },
      { text: "a", width: 39.13 },
      { text: "conversation", width: 457.19, italic: true },
    ],
    intro:
      "Thanks for stopping by. If you have a problem worth building for, or just want to talk shop about models, graphs or automation, the form below reaches me directly.",
    // Tally form https://tally.so/r/XxbZBP, embedded transparent so the page grid shows through.
    tallyEmbedUrl:
      "https://tally.so/embed/XxbZBP?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  },

  cta: {
    headline:
      "Have something worth building? Let's talk about what it should become.",
    buttonLabel: "Drop a line",
  },

  footerColumns: [
    {
      heading: "Website",
      links: [
        { label: "Works", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Social",
      links: [
        { label: "GitHub", href: GITHUB, external: true },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/shreya-chourasia-11b404318/",
          external: true,
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/_delulu._.shreya_",
          external: true,
        },
      ],
    },
  ],
};
