import { Link } from 'react-router-dom';
import { SITE_URL } from '../seo/siteMeta';

/**
 * Landing page for "web development company in hyderabad".
 *
 * Built to the same shape as /ai-automation-company-hyderabad, which went from
 * position 21 to page one. What appears to have carried it: a root-level page
 * rather than a /learn article, Service and FAQPage markup, and every article
 * linking to it with the target phrase as anchor text. The /learn article on
 * this topic stays informational and links up here instead of competing.
 *
 * Deliberately "web development" rather than "website development". The latter
 * is contested by every template shop in the city and pulls in buyers shopping
 * on price alone; this phrase still catches that intent while describing what
 * we actually sell.
 *
 * Every project named here appears on /work. No client metrics invented.
 */

const SERVICES = [
  {
    name: 'Custom web applications',
    body: 'Software that happens to run in a browser: dashboards, portals, internal tools, multi-role platforms with real permissions behind them. React and TypeScript on the front, PHP or Node with a proper database behind it.',
    proof: 'Knowva',
  },
  {
    name: 'E-commerce storefronts',
    body: 'Catalogue, cart, payments, order tracking and the admin side someone actually has to run every day. The last part is where most builds disappoint, because it is the part nobody demos.',
    proof: 'Sree Nandas',
  },
  {
    name: 'Learning and member platforms',
    body: 'Courses, assignments, assessments and the reporting an institution needs to see how a cohort is doing rather than one student at a time.',
    proof: 'GenZ IQ Learning',
  },
  {
    name: 'Marketplaces and two-sided platforms',
    body: 'Two groups of users who need different things from the same system, with discovery, profiles and messaging that hold up when both sides grow.',
    proof: 'bee echoo Web Platform',
  },
  {
    name: 'Content and community sites',
    body: 'Fast, structured, and editable by the people who own the content rather than by us. Server-rendered where search visibility matters.',
    proof: 'Chaitanyamrutha',
  },
  {
    name: 'APIs and integrations',
    body: 'The layer that connects your site to everything else: payments, CRM, WhatsApp, ad platforms, internal systems. Often the actual reason a project is worth doing.',
    proof: 'Kredoo',
  },
];

const FAQS = [
  {
    q: 'What does a web project cost in Hyderabad?',
    a: 'A straightforward brochure or content site is usually the low end. A custom application with accounts, permissions and an admin panel sits well above it, because the build is software rather than pages. We scope fixed-fee once the requirement is clear, and we would rather run a short paid discovery than give you a number with a large margin of error inside it.',
  },
  {
    q: 'How long does it take?',
    a: 'A focused site is weeks. An application with real user roles is months, and anyone who quotes you weeks for that is either scoping something smaller than you asked for or planning to hand you something you cannot run. We give a date with the scope, not after it.',
  },
  {
    q: 'What do you build with?',
    a: 'React and TypeScript on the front end, Next.js where server rendering matters for search, and PHP or Node with MySQL or Postgres behind it. We pick the boring option deliberately. A stack your next developer already knows is worth more to you than one that impressed us.',
  },
  {
    q: 'Should we use WordPress instead?',
    a: 'Sometimes, and we will say so. If you need a content site with a familiar editor and no unusual logic, WordPress is cheaper to build and easier to staff. Custom is the right answer when the product is the software rather than the pages, or when you are integrating with systems a plugin cannot reach.',
  },
  {
    q: 'Who owns the code and the hosting?',
    a: 'You do, from the first commit. Repository, hosting, domain and database sit in your accounts rather than ours, so you can take the project to another team without rebuilding anything. We hand over credentials at the start, not at the end.',
  },
  {
    q: 'Do you design as well as build?',
    a: 'Yes, in-house. We do not hand a developer a file from a separate agency and hope the two halves meet. If you already have a designer or a design system, we will build to it.',
  },
  {
    q: 'What happens after launch?',
    a: 'A short warranty window is included for anything that is our defect. Beyond that, ongoing work is a monthly arrangement or hourly, whichever suits how much you expect to change. We will tell you honestly if you do not need a retainer.',
  },
];

const WebDevelopmentHyderabad = () => {
  const canonical = `${SITE_URL}/web-development-company-hyderabad`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    serviceType: 'Web development',
    name: 'Web Development Services in Hyderabad',
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'Country', name: 'India' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web development services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script data-seo="1" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script data-seo="1" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Hyderabad · India</span>
          <h1 className="fade-up">Web Development Company in Hyderabad</h1>
          <p className="fade-up">
            We build web applications, storefronts and platforms for businesses in Hyderabad
            and across India - designed and engineered in-house, handed over in your own
            accounts. Below is what we build, the projects behind each one, and what a first
            engagement looks like.
          </p>
          <div className="hero-tags-row fade-up">
            <span className="hero-tag"><span className="dot"></span>React &amp; TypeScript</span>
            <span className="hero-tag"><span className="dot"></span>Next.js</span>
            <span className="hero-tag"><span className="dot"></span>E-commerce</span>
            <span className="hero-tag"><span className="dot"></span>Custom Platforms</span>
            <span className="hero-tag"><span className="dot"></span>APIs</span>
          </div>
          <div style={{ marginTop: '32px' }} className="fade-up">
            <Link className="btn" to="/contact">Book a 30-minute call</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">What we build</span>
            <h2 className="display">Six kinds of project, all shipped.</h2>
          </div>

          <div className="lp-grid">
            {SERVICES.map((s) => (
              <div className="lp-card fade-up" key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                <div className="lp-proof">
                  <span className="lp-proof-label">Built</span>
                  {s.proof}
                </div>
              </div>
            ))}
          </div>

          <div className="fade-up" style={{ marginTop: '40px' }}>
            <Link className="link-arrow" to="/work">See the full project list <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">How it works</span>
            <h2 className="display">Scoped to ship, not to impress.</h2>
          </div>

          <div className="lp-steps">
            {[
              ['01', 'A conversation, not a pitch', 'Twenty minutes on what the thing has to do and who has to use it. If a template or an off-the-shelf product would serve you better, we will say so before you spend anything.'],
              ['02', 'Scope, priced fixed', 'Written scope, fixed fee, a date. The unglamorous parts - permissions, admin screens, error states - are named in it rather than discovered later.'],
              ['03', 'Design and build together', 'Designed in-house and engineered by the same team, so nothing is lost between a file and a front end. You see working software early, not a slideshow.'],
              ['04', 'Hand over the controls', 'Repository, hosting, domain and database in your name. You can take it to another team tomorrow without rebuilding anything.'],
            ].map(([n, title, body]) => (
              <div className="lp-step fade-up" key={n}>
                <span className="lp-step-num">{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Questions</span>
            <h2 className="display">Before you get in touch.</h2>
          </div>

          <div className="lp-faq">
            {FAQS.map((f) => (
              <details className="lp-faq-item fade-up" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="fade-up" style={{ marginTop: '40px' }}>
            <p style={{ color: 'var(--body)' }}>
              Deciding between agencies? Our guide on{' '}
              <Link to="/learn/web-app-development-company-hyderabad">what to ask a web app development company</Link>{' '}
              covers the questions worth asking. If your project is mobile, see{' '}
              <Link to="/mobile-app-development-company-hyderabad">mobile app development in Hyderabad</Link>.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '640px' }}>
            <span className="tag">Get started</span>
            <h2 className="display">Tell us what you need built.</h2>
            <p style={{ fontSize: '18px', marginTop: '18px' }}>
              We respond within one business day. If your project is in scope we will send a
              30-minute call invite. If it is not, we will tell you who would be a better fit.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link className="btn" to="/contact">Start a project</Link>
              <Link className="btn-outline" to="/work">See our work</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebDevelopmentHyderabad;
