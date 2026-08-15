import { Link } from 'react-router-dom';
import { SITE_URL } from '../seo/siteMeta';

/**
 * Landing page for buyers outside India.
 *
 * Deliberately /global rather than /usa. A Canadian, British, Australian or
 * Singaporean buyer needs exactly the same things a US one does: pricing in
 * dollars rather than lakhs, the time difference framed as useful, and answers
 * on contracts and data handling before the first call. Naming it after one
 * country would have excluded buyers we would happily take, and Search Console
 * already shows impressions from five countries outside India.
 *
 * The rest of the site keeps its India positioning. This page does not replace
 * it, and hreflang in Seo.jsx tells Google which audience each version suits
 * rather than redirecting anyone by IP address.
 */

const CAPABILITIES = [
  {
    name: 'Workflow automation',
    body: 'Removing a repetitive sequence someone performs by hand: reading an incoming message, deciding what it is, putting the data where it belongs, notifying the right person. Built on n8n, self-hosted when you want the data staying inside your own infrastructure.',
    proof: 'Email-to-Email Workflow via Monday.com',
  },
  {
    name: 'Custom AI agents',
    body: 'For work that needs judgement rather than a fixed branch: unstructured text, inconsistent documents, requests that could mean three different things. If the behaviour fits a decision tree you want an automation instead, and we will say so before you spend anything.',
    proof: 'AI-Powered Lead Coordinator',
  },
  {
    name: 'Document and data extraction',
    body: 'Reading scanned invoices, forms and statements, extracting fields by meaning rather than position, validating the result and flagging what fails. That validation step is the difference between a demo and something you can run a business on.',
    proof: 'SmartDoc: OCR Automation',
  },
  {
    name: 'Lead response systems',
    body: 'Instant first reply, qualification before a human is involved, and sequences that stop the moment someone responds. First-response speed moves revenue more directly than almost anything else in a sales process.',
    proof: 'Intelligent SMS Lead Engagement via HubSpot',
  },
  {
    name: 'Web and mobile applications',
    body: 'Production applications in React, React Native and Next.js. Designed in-house, shipped to the app stores, and handed over with the repository and the deployment pipeline in your accounts.',
    proof: 'Kredoo CRM',
  },
  {
    name: 'Overflow and white-label delivery',
    body: 'If you are an agency with more automation sold than capacity to build it, we work as your delivery team. Your client relationship, your brand on the deliverable, our engineers behind it. Several of our engagements run this way.',
    proof: null,
  },
];

const FAQS = [
  {
    q: 'How does the time difference actually work?',
    a: 'India Standard Time is 9.5 to 12.5 hours ahead of the continental United States, and 4.5 to 5.5 ahead of the UK and Europe. In practice that means work you brief at the end of your day is progressing while you sleep and waiting for review when you start. We hold a fixed overlap window each day, usually your early morning, for anything that needs a live conversation. Teams who have not worked this way before tend to expect it to be a cost and find it is closer to a second shift.',
  },
  {
    q: 'Who owns the code and the workflows?',
    a: 'You do, from the first commit. The repository, the hosting accounts, the domain and the database are in your name rather than ours. Self-hosted n8n means your workflows keep running whether or not you continue working with us, and there is no proprietary layer you would have to rebuild if you moved to another provider.',
  },
  {
    q: 'Where is our data processed and stored?',
    a: 'Wherever you require. We deploy to your cloud accounts by default, so a US client running on AWS us-east-1 has nothing leaving that region. Where a workflow calls a language model, we will tell you which provider and what is sent before it is built, and we can restrict processing to providers with the residency commitments your policy requires. We sign NDAs before scoping and a data processing agreement before any production data is involved.',
  },
  {
    q: 'What about GDPR and CCPA?',
    a: 'We build to the requirement you are subject to rather than assuming one. In practice that means data minimisation in the workflow design, no personal data in logs or analytics, a documented processing basis, and deletion paths that actually work. We are a processor rather than a controller in most engagements, and we will sign the corresponding agreement.',
  },
  {
    q: 'How do we contract and pay?',
    a: 'A mutual NDA, then a master services agreement with a statement of work per project. Fixed fee where scope is clear, monthly retainer where the work is continuous. We invoice in US dollars and receive payment by international bank transfer, Wise or Payoneer. Net 15 or net 30, whichever your finance team prefers.',
  },
  {
    q: 'What does a first engagement look like?',
    a: 'A 30-minute call to establish whether the problem is worth automating at all, then a written scope with a fixed price and a delivery date. First workflows are usually days rather than weeks. Most of the effort is not construction, it is mapping the current process honestly, including the exceptions your team handles without noticing they handle them.',
  },
  {
    q: 'Why work with a team in India rather than one locally?',
    a: 'Cost is the obvious answer and the least interesting one. The substantive reasons are the overnight cycle and the fact that we specialise narrowly in automation rather than treating it as one service line among twenty. If you want someone in the room, we are the wrong choice and we will say so on the first call.',
  },
];

const Global = () => {
  const canonical = `${SITE_URL}/global`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    serviceType: 'AI automation and software development',
    name: 'AI Automation and Development for International Teams',
    provider: { '@id': `${SITE_URL}/#organization` },
    // India stays in the list. This page adds markets rather than replacing
    // the positioning the rest of the site is built on.
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'Country', name: 'India' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services for international clients',
      itemListElement: CAPABILITIES.map((c) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.name },
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
          <span className="tag fade-up">For teams in the US, UK, Canada and Australia</span>
          <h1 className="fade-up">AI Automation, Built Overnight</h1>
          <p className="fade-up">
            We are an automation and product studio in Hyderabad, India, working with
            companies and agencies abroad. You brief at the end of your day and review
            progress at the start of the next one. Fixed-fee scopes, code in your accounts,
            and a straight answer when the honest one is that you should not build it.
          </p>
          <div className="hero-tags-row fade-up">
            <span className="hero-tag"><span className="dot"></span>n8n Workflows</span>
            <span className="hero-tag"><span className="dot"></span>AI Agents</span>
            <span className="hero-tag"><span className="dot"></span>Document AI</span>
            <span className="hero-tag"><span className="dot"></span>CRM Integration</span>
            <span className="hero-tag"><span className="dot"></span>White-Label Delivery</span>
          </div>
          <div style={{ marginTop: '32px' }} className="fade-up">
            <Link className="btn btn-primary" to="/contact">Book a 30-minute call</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">The overnight cycle</span>
            <h2 className="display" style={{ maxWidth: '820px' }}>
              A time difference is only a problem if you treat it as a meeting problem
            </h2>
          </div>
          <div className="svc-list fade-up">
            <div className="svc-row">
              <div className="svc-num">01</div>
              <div className="svc-title">You brief, end of your day</div>
              <div className="svc-desc">
                A written scope, a Loom, or thirty minutes on a call in your afternoon.
                Whatever is quickest for you.
              </div>
            </div>
            <div className="svc-row">
              <div className="svc-num">02</div>
              <div className="svc-title">We build, through your night</div>
              <div className="svc-desc">
                Our full working day sits inside your night. Questions get asked in writing
                so nothing waits twelve hours for an answer that could have been a sentence.
              </div>
            </div>
            <div className="svc-row">
              <div className="svc-num">03</div>
              <div className="svc-title">You review, start of your day</div>
              <div className="svc-desc">
                Progress is waiting when you open your laptop, with a fixed overlap window
                in your early morning for anything that genuinely needs a live conversation.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">What we build</span>
            <h2 className="display" style={{ maxWidth: '820px' }}>
              Six things, done properly, rather than twenty listed on a page
            </h2>
          </div>
          <div className="svc-list fade-up">
            {CAPABILITIES.map((c, i) => (
              <div className="svc-row" key={c.name}>
                <div className="svc-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="svc-title">{c.name}</div>
                <div className="svc-desc">
                  {c.body}
                  {c.proof && (
                    <>
                      {' '}
                      <Link to="/work" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                        See: {c.proof}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Pricing</span>
            <h2 className="display" style={{ maxWidth: '820px' }}>
              Published ranges, in dollars
            </h2>
            <p style={{ maxWidth: '760px', marginTop: '18px', color: 'var(--body)', fontSize: '18px', lineHeight: 1.6 }}>
              Most agencies in this market will not put a number on a page. These are ours,
              and they are close to the going rate for competent offshore automation work.
              What moves a project between them is how many decisions the system has to make
              and how messy the input is, not how many hours it takes.
            </p>
          </div>
          <div className="svc-list fade-up">
            <div className="svc-row">
              <div className="svc-num">$</div>
              <div className="svc-title">Single workflow</div>
              <div className="svc-desc">
                Roughly $500 to $1,500. Three to five systems connected, with error handling
                and alerting included rather than quoted separately.
              </div>
            </div>
            <div className="svc-row">
              <div className="svc-num">$$</div>
              <div className="svc-title">Multi-step system with AI</div>
              <div className="svc-desc">
                Roughly $1,500 to $5,000. Custom integrations, a model making a judgement
                somewhere in the flow, multi-branch logic and a tested fallback for the cases
                it gets wrong.
              </div>
            </div>
            <div className="svc-row">
              <div className="svc-num">$$$</div>
              <div className="svc-title">Ongoing retainer</div>
              <div className="svc-desc">
                From about $1,200 a month. Maintenance, iteration and a named engineer.
                Worth it once you have systems in production, because APIs change and
                something breaks every few months in anything with external dependencies.
              </div>
            </div>
            <div className="svc-row">
              <div className="svc-num">◇</div>
              <div className="svc-title">White-label capacity</div>
              <div className="svc-desc">
                Monthly, priced on committed engineer time. For agencies who have sold more
                automation than they can staff.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Before you ask</span>
            <h2 className="display" style={{ maxWidth: '820px' }}>
              The questions every overseas client asks on the first call
            </h2>
          </div>
          <div className="faq-list fade-up" style={{ marginTop: '40px', maxWidth: '860px' }}>
            {FAQS.map((f) => (
              <div key={f.q} style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                  {f.q}
                </h3>
                <p style={{ color: 'var(--body)', fontSize: '16px', lineHeight: 1.65, margin: 0 }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="display fade-up" style={{ maxWidth: '760px', margin: '0 auto' }}>
            Tell us what your team does by hand
          </h2>
          <p className="fade-up" style={{ maxWidth: '620px', margin: '20px auto 0', color: 'var(--body)', fontSize: '18px', lineHeight: 1.6 }}>
            Thirty minutes, no charge, and you leave with a range and the reasoning behind
            it. If the numbers do not work yet, we will tell you that instead of quoting.
          </p>
          <div style={{ marginTop: '32px' }} className="fade-up">
            <Link className="btn btn-primary" to="/contact">Book a call</Link>
          </div>
          <p className="fade-up" style={{ marginTop: '28px', color: 'var(--muted)', fontSize: '15px' }}>
            Or see the <Link to="/work" style={{ color: 'var(--accent)' }}>projects we have shipped</Link>
            {' '}and the <Link to="/learn" style={{ color: 'var(--accent)' }}>guides we publish</Link>.
          </p>
        </div>
      </section>
    </>
  );
};

export default Global;
