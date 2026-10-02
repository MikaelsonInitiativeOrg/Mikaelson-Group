import type { Metadata } from "next";
import { ORG } from "./content";

type OpenGraphBase = {
  type: "website";
  locale: string;
  siteName: string;
  images: NonNullable<Metadata["openGraph"]>["images"];
};

/** Canonical origin. Every absolute URL (sitemap, canonicals, JSON-LD) is built from it. */
export const SITE_URL = "https://www.mikaelsongroup.com";

export const SITE_DESCRIPTION =
  "Mikaelson Group articulates how human capability is developed: epistemic agency, intellectual infrastructure, applied human capability and generative capacity. Its non-profit wing is the Mikaelson Initiative.";

/** Square logo Google may show for the organisation (≥112px, crawlable, stable URL). */
export const LOGO_URL = `${SITE_URL}/brand/mikaelson-mark.png`;

/**
 * Open Graph fields every page repeats. A page's openGraph replaces the
 * layout's wholesale, including the share image from app/opengraph-image.tsx,
 * so the image is named here too.
 */
export const OG_BASE: OpenGraphBase = {
  type: "website",
  locale: "en_NG",
  siteName: "Mikaelson Group",
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Mikaelson Group: Human capability is infrastructure.",
    },
  ],
};

/** Public routes, for the sitemap. */
export const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/frameworks", priority: 0.8 },
  { path: "/initiative", priority: 0.8 },
  { path: "/contact", priority: 0.5 },
] as const;

/**
 * Organisation structured data for the home page: tells Google the
 * organisation's name, URL and logo, and how the two engines relate.
 * https://developers.google.com/search/docs/appearance/structured-data/organization
 */
export function organizationJsonLd() {
  const groupId = `${SITE_URL}/#organization`;
  const initiativeId = `${SITE_URL}/#initiative`;
  const logo = { "@type": "ImageObject", url: LOGO_URL, width: 800, height: 800 };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": groupId,
        name: ORG.group,
        url: SITE_URL,
        logo,
        image: LOGO_URL,
        description: SITE_DESCRIPTION,
        email: ORG.email,
        address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
        subOrganization: { "@id": initiativeId },
      },
      {
        "@type": "NGO",
        "@id": initiativeId,
        name: ORG.initiative,
        legalName: ORG.registeredName,
        url: ORG.initiativeUrl,
        logo,
        email: ORG.email,
        address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
        parentOrganization: { "@id": groupId },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORG.group,
        inLanguage: "en-NG",
        publisher: { "@id": groupId },
      },
    ],
  };
}
