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
        .svc-detail { display: grid; grid-template-columns: 1.25fr 1fr; gap: 56px; padding: 56px 0; border-bottom: 1px solid var(--border); align-items: center; opacity: 1 !important; transform: none !important; }
        .svc-detail h2 { font-family: var(--display); font-size: clamp(32px, 4vw, 52px); font-weight: 600; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 16px; }
        .svc-detail .svc-eyebrow { font-family: var(--display); font-size: 22px; font-style: italic; color: var(--accent); margin-bottom: 8px; font-weight: 500; }
        .svc-detail p { font-size: 17px; line-height: 1.6; margin-bottom: 16px; }
        .svc-detail ul { list-style: none; margin-top: 20px; columns: 2; column-gap: 32px; }
        .svc-detail li { padding-left: 26px; position: relative; margin-bottom: 10px; font-size: 15px; color: var(--body); break-inside: avoid; }
        .svc-detail li::before { content: "→"; position: absolute; left: 0; color: var(--accent); font-weight: 600; }

        /* Remaining services - dense grid, no mascot */
        .svc-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
        .svc-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 32px 28px; display: flex; flex-direction: column; transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; }
        .svc-card:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.07); border-color: #cfd6dd; }
        .svc-card .svc-eyebrow { font-family: var(--display); font-size: 15px; font-style: italic; color: var(--accent); margin-bottom: 10px; font-weight: 500; letter-spacing: 0.01em; }
        .svc-card h3 { font-family: var(--display); font-size: 25px; font-weight: 600; color: var(--text); letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 12px; }
        .svc-card p { font-size: 15px; line-height: 1.55; margin-bottom: 18px; }
        .svc-card ul { list-style: none; margin-top: auto; border-top: 1px solid var(--border); padding-top: 16px; }
        .svc-card li { padding-left: 20px; position: relative; margin-bottom: 8px; font-size: 14px; color: var(--body); }
        .svc-card li:last-child { margin-bottom: 0; }
        .svc-card li::before { content: "→"; position: absolute; left: 0; color: var(--accent); font-weight: 600; }
        @media (max-width: 1100px) { .svc-cards { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) { .svc-cards { grid-template-columns: 1fr; } .svc-detail ul { columns: 1; } }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
        .price-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 36px 32px; display: flex; flex-direction: column; }
        .price-card.featured { background: var(--text); color: #fff; border-color: var(--text); }
        .price-card.featured h3, .price-card.featured .price { color: #fff; }
        .price-card.featured ul li { color: rgba(255,255,255,0.85); }
        .price-card.featured .badge { background: var(--accent); color: #fff; padding: 4px 10px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; align-self: flex-start; margin-bottom: 16px; }
        .price-card h3 { font-family: var(--display); font-size: 28px; font-weight: 500; color: var(--text); margin-bottom: 8px; }
        .price-card .price { font-family: var(--display); font-size: 42px; font-weight: 500; color: var(--text); margin-bottom: 8px; letter-spacing: -0.02em; }
        .price-card .price span { font-size: 14px; color: var(--body); font-family: var(--sans); font-weight: 400; }
        .price-card.featured .price span { color: rgba(255,255,255,0.7); }
        .price-card .desc { font-size: 14px; line-height: 1.5; margin-bottom: 24px; opacity: 0.8; }
        .price-card ul { list-style: none; margin-bottom: 32px; flex: 1; }
        .price-card li { font-size: 14px; padding: 8px 0; border-bottom: 1px solid var(--border); display: flex; gap: 8px; }
        .price-card.featured li { border-color: rgba(255,255,255,0.15); }
        .price-card li::before { content: "✓"; color: var(--accent); font-weight: 600; }
        .price-card.featured li::before { color: #fff; }
        @media (max-width: 960px) {
          .svc-detail { grid-template-columns: 1fr; gap: 32px; }
          .pricing-grid { grid-template-columns: 1fr; }
        }
        .arkin-automation-wrap { position: relative; display: flex; align-items: flex-end; justify-content: center; height: 400px; overflow: visible; }
        .arkin-svc-img { height: 400px; width: auto; object-fit: contain; object-position: bottom; filter: drop-shadow(0 24px 40px rgba(0,0,0,0.14)); position: relative; z-index: 2; animation: arkinFloat 5s ease-in-out infinite; }
        .tool-logo { position: absolute; z-index: 3; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); background: #fff; padding: 8px; object-fit: contain; }
        .tool-logo-n8n    { width: 56px; height: 56px; top: 30px;  left: 8%;  animation: floatTool1 6s ease-in-out infinite; }
        .tool-logo-wa     { width: 56px; height: 56px; top: 50px;  right: 6%; animation: floatTool2 7s ease-in-out infinite; padding: 6px; }
        /* Make's mark is ~1.9:1 — a square tile letterboxed it into a stamp */
        .tool-logo-make   { width: 88px; height: 50px; padding: 4px 8px; bottom: 80px; left: 4%; animation: floatTool3 5.5s ease-in-out infinite; }
        .tool-logo-zapier { width: 56px; height: 56px; bottom: 60px; right: 4%; animation: floatTool4 6.5s ease-in-out infinite; }
        @keyframes floatTool1 { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-12px) rotate(4deg)} }
        @keyframes floatTool2 { 0%,100%{transform:translateY(0) rotate(3deg)}  50%{transform:translateY(-16px) rotate(-3deg)} }
        @keyframes floatTool3 { 0%,100%{transform:translateY(-6px) rotate(2deg)} 50%{transform:translateY(8px) rotate(-2deg)} }
        @keyframes floatTool4 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        @media (max-width: 960px) {
          .arkin-automation-wrap { height: 320px; overflow: visible; }
          .arkin-svc-img { height: 320px; }
          .tool-logo-n8n    { width: 44px; height: 44px; top: 16px; left: 6%; }
          .tool-logo-wa     { width: 44px; height: 44px; top: 20px; right: 6%; }
          .tool-logo-make   { width: 68px; height: 42px; bottom: 40px; left: 4%; }
          .tool-logo-zapier { width: 44px; height: 44px; bottom: 30px; right: 4%; }
        }
      `}</style>

      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Services</span>
          <h1 className="fade-up">What We Build for You</h1>
          <p className="fade-up">Six core service lines, each scoped to ship in weeks, not quarters. Pick one - or stack them - to build the AI-native operation your business deserves.</p>
        </div>
      </section>

      <section style={{ padding: '0 0 var(--section-pad)' }}>
        <div className="wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading services...</div>
          ) : servicesData.length > 0 ? (
            <>
              {/* Lead service keeps the mascot - it earns its place once, not six times */}
              {(() => {
                const svc = servicesData[0];
                return (
                  <div className="svc-detail fade-up" key={svc.id || 'lead'}>
                    <div>
                      <div className="svc-eyebrow">{svc.eyebrow}</div>
                      <h2>{svc.title}</h2>
                      <p>{svc.description}</p>
                      {svc.features && svc.features.length > 0 && (
                        <ul>
                          {svc.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="arkin-automation-wrap">
                      <img src="/pictures/n8n.png" alt="n8n" className="tool-logo tool-logo-n8n" />
                      <img src="/pictures/WhatsApp_Logo_green.svg" alt="WhatsApp" className="tool-logo tool-logo-wa" />
                      <img src="/pictures/Make_Logo.jpg" alt="Make" className="tool-logo tool-logo-make" />
                      <img src="/pictures/zapier.png" alt="Zapier" className="tool-logo tool-logo-zapier" />
                      <img src="/pictures/animations-arkin.webp" alt={svc.title} className="arkin-svc-img" loading="lazy" />
                    </div>
                  </div>
                );
              })()}

              {/* Everything else reads faster as a scannable grid */}
              <div className="svc-cards">
                {servicesData.slice(1).map((svc, i) => (
                  <div className="svc-card fade-up" key={svc.id || i}>
                    <div className="svc-eyebrow">{svc.eyebrow}</div>
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    {svc.features && svc.features.length > 0 && (
                      <ul>
                        {svc.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>No services found.</div>
          )}
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

      <section className="cta-quiz">
        <div className="wrap fade-up">
          <span className="tag">Free Assessment</span>
          <h2>Not sure which one is right for you?</h2>
          <p>Take our 2-minute AI readiness quiz - we'll send back a custom recommendation.</p>
          <button className="btn btn-light" onClick={() => setIsQuizOpen(true)}>Take the Free Quiz →</button>
        </div>
      </section>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default Services;
