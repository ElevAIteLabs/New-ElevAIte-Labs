/**
 * Rewrites the case study copy on /work.
 *
 * Why: every article links to /work as proof, and the copy there was a mix of
 * raw technical inventories ("built as a React + TypeScript frontend with Vite
 * and a PHP/MySQL backend API"), paragraphs describing the client's business
 * rather than the work, and lengths ranging from 11 to 113 words. A buyer
 * clicking through from an article to check whether we are credible was
 * reading a package list.
 *
 * Every entry now follows the same shape: what the situation was, what we
 * built, what changed as a result. 40 to 55 words.
 *
 * Nothing is invented. Where a description carries a figure it came from the
 * original copy (only id 18 does). Places where a real number would strengthen
 * the entry are listed in NEEDS_METRIC below rather than filled with a guess.
 *
 * Usage:  node content/rewrite-work.mjs        # prints SQL to stdout
 */

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "''");

export const WORK = [
  {
    id: 7,
    // Was "Chaitan yamrutha-Community Empowerment Platform": the name was split
    // mid-word and the hyphen unspaced.
    title: 'Chaitanyamrutha - Community Empowerment Platform',
    description:
      'A public site for a community organisation running programmes across organic farming, animal welfare, education and healthcare. We built a structure that lets each initiative be explained on its own terms rather than compressed onto one page, so a supporter can find the programme they care about and act on it.',
  },
  {
    id: 8,
    // Was titled "bee echoo", identical to id 9, with the same description on
    // both. Two real projects that read as an accidental duplicate.
    title: 'bee echoo Web Platform',
    description:
      'A marketplace connecting creators, event hosts, studios and brands. We built the web platform in React and TypeScript: event discovery, campaign posting, creator profiles and media portfolios, so a brand can find and brief a creator without the negotiation moving into direct messages and getting lost.',
  },
  {
    id: 9,
    title: 'bee echoo Mobile App',
    description:
      'The companion app for the bee echoo marketplace, built for creators who work away from a desk. Browse and accept gigs, upload media from the phone that shot it, and manage bookings on the move, with everything syncing to the same profiles and campaigns as the web platform.',
  },
  {
    id: 10,
    title: 'Knowva',
    description:
      'A directory and comparison platform for AI tools, built as a React and TypeScript front end on a PHP and MySQL API. Visitors browse by category, compare tools side by side and discuss them in community threads. An admin dashboard keeps the catalogue maintained without developer involvement.',
  },
  {
    id: 11,
    title: 'Sree Nandas',
    description:
      'An online storefront for a Kerala bakery known for traditional South Indian sweets and snacks. We built the catalogue, ordering and delivery flow, so specialities that previously needed a visit to a physical counter can be ordered to the door, extending a well-known local brand beyond its outlets.',
  },
  {
    id: 13,
    title: 'AI-Powered Lead Coordinator',
    description:
      'An agent that handles incoming enquiries from prospective tenants end to end. It reads what each person is asking for, pre-qualifies against requirements and availability, and passes only genuine prospects to a human, so the letting team stops spending its day answering the same questions.',
  },
  {
    id: 14,
    title: 'AI-Powered Social Media Content Automation',
    description:
      'A content engine that runs without supervision. It gathers trending topics and industry news daily, generates posts shaped for each platform, and publishes across LinkedIn, Instagram and other channels. The brand stays current without anyone on the client team writing or scheduling a post.',
  },
  {
    id: 16,
    title: 'Intelligent SMS Lead Engagement via HubSpot',
    description:
      'An SMS layer on HubSpot that messages a lead the moment they enter the pipeline, answers their follow-up questions with AI, and keeps nudging on a schedule until they respond. First-response time stops depending on whether someone happens to be at their desk.',
  },
  {
    id: 17,
    title: 'WhatsApp Automation for Kredoo CRM',
    description:
      'WhatsApp Business automation built natively into Kredoo CRM. Leads are nurtured and followed up in the channel Indian buyers actually use, and every thread syncs back to the CRM record, so the history a salesperson needs sits in one place rather than on someone’s phone.',
  },
  {
    id: 18,
    title: 'Certification Issuance Automation',
    description:
      'Certificates issued automatically on course completion. The workflow populates a personalised template, renders a branded PDF and emails it to the recipient, replacing a manual process that ran in batches. Turnaround went from days to seconds, and nobody has to remember to start it.',
  },
  {
    id: 19,
    title: 'Email-to-Email Workflow via Monday.com',
    description:
      'Email routed into Monday.com and back out again. Incoming mail is parsed, categorised and created as a board item, and board changes trigger the right outbound reply. Scheduled follow-ups run off pipeline stage, so nothing depends on someone remembering to forward a message or chase a lead.',
  },
  {
    id: 20,
    title: 'GenZ IQ Learning',
    description:
      'A learning platform for colleges carrying courses, assignments, mock tests and live classes. Institutions get performance tracking across whole cohorts rather than one student at a time, so a department can see which topics a year group is struggling with before results arrive rather than afterwards.',
  },
  {
    id: 21,
    title: 'Mamma Magic',
    description:
      'An e-commerce app for a small retailer that had been taking orders over chat. Customers browse the catalogue, order and track delivery in one place, which removed the manual back and forth of confirming stock, price and payment message by message.',
  },
  {
    id: 22,
    title: 'SmartDoc: OCR Automation',
    description:
      'Document extraction that turns scanned PDFs into editable files. Built for large repositories where the alternative is retyping, it recognises text with high precision and processes files in bulk rather than one at a time, so digitising an archive stops being a staffing decision.',
  },
  {
    id: 23,
    title: 'Benri',
    description:
      'A mobile advertising platform where people earn real rewards for watching short ads. The reel-style feed connects viewers with brands, events and offers near them, while advertisers get real-time insight into what is actually being watched rather than what was merely served.',
  },
  {
    id: 24,
    title: 'Content Generation Platform',
    description:
      'An AI content tool covering social posts, blogs and marketing copy. Built so output follows a brand voice and its format rules rather than producing generic text that then has to be rewritten, which is where most content tooling quietly fails.',
  },
];

/**
 * Entries a real figure would strengthen. Deliberately left out of the copy
 * rather than guessed at.
 */
export const NEEDS_METRIC = [
  '13 Lead Coordinator: enquiries handled per week, or share auto-qualified',
  '16 HubSpot SMS: first-response time before and after',
  '17 WhatsApp Kredoo: follow-up volume, or reply rate',
  '19 Monday.com: emails routed per month',
  '22 SmartDoc OCR: pages processed, or extraction accuracy',
];

const sql = WORK.map((w) => `UPDATE work SET
  title = '${esc(w.title)}',
  description = '${esc(w.description)}'
WHERE id = ${w.id};`).join('\n\n');

console.log(sql);
