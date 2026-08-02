import { useLocation } from 'react-router-dom';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  ROUTE_META,
  PRIMARY_NAV,
} from '../seo/siteMeta';

/**
 * JSON-LD for the organisation, the site, and its services.
 *
 * Several unrelated companies use near-identical names (elevaitelabs.io,
 * elevaitelabs.ai, elevaite.in, elevatelabs.ai), so the explicit identity
 * block plus sameAs links matter more than usual here - they tell Google
 * which "ElevAIte Labs" this domain is.
 *
 * The identity fields below (logo, founder, foundingDate, sameAs, address)
 * are what Google's Knowledge Graph reads when deciding whether a brand is
 * a distinct entity worth showing a knowledge panel for. Markup alone does
 * not create a panel - Google also needs the same facts corroborated on
 * third-party sources - but without it there is nothing to corroborate.
 *
 * NAP values are taken from the contact page, which holds the real details.
 */

/** Set once confirmed - a wrong year is worse than an absent one. */
const FOUNDING_YEAR = null;

const FOUNDERS = [
  {
    '@type': 'Person',
    '@id': `${SITE_URL}/about#shanmukh`,
    name: 'Ramachandruni Anjaneya Shanmukh',
    jobTitle: 'Founder & CEO',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: [
      'https://www.linkedin.com/in/shanmukh-r-a70a0919a/',
      'https://www.instagram.com/shanmukh_ramachandruni_245/',
    ],
  },
  {
    '@type': 'Person',
    '@id': `${SITE_URL}/about#premsai`,
    name: 'Premsai Kilaru',
    jobTitle: 'Co-Founder & CMO',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: [
      'https://www.linkedin.com/in/premsaikilaru/',
      'https://www.instagram.com/premsaikilaru/',
    ],
  },
  {
    '@type': 'Person',
    '@id': `${SITE_URL}/about#vishhnu`,
    name: 'Vishhnu Saai Gudise',
    jobTitle: 'Co-Founder & CTO',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: [
      'https://www.linkedin.com/in/vishhnu-saai-gudise/',
      'https://www.instagram.com/vishhnu_chinnu/',
    ],
  },
];

const ORGANISATION = {
  '@context': 'https://schema.org',
  // Organization is the type Google's entity pipeline reads; ProfessionalService
  // keeps the local-business signals (address, areaServed, telephone) valid.
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: SITE_NAME,
  alternateName: ['ElevAIte Labs Hyderabad', 'Elevaite Labs', 'ElevAIte'],
  url: SITE_URL,
  // An explicit ImageObject with dimensions - a bare URL is accepted but the
  // panel logo is only eligible above 112x112.
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: DEFAULT_OG_IMAGE,
    contentUrl: DEFAULT_OG_IMAGE,
    width: 1024,
    height: 1024,
    caption: SITE_NAME,
  },
  image: { '@id': `${SITE_URL}/#logo` },
  slogan: 'AI automation that actually ships.',
  description:
    'ElevAIte Labs is an AI automation agency in Hyderabad, India, building AI workflow automations, custom AI agents, lead generation systems, and web and mobile applications.',
  email: 'team@elevaitelabs.in',
  telephone: '+91-75699-54054',
  ...(FOUNDING_YEAR ? { foundingDate: String(FOUNDING_YEAR) } : {}),
  foundingLocation: {
    '@type': 'Place',
    name: 'Hyderabad, Telangana, India',
  },
  founder: FOUNDERS,
  employee: FOUNDERS,
  knowsAbout: [
    'AI automation',
    'n8n workflow automation',
    'Custom AI agents',
    'WhatsApp Business automation',
    'Lead generation systems',
    'CRM automation',
    'Web and mobile app development',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'team@elevaitelabs.in',
      telephone: '+91-75699-54054',
      areaServed: 'IN',
      availableLanguage: ['en', 'te', 'hi'],
    },
  ],
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'City', name: 'Hyderabad' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'HITEC City, Hyderabad',
    postalCode: '500081',
    addressRegion: 'Telangana',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.linkedin.com/company/elevaitelabs/',
    'https://www.instagram.com/elevaite_labs',
  ],
};

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  // Google reads WebSite.name (alongside og:site_name) for the site name shown
  // above the URL in the result, in place of the bare domain.
  name: SITE_NAME,
  alternateName: 'ElevAIte Labs Hyderabad',
  description: ORGANISATION.description,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
};

/**
 * The site's primary sections, declared as navigation.
 *
 * Sitelinks are fully automated - Google states there is no markup that
 * produces them. What this does is remove ambiguity about which routes are
 * top-level sections, which is one of the inputs to that automation. It is
 * a supporting signal, not a switch.
 */
const SITE_NAVIGATION = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#navigation`,
  name: `${SITE_NAME} main navigation`,
  itemListElement: PRIMARY_NAV.map((path, i) => ({
    '@type': 'SiteNavigationElement',
    position: i + 1,
    name: ROUTE_META[path].label,
    description: ROUTE_META[path].description,
    url: `${SITE_URL}${path}`,
  })),
};

// Mirrors the six services in the CMS.
const SERVICE_NAMES = [
  'AI Automation & Workflows',
  'Web & Mobile App Development',
  'Custom AI Agents',
  'Lead Generation Systems',
  'AI Content Creation',
  'AI Strategy Consulting',
];

const SERVICE_LIST = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Services offered by ElevAIte Labs',
  itemListElement: SERVICE_NAMES.map((name, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'IN',
    },
  })),
};

/** Breadcrumbs give every inner page an explicit parent, so Google renders
 *  "elevaitelabs.in > Services" instead of a raw URL. */
const breadcrumbFor = (path, label) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}${path}` },
  ],
});

const StructuredData = () => {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const meta = ROUTE_META[path];

  const blocks = [ORGANISATION, WEBSITE];

  if (path === '/') {
    blocks.push(SITE_NAVIGATION);
  } else if (meta) {
    blocks.push(breadcrumbFor(path, meta.label));
  }

  if (path === '/' || path === '/services') {
    blocks.push(SERVICE_LIST);
  }

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          data-seo="1"
          type="application/ld+json"
          // Schema blocks are static constants, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
