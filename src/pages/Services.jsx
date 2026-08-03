import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';

const Services = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // For PHP backend, adjust this URL depending on your server setup
  const apiUrl = (r) => import.meta.env.DEV ? `http://localhost:5000/${r}` : `${import.meta.env.VITE_API_URL}/${r}.php`;

  useEffect(() => {
    fetch(apiUrl('services'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServicesData(data);
        } else {
          console.error('API Error: Expected array, got:', data);
          setServicesData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setServicesData([]);
      });
  }, []);

  return (
    <>
      <style>{`
        /* One card spec for all six lines. Equal heights, equal weight. */
        .svc-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
        .svc-card { position: relative; overflow: hidden; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card-lg); padding: 32px 28px 26px; display: flex; flex-direction: column; transition: transform 180ms var(--ease-out), box-shadow 180ms var(--ease-out), border-color 180ms ease; }
        .svc-card-num { position: absolute; top: 18px; right: 24px; font-family: var(--display); font-size: 46px; font-weight: 700; line-height: 1; color: var(--border); letter-spacing: -0.03em; pointer-events: none; transition: color 180ms ease; }
        .svc-card .svc-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
        .svc-card h3 { font-family: var(--display); font-size: 25px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 12px; max-width: 82%; }
        .svc-card p { font-size: 14.5px; line-height: 1.55; margin-bottom: 20px; }
        .svc-card ul { list-style: none; margin: 0 0 20px; padding-top: 18px; border-top: 1px solid var(--border); }
        .svc-card li { position: relative; padding-left: 20px; margin-bottom: 9px; font-size: 13.5px; line-height: 1.45; color: var(--body); }
        .svc-card li:last-child { margin-bottom: 0; }
        .svc-card li::before { content: ""; position: absolute; left: 3px; top: 7px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .svc-card .svc-more { color: var(--muted); font-style: italic; }
        .svc-card .svc-more::before { background: var(--border); }
        .svc-card-cta { margin-top: auto; font-size: 13px; font-weight: 600; color: var(--accent); display: inline-flex; align-items: center; gap: 6px; }
        .svc-card-cta .arrow { transition: transform 160ms var(--ease-out); }

        @media (hover: hover) and (pointer: fine) {
          .svc-card:hover { transform: translateY(-4px); border-color: #D4D0C6; box-shadow: 0 14px 32px -14px rgba(15,15,15,0.16); }
          .svc-card:hover .svc-card-num { color: rgba(30,136,229,0.22); }
          .svc-card:hover .svc-card-cta .arrow { transform: translateX(4px); }
        }
        .svc-card:focus-within { border-color: var(--accent); }

        /* Tool stack strip */
        .svc-stack { background: var(--card); }
        .svc-stack-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .svc-stack-inner p { font-size: 16px; line-height: 1.6; margin-top: 14px; max-width: 460px; }
        .svc-stack-logos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .svc-stack-logos span { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); height: 92px; display: grid; place-items: center; padding: 18px; }
        .svc-stack-logos img { max-height: 40px; max-width: 100%; width: auto; object-fit: contain; border-radius: 6px; }

        /* Engagement band - the one place Arkin appears on this page */
        .svc-engage { background: var(--text); color: #fff; }
        .svc-engage-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 56px; align-items: center; }
        .svc-engage-grid h2 { color: #fff; margin-bottom: 28px; }
        .svc-engage-list { list-style: none; margin: 0 0 32px; padding: 0; counter-reset: eng; }
        .svc-engage-list li { position: relative; padding-left: 22px; margin-bottom: 16px; font-size: 15.5px; line-height: 1.6; color: rgba(255,255,255,0.72); }
        .svc-engage-list li::before { content: ""; position: absolute; left: 2px; top: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
        .svc-engage-list b { color: #fff; font-weight: 600; }
        .svc-engage-cta { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
        .svc-engage-quiz { background: none; border: 0; padding: 0; font-family: inherit; font-size: 14px; color: rgba(255,255,255,0.6); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: color 160ms ease; }
        .svc-engage-quiz .arrow { transition: transform 160ms var(--ease-out); }
        .svc-engage-quiz:hover { color: #fff; }
        .svc-engage-quiz:hover .arrow { transform: translateX(4px); }
        .svc-engage-visual { display: flex; justify-content: center; align-items: flex-end; }
        .svc-engage-visual img { height: 340px; width: auto; object-fit: contain; filter: drop-shadow(0 24px 48px rgba(0,0,0,0.5)); }

        @media (max-width: 1100px) {
          .svc-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 960px) {
          .svc-stack-inner { grid-template-columns: 1fr; gap: 32px; }
          .svc-stack-logos { justify-content: flex-start; gap: 32px; }
          .svc-engage-grid { grid-template-columns: 1fr; gap: 32px; }
          .svc-engage-visual { order: -1; }
          .svc-engage-visual img { height: 240px; }
        }
        @media (max-width: 700px) {
          .svc-cards { grid-template-columns: 1fr; }
          .svc-card h3 { max-width: 76%; }
          .svc-card .svc-eyebrow { font-size: 12px; }
          .svc-card-cta { min-height: 44px; }
        }
      `}</style>

      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Services</span>
          <h1 className="fade-up">What We Build for You</h1>
          <p className="fade-up">Six core service lines, each scoped to ship in weeks, not quarters. Pick one - or stack them - to build the AI-native operation your business deserves.</p>
        </div>
      </section>

      {/* Every line rendered identically. The old page gave line 01 a mascot
          hero and demoted the rest to leftovers, which is what read as
          inconsistent - and feature counts of 4 to 11 made the cards ragged. */}
      <section style={{ padding: '0 0 var(--section-pad)' }}>
        <div className="wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading services...</div>
          ) : servicesData.length > 0 ? (
            <div className="svc-cards">
              {servicesData.map((svc, i) => {
                const feats = svc.features || [];
                const shown = feats.slice(0, 4);
                const rest = feats.length - shown.length;
                return (
                  <article className="svc-card fade-up" key={svc.id || i}>
                    <span className="svc-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="svc-eyebrow">{(svc.eyebrow || '').replace(/^\d+\s*\/\s*/, '')}</div>
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    {shown.length > 0 && (
                      <ul>
                        {shown.map((feature, idx) => <li key={idx}>{feature}</li>)}
                        {rest > 0 && <li className="svc-more">+{rest} more</li>}
                      </ul>
                    )}
                    <Link to="/contact" className="svc-card-cta">Scope this <span className="arrow">&rarr;</span></Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>No services found.</div>
          )}
        </div>
      </section>

      {/* The tool logos used to float around the mascot. As a stated strip they
          answer a real buyer question instead of decorating one card. */}
      <section className="svc-stack">
        <div className="wrap">
          <div className="svc-stack-inner fade-up">
            <div>
              <span className="tag">The stack</span>
              <h2 className="display">Built on the tools you already run.</h2>
              <p>We work inside your existing systems rather than asking you to migrate. If it has an API, it joins the workflow.</p>
            </div>
            <div className="svc-stack-logos">
              <span><img src="/pictures/n8n.png" alt="n8n" loading="lazy" /></span>
              <span><img src="/pictures/zapier.png" alt="Zapier" loading="lazy" /></span>
              <span><img src="/pictures/Make_Logo.jpg" alt="Make" loading="lazy" /></span>
              <span><img src="/pictures/WhatsApp_Logo_green.svg" alt="WhatsApp Business API" loading="lazy" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Arkin appears once on this page, and only where he has a job */}
      <section className="svc-engage">
        <div className="wrap">
          <div className="svc-engage-grid">
            <div className="fade-up">
              <span className="tag" style={{ color: 'var(--accent)' }}>How an engagement runs</span>
              <h2 className="display">Scoped in a week. Shipping in four.</h2>
              <ol className="svc-engage-list">
                <li><b>Week 1 &mdash; Scope.</b> We map the workflow, agree the success metric, and fix the price. No open-ended discovery.</li>
                <li><b>Weeks 2&ndash;4 &mdash; Build.</b> Working software every week, in your environment, not a demo sandbox.</li>
                <li><b>After &mdash; Own it or keep us.</b> Documented handover to your team, or a retainer if you would rather we keep compounding it.</li>
              </ol>
              <div className="svc-engage-cta">
                <Link to="/contact" className="btn btn-light">Book a scoping call &rarr;</Link>
                <button className="svc-engage-quiz" onClick={() => setIsQuizOpen(true)}>
                  Not sure which line you need? Take the 2-minute quiz <span className="arrow">&rarr;</span>
                </button>
              </div>
            </div>
            <div className="svc-engage-visual fade-up">
              <img src="/pictures/Agent-arkin.webp" alt="Arkin - ElevAIte Labs" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '720px' }}>
            <span className="tag">Engagement Models</span>
            <h2 className="display">Three ways to work with us.</h2>
          </div>
          <div className="pricing-grid fade-up">
            <div className="price-card">
              <h3>Sprint</h3>
              <div className="price">₹2.5L<span> / 2 weeks</span></div>
              <div className="desc">A fixed-scope build. One automation, one app screen, one Agent.</div>
              <ul>
                <li>Discovery + scoping</li>
                <li>Design &amp; build</li>
                <li>Deployment</li>
                <li>30-day support</li>
              </ul>
              <Link to="/contact" className="btn btn-ghost" style={{ justifyContent: 'center' }}>Start a Sprint</Link>
            </div>
            <div className="price-card featured">
              <span className="badge">Most popular</span>
              <h3>Project</h3>
              <div className="price">₹8L+<span> / 4–8 weeks</span></div>
              <div className="desc">A complete system. Multiple workflows or a full app, end-to-end.</div>
              <ul>
                <li>Everything in Sprint</li>
                <li>Multi-workflow architecture</li>
                <li>Integrations + data layer</li>
                <li>90-day optimization</li>
              </ul>
              <Link to="/contact" className="btn btn-light" style={{ justifyContent: 'center' }}>Scope a Project</Link>
            </div>
            <div className="price-card">
              <h3>Retainer</h3>
              <div className="price">₹3L<span> / month</span></div>
              <div className="desc">Ongoing partnership. We become your fractional AI team.</div>
              <ul>
                <li>Dedicated team allocation</li>
                <li>Quarterly roadmap</li>
                <li>Continuous shipping</li>
                <li>Priority support</li>
              </ul>
              <Link to="/contact" className="btn btn-ghost" style={{ justifyContent: 'center' }}>Book a Call</Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* The quiz CTA folded into the engagement band above - two dark
          sections back to back read as one undifferentiated slab. */}

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default Services;
