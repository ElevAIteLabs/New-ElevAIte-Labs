/**
 * Single source of truth for per-route search metadata.
 *
 * Titles and descriptions are written around the keyword clusters we are
 * actually trying to win - local intent ("Hyderabad", "India") plus the
 * tool-led terms our case studies already cover (n8n, WhatsApp, CRM),
 * rather than the US-dominated generic "AI agency" head terms.
 *
 * The same map drives sitemap.xml and the prerender pass, so a new route
 * only has to be added here.
 */

export const SITE_URL = 'https://elevaitelabs.in';
export const SITE_NAME = 'ElevAIte Labs';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/pictures/logo.png`;

/**
 * `label` is the short human name for the route. It drives breadcrumb
 * structured data and the SiteNavigationElement block, both of which are
 * how Google reads the site's hierarchy when deciding what - if anything -
 * to show as sitelinks under the brand result. Keep them short: sitelink
 * labels are drawn from anchor text and headings, not from <title>.
 */
export const ROUTE_META = {
  '/': {
    label: 'Home',
    title: 'AI Automation Agency in Hyderabad | ElevAIte Labs',
    description:
      'ElevAIte Labs builds AI automations, custom AI agents, web and mobile apps for businesses in Hyderabad and across India. Save time, close more leads, scale faster.',
    changefreq: 'weekly',
    priority: '1.0',
  },
  '/about': {
    label: 'About',
    title: 'About ElevAIte Labs | AI & Automation Team, Hyderabad',
    description:
      'Meet the team behind ElevAIte Labs - an AI automation and product studio in Hyderabad building agents, workflows and apps that businesses actually use.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  '/services': {
    label: 'Services',
    title: 'AI Automation, AI Agents & App Development Services',
    description:
      'AI workflow automation, custom AI agents, lead generation systems, AI content engines, web and mobile app development, and AI strategy consulting.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  '/work': {
    label: 'Case Studies',
    title: 'Case Studies: n8n, WhatsApp & Workflow Automation',
    description:
      'Real projects from ElevAIte Labs - WhatsApp automation, HubSpot lead engagement, OCR document automation, certification issuance, and custom web and mobile apps.',
    changefreq: 'weekly',
    priority: '0.9',
  },
  '/products': {
    label: 'Kredoo CRM',
    title: 'Kredoo - Sales CRM with WhatsApp & Meta Ads Automation',
    description:
      'Kredoo is a modern sales CRM that auto-captures leads from Meta and Google Ads and automates follow-ups with n8n, so no enquiry goes cold.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  '/learn': {
    label: 'Learn',
    title: 'Learn AI Automation | Guides & Resources',
    description:
      'Practical guides on AI automation, n8n workflows, AI agents and lead generation systems from the ElevAIte Labs team.',
    changefreq: 'weekly',
    priority: '0.7',
  },
  '/contact': {
    label: 'Contact',
    title: 'Contact ElevAIte Labs | AI Automation Agency Hyderabad',
    description:
      'Talk to ElevAIte Labs about AI automation, custom AI agents or app development. Book a call with our Hyderabad team.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  '/blog-automation': {
    label: 'AI Workflow Automation',
    title: 'How AI Workflow Automation Cuts Manual Work | ElevAIte Labs',
    description:
      'How businesses use AI workflow automation and n8n to remove repetitive data entry, routing and follow-up work from their operations.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  '/blog-kredoo': {
    label: 'Building Kredoo',
    title: 'Building Kredoo: A CRM That Automates Follow-Ups',
    description:
      'The story behind Kredoo - why we built a sales CRM that captures Meta and Google Ads leads automatically and never lets a follow-up slip.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  '/blog-whatsapp': {
    label: 'WhatsApp Automation',
    title: 'WhatsApp Automation for Business | ElevAIte Labs',
    description:
      'How WhatsApp automation handles customer support, lead qualification and follow-ups at scale without adding headcount.',
    changefreq: 'monthly',
    priority: '0.6',
  },
};

/**
 * The routes we want Google to consider as the site's primary sections.
 * Order matters - it is the order emitted in the navigation schema.
 */
export const PRIMARY_NAV = ['/services', '/work', '/products', '/learn', '/about', '/contact'];

/** Routes that must never be indexed. */
export const NOINDEX_ROUTES = ['/admin', '/admin/login'];

/** Public routes, in sitemap order. */
export const PUBLIC_ROUTES = Object.keys(ROUTE_META);
