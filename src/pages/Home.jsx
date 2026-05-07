import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';

const Home = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const API_URL = 'https://elevaitelabs.in/api';

  useEffect(() => {
    fetch(`${API_URL}/services.php`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
        setLoadingServices(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setLoadingServices(false);
      });

    fetch(`${API_URL}/work.php`)
      .then(res => res.json())
      .then(data => {
        console.log('Home: Fetched projects:', data);
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjectsError('Invalid projects format received from API');
        }
        setLoadingProjects(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setProjectsError(err.message);
        setLoadingProjects(false);
      });

    fetch(`${API_URL}/products.php`)
      .then(res => res.json())
      .then(data => {
        console.log('Home: Fetched products:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProductsError('Invalid data format received from API');
        }
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setProductsError(err.message);
        setLoadingProducts(false);
      });
  }, []);

  useEffect(() => {
    // Typewriter effect
    const target = document.getElementById("tw-target");
    if (target) {
      const words = ["AI Systems", "AI Automations", "AI Agents", "Applications"];
      let wordIdx = 0, charIdx = 0, deleting = false;
      let timer;

      function tick() {
        const word = words[wordIdx % words.length];
        if (!deleting) {
          target.textContent = word.slice(0, charIdx + 1);
          charIdx++;
          if (charIdx === word.length) {
            deleting = true;
            timer = setTimeout(tick, 2000);
            return;
          }
          timer = setTimeout(tick, 100);
        } else {
          target.textContent = word.slice(0, charIdx - 1);
          charIdx--;
          if (charIdx === 0) {
            deleting = false;
            wordIdx++;
          }
          timer = setTimeout(tick, 55);
        }
      }
      timer = setTimeout(tick, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-left">
              <span className="tag fade-up">AI Agency · Hyderabad, India</span>
              <h1 className="hero-headline fade-up">We Build<br /><em><span id="tw-target">AI Systems</span><span className="tw-cursor"></span></em><br />That Work While You Sleep</h1>
              <p className="hero-sub fade-up">ElevAIte Labs builds AI automations, mobile apps, and web platforms that help businesses save time, close more leads, and scale faster.</p>
              <div className="hero-cta-row fade-up">
                <Link to="/contact" className="btn btn-primary">Book a Call</Link>
                <Link to="/work" className="btn btn-ghost">See Our Work</Link>
              </div>
              <div className="hero-stats fade-up">
                <span>35+ Projects</span><span className="dot"></span>
                <span>20+ Clients</span><span className="dot"></span>
                <span>1000+ Hours Automated</span>
              </div>
            </div>
            <div className="arkin-hero-wrap">
              <div className="arkin-glow"></div>
              <img src="/pictures/arkin.png" alt="Arkin — ElevAIte Labs mascot" className="arkin-hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="about-grid">
            <div className="arkin-char-wrap arkin-about-wrap fade-up">
              <img src="/pictures/rightside-pointing-arkin.png" alt="Arkin — ElevAIte Labs" className="arkin-char arkin-about-img" />
            </div>
            <div className="about-copy fade-up">
              <span className="tag">About Us</span>
              <h2 className="display">Why Businesses in India Choose ElevAIte Labs</h2>
              <p>We're an AI-first studio based in Hyderabad, working with founders and operators who want results — not slideware. Our team blends senior product engineers with applied-AI specialists, so the things we build actually ship and stay shipped.</p>
              <p>Local context matters. We understand the speed, scrappiness, and regulatory texture of Indian businesses, and we pair that with global engineering standards. The outcome: AI systems that fit your operation, not the other way around.</p>
              <Link to="/about" className="link-arrow">Learn More About Us <span className="arrow">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">What We Do</span>
            <h2 className="display" style={{ maxWidth: '800px' }}>Everything Your Business Needs to Go AI-First</h2>
          </div>
          <div className="svc-list fade-up">
            {loadingServices ? (
              <div style={{ padding: '20px', color: 'var(--body)' }}>Loading services...</div>
            ) : services.length > 0 ? (
              services.map((svc, index) => (
                <Link className="svc-row" to="/services" key={svc.id || index}>
                  <div className="svc-num">{(index + 1).toString().padStart(2, '0')}</div>
                  <div className="svc-title">{svc.title}</div>
                  <div className="svc-desc">{svc.description}</div>
                  <div className="svc-arrow">→</div>
                </Link>
              ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--body)' }}>No services found.</div>
            )}
          </div>
        </div>
      </section>
      {/* ===== KREDOO TEASER ===== */}
      <section style={{ background: 'var(--text)', color: '#fff', padding: '100px 0', overflow: 'hidden' }}>
        <div className="wrap">
          <div className="kredoo-teaser-grid">
            <div className="fade-up">
              <span className="tag" style={{ color: 'var(--accent)' }}>Our Flagship Product</span>
              <h2 className="display" style={{ color: '#fff', marginBottom: '24px' }}>Meet Kredoo: The AI CRM for Sales Teams</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '19px', marginBottom: '32px', maxWidth: '540px' }}>Stop chasing leads manually. Kredoo automates your entire sales pipeline — from WhatsApp capture to smart follow-ups and CRM sync.</p>
              <div className="hero-cta-row">
                <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Try Kredoo Free →</a>
                <Link to="/blog-kredoo" className="btn btn-ghost" style={{ color: '#fff', borderColor: '#fff' }}>Read the Story</Link>
              </div>
            </div>
            <div className="kredoo-teaser-visual fade-up">
              <div className="kredoo-anim-box">
                <img src="/pictures/Kredoo-black.png" alt="Kredoo" className="kredoo-logo-anim" style={{ filter: 'invert(1) brightness(2)' }} />
                <div className="kredoo-pulse"></div>
                <div className="kredoo-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .kredoo-teaser-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: center; }
          .kredoo-teaser-visual { position: relative; display: flex; justify-content: center; }
          .kredoo-anim-box { position: relative; width: 320px; height: 320px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); }
          .kredoo-logo-anim { width: 180px; position: relative; z-index: 2; animation: kredooFloat 6s ease-in-out infinite; }
          .kredoo-pulse { position: absolute; inset: 0; border-radius: 50%; background: var(--accent); opacity: 0; animation: kredooPulse 4s linear infinite; }
          @keyframes kredooPulse {
            0% { transform: scale(0.8); opacity: 0.4; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          @keyframes kredooFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }
          @media (max-width: 960px) {
            .kredoo-teaser-grid { grid-template-columns: 1fr; gap: 48px; text-align: center; }
            .kredoo-teaser-grid p { margin-inline: auto; }
            .kredoo-teaser-grid .hero-cta-row { justify-content: center; }
            .kredoo-anim-box { width: 260px; height: 260px; }
            .kredoo-logo-anim { width: 140px; }
          }
        `}</style>
      </section>


      {/* ===== PROCESS ===== */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Our Process</span>
            <h2 className="display" style={{ maxWidth: '720px' }}>From Idea to Automation in 4 Steps</h2>
          </div>
          <div className="process-grid">
            <div className="process-step fade-up">
              <div className="process-num">01</div>
              <h3>Discovery</h3>
              <p>We map your operation, find leverage points, and identify the AI plays with the highest ROI.</p>
            </div>
            <div className="process-step fade-up">
              <div className="process-num">02</div>
              <h3>Design</h3>
              <p>We architect the system — workflows, data, models, integrations — and lock the blueprint with you.</p>
            </div>
            <div className="process-step fade-up">
              <div className="process-num">03</div>
              <h3>Build</h3>
              <p>2–4 week sprints. You see working software every week, not Gantt charts.</p>
            </div>
            <div className="process-step fade-up">
              <div className="process-num">04</div>
              <h3>Optimize</h3>
              <p>We measure, tune, and harden. Most clients keep us on a retainer to keep compounding gains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED WORK ===== */}
      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Our Work</span>
            <h2 className="display">Real Projects. Real Results.</h2>
          </div>
          <div className="work-grid">
            {loadingProjects ? (
              <div style={{ padding: '20px', color: 'var(--body)' }}>Loading projects...</div>
            ) : projectsError ? (
              <div style={{ padding: '20px', color: '#ef4444' }}>Error: {projectsError}</div>
            ) : projects.length > 0 ? (
              projects
                .filter(p => p.category !== 'mobile-app')
                .slice(0, 7)
                .map((project, index) => {
                  const classes = ['wc-w1', 'wc-w2', 'wc-w3', 'wc-w4', 'wc-w5', 'wc-w6', 'wc-w7'];
                  const cardClass = classes[index % classes.length];
                  return (
                    <Link className={`work-card ${cardClass} fade-up`} to="/work" key={project.id || index}>
                      <div
                        className="ph"
                        style={{
                          backgroundImage: `url('${project.image ? (project.image.startsWith('http') ? project.image : `/pictures/${project.image}`) : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&h=500&fit=crop&q=80&auto=format'}')`
                        }}
                      >
                        <span className="ph-label">{project.industry}</span>
                      </div>
                      <div className="work-card-body">
                        <div className="industry">{project.industry}</div>
                        <h3>{project.title}</h3>
                        <div className="result">{project.description}</div>
                      </div>
                    </Link>
                  );
                })
            ) : (
              <div style={{ padding: '20px', color: 'var(--body)' }}>No projects found.</div>
            )}
          </div>
          <div className="work-cta fade-up">
            <Link to="/work" className="link-arrow">View All Projects <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Our Products</span>
            <h2 className="display">Tools We've Built. Ready for You.</h2>
          </div>
          <div className="products-grid">
            {loadingProducts ? (
              <div style={{ padding: '20px', color: 'var(--body)' }}>Loading products...</div>
            ) : productsError ? (
              <div style={{ padding: '20px', color: '#ef4444' }}>Error: {productsError}</div>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <div className="product-card fade-up" key={product.id || index}>
                  <div
                    className="ph"
                    style={{
                      backgroundImage: `url('${product.image ? (product.image.startsWith('http') ? product.image : `/pictures/${product.image}`) : 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&h=400&fit=crop&q=80&auto=format'}')`
                    }}
                  >
                    <span className="ph-label">{product.name}</span>
                  </div>
                  <div className="product-card-body">
                    <h3>{product.name}</h3>
                    <p className="tagline">{product.description}</p>
                    <div className="product-card-actions">
                      <Link to="/products" className="link-arrow">Learn More <span className="arrow">→</span></Link>
                      <button className="btn-demo"><span className="play">▶</span> Watch Demo</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--body)' }}>No products found.</div>
            )}
          </div>
        </div>
      </section>

      {/* ===== LEARN / REELS ===== */}
      <section className="learn-section">
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Learn With Us</span>
            <h2 className="display">Free AI Education for Professionals &amp; Students</h2>
          </div>
          <div className="reels-row">
            <a className="reel-card fade-up" href="https://www.instagram.com/reel/DPblf0dD_T0/" target="_blank" rel="noopener noreferrer">
              <div className="reel-media ig-reel">
                <iframe src="https://www.instagram.com/reel/DPblf0dD_T0/embed/" className="reel-iframe" frameBorder="0" scrolling="no" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy"></iframe>
                <div className="reel-play">▶</div>
              </div>
              <div className="reel-cat">Automation</div>
              <h3>5 workflows you should automate this week</h3>
            </a>
            <a className="reel-card fade-up" href="https://www.instagram.com/reel/DS7ph4rD9LM/" target="_blank" rel="noopener noreferrer">
              <div className="reel-media ig-reel">
                <iframe src="https://www.instagram.com/reel/DS7ph4rD9LM/embed/" className="reel-iframe" frameBorder="0" scrolling="no" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy"></iframe>
                <div className="reel-play">▶</div>
              </div>
              <div className="reel-cat">Career</div>
              <h3>Become an AI engineer in 2026 — the honest path</h3>
            </a>
            <a className="reel-card fade-up" href="https://www.instagram.com/reel/DS-PVTTjyxQ/" target="_blank" rel="noopener noreferrer">
              <div className="reel-media ig-reel">
                <iframe src="https://www.instagram.com/reel/DS-PVTTjyxQ/embed/" className="reel-iframe" frameBorder="0" scrolling="no" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy"></iframe>
                <div className="reel-play">▶</div>
              </div>
              <div className="reel-cat">Founders</div>
              <h3>Why your AI Agent is failing (and how to fix it)</h3>
            </a>
            <a className="reel-card fade-up" href="https://www.instagram.com/reel/DUlGdjLjWaG/" target="_blank" rel="noopener noreferrer">
              <div className="reel-media ig-reel">
                <iframe src="https://www.instagram.com/reel/DUlGdjLjWaG/embed/" className="reel-iframe" frameBorder="0" scrolling="no" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy"></iframe>
                <div className="reel-play">▶</div>
              </div>
              <div className="reel-cat">Tools</div>
              <h3>The 6 AI tools every Indian SMB should be running</h3>
            </a>
          </div>
          <div className="work-cta fade-up">
            <Link to="/learn" className="link-arrow">Follow Us on Instagram <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">What Clients Say</span>
            <h2 className="display">Results That Speak for Themselves</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card fade-up">
              <div className="quote-mark">"</div>
              <p className="quote">ElevAIte rebuilt our entire lead funnel in 5 weeks. We went from manually chasing 30 leads a day to converting 3× more without adding headcount.</p>
              <div className="testimonial-meta">
                <div className="name">Aarav Reddy</div>
                <div className="role">Co-founder</div>
                <div className="company">Nivasa Homes</div>
              </div>
            </div>
            <div className="testimonial-card fade-up">
              <div className="quote-mark">"</div>
              <p className="quote">They don't sell hype. They asked the right questions, scoped tightly, and shipped a WhatsApp bot that genuinely talks like our front-desk team.</p>
              <div className="testimonial-meta">
                <div className="name">Dr. Priya Iyer</div>
                <div className="role">Operations Director</div>
                <div className="company">Apex Clinics</div>
              </div>
            </div>
            <div className="testimonial-card fade-up">
              <div className="quote-mark">"</div>
              <p className="quote">A rare agency that pairs design taste with serious engineering. Our app launched on time and the AI features feel native, not bolted on.</p>
              <div className="testimonial-meta">
                <div className="name">Rohan Mehta</div>
                <div className="role">Founder &amp; CEO</div>
                <div className="company">Chai Pani</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUIZ CTA ===== */}
      <section className="cta-quiz">
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Free Assessment</span>
            <h2>Is Your Business AI-Ready?</h2>
            <p>Take our free 2-minute quiz and find out exactly where AI can save you time and money.</p>
            <button className="btn btn-light" onClick={() => setIsQuizOpen(true)}>Take the Free Quiz →</button>
          </div>
        </div>
      </section>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default Home;
