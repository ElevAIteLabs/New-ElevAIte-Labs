import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizModal from '../components/QuizModal';

const LinkedInIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.339 18.338v-7.16H5.964v7.16h2.375zm-1.18-8.156c.764 0 1.236-.506 1.236-1.14-.014-.648-.472-1.14-1.222-1.14s-1.236.492-1.236 1.14c0 .634.472 1.14 1.207 1.14h.014zm9.665 8.156v-4.107c0-2.19-1.169-3.211-2.728-3.211-1.255 0-1.821.694-2.135 1.181v-1.014H9.586c.029.671 0 7.16 0 7.16h2.375v-3.998c0-.215.014-.43.078-.583.171-.43.563-.875 1.222-.875.86 0 1.207.658 1.207 1.625v3.83h2.375z"/></svg>
);

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

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
        .about-lead { padding-top: 0; padding-bottom: 16px; text-align: center; }
        .about-lead h1 { font-family: var(--display); font-size: clamp(36px, 5vw, 72px); font-weight: 600; color: var(--text); letter-spacing: -0.025em; line-height: 1.1; max-width: 1100px; margin: 0 auto; }
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
        .team-social { display: flex; gap: 10px; margin-top: 10px; }
        .team-social a { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); color: var(--body); background: #fff; transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease; }
        .team-social a:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-2px); }
        .stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 56px; padding: 56px; background: var(--accent); border-radius: 16px; color: #fff; }
        .stat-num { font-family: var(--display); font-size: 64px; font-weight: 500; line-height: 1; letter-spacing: -0.03em; }
        .stats-strip .stat-label { font-size: 14px; opacity: 0.85; margin-top: 8px; }
        @media (max-width: 960px) {
          .about-lead, .values-grid, .team-grid, .stats-strip { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .about-img-strip { grid-template-columns: 1fr; height: auto; }
          .about-img-strip .ph { height: 200px; }
          .stats-strip { padding: 32px; }
        }
        @media (max-width: 700px) {
          .team-social a { width: 44px; height: 44px; }
        }
        @media (max-width: 560px) {
          .about-lead, .values-grid, .team-grid, .stats-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <section>
        <div className="wrap">
          <span className="tag fade-up">About Us</span>
          <div className="about-lead fade-up">
            <h1>An AI studio for businesses that<br /><em>actually want results.</em></h1>
          </div>
          <div className="hero-badge-row fade-up" style={{ marginTop: '32px', marginBottom: '0', justifyContent: 'center' }}>
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

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ maxWidth: '720px' }}>
            <span className="tag">The Team</span>
            <h2 className="display">A small team, by design.</h2>
            <p style={{ fontSize: '18px', marginTop: '18px' }}>We stay deliberately small so the people you meet on the call are the people writing the code. No layers, no handoffs.</p>
          </div>
          <div className="team-grid">
            <div className="team-card fade-up">
              <div className="ph" style={{ backgroundImage: "url('/pictures/shanmukh.jpeg')", backgroundPosition: 'center 30%' }}></div>
              <div className="name">Shanmukh R</div>
              <div className="role">CO-Founder &amp; CEO</div>
              <div className="team-social">
                <a href="https://www.linkedin.com/in/shanmukh-r-a70a0919a/" target="_blank" rel="noopener noreferrer" aria-label="Shanmukh on LinkedIn"><LinkedInIcon /></a>
                <a href="https://www.instagram.com/shanmukh_ramachandruni_245/" target="_blank" rel="noopener noreferrer" aria-label="Shanmukh on Instagram"><InstagramIcon /></a>
              </div>
            </div>
            <div className="team-card fade-up">
              <div className="ph" style={{ backgroundImage: "url('/pictures/premsai.png')" }}></div>
              <div className="name">Premsai Kilaru</div>
              <div className="role">CO-Founder &amp; CMO</div>
              <div className="team-social">
                <a href="https://www.linkedin.com/in/premsaikilaru/" target="_blank" rel="noopener noreferrer" aria-label="Premsai on LinkedIn"><LinkedInIcon /></a>
                <a href="https://www.instagram.com/premsaikilaru/" target="_blank" rel="noopener noreferrer" aria-label="Premsai on Instagram"><InstagramIcon /></a>
              </div>
            </div>
            <div className="team-card fade-up">
              <div className="ph" style={{ backgroundImage: "url('/pictures/vishnu.jpeg')" }}></div>
              <div className="name">Vishhnu Saai Gudise</div>
              <div className="role">CO-Founder &amp; CTO</div>
              <div className="team-social">
                <a href="https://www.linkedin.com/in/vishhnu-saai-gudise/" target="_blank" rel="noopener noreferrer" aria-label="Vishhnu on LinkedIn"><LinkedInIcon /></a>
                <a href="https://www.instagram.com/vishhnu_chinnu/" target="_blank" rel="noopener noreferrer" aria-label="Vishhnu on Instagram"><InstagramIcon /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
