/**
 * Content model for the Mikaelson Group portal.
 * Everything on the site is editorial: no type here describes a sale,
 * an enrolment or an application.
 */

/** Catalogue reference, e.g. "MG/FW-01". */
export type CatalogueRef = `${string}/${string}`;

/** Publication state of an editorial item. */
export type PublicationStatus = "published" | "in-preparation" | "forthcoming";

/** Which arm of the institution an item belongs to. */
export type Engine = "group" | "initiative";

export type FrameworkSlug =
  | "epistemic-agency"
  | "intellectual-infrastructure"
  | "applied-human-capability"
  | "generative-capacity";

export interface FrameworkComponent {
  name: string;
  description: string;
}

export interface Framework {
  slug: FrameworkSlug;
  ref: CatalogueRef;
  /** Position in the sequence (1–4). Each framework presupposes the last. */
  order: 1 | 2 | 3 | 4;
  title: string;
  /** One-line summary for indexes. */
  summary: string;
  /** The working definition, one or two sentences. */
  definition: string;
  /** The question the framework exists to answer. */
  governingQuestion: string;
  /** The level at which the framework is observed. */
  unitOfAnalysis: string;
  components: FrameworkComponent[];
  /** A common misreading, stated so it can be set aside. */
  notToBeConfusedWith: string;
}

export interface Author {
  name: string;
  affiliation?: string;
}

/** A long-form scholarly publication. */
export interface Monograph {
  ref: CatalogueRef;
  title: string;
  subtitle?: string;
  authors: Author[];
  engine: Engine;
  /** The research series it belongs to, if any. */
  series?: string;
  abstract: string;
  status: PublicationStatus;
  /** ISO date (YYYY-MM-DD); absent until published. */
  publishedOn?: string;
  pages?: number;
  /** Canonical location of the text, when published. */
  href?: string;
}

/** A short editorial note, statement or field report. */
export interface Dispatch {
  ref: CatalogueRef;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  issuedOn: string;
  engine: Engine;
  kind: "statement" | "field-note" | "editorial" | "notice";
  summary: string;
  href?: string;
}

/** A research series within the Initiative's archive. */
export interface ResearchSeries {
  ref: CatalogueRef;
  title: string;
  description: string;
}

/** Descriptive overview of the Mikaelson School Clubs programme. */
export interface SchoolClubOverview {
  name: string;
  /** Who the clubs serve, e.g. "Secondary-school students". */
  constituency: string;
  /** How a club is run. */
  format: string;
  /** What a club concerns itself with. */
  focus: string[];
  /** Which frameworks the clubs put into practice. */
  frameworks: FrameworkSlug[];
  /** The programme's own site. */
  href: string;
}

/** A correspondence desk in the contact directory. */
export interface CorrespondenceDesk {
  ref: CatalogueRef;
  title: string;
  /** Who should write to this desk. */
  forWhom: string;
  /** What the desk handles. */
  handles: string[];
  email: string;
  /** Subject-line prefix so the secretariat can route the letter. */
  subjectPrefix: string;
  engine: Engine | "both";
}

/** A row in a legal or governance record. */
export interface RecordEntry {
  label: string;
  value: string;
  /** True when the value is awaiting confirmation and must not be relied on. */
  pending?: boolean;
}

/** Publication state of a blog post. Drafts are never served publicly. */
export type PostStatus = "draft" | "published";

/** A blog post, written in the Studio and stored in Neon. */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Public Vercel Blob URL (or any https URL). */
  coverImage: string | null;
  coverAlt: string | null;
  authorName: string;
  authorRole: string | null;
  /** Markdown-style text; see src/lib/article.tsx for the supported syntax. */
  body: string;
  status: PostStatus;
  /** ISO timestamp; set the first time the post is published. */
  publishedAt: string | null;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

/** The fields an editor can send when creating or updating a post. */
export type BlogPostInput = Omit<BlogPost, "id" | "publishedAt" | "updatedAt">;
