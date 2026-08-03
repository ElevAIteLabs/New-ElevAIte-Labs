import { Link } from 'react-router-dom';
import { SITE_URL, SITE_NAME } from '../seo/siteMeta';

/**
 * Landing page for "ai automation company in hyderabad".
 *
 * Deliberately targets the non-"best" variant. Queries phrased as "best X in
 * city" are read by Google as comparison intent and answered with third-party
 * listicles and directories, so a single company page cannot win them. The
 * plain "company in city" variant is served by service pages, which is what
 * the agencies currently ranking are using.
 *
 * Everything here is grounded in projects on /work and the six service lines
 * in the CMS. No client metrics are invented.
 */

const SERVICES = [
  {
    name: 'AI workflow automation',
    body: 'Removing a repetitive sequence someone performs by hand: reading an incoming message, deciding what it is, putting the data where it belongs, notifying the right person. Built on n8n, usually self-hosted so your data stays in infrastructure you control.',
    proof: 'Email-to-Email Workflow via Monday.com',
  },
  {
    name: 'Custom AI agents',
    body: 'For work that needs a judgement rather than a fixed branch - unstructured text, inconsistent documents, requests that could mean three different things. If the behaviour fits a decision tree you want an automation instead, and we will tell you so.',
    proof: 'AI-Powered Lead Coordinator',
  },
  {
    name: 'WhatsApp and CRM automation',
    body: 'Acknowledgement, qualification and follow-up in the channel Indian buyers actually use, connected to the CRM so records stay current without anyone copying anything across.',
    proof: 'WhatsApp Automation for Kredoo CRM',
  },
  {
    name: 'Lead response systems',
    body: 'Instant first reply, qualification before a human is involved, and sequences that stop the moment someone responds. Speed of first response moves revenue more directly than almost anything else in a sales process.',
    proof: 'Intelligent SMS Lead Engagement via HubSpot',
  },
  {
    name: 'Document and data extraction',
    body: 'Reading scanned invoices, forms and statements, extracting fields by meaning rather than position, validating the result and flagging what fails. That validation step is what separates a demo from something you can run a business on.',
    proof: 'SmartDoc: OCR Automation',
  },
  {
    name: 'Content and publishing pipelines',
    body: 'Research, generation per platform, approval and scheduled publishing as one pipeline, rather than a person coordinating five tools around a chat window.',
    proof: 'AI-Powered Social Media Content Automation',
  },
];

const FAQS = [
  {
    q: 'What does an AI automation company actually deliver?',
    a: 'Working systems, not strategy decks. In practice that means a workflow that runs without supervision, an agent that handles unstructured requests, a document pipeline, or a lead response system. If a proposal cannot tell you what will exist at the end and who will use it, it is not scoped properly.',
  },
  {
    q: 'How long does a first automation take?',
    a: 'A first workflow is usually days rather than weeks. Most of the effort is not construction, it is mapping the current process honestly, including the exceptions people handle without noticing they handle them. Those exceptions are what break naive automations.',
  },
  {
    q: 'Do you work with businesses outside Hyderabad?',
    a: 'Yes. We are based in HITEC City and work with teams across India. The work is remote by nature, and we are happy to meet in person when you are in the city.',
  },
  {
    q: 'Which automation should we build first?',
    a: 'Almost always the one that is boring, high-frequency, and currently done by your most expensive person. It pays for itself quickly and it teaches your team what to trust. Lead response is usually second, because first-reply speed affects revenue directly.',
  },
  {
    q: 'Do we need an AI agent or a simpler automation?',
    a: 'Ask whether a competent new hire would need judgement to do the task, or just instructions. Instructions mean a workflow, which is cheaper and far more predictable. Judgement means an agent. Most businesses need considerably more of the first than the second.',
  },
  {
    q: 'Who owns the automations you build?',
    a: 'You do. Code, hosting, domain and database are in your name from day one, and self-hosted n8n means the workflows keep running whether or not you keep working with us.',
  },
];

const AiAutomationHyderabad = () => {
  const canonical = `${SITE_URL}/ai-automation-company-hyderabad`;

  // FAQ markup is one of the few structured data types that can still change
  // how a local service result is displayed, so it is worth carrying here.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    serviceType: 'AI automation',
    name: 'AI Automation Services in Hyderabad',
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'Country', name: 'India' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI automation services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name },
      })),
    },
  };

  return (
    <>
      <script
        data-seo="1"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        data-seo="1"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Hyderabad · India</span>
          <h1 className="fade-up">AI Automation Company in Hyderabad</h1>
          <p className="fade-up">
            We build AI automations, custom agents and lead systems for businesses in
            Hyderabad and across India - and we deploy them, rather than handing over a
            strategy document. Below is what we actually build, the projects behind each
            one, and how a first engagement works.
          </p>
          <div className="hero-tags-row fade-up">
            <span className="hero-tag"><span className="dot"></span>n8n Workflows</span>
            <span className="hero-tag"><span className="dot"></span>AI Agents</span>
            <span className="hero-tag"><span className="dot"></span>WhatsApp Automation</span>
            <span className="hero-tag"><span className="dot"></span>CRM Integration</span>
            <span className="hero-tag"><span className="dot"></span>Document AI</span>
          </div>
          <div style={{ marginTop: '32px' }} className="fade-up">
            <Link className="btn" to="/contact">Book a 30-minute call</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">What we automate</span>
            <h2 className="display">Six things we are asked for most.</h2>
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
              ['01', 'A conversation, not a pitch', 'Twenty minutes on what your team actually does by hand. We will tell you if the problem is an automation, an agent, or neither - including when the answer is that you do not need us.'],
              ['02', 'Map the real process', 'Including the exceptions people handle without noticing. This is where most of the effort goes, and skipping it is why naive automations break in week two.'],
              ['03', 'Build the first workflow', 'One process, end to end, with failure handling from the start. An automation that fails silently is worse than none, because people keep trusting it after it has stopped working.'],
              ['04', 'Hand over the controls', 'Code, hosting and accounts in your name. Self-hosted where it matters, so nothing depends on us continuing to be involved.'],
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
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '640px' }}>
            <span className="tag">Get started</span>
            <h2 className="display">Tell us what your team does by hand.</h2>
            <p style={{ fontSize: '18px', marginTop: '18px' }}>
              We respond within one business day. If your project is in scope we will send a
              30-minute call invite. If it is not, we will tell you who would be a better fit.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link className="btn" to="/contact">Start a project</Link>
              <Link className="btn-outline" to="/learn">Read our guides</Link>
            </div>
            <p style={{ marginTop: '28px', fontSize: '15px', color: 'var(--muted)' }}>
              {SITE_NAME} · HITEC City, Hyderabad 500081 · +91 75699 54054
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AiAutomationHyderabad;
