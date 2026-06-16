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
        .svc-detail { display: grid; grid-template-columns: 1.4fr 1fr; gap: 80px; padding: 80px 0; border-bottom: 1px solid var(--border); align-items: center; opacity: 1 !important; transform: none !important; }
        .svc-detail:nth-child(even) .svc-detail-img { order: -1; }
        .svc-detail h2 { font-family: var(--display); font-size: clamp(32px, 4vw, 52px); font-weight: 600; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 20px; }
        .svc-detail .svc-eyebrow { font-family: var(--display); font-size: 22px; font-style: italic; color: var(--accent); margin-bottom: 8px; font-weight: 500; }
        .svc-detail p { font-size: 17px; line-height: 1.6; margin-bottom: 18px; }
        .svc-detail ul { list-style: none; margin-top: 20px; }
        .svc-detail li { padding-left: 28px; position: relative; margin-bottom: 12px; font-size: 16px; color: var(--body); }
        .svc-detail li::before { content: "→"; position: absolute; left: 0; color: var(--accent); font-weight: 600; }
        .svc-detail-img { aspect-ratio: 4/3; }
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
          .svc-detail { grid-template-columns: 1fr; gap: 40px; }
          .svc-detail:nth-child(even) .svc-detail-img { order: 0; }
          .pricing-grid { grid-template-columns: 1fr; }
        }
        .arkin-automation-wrap { position: relative; display: flex; align-items: flex-end; justify-content: center; height: 580px; overflow: visible; }
        .arkin-svc-img { height: 600px; width: auto; object-fit: contain; object-position: bottom; filter: drop-shadow(0 24px 40px rgba(0,0,0,0.14)); position: relative; z-index: 2; animation: arkinFloat 5s ease-in-out infinite; }
        .tool-logo { position: absolute; z-index: 3; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); background: #fff; padding: 8px; object-fit: contain; }
        .tool-logo-n8n    { width: 56px; height: 56px; top: 30px;  left: 8%;  animation: floatTool1 6s ease-in-out infinite; }
        .tool-logo-wa     { width: 56px; height: 56px; top: 50px;  right: 6%; animation: floatTool2 7s ease-in-out infinite; padding: 6px; }
        .tool-logo-make   { width: 60px; height: 60px; bottom: 80px; left: 4%; animation: floatTool3 5.5s ease-in-out infinite; }
        .tool-logo-zapier { width: 56px; height: 56px; bottom: 60px; right: 4%; animation: floatTool4 6.5s ease-in-out infinite; }
        @keyframes floatTool1 { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-12px) rotate(4deg)} }
        @keyframes floatTool2 { 0%,100%{transform:translateY(0) rotate(3deg)}  50%{transform:translateY(-16px) rotate(-3deg)} }
        @keyframes floatTool3 { 0%,100%{transform:translateY(-6px) rotate(2deg)} 50%{transform:translateY(8px) rotate(-2deg)} }
        @keyframes floatTool4 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        .arkin-svc-simple { height: 600px; }
        .arkin-svc-simple-img { height: 600px; }
        @media (max-width: 960px) {
          .svc-detail-img { aspect-ratio: unset; }
          .arkin-automation-wrap { height: 480px; overflow: visible; }
          .arkin-svc-img { height: 480px; }
          .arkin-svc-simple { height: 400px; }
          .arkin-svc-simple-img { height: 380px; }
          .tool-logo-n8n    { width: 44px; height: 44px; top: 16px; left: 6%; }
          .tool-logo-wa     { width: 44px; height: 44px; top: 20px; right: 6%; }
          .tool-logo-make   { width: 48px; height: 48px; bottom: 40px; left: 4%; }
          .tool-logo-zapier { width: 44px; height: 44px; bottom: 30px; right: 4%; }
        }
      `}</style>

      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Services</span>
          <h1 className="fade-up">What We Build for You</h1>
          <p className="fade-up">Six core service lines, each scoped to ship in weeks, not quarters. Pick one — or stack them — to build the AI-native operation your business deserves.</p>
        </div>
      </section>

      <section style={{ padding: '0' }}>
        <div className="wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading services...</div>
          ) : (
            servicesData.map((svc, i) => (
              <div className="svc-detail fade-up" key={svc.id || i}>
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
                {svc.image === 'animations-arkin.png' ? (
                  <div className="arkin-automation-wrap svc-detail-img">
                    <img src="/pictures/n8n.png" alt="n8n" className="tool-logo tool-logo-n8n" />
                    <img src="/pictures/WhatsApp_Logo_green.svg" alt="WhatsApp" className="tool-logo tool-logo-wa" />
                    <img src="/pictures/Make_Logo.jpg" alt="Make" className="tool-logo tool-logo-make" />
                    <img src="/pictures/zapier.png" alt="Zapier" className="tool-logo tool-logo-zapier" />
                    <img src="/pictures/animations-arkin.png" alt={svc.title} className="arkin-svc-img" />
                  </div>
                ) : (
                  <div className="arkin-char-wrap arkin-svc-simple svc-detail-img">
                    <img src={`/pictures/${svc.image || 'Agent-arkin.png'}`} alt={svc.title} className="arkin-char arkin-svc-simple-img" />
                  </div>
                )}
              </div>
            ))
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
          <p>Take our 2-minute AI readiness quiz — we'll send back a custom recommendation.</p>
          <button className="btn btn-light" onClick={() => setIsQuizOpen(true)}>Take the Free Quiz →</button>
        </div>
      </section>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default Services;
