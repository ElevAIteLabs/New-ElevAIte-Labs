import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';

const About = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    const wrap = document.querySelector('.card-fan-wrap');
    if (!wrap) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('fan-open');
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    io.observe(wrap);

    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .about-lead { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; padding-top: 0; padding-bottom: 40px; align-items: end; }
        .about-lead h1 { font-family: var(--display); font-size: clamp(48px, 6vw, 88px); font-weight: 600; color: var(--text); letter-spacing: -0.025em; line-height: 1.05; }
        .about-lead h1 em { font-style: italic; color: var(--accent); font-weight: 500; }
        .about-lead p { font-size: 19px; line-height: 1.55; color: var(--body); }
        .about-img-strip { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; height: 360px; }
        .card-fan-section { padding: 48px 0 100px; overflow: hidden; }
        .card-fan-wrap { position: relative; height: 480px; display: flex; align-items: flex-start; justify-content: center; }
        .fan-card { position: absolute; width: 200px; height: 280px; border-radius: 22px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.28); transform: translate(0, 50px) rotate(0deg); opacity: 0; transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease; will-change: transform, opacity; }
        .fan-card-bg { width: 100%; height: 100%; background-size: cover; background-position: center; }
        .fan-card-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%); }
        .fan-card-label { position: absolute; bottom: 14px; left: 14px; right: 14px; color: #fff; font-family: var(--display); font-size: 13px; font-weight: 600; line-height: 1.3; }
        .fan-card-tag { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.6); margin-bottom: 3px; }
        .card-fan-wrap.fan-open .fan-card { opacity: 1; }
        .card-fan-wrap.fan-open .fan-card:nth-child(1) { transform: translateX(-35vw) translateY(140px) rotate(-45deg); transition-delay: 0s; z-index:1; }
        .card-fan-wrap.fan-open .fan-card:nth-child(2) { transform: translateX(-21vw) translateY(50px) rotate(-25deg); transition-delay: 0.1s; z-index:2; }
        .card-fan-wrap.fan-open .fan-card:nth-child(3) { transform: translateX(-7vw) translateY(10px) rotate(-8deg); transition-delay: 0.2s; z-index:3; }
        .card-fan-wrap.fan-open .fan-card:nth-child(4) { transform: translateX(7vw) translateY(10px) rotate(8deg); transition-delay: 0.3s; z-index:3; }
        .card-fan-wrap.fan-open .fan-card:nth-child(5) { transform: translateX(21vw) translateY(50px) rotate(25deg); transition-delay: 0.4s; z-index:2; }
        .card-fan-wrap.fan-open .fan-card:nth-child(6) { transform: translateX(35vw) translateY(140px) rotate(45deg); transition-delay: 0.5s; z-index:1; }
        @media (max-width: 960px) {
          .card-fan-wrap { height: 360px; }
          .fan-card { width: 148px; height: 210px; border-radius: 16px; }
          .card-fan-wrap.fan-open .fan-card:nth-child(1) { transform: translateX(-33vw) translateY(90px) rotate(-40deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(2) { transform: translateX(-20vw) translateY(35px) rotate(-22deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(3) { transform: translateX(-6vw) translateY(5px) rotate(-6deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(4) { transform: translateX(6vw) translateY(5px) rotate(6deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(5) { transform: translateX(20vw) translateY(35px) rotate(22deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(6) { transform: translateX(33vw) translateY(90px) rotate(40deg); }
        }
        @media (max-width: 600px) {
          .card-fan-wrap { height: 290px; }
          .fan-card { width: 116px; height: 164px; border-radius: 12px; }
          .card-fan-wrap.fan-open .fan-card:nth-child(1) { transform: translateX(-30vw) translateY(70px) rotate(-35deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(2) { transform: translateX(-18vw) translateY(28px) rotate(-20deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(3) { transform: translateX(-6vw) translateY(4px) rotate(-5deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(4) { transform: translateX(6vw) translateY(4px) rotate(5deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(5) { transform: translateX(18vw) translateY(28px) rotate(20deg); }
          .card-fan-wrap.fan-open .fan-card:nth-child(6) { transform: translateX(30vw) translateY(70px) rotate(35deg); }
        }
        .arkin-about-para-wrap { display: flex; flex-direction: column; }
        .arkin-about-para-img { height: 480px; width: auto; object-fit: contain; object-position: bottom left; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.12)); animation: arkinFloat 5s ease-in-out infinite; margin-bottom: 20px; }
        .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 56px; }
        .value-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 36px 32px; }
        .value-num { font-family: var(--display); font-size: 36px; font-style: italic; color: var(--accent); margin-bottom: 12px; }
        .value-card h3 { font-family: var(--display); font-size: 26px; font-weight: 500; color: var(--text); margin-bottom: 12px; letter-spacing: -0.01em; }
        .value-card p { font-size: 15px; line-height: 1.55; }
        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; max-width: 1100px; margin-inline: auto; }
        .team-card .ph { aspect-ratio: 4/5; margin-bottom: 14px; }
        .team-card .name { font-family: var(--display); font-size: 22px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
        .team-card .role { font-size: 14px; color: var(--accent); font-weight: 500; margin-bottom: 8px; }
        .team-card p { font-size: 14px; line-height: 1.5; }
        .stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 56px; padding: 56px; background: var(--accent); border-radius: 16px; color: #fff; }
        .stat-num { font-family: var(--display); font-size: 64px; font-weight: 500; line-height: 1; letter-spacing: -0.03em; }
        .stats-strip .stat-label { font-size: 14px; opacity: 0.85; margin-top: 8px; }
        @media (max-width: 960px) {
          .about-lead, .values-grid, .team-grid, .stats-strip { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .about-img-strip { grid-template-columns: 1fr; height: auto; }
          .about-img-strip .ph { height: 200px; }
          .stats-strip { padding: 32px; }
        }
        @media (max-width: 560px) {
          .about-lead, .values-grid, .team-grid, .stats-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <section style={{ paddingBottom: '0' }}>
        <div className="wrap">
          <span className="tag fade-up">About Us</span>
          <div className="about-lead fade-up">
            <h1>An AI studio for businesses that <em>actually want results.</em></h1>
            <div className="arkin-about-para-wrap">
              <img src="/pictures/holding-hands.png" alt="Arkin" className="arkin-about-para-img" />
            </div>
          </div>
          <div className="hero-badge-row fade-up" style={{ marginTop: '32px', marginBottom: '16px' }}>
            <div className="hero-badge">
              <span className="badge-icon">📍</span>
              <div><strong>Hyderabad, India</strong><span className="badge-sub">HITEC City HQ</span></div>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <div><strong> 35+ projects shipped</strong><span className="badge-sub">Since 2023</span></div>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">🌐</span>
              <div><strong>10+ industries</strong><span className="badge-sub">Real estate to fintech</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="card-fan-section">
        <div className="card-fan-wrap">
          <div className="fan-card">
            <div className="fan-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=800&fit=crop&q=80&auto=format')" }}></div>
            <div className="fan-card-overlay"></div>
            <div className="fan-card-label"><span className="fan-card-tag">Our Studio</span>Hyderabad HQ</div>
          </div>
          <div className="fan-card">
            <div className="fan-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=800&fit=crop&q=80&auto=format')" }}></div>
            <div className="fan-card-overlay"></div>
            <div className="fan-card-label"><span className="fan-card-tag">How We Work</span>Collaborative & Fast</div>
          </div>
          <div className="fan-card">
            <div className="fan-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=800&fit=crop&q=80&auto=format')" }}></div>
            <div className="fan-card-overlay"></div>
            <div className="fan-card-label"><span className="fan-card-tag">Engineering</span>AI-First Always</div>
          </div>
          <div className="fan-card">
            <div className="fan-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop&q=80&auto=format')" }}></div>
            <div className="fan-card-overlay"></div>
            <div className="fan-card-label"><span className="fan-card-tag">The Team</span>Small by Design</div>
          </div>
          <div className="fan-card">
            <div className="fan-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=800&fit=crop&q=80&auto=format')" }}></div>
            <div className="fan-card-overlay"></div>
            <div className="fan-card-label"><span className="fan-card-tag">With Clients</span>Real Partnerships</div>
          </div>
          <div className="fan-card">
            <div className="fan-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=800&fit=crop&q=80&auto=format')" }}></div>
            <div className="fan-card-overlay"></div>
            <div className="fan-card-label"><span className="fan-card-tag">Deep Work</span>Problem Solvers</div>
          </div>
        </div>
      </div>

      <section style={{ paddingTop: '56px' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '720px' }}>
            <span className="tag">Our Values</span>
            <h2 className="display">Three principles we don't compromise on.</h2>
          </div>
          <div className="values-grid">
            <div className="value-card fade-up">
              <div className="value-num">01</div>
              <h3>Ship, don't slideware</h3>
              <p>Working software in week one. Decks are easy; deployments are the point.</p>
            </div>
            <div className="value-card fade-up">
              <div className="value-num">02</div>
              <h3>Honest scoping</h3>
              <p>If AI isn't the right answer, we'll tell you. We'd rather lose a deal than ship something that won't work.</p>
            </div>
            <div className="value-card fade-up">
              <div className="value-num">03</div>
              <h3>Built to outlast us</h3>
              <p>Documented, tested, handover-ready. Your team owns what we build, from day one.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '720px' }}>
            <span className="tag">The Team</span>
            <h2 className="display">A small team, by design.</h2>
            <p style={{ fontSize: '18px', marginTop: '18px' }}>We stay deliberately small so the people you meet on the call are the people writing the code. No layers, no handoffs.</p>
          </div>
          <div className="team-grid">
            <div className="team-card fade-up">
              <div className="ph" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=480&h=600&fit=crop&q=80&auto=format')" }}><span className="ph-label">portrait</span></div>
              <div className="name">Vikram Shah</div>
              <div className="role">Founder &amp; CEO</div>
              <p>Ex-product lead, ten years building consumer apps across India and SEA.</p>
            </div>
            <div className="team-card fade-up">
              <div className="ph" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=600&fit=crop&q=80&auto=format')" }}><span className="ph-label">portrait</span></div>
              <div className="name">Ananya Krishnan</div>
              <div className="role">Head of AI Engineering</div>
              <p>LLM systems, RAG, agentic workflows. Previously at a YC-backed AI startup.</p>
            </div>
            <div className="team-card fade-up">
              <div className="ph" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=480&h=600&fit=crop&q=80&auto=format')" }}><span className="ph-label">portrait</span></div>
              <div className="name">Karthik Rao</div>
              <div className="role">Design Director</div>
              <p>Design systems and product UX for B2B SaaS. Likes type more than is healthy.</p>
            </div>

          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '720px' }}>
            <span className="tag">By the Numbers</span>
            <h2 className="display">Two years in. We're just getting started.</h2>
          </div>
          <div className="stats-strip fade-up">
            <div><div className="stat-num" data-count="30" data-suffix="+">30+</div><div className="stat-label">Projects shipped</div></div>
            <div><div className="stat-num" data-count="15" data-suffix="+">15+</div><div className="stat-label">Active clients</div></div>
            <div><div className="stat-num" data-count="1000" data-suffix="+">1,000+</div><div className="stat-label">Hours automated weekly</div></div>
            <div><div className="stat-num" data-count="4.9" data-suffix="">4.9</div><div className="stat-label">Avg client rating</div></div>
          </div>
        </div>
      </section>

      <section className="cta-quiz">
        <div className="wrap fade-up">
          <span className="tag">Free Assessment</span>
          <h2>Is Your Business AI-Ready?</h2>
          <p>Take our free 2-minute quiz and find out exactly where AI can save you time and money.</p>
          <button className="btn btn-light" onClick={() => setIsQuizOpen(true)}>Take the Free Quiz →</button>
        </div>
      </section>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default About;
