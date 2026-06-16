import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';

const Products = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = (r) => import.meta.env.DEV ? `http://localhost:5000/${r}` : `${import.meta.env.VITE_API_URL}/${r}.php`;

  useEffect(() => {
    fetch(apiUrl('products'))
      .then(res => res.json())
      .then(data => {
        console.log('Products Page: Fetched products:', data);
        if (Array.isArray(data)) {
          setProductsData(data);
        } else {
          console.error('API Error: Expected array, got:', data);
          setError('Invalid data format received from API');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        .product-feature { display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: stretch; padding: 100px 0; border-bottom: 1px solid var(--border); }
        .product-feature:nth-child(even) > .product-img { order: -1; }
        .product-img { border-radius: 16px; min-height: 420px; height: 100%; }
        .product-feature .badge { display: inline-block; font-family: var(--display); font-size: 14px; font-style: italic; color: var(--accent); margin-bottom: 8px; }
        .product-feature h2 { font-family: var(--display); font-size: clamp(40px, 5vw, 64px); font-weight: 600; color: var(--text); letter-spacing: -0.025em; line-height: 1.05; margin-bottom: 18px; }
        .product-feature .tagline { font-size: 19px; line-height: 1.5; color: var(--body); margin-bottom: 28px; max-width: 480px; }
        .feature-list { list-style: none; margin-bottom: 32px; }
        .feature-list li { padding: 12px 0; border-bottom: 1px dashed var(--border); display: flex; gap: 12px; font-size: 15px; color: var(--body); }
        .feature-list li::before { content: "✦"; color: var(--accent); font-size: 12px; margin-top: 4px; }
        .feature-list li:last-child { border-bottom: none; }
        .product-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .arkin-product-wrap { background: transparent; min-height: 420px; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .arkin-product-img  { max-height: 500px; width: auto; max-width: 100%; object-fit: contain; }
        @media (max-width: 960px) {
          .product-feature { grid-template-columns: 1fr; gap: 32px; padding: 56px 0; }
          .product-feature:nth-child(even) > .product-img { order: 0; }
          .arkin-product-img { height: 280px; }
        }
      `}</style>
      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Our Products</span>
          <h1 className="fade-up">Tools We've Built. Ready for You.</h1>
          <p className="fade-up">Three products born from problems we saw across our client work, productized so any business can use them. Self-serve, fairly priced, and built on the same standards as our custom builds.</p>
          <div className="hero-badge-row fade-up" style={{ marginTop: '32px' }}>
            <div className="hero-badge">
              <span className="badge-icon">🎯</span>
              <div><strong>Kredoo CRM</strong><span className="badge-sub">Lead pipeline · live</span></div>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">⚡</span>
              <div><strong>LeadFlow AI</strong><span className="badge-sub">Auto follow-up</span></div>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">🤖</span>
              <div><strong>ChatDesk</strong><span className="badge-sub">Route intelligence</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KREDOO FLAGSHIP ===== */}
      <section className="kredoo-section">
        <div className="wrap">
          <div className="kredoo-flagship">
            <div className="fade-up">
              <div className="kredoo-badge"><span className="kredoo-badge-dot"></span> Live product · kredoo.in</div>
              <img src="/pictures/Kredoo-black.png" className="kredoo-logo-svg" alt="Kredoo" />
              <p className="kredoo-tagline">The AI-powered lead CRM built specifically for Indian sales teams — pipeline management, smart booking links, WhatsApp automation, and n8n integration in one place.</p>
              <div className="kredoo-features">
                <div className="kredoo-feat">
                  <div className="kredoo-feat-icon">📋</div>
                  <h4>Visual Pipeline</h4>
                  <p>Drag-and-drop Kanban board. See every lead, every stage, in real time.</p>
                </div>
                <div className="kredoo-feat">
                  <div className="kredoo-feat-icon">🤖</div>
                  <h4>AI Automations</h4>
                  <p>n8n-powered workflows that route, qualify, and follow up automatically.</p>
                </div>
                <div className="kredoo-feat">
                  <div className="kredoo-feat-icon">📅</div>
                  <h4>Booking Links</h4>
                  <p>Calendly-style scheduling built into your CRM. No third-party needed.</p>
                </div>
                <div className="kredoo-feat">
                  <div className="kredoo-feat-icon">💬</div>
                  <h4>WhatsApp Native</h4>
                  <p>Leads from Meta Ads flow directly in. Follow-ups go out on WhatsApp.</p>
                </div>
              </div>
              <div className="kredoo-stats">
                <div className="kredoo-stat">
                  <div className="kredoo-stat-num">500+</div>
                  <div className="kredoo-stat-label">Leads tracked</div>
                </div>
                <div className="kredoo-stat">
                  <div className="kredoo-stat-num">3×</div>
                  <div className="kredoo-stat-label">Faster follow-up</div>
                </div>
                <div className="kredoo-stat">
                  <div className="kredoo-stat-num">₹0</div>
                  <div className="kredoo-stat-label">To start free</div>
                </div>
              </div>
              <div className="kredoo-cta-row">
                <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="btn-white">Start Free Trial →</a>
                <Link to="/blog-kredoo" className="btn-outline-white">Read the story</Link>
              </div>
            </div>
            <div className="fade-up">
              <div className="kredoo-iframe-card">
                <div className="kredoo-mockup-bar">
                  <div className="kredoo-mockup-dot kd1"></div>
                  <div className="kredoo-mockup-dot kd2"></div>
                  <div className="kredoo-mockup-dot kd3"></div>
                  <span className="kredoo-mockup-title">kredoo.in</span>
                </div>
                <div className="kredoo-iframe-wrap">
                  <iframe
                    src="https://kredoo.in"
                    className="kredoo-iframe"
                    scrolling="no"
                    frameBorder="0"
                    title="Kredoo CRM — Live Preview"
                    loading="lazy"
                  ></iframe>
                  <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="kredoo-iframe-overlay">
                    <span className="kredoo-visit-btn">Open Kredoo →</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0' }}>
        <div className="wrap">
          {/* Static Products from HTML */}
          <article className="product-feature fade-up">
            <div>
              <span className="badge">01 / LeadFlow AI</span>
              <h2>Capture every lead. Follow up while you sleep.</h2>
              <p className="tagline">A self-serve inbound lead engine that captures, qualifies, and follows up across email, WhatsApp, and SMS — with native CRM sync.</p>
              <ul className="feature-list">
                <li>Multi-channel capture from your site, ads, and DMs</li>
                <li>AI qualification scoring tuned to your ICP</li>
                <li>24/7 follow-up sequences in your brand voice</li>
                <li>Calendar handoff once a lead is sales-ready</li>
                <li>Full transparency — every message logged and editable</li>
              </ul>
              <div className="product-cta-row">
                <Link to="/contact" className="btn btn-primary">Start Free Trial</Link>
                <button className="btn btn-demo"><span className="play">▶</span> Watch 90s Demo</button>
              </div>
            </div>
            <div className="product-img arkin-char-wrap arkin-product-wrap">
              <img src="/pictures/productsarkine.png" alt="LeadFlow AI" className="arkin-char arkin-product-img" />
            </div>
          </article>

          <article className="product-feature fade-up">
            <div>
              <span className="badge">02 / ChatDesk</span>
              <h2>WhatsApp, but it's your best employee.</h2>
              <p className="tagline">A WhatsApp-first AI agent trained on your business. Books appointments, answers FAQs, escalates the things that actually need a human.</p>
              <ul className="feature-list">
                <li>Trained on your docs, FAQs, and product catalog</li>
                <li>Native WhatsApp Business API — verified and compliant</li>
                <li>Multi-language: English, Hindi, Telugu, Tamil, more</li>
                <li>Live handoff to your team with full conversation context</li>
                <li>Analytics on what customers actually ask</li>
              </ul>
              <div className="product-cta-row">
                <Link to="/contact" className="btn btn-primary">Get Early Access</Link>
                <button className="btn btn-demo"><span className="play">▶</span> See it in action</button>
              </div>
            </div>
            <div className="product-img arkin-char-wrap arkin-product-wrap">
              <img src="/pictures/whatsapparkine.png" alt="ChatDesk" className="arkin-char arkin-product-img" />
            </div>
          </article>

          <article className="product-feature fade-up">
            <div>
              <span className="badge">03 / ContentForge</span>
              <h2>A content engine that sounds like you.</h2>
              <p className="tagline">Brand-trained drafts for blog, social, and ads — calibrated to your voice, then approved by humans before they ship.</p>
              <ul className="feature-list">
                <li>Voice training from your existing best content</li>
                <li>Blog, LinkedIn, Instagram, ad creative — one engine</li>
                <li>Approval workflows for marketing teams</li>
                <li>Integrations with WordPress, Webflow, Buffer, Meta Ads</li>
                <li>Performance-aware: learns from what actually works</li>
              </ul>
              <div className="product-cta-row">
                <Link to="/contact" className="btn btn-primary">Join Waitlist</Link>
                <button className="btn btn-demo"><span className="play">▶</span> Tour the editor</button>
              </div>
            </div>
            <div className="product-img arkin-char-wrap arkin-product-wrap">
              <img src="/pictures/Arkin-Leftside-Pointing-Grey.png" alt="ContentForge" className="arkin-char arkin-product-img" />
            </div>
          </article>

          {/* Dynamic Products from API */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading more products...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#ef4444' }}>Error: {error}</div>
          ) : productsData.length > 0 ? (
            productsData.map((prod, i) => (
              <article className="product-feature fade-up" key={prod.id || i}>
                <div>
                  <span className="badge">{prod.price || `0${i + 4} / New`}</span>
                  <h2>{prod.name}</h2>
                  <p className="tagline">{prod.description}</p>
                  {prod.features && prod.features.length > 0 && (
                    <ul className="feature-list">
                      {prod.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  <div className="product-cta-row">
                    <Link to="/contact" className="btn btn-primary">Get Started</Link>
                    <button className="btn btn-demo"><span className="play">▶</span> Watch Demo</button>
                  </div>
                </div>
                <div className="product-img arkin-char-wrap arkin-product-wrap">
                  <img src={`/pictures/${prod.image || 'Arkin-Leftside-Pointing-Grey.png'}`} alt={prod.name} className="arkin-char arkin-product-img" />
                </div>
              </article>
            ))
          ) : null}
        </div>
      </section>

      <section className="cta-quiz">
        <div className="wrap fade-up">
          <span className="tag">Want something custom?</span>
          <h2>We build bespoke too.</h2>
          <p>If our products don't quite fit, our custom team can build exactly what your business needs — typically in 4–8 weeks.</p>
          <Link to="/services" className="btn btn-light">Explore Custom Work →</Link>
        </div>
      </section>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default Products;
