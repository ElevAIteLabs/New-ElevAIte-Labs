import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';
import { isRealArtwork } from '../lib/artwork';

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
        .product-feature { display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items: center; padding: 64px 0; border-bottom: 1px solid var(--border); }
        .product-feature:nth-child(even) > .product-img { order: -1; }
        .product-img { border-radius: 16px; }
        .product-feature .badge { display: inline-block; font-family: var(--display); font-size: 14px; font-style: italic; color: var(--accent); margin-bottom: 8px; }
        .product-feature h2 { font-family: var(--display); font-size: clamp(40px, 5vw, 64px); font-weight: 600; color: var(--text); letter-spacing: -0.025em; line-height: 1.05; margin-bottom: 18px; }
        .product-feature .tagline { font-size: 19px; line-height: 1.5; color: var(--body); margin-bottom: 28px; max-width: 480px; }
        .feature-list { list-style: none; margin-bottom: 32px; }
        .feature-list li { padding: 12px 0; border-bottom: 1px dashed var(--border); display: flex; gap: 12px; font-size: 15px; color: var(--body); }
        .feature-list li::before { content: "✦"; color: var(--accent); font-size: 12px; margin-top: 4px; }
        .feature-list li:last-child { border-bottom: none; }
        .product-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
        /* Product mocks — representative UI, built in CSS. No stock art, no mascot. */
        .product-mock { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card-lg); box-shadow: 0 24px 60px rgba(0,0,0,0.09); overflow: hidden; width: 100%; }
        .mock-bar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border); background: #FBFAF7; }
        .mock-dots { display: flex; gap: 6px; }
        .mock-dots span { width: 10px; height: 10px; border-radius: 50%; display: block; }
        .mock-title { font-size: 12px; font-weight: 600; color: var(--muted); letter-spacing: 0.04em; text-transform: uppercase; }
        .mock-body { padding: 20px; }

        /* LeadFlow — inbound pipeline */
        .mock-lead { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: 10px; margin-bottom: 10px; background: var(--white); }
        .mock-lead:last-child { margin-bottom: 0; }
        .mock-ch { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; font-size: 13px; flex-shrink: 0; background: var(--card); }
        .mock-lead-main { flex: 1; min-width: 0; }
        .mock-lead-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .mock-lead-sub { font-size: 11px; color: var(--muted); }
        .mock-score { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; flex-shrink: 0; }
        .mock-score.hot { background: rgba(30,136,229,0.12); color: var(--accent-deep); }
        .mock-score.warm { background: rgba(138,133,122,0.15); color: var(--muted); }

        /* ChatDesk — WhatsApp thread */
        .mock-chat { background: #ECE5DD; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
        .mock-msg { max-width: 78%; padding: 9px 12px; border-radius: 10px; font-size: 13px; line-height: 1.45; box-shadow: 0 1px 1px rgba(0,0,0,0.06); }
        .mock-msg.them { background: #fff; align-self: flex-start; border-top-left-radius: 2px; color: var(--text); }
        .mock-msg.us { background: #D9FDD3; align-self: flex-end; border-top-right-radius: 2px; color: #111; }
        .mock-msg .mock-tick { font-size: 10px; color: #53bdeb; margin-left: 6px; }
        .mock-typing { align-self: flex-start; background: #fff; padding: 10px 14px; border-radius: 10px; border-top-left-radius: 2px; display: flex; gap: 4px; }
        .mock-typing i { width: 6px; height: 6px; border-radius: 50%; background: #b9b9b9; display: block; animation: mockDot 1.3s ease-in-out infinite; }
        .mock-typing i:nth-child(2) { animation-delay: 0.18s; }
        .mock-typing i:nth-child(3) { animation-delay: 0.36s; }
        @keyframes mockDot { 0%,60%,100% { opacity: 0.35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }

        /* ContentForge — draft + approval */
        .mock-tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .mock-tab { font-size: 11px; font-weight: 600; padding: 5px 10px; border-radius: 999px; background: var(--card); color: var(--body); }
        .mock-tab.on { background: var(--accent); color: #fff; }
        .mock-line { height: 9px; border-radius: 5px; background: var(--card); margin-bottom: 9px; }
        .mock-line.w90 { width: 90%; } .mock-line.w75 { width: 75%; } .mock-line.w60 { width: 60%; }
        .mock-line.accent { background: rgba(30,136,229,0.22); }
        .mock-approve { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); }
        .mock-voice { font-size: 11px; color: var(--muted); }
        .mock-btn { font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 6px; background: var(--accent); color: #fff; }

        /* Fallback tile for CMS-added products with no artwork */
        .product-tile { aspect-ratio: 4/3; border-radius: var(--radius-card-lg); background: linear-gradient(135deg, var(--text) 0%, #2b2b2b 100%); display: grid; place-items: center; color: #fff; }
        .product-tile span { font-family: var(--display); font-size: 56px; font-weight: 700; opacity: 0.9; }
        .product-tile img { max-height: 78%; max-width: 82%; width: auto; object-fit: contain; border-radius: 10px; }

        @media (max-width: 960px) {
          .product-feature { grid-template-columns: 1fr; gap: 32px; padding: 48px 0; }
          .product-feature:nth-child(even) > .product-img { order: 0; }
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
            <div className="product-img">
              <div className="product-mock" role="img" aria-label="LeadFlow AI inbound pipeline showing leads captured from WhatsApp, web form, and Instagram with AI qualification scores">
                <div className="mock-bar">
                  <div className="mock-dots">
                    <span style={{ background: '#ff5f57' }}></span>
                    <span style={{ background: '#febc2e' }}></span>
                    <span style={{ background: '#28c840' }}></span>
                  </div>
                  <div className="mock-title">LeadFlow · Inbound</div>
                </div>
                <div className="mock-body">
                  <div className="mock-lead">
                    <div className="mock-ch">💬</div>
                    <div className="mock-lead-main">
                      <div className="mock-lead-name">Aarav Reddy</div>
                      <div className="mock-lead-sub">WhatsApp · replied in 40s</div>
                    </div>
                    <div className="mock-score hot">92 · Hot</div>
                  </div>
                  <div className="mock-lead">
                    <div className="mock-ch">🌐</div>
                    <div className="mock-lead-main">
                      <div className="mock-lead-name">Nivasa Homes</div>
                      <div className="mock-lead-sub">Web form · sequence step 2/5</div>
                    </div>
                    <div className="mock-score hot">87 · Hot</div>
                  </div>
                  <div className="mock-lead">
                    <div className="mock-ch">📸</div>
                    <div className="mock-lead-main">
                      <div className="mock-lead-name">Priya Iyer</div>
                      <div className="mock-lead-sub">Instagram DM · nurture</div>
                    </div>
                    <div className="mock-score warm">54 · Warm</div>
                  </div>
                  <div className="mock-lead">
                    <div className="mock-ch">📅</div>
                    <div className="mock-lead-main">
                      <div className="mock-lead-name">Rohan Mehta</div>
                      <div className="mock-lead-sub">Call booked · Thu 4:30 PM</div>
                    </div>
                    <div className="mock-score hot">Booked</div>
                  </div>
                </div>
              </div>
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
            <div className="product-img">
              <div className="product-mock" role="img" aria-label="ChatDesk WhatsApp conversation where the AI agent answers a customer question and books an appointment">
                <div className="mock-bar">
                  <div className="mock-dots"><span style={{ background: '#25D366' }}></span></div>
                  <div className="mock-title">ChatDesk · WhatsApp Business</div>
                </div>
                <div className="mock-chat">
                  <div className="mock-msg them">Hi, do you have a 2BHK available in Kondapur?</div>
                  <div className="mock-msg us">Yes — we have 3 units in Kondapur, ₹78L–₹94L. Want me to send floor plans?<span className="mock-tick">✓✓</span></div>
                  <div className="mock-msg them">Yes please. Can I visit this weekend?</div>
                  <div className="mock-msg us">Saturday 11 AM or Sunday 4 PM — which suits you?<span className="mock-tick">✓✓</span></div>
                  <div className="mock-msg them">Saturday works</div>
                  <div className="mock-typing"><i></i><i></i><i></i></div>
                </div>
              </div>
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
            <div className="product-img">
              <div className="product-mock" role="img" aria-label="ContentForge editor showing a brand-voice-matched draft awaiting human approval">
                <div className="mock-bar">
                  <div className="mock-dots">
                    <span style={{ background: '#ff5f57' }}></span>
                    <span style={{ background: '#febc2e' }}></span>
                    <span style={{ background: '#28c840' }}></span>
                  </div>
                  <div className="mock-title">ContentForge · Draft</div>
                </div>
                <div className="mock-body">
                  <div className="mock-tabs">
                    <span className="mock-tab on">LinkedIn</span>
                    <span className="mock-tab">Blog</span>
                    <span className="mock-tab">Instagram</span>
                    <span className="mock-tab">Meta Ad</span>
                  </div>
                  <div className="mock-line w90"></div>
                  <div className="mock-line accent w75"></div>
                  <div className="mock-line"></div>
                  <div className="mock-line w90"></div>
                  <div className="mock-line w60"></div>
                  <div className="mock-line accent w75"></div>
                  <div className="mock-line w90"></div>
                  <div className="mock-approve">
                    <span className="mock-voice">Brand voice match · 94%</span>
                    <span className="mock-btn">Approve &amp; publish</span>
                  </div>
                </div>
              </div>
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
                <div className="product-img">
                  <div className="product-tile">
                    {isRealArtwork(prod.image)
                      ? <img src={prod.image.startsWith('http') ? prod.image : `/pictures/${prod.image}`} alt={prod.name} />
                      : <span>{(prod.name || '?').trim().charAt(0).toUpperCase()}</span>}
                  </div>
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
