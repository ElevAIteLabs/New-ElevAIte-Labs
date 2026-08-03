import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';
import MediaOrTile from '../components/MediaOrTile';

const Home = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  const apiUrl = (r) => import.meta.env.DEV ? `http://localhost:5000/${r}` : `${import.meta.env.VITE_API_URL}/${r}.php`;

  useEffect(() => {
    fetch(apiUrl('services'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
        setLoadingServices(false);
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        setLoadingServices(false);
      });

    fetch(apiUrl('work'))
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

    // The products section is now the bespoke Kredoo module breakdown, so the
    // home page no longer needs the CMS products list. /products still uses it.
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
              {/* Intrinsic size is 941x1672 - square attributes reserved a box
                  that collapsed on decode, shifting the LCP element. */}
              <img src="/pictures/arkin.webp" alt="Arkin - ElevAIte Labs mascot" className="arkin-hero-img" width="349" height="620" fetchPriority="high" />

              {/* The six service lines, revealed once after LCP settles.
                  Absolutely positioned, so it adds no page height. Static on
                  purpose: the hero must render without waiting on the API.
                  Keep in sync with the Services page if a line changes. */}
              <div className="hero-run" role="img" aria-label="The six things ElevAIte Labs builds: AI automation and workflows, web and mobile apps, custom AI agents, lead generation systems, AI content creation, and AI strategy consulting.">
                {[
                  ['AI Automation', 'Agents that read, decide, act'],
                  ['Web & Mobile Apps', 'iOS, Android and web'],
                  ['Custom AI Agents', 'On WhatsApp, web and Slack'],
                  ['Lead Generation', 'Sourced, warmed, booked'],
                  ['AI Content', 'Trained on your brand voice'],
                  ['AI Strategy', 'A 90-day roadmap'],
                ].map(([title, sub]) => (
                  <div className="hrun-step" key={title}>
                    <span className="hrun-dot"></span>
                    <div className="hrun-body">
                      <b>{title}</b>
                      <span>{sub}</span>
                    </div>
                  </div>
                ))}
                <div className="hrun-foot">Six service lines &middot; shipped in weeks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="about-grid">
            <div className="about-proof fade-up">
              <div className="proof-stats">
                <div>
                  <span className="proof-num">35+</span>
                  <span className="proof-label">Projects shipped<br />since 2023</span>
                </div>
                <div>
                  <span className="proof-num">20+</span>
                  <span className="proof-label">Clients across<br />10+ industries</span>
                </div>
                <div>
                  <span className="proof-num">1,000+</span>
                  <span className="proof-label">Hours automated<br />every week</span>
                </div>
              </div>

              <div className="proof-team">
                {/* Per-image crop: these three portraits have different aspect
                    ratios (900x1600 vs ~1100x1400), so one shared position
                    beheads the tallest of them. */}
                <div className="proof-faces">
                  <img src="/pictures/shanmukh.jpeg" alt="Ramachandruni Anjaneya Shanmukh" loading="lazy" style={{ objectPosition: 'center 18%' }} />
                  <img src="/pictures/vishnu.jpeg" alt="Vishhnu Saai Gudise" loading="lazy" style={{ objectPosition: 'center 22%' }} />
                  <img src="/pictures/premsai.png" alt="Premsai Kilaru" loading="lazy" style={{ objectPosition: 'center 20%' }} />
                </div>
                <p>A small team, by design &mdash; the people you meet on the call are the people writing the code.</p>
              </div>

              <div className="proof-tools">
                <span className="proof-label">Built on the stack you already use</span>
                <div className="proof-logos">
                  <img src="/pictures/n8n.png" alt="n8n" loading="lazy" />
                  <img src="/pictures/zapier.png" alt="Zapier" loading="lazy" />
                  <img src="/pictures/Make_Logo.jpg" alt="Make" loading="lazy" />
                  <img src="/pictures/WhatsApp_Logo_green.svg" alt="WhatsApp Business" loading="lazy" />
                </div>
              </div>
            </div>
            <div className="about-copy fade-up">
              <span className="tag">About Us</span>
              <h2 className="display">Why Businesses in India Choose ElevAIte Labs</h2>
              <p>We're an AI-first studio based in Hyderabad, working with founders and operators who want results - not slideware. Our team blends senior product engineers with applied-AI specialists, so the things we build actually ship and stay shipped.</p>
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
      <section style={{ background: 'var(--text)', color: '#fff', overflow: 'hidden' }}>
        <div className="wrap">
          <div className="kredoo-teaser-grid">
            <div className="fade-up">
              <span className="tag" style={{ color: 'var(--accent)' }}>Our Flagship Product</span>
              <h2 className="display" style={{ color: '#fff', marginBottom: '24px' }}>Meet Kredoo: The AI CRM for Sales Teams</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '19px', marginBottom: '32px', maxWidth: '540px' }}>Stop chasing leads manually. Kredoo automates your entire sales pipeline - from WhatsApp capture to smart follow-ups and CRM sync.</p>
              <ul className="kredoo-points">
                <li>Leads from Meta &amp; Google Ads land in the pipeline in real time</li>
                <li>WhatsApp and Instagram in one shared team inbox</li>
                <li>Booking links, smart follow-ups and n8n automation built in</li>
              </ul>
              <div className="hero-cta-row">
                <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Try Kredoo Free →</a>
                <Link to="/blog-kredoo" className="btn btn-ghost" style={{ color: '#fff', borderColor: '#fff' }}>Read the Story</Link>
              </div>
            </div>
            <div className="kredoo-teaser-visual fade-up">
              <div className="browser-mockup">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <span style={{ background: '#ff5f57' }}></span>
                    <span style={{ background: '#febc2e' }}></span>
                    <span style={{ background: '#28c840' }}></span>
                  </div>
                  <div className="browser-url">kredoo.in</div>
                </div>
                <div className="browser-content">
                  <img src="/pictures/kreedo.png" alt="Kredoo CRM Dashboard" style={{ width: '100%', display: 'block' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          /* The screenshot is the proof here, so give it the wider track and
             let it bleed past the container - it was scaled down so far the
             product was illegible. */
          .kredoo-teaser-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 64px; align-items: center; }
          .kredoo-teaser-visual { position: relative; display: flex; justify-content: flex-start; align-items: center; }
          .kredoo-points { list-style: none; margin: 0 0 32px; padding: 0; }
          .kredoo-points li { position: relative; padding-left: 24px; margin-bottom: 12px; font-size: 15.5px; line-height: 1.5; color: rgba(255,255,255,0.72); }
          .kredoo-points li::before { content: ""; position: absolute; left: 2px; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
          .browser-mockup { width: calc(100% + 90px); max-width: none; border-radius: 12px; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08); background: #1e1e1e; }
          .browser-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #2a2a2a; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .browser-dots { display: flex; gap: 6px; }
          .browser-dots span { width: 12px; height: 12px; border-radius: 50%; display: block; }
          .browser-url { flex: 1; background: rgba(255,255,255,0.07); border-radius: 6px; padding: 5px 12px; font-size: 13px; color: rgba(255,255,255,0.5); font-family: monospace; text-align: center; }
          .browser-content { overflow: hidden; }
          @media (max-width: 960px) {
            .kredoo-teaser-grid { grid-template-columns: 1fr; gap: 40px; }
            .kredoo-teaser-visual { justify-content: center; }
            .browser-mockup { width: 100%; }
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
              <p>We architect the system - workflows, data, models, integrations - and lock the blueprint with you.</p>
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
                .slice(0, 6)
                .map((project, index) => (
                  <Link className="work-card fade-up" to="/work" key={project.id || index}>
                    <div className="wc-media">
                      <MediaOrTile
                        src={project.image}
                        alt={project.title}
                        className="work-card-shot"
                        tileClassName="work-card-tile"
                      />
                    </div>
                    <div className="work-card-body">
                      <div className="industry">{project.industry}</div>
                      <h3>{project.title}</h3>
                      <div className="result">{project.description}</div>
                      <span className="wc-cta">View case study <span className="arrow">→</span></span>
                    </div>
                  </Link>
                ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--body)' }}>No projects found.</div>
            )}
          </div>
          <div className="work-cta fade-up">
            <Link to="/work" className="link-arrow">View All Projects <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* ===== KREDOO MODULES ===== */}
      <section className="kmod-section">
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Kredoo Modules</span>
            <h2 className="display" style={{ maxWidth: '840px' }}>Two channels. One pipeline.</h2>
            <p className="kmod-lead">Instagram creates the lead. WhatsApp closes it. Both write into the same inbox, the same timeline and the same pipeline &mdash; so nobody re-types anything and nothing quietly falls through.</p>
          </div>

          {/* The funnel, end to end - reveals step by step on scroll */}
          <ol className="kmod-journey fade-up">
            {[
              { n: '01', t: 'Reel goes out', c: 'Instagram' },
              { n: '02', t: 'Someone comments "price"', c: 'Instagram' },
              { n: '03', t: 'Public reply + private DM', c: 'Instagram' },
              { n: '04', t: 'Qualified in the DM', c: 'Instagram' },
              { n: '05', t: 'Slot booked', c: 'Shared' },
              { n: '06', t: 'Reminders + follow-up', c: 'WhatsApp' },
            ].map((s) => (
              <li key={s.n}>
                <span className="kj-num">{s.n}</span>
                <strong>{s.t}</strong>
                <em>{s.c}</em>
              </li>
            ))}
          </ol>

          <div className="kmod-grid">
            <article className="kmod kmod--ig fade-up">
              <header className="kmod-head">
                <span className="kmod-icon kmod-icon--ig" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </span>
                <div>
                  <h3>Instagram</h3>
                  <span className="kmod-role">Top of the funnel</span>
                </div>
              </header>
              <p className="kmod-pitch">Native DM automation on your own professional account. Comments, story replies and bio links all become CRM leads.</p>
              <ul className="kmod-list">
                <li><b>Comment &rarr; DM</b> on a keyword, or on any comment at all.</li>
                <li><b>Rotating public replies</b> with <code>{'{{username}}'}</code>, because Instagram flags accounts that post the same comment repeatedly.</li>
                <li><b>Follow gate</b> &mdash; the real link goes only to followers; everyone else is asked to follow and comment again.</li>
                <li><b>Arm a rule for your next post</b> and it attaches itself the moment the reel goes live.</li>
                <li><b>Hourly cap</b> under Instagram&rsquo;s 750/hr ceiling, so a viral reel can&rsquo;t get you rate-limited.</li>
                <li><b>Ref links</b> for the bio that track taps <em>versus</em> conversations actually started.</li>
              </ul>
              <div className="kmod-proof">
                <span className="kmod-proof-label">Attribution no native dashboard gives you</span>
                <span className="kmod-proof-value">Per post: DMs triggered &rarr; leads created &rarr; bookings. Not likes.</span>
              </div>
            </article>

            <article className="kmod kmod--wa fade-up">
              <header className="kmod-head">
                <span className="kmod-icon kmod-icon--wa" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.683 5.535l-.999 3.648 3.805-.882zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                </span>
                <div>
                  <h3>WhatsApp</h3>
                  <span className="kmod-role">Bottom of the funnel</span>
                </div>
              </header>
              <p className="kmod-pitch">The official WhatsApp Cloud API on your own business number. No third-party relay, no n8n or Zapier sitting in the middle.</p>
              <ul className="kmod-list">
                <li><b>One-click connect</b> through Meta&rsquo;s own popup &mdash; Kredoo is a registered Meta Tech Provider, so no copying tokens between dashboards.</li>
                <li><b>Real delivery tracking:</b> queued &rarr; sent &rarr; delivered &rarr; read &rarr; failed, driven by Meta&rsquo;s webhooks. &ldquo;Sent&rdquo; isn&rsquo;t treated as proof of anything.</li>
                <li><b>Template builder</b> with a live phone preview, submitted for Meta approval from inside Kredoo.</li>
                <li><b>Send-again waves</b> &mdash; follow a campaign with a second template to non-responders only, with full history kept.</li>
                <li><b>AI agent</b> answers off-script from your knowledge base, then hands back to the flow or books the slot itself.</li>
                <li><b>Compliance built in:</b> automatic STOP handling, 24-hour window enforcement, rate-limit backoff.</li>
              </ul>
              <div className="kmod-proof">
                <span className="kmod-proof-label">Spend you can actually audit</span>
                <span className="kmod-proof-value">Estimated before you send. Actual cost recorded per message from Meta&rsquo;s own pricing.</span>
              </div>
            </article>
          </div>

          <div className="kmod-shared fade-up">
            <h4>Both channels share one CRM underneath</h4>
            <ul>
              <li>One shared team inbox and a single lead timeline across both channels</li>
              <li>Kanban pipeline with custom boards, stages, fields and per-rep assignment</li>
              <li>Meta Lead Ads posting straight in, in real time</li>
              <li>Booking links, white-label on your own domain</li>
              <li>AI Voice Agent &mdash; calls leads, transcript lands on the record</li>
              <li>REST API and webhooks out to n8n, Make, Slack or Sheets</li>
            </ul>
            <div className="kmod-cta">
              <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Try Kredoo Free &rarr;</a>
              <Link to="/blog-kredoo" className="btn btn-ghost">Read the Story</Link>
            </div>
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
              <h3>Become an AI engineer in 2026 - the honest path</h3>
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
      {/* <section>
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
      </section> */}

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
