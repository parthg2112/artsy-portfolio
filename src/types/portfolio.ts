/**
 * Shapes for the portfolio. Content (words) and asset packs (artwork) are separate:
 * every pack renders the same content, so the two looks can be compared side by side.
 */

/* ---------------------------------- content --------------------------------- */

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/** One word-box in the kinetic hero heading. `width` is measured, not guessed. */
export interface HeadingWord {
  text: string;
  width: number;
  italic?: boolean;
}

/** A slot in the hero heading: a word, a cycling image chip, or an emoji glyph. */
export type HeadingSlot =
  | { kind: "word"; word: HeadingWord }
  | { kind: "chip"; slot: 0 | 1 | 2 }
  | { kind: "emoji"; icon: "outline" | "wink"; size: number };

export interface Project {
  title: string;
  /** Where the card links - a repo URL for this portfolio. */
  href: string;
  blurb: string;
}

export interface Service {
  index: string;
  title: string;
  description: string;
  /** Index into `AssetPack.projectCovers` - the work shown when this row is hovered. */
  coverIndex: number;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface PortfolioContent {
  name: string;
  wordmark: string;
  /** Short name used on the hero folder tab. */
  shortName: string;
  role: string;
  email: string;
  socials: NavLink[];
  navLinks: NavLink[];
  hero: {
    slots: HeadingSlot[];
    /** Accessible sentence; must match the words in `slots`. */
    ariaLabel: string;
    /** Container height = rows * 136. */
    rows: number;
  };
  projects: Project[];
  services: Service[];
  aboutStatement: string;
  /** Copy over the full-bleed image that opens between Work and About. */
  fullBleed: { title: string; hint: string; line: string };
  /** Right-side section index on the home page; hrefs are in-page anchors. */
  sectionIndex: { label: string; href: string }[];
  about: {
    heading: string;
    /** Desktop keeps these as authored line breaks; mobile reflows. */
    paragraphOneLines: string[];
    paragraphTwo: string;
    /** Caption on the taped polaroid between the paragraphs. */
    noteCaption: string;
  };
  contact: {
    headingWords: HeadingWord[];
    ariaLabel: string;
    intro: string;
    /** Tally form embed URL. Empty string hides the embed. */
    tallyEmbedUrl: string;
  };
  cta: { headline: string; buttonLabel: string };
  footerColumns: FooterColumn[];
}

/* -------------------------------- asset packs ------------------------------- */

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

/** A decorative element hanging from the top of the hero on a drawn string. */
export interface HeroOrnament {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  stringLength: number;
  zIndex: number;
}

export interface HeroDoodle {
  src: string;
  width: number;
  height: number;
  left: number;
  top: number;
  rotate?: number;
}

export interface FolderSheet {
  src: string;
  rotate: number;
  openX: number;
  openY: number;
  openRotate: number;
}

export interface FolderSticker {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rounded?: boolean;
}

export interface AssetPack {
  /** Stable id used by the route + switcher. */
  id: "code" | "original";
  label: string;
  heroOrnaments: HeroOrnament[];
  heroDoodles: HeroDoodle[];
  heroPlane: string;
  folder: {
    back: string;
    flap: string;
    backClipPath: string;
    sheets: FolderSheet[];
    stickers: FolderSticker[];
    avatar: string;
  };
  /** Three slots, each cycling through its own images every 935ms. */
  headingChips: [string[], string[], string[]];
  /** Marquee stickers; the loop distance is derived from the count. */
  stickers: string[];
  /** One cover per project, in the same order as `content.projects`. */
  projectCovers: ImageAsset[];
  /** `note` is the taped polaroid that breaks up the /about paragraphs. */
  portraits: { about: ImageAsset; cta: ImageAsset; note: ImageAsset };
  /** Decorative rule between About and Services. */
  divider: ImageAsset;
  /** Landscape image for the full-bleed scroll-expand section on the home page. */
  fullBleed: ImageAsset;
  aboutHero: {
    /** Art card pinned above the lens collage. */
    dossierCover: string;
    /** What that card pixel-dissolves into on hover. */
    artReveal: string;
    lensDesktop: string;
    lensMobile: string;
    lensAlt: string;
  };
}
