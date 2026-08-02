import { useLocation } from 'react-router-dom';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../seo/siteMeta';

/**
 * JSON-LD for the organisation and its services.
 *
 * Several unrelated companies use near-identical names (elevaitelabs.io,
 * elevaitelabs.ai, elevaite.in, elevatelabs.ai), so the explicit identity
 * block plus sameAs links matter more than usual here — they tell Google
 * which "ElevAIte Labs" this domain is.
 *
 * NAP values are taken from the contact page, which holds the real details.
 */

const ORGANISATION = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  description:
    'ElevAIte Labs is an AI automation agency in Hyderabad, India, building AI workflow automations, custom AI agents, lead generation systems, and web and mobile applications.',
  email: 'elevaitelabs@gmail.com',
  telephone: '+91-75699-54054',
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
  name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
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

const StructuredData = () => {
  const { pathname } = useLocation();

  const blocks = [ORGANISATION, WEBSITE];
  if (pathname === '/' || pathname === '/services') {
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
