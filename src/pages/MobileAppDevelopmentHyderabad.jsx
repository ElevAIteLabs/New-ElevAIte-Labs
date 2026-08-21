import { Link } from 'react-router-dom';
import { SITE_URL } from '../seo/siteMeta';

/**
 * Landing page for "mobile app development company in hyderabad".
 *
 * Same shape as /ai-automation-company-hyderabad, which moved from position 21
 * to page one: a root-level page rather than a /learn article, Service and
 * FAQPage markup, and every article linking here with the target phrase as
 * anchor text. The /learn article on React Native stays informational and
 * links up to this page rather than competing with it.
 *
 * Every project named here appears on /work. No client metrics invented.
 */

const SERVICES = [
  {
    name: 'Cross-platform apps in React Native',
    body: 'One codebase shipping to both stores. The right default for most products, because two native teams cost roughly twice as much and diverge in behaviour within a year.',
    proof: 'bee echoo Mobile App',
  },
  {
    name: 'E-commerce and ordering apps',
    body: 'Catalogue, cart, payments and order tracking, with the notification and delivery flow that turns a browse into a repeat purchase.',
    proof: 'Mamma Magic',
  },
  {
    name: 'Rewards and engagement apps',
    body: 'Feeds, streaks, wallets and reward mechanics, plus the analytics an operator needs to see what people actually watched rather than what was merely served.',
    proof: 'Benri',
  },
  {
    name: 'Marketplace apps',
    body: 'Two sides of a market on a phone: discovery, profiles, media upload from the device that shot it, and booking that survives patchy connectivity.',
    proof: 'bee echoo Mobile App',
  },
  {
    name: 'Backends and APIs',
    body: 'The part users never see and every app depends on: accounts, payments, push, storage and the admin panel your team runs the business from.',
    proof: 'Kredoo',
  },
  {
    name: 'Store submission and releases',
    body: 'App Store and Play Console setup, review submission, and the release process afterwards. Handed over configured in your own developer accounts, not ours.',
    proof: 'Mamma Magic',
  },
];

const FAQS = [
  {
    q: 'What does a mobile app cost in Hyderabad?',
    a: 'It depends far more on what happens behind the app than on the screens. An app talking to an existing API is a fraction of one that needs accounts, payments, notifications and an admin panel built alongside it. We scope fixed-fee once the requirement is clear, and we will tell you which parts are driving the number.',
  },
  {
    q: 'React Native or fully native?',
    a: 'React Native for most products, because one codebase to both stores is genuinely cheaper to build and much cheaper to keep consistent. Go native when the app depends on heavy device capability - sustained camera or video processing, complex background work, tight platform integrations. We will tell you which side your product falls on before you commit, and sometimes the answer costs us the larger project.',
  },
  {
    q: 'How long until it is in the stores?',
    a: 'A focused first version is usually a matter of months rather than weeks, and store review adds days at the end, occasionally longer for a first submission. We plan the submission rather than treating it as an afterthought, because a rejection late in a launch schedule is expensive.',
  },
  {
    q: 'Do you handle App Store and Play Store submission?',
    a: 'Yes, including the account setup, listing, screenshots and review responses. Everything is created in your developer accounts. Apps published under an agency account are a problem you only discover when you try to leave.',
  },
  {
    q: 'Who owns the app and the code?',
    a: 'You do, from the first commit. Repository, backend, developer accounts and database in your name. You can move to another team without rebuilding or renegotiating anything.',
  },
  {
    q: 'Do we need an app at all?',
    a: 'Often not. If your users would visit a few times a year, a fast mobile site serves them better and costs far less, because you avoid the store review cycle and the install barrier entirely. An app earns its place when it needs push, offline behaviour, the camera, or genuinely repeat use.',
  },
  {
    q: 'What about maintenance after launch?',
    a: 'iOS and Android both ship breaking changes on a schedule, so an app left alone for a year usually needs work before it needs features. A light monthly arrangement covers OS updates and store compliance; anything larger is scoped separately.',
  },
];

const MobileAppDevelopmentHyderabad = () => {
  const canonical = `${SITE_URL}/mobile-app-development-company-hyderabad`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    serviceType: 'Mobile app development',
    name: 'Mobile App Development Services in Hyderabad',
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'Country', name: 'India' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mobile app development services',
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
          <h1 className="fade-up">Mobile App Development Company in Hyderabad</h1>
          <p className="fade-up">
            We build iOS and Android apps for businesses in Hyderabad and across India -
            designed in-house, shipped to both stores, and handed over in your own developer
            accounts. Below is what we build, the projects behind each one, and how a first
            engagement works.
          </p>
          <div className="hero-tags-row fade-up">
            <span className="hero-tag"><span className="dot"></span>React Native</span>
            <span className="hero-tag"><span className="dot"></span>iOS &amp; Android</span>
            <span className="hero-tag"><span className="dot"></span>E-commerce Apps</span>
            <span className="hero-tag"><span className="dot"></span>Backends &amp; APIs</span>
            <span className="hero-tag"><span className="dot"></span>Store Releases</span>
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
            <h2 className="display">Six kinds of app, all shipped.</h2>
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
              ['01', 'A conversation, not a pitch', 'Twenty minutes on who uses this and how often. If a mobile site would serve them better than an app, we will say so before you spend anything.'],
              ['02', 'Scope, priced fixed', 'Written scope, fixed fee, a date, including the backend and the store submission rather than leaving them to be discovered later.'],
              ['03', 'Design and build together', 'Designed in-house and engineered by the same team. You get builds on a real device early, because an app only reveals itself in the hand.'],
              ['04', 'Ship and hand over', 'Published from your developer accounts, with the repository, backend and credentials in your name from the start.'],
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
              Weighing React Native against native? Our guide on{' '}
              <Link to="/learn/mobile-app-development-company-hyderabad">React Native and when not to use it</Link>{' '}
              goes into the trade-off. If your project is browser-based, see{' '}
              <Link to="/web-development-company-hyderabad">web development in Hyderabad</Link>.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '640px' }}>
            <span className="tag">Get started</span>
            <h2 className="display">Tell us what you want to build.</h2>
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

export default MobileAppDevelopmentHyderabad;
