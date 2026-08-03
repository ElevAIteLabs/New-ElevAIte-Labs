import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApiUrl } from '../seo/posts';

// Articles written before the CMS existed. They live as their own page
// components, so they are described here to render through the same card as
// everything coming from the admin panel.
const LEGACY_ARTICLES = [
  {
    href: '/blog-kredoo',
    tag: 'Product',
    readTime: '7 min read',
    date: null,
    title: 'Introducing Kredoo: The Lead CRM Built for Indian Sales Teams',
    excerpt:
      "We spent six months watching Indian sales teams struggle with CRMs designed for Western markets - too complex, too expensive, and completely ignorant of how Indian B2B actually works. So we built Kredoo. Here's what it does and why it exists.",
  },
  {
    href: '/blog-automation',
    tag: 'Operations',
    readTime: '9 min read',
    date: null,
    title: 'How Indian SMBs Are Losing 30 Hours a Week - and How to Stop',
    excerpt:
      "The same five manual workflows appear in nearly every business we audit. Lead follow-up, CRM hygiene, appointment scheduling, invoice chasing, and content publishing. Together they eat 30+ hours of someone's week. Here's the complete breakdown and what to automate first.",
  },
  {
    href: '/blog-whatsapp',
    tag: 'Playbook',
    readTime: '12 min read',
    date: null,
    title: 'The WhatsApp Automation Playbook for Indian Businesses',
    excerpt:
      '450 million Indians use WhatsApp daily. Your best leads are on it right now, and most businesses are responding manually - or not at all. This is the complete guide to building AI agents on WhatsApp that qualify, nurture, and book, without a single human in the loop.',
  },
];

// "2 Aug 2026". Returns null for missing or unparseable values so the meta
// line simply drops the segment instead of rendering "Invalid Date".
const formatPostDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Learn = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [posts, setPosts] = useState([]);

  // Posts published from the admin panel. The three articles below this list
  // predate the CMS and are still hardcoded, so both render together.
  useEffect(() => {
    let cancelled = false;
    fetch(postsApiUrl())
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => !cancelled && setPosts(Array.isArray(d) ? d : []))
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // CMS posts first (newest work), then the pre-CMS articles.
  const articles = [
    ...posts.map((p) => ({
      href: `/learn/${p.slug}`,
      tag: p.tag,
      readTime: p.read_time,
      date: p.published_at,
      title: p.title,
      excerpt: p.excerpt,
    })),
    ...LEGACY_ARTICLES,
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <>
      <style>{`
        .reels-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-top: 40px; align-items: start; }
        .reel-card-clean { display: flex; flex-direction: column; gap: 14px; text-decoration: none; cursor: pointer; }
        .reel-thumb { aspect-ratio: 9 / 16; border-radius: 16px; overflow: hidden; position: relative; background: var(--card); border: 1px solid var(--border); transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .reel-card-clean:hover .reel-thumb { transform: translateY(-6px); box-shadow: 0 20px 48px -8px rgba(15, 15, 15, 0.18); }
        .reel-thumb::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(10, 10, 10, 0.72) 0%, rgba(10, 10, 10, 0.18) 45%, transparent 70%); border-radius: inherit; z-index: 1; }
        .reel-thumb-cat { position: absolute; top: 14px; left: 14px; z-index: 2; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: rgba(30, 136, 229, 0.85); padding: 4px 10px; border-radius: 999px; backdrop-filter: blur(6px); }
        .reel-thumb-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; width: 52px; height: 52px; border-radius: 50%; background: rgba(255, 255, 255, 0.92); border: 1px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 17px; padding-left: 3px; transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s ease, background 0.25s ease; backdrop-filter: blur(4px); }
        .reel-card-clean:hover .reel-thumb-play { transform: translate(-50%, -50%) scale(1.12); box-shadow: 0 8px 28px rgba(30, 136, 229, 0.28); background: #fff; }
        .reel-thumb-ig { position: absolute; bottom: 14px; left: 14px; right: 14px; z-index: 2; display: flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(255,255,255,0.75); font-weight: 500; }
        .reel-thumb-ig svg { flex-shrink: 0; opacity: 0.85; }
        .reel-thumb-bg { position: absolute; inset: 0; z-index: 0; background-image: repeating-linear-gradient(135deg, rgba(15,15,15,0.04) 0px, rgba(15,15,15,0.04) 1px, transparent 1px, transparent 9px); }
        .reel-card-clean:nth-child(1) .reel-thumb { background: #E8EEF8; }
        .reel-card-clean:nth-child(2) .reel-thumb { background: #EBE8F0; }
        .reel-card-clean:nth-child(3) .reel-thumb { background: #E8F0EC; }
        .reel-card-clean:nth-child(4) .reel-thumb { background: #F0EBE8; }
        .reel-card-clean:nth-child(5) .reel-thumb { background: #E8EEF0; }
        .reel-card-clean .reel-cat { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); font-weight: 600; }
        .reel-card-clean h3 { font-family: var(--sans); font-size: 15px; font-weight: 600; color: var(--text); line-height: 1.35; }
        @media (max-width: 1100px) { .reels-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .reels-grid { grid-template-columns: repeat(2, 1fr); } }
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 56px; }
        .blog-card { display: flex; flex-direction: column; gap: 16px; cursor: pointer; }
        .blog-card .ph { aspect-ratio: 16/10; transition: transform 0.25s; }
        .blog-card:hover .ph { transform: translateY(-3px); }
        .blog-card .meta { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); font-weight: 600; }
        .blog-card h3 { font-family: var(--display); font-size: 24px; font-weight: 500; color: var(--text); letter-spacing: -0.01em; line-height: 1.2; }
        .blog-card p { font-size: 15px; line-height: 1.55; }
        .course-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 56px; }
        .course-card { background: var(--card); border-radius: 16px; padding: 36px 32px; display: flex; flex-direction: column; gap: 14px; }
        .course-card .level { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); font-weight: 600; }
        .course-card h3 { font-family: var(--display); font-size: 26px; font-weight: 500; color: var(--text); letter-spacing: -0.01em; }
        .course-card .meta-row { display: flex; gap: 18px; font-size: 13px; color: var(--body); margin-top: 4px; }
        .course-card p { font-size: 15px; line-height: 1.5; }
        .course-card .cta { margin-top: auto; padding-top: 16px; }
        @media (max-width: 960px) { .blog-grid, .course-row { grid-template-columns: 1fr; } }
              @media (max-width: 700px) {
          .reel-thumb-cat { font-size: 12px; }
          .reel-card .reel-cat, .reel-card-clean .reel-cat { font-size: 12px; }
          .course-card .level { font-size: 12px; }
          .post-dates, .post-tag { font-size: 12px; }
        }
`}</style>

      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Learn With Us</span>
          <h1 className="fade-up">Free AI Education for Professionals &amp; Students</h1>
          <p className="fade-up">We publish what we wish we'd had when we were starting. Reels, articles, and short courses - built for Indian operators, founders, and students who want to actually use AI in their work.</p>
          <div className="hero-tags-row fade-up">
            <span className="hero-tag"><span className="dot"></span>Automation</span>
            <span className="hero-tag"><span className="dot"></span>AI Agents</span>
            <span className="hero-tag"><span className="dot"></span>WhatsApp Bots</span>
            <span className="hero-tag"><span className="dot"></span>RAG Systems</span>
            <span className="hero-tag"><span className="dot"></span>Lead Generation</span>
            <span className="hero-tag"><span className="dot"></span>Content Engines</span>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="tag">Reels</span>
              <h2 className="display">This Week on Instagram</h2>
            </div>
            <a href="https://www.instagram.com/elevaitelabs/" target="_blank" rel="noopener noreferrer" className="link-arrow">Follow @elevaitelabs <span className="arrow">→</span></a>
          </div>

          <div className="reels-grid">
            <a className="reel-card-clean fade-up" href="https://www.instagram.com/reel/DPblf0dD_T0/" target="_blank" rel="noopener noreferrer">
              <div className="reel-thumb">
                <div className="reel-thumb-bg"></div>
                <div className="reel-thumb-cat">Automation</div>
                <div className="reel-thumb-play">▶</div>
                <div className="reel-thumb-ig">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Watch on Instagram
                </div>
              </div>
              <div className="reel-cat">Automation</div>
              <h3>5 workflows you should automate this week</h3>
            </a>

            <a className="reel-card-clean fade-up" href="https://www.instagram.com/reel/DS7ph4rD9LM/" target="_blank" rel="noopener noreferrer">
              <div className="reel-thumb">
                <div className="reel-thumb-bg"></div>
                <div className="reel-thumb-cat">Career</div>
                <div className="reel-thumb-play">▶</div>
                <div className="reel-thumb-ig">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Watch on Instagram
                </div>
              </div>
              <div className="reel-cat">Career</div>
              <h3>Become an AI engineer in 2026 - the honest path</h3>
            </a>

            <a className="reel-card-clean fade-up" href="https://www.instagram.com/reel/DS-PVTTjyxQ/" target="_blank" rel="noopener noreferrer">
              <div className="reel-thumb">
                <div className="reel-thumb-bg"></div>
                <div className="reel-thumb-cat">Founders</div>
                <div className="reel-thumb-play">▶</div>
                <div className="reel-thumb-ig">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Watch on Instagram
                </div>
              </div>
              <div className="reel-cat">Founders</div>
              <h3>Why your AI Agent is failing (and how to fix it)</h3>
            </a>

            <a className="reel-card-clean fade-up" href="https://www.instagram.com/reel/DUlGdjLjWaG/" target="_blank" rel="noopener noreferrer">
              <div className="reel-thumb">
                <div className="reel-thumb-bg"></div>
                <div className="reel-thumb-cat">Tools</div>
                <div className="reel-thumb-play">▶</div>
                <div className="reel-thumb-ig">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Watch on Instagram
                </div>
              </div>
              <div className="reel-cat">Tools</div>
              <h3>The 6 AI tools every Indian SMB should be running</h3>
            </a>

            <a className="reel-card-clean fade-up" href="https://www.instagram.com/reel/DV0-5lfDx2_/" target="_blank" rel="noopener noreferrer">
              <div className="reel-thumb">
                <div className="reel-thumb-bg"></div>
                <div className="reel-thumb-cat">Growth</div>
                <div className="reel-thumb-play">▶</div>
                <div className="reel-thumb-ig">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Watch on Instagram
                </div>
              </div>
              <div className="reel-cat">Growth</div>
              <h3>How we automated a business to ₹10L/month</h3>
            </a>
          </div>

          <div className="work-cta fade-up" style={{ marginTop: '40px' }}>
            <a href="https://www.instagram.com/elevaitelabs/" target="_blank" rel="noopener noreferrer" className="link-arrow">View all reels on Instagram <span className="arrow">→</span></a>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Articles</span>
            <h2 className="display">Long-form, written by people who ship.</h2>
          </div>
          <div className="post-grid">
            {articles.map((article) => (
              <Link className="post-card fade-up" key={article.href} to={article.href}>
                <div className="post-card-meta">
                  {article.tag && <span className="post-tag">{article.tag}</span>}
                  <span className="post-dates">
                    {[formatPostDate(article.date), article.readTime].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className="post-read">Read the post <span className="arrow">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--card)' }}>
        <div className="wrap">
          <div className="fade-up">
            <span className="tag">Mini-Courses</span>
            <h2 className="display">Short, free, and shipping-focused.</h2>
            <p style={{ fontSize: '18px', marginTop: '18px', maxWidth: '640px' }}>Three free courses, each under 90 minutes, each ending with you having actually built something.</p>
          </div>
          <div className="course-row">
            <div className="course-card fade-up">
              <div className="level">Beginner</div>
              <h3>Your first AI workflow in 60 minutes</h3>
              <div className="meta-row"><span>6 lessons</span><span>·</span><span>60 min</span></div>
              <p>Build a real lead-followup workflow with no code, using the tools you already have.</p>
              <div className="cta"><Link to="/learn" className="link-arrow">Start course <span className="arrow">→</span></Link></div>
            </div>
            <div className="course-card fade-up">
              <div className="level">Intermediate</div>
              <h3>Building production RAG systems</h3>
              <div className="meta-row"><span>9 lessons</span><span>·</span><span>90 min</span></div>
              <p>Embeddings, retrieval, evals, and the boring parts that make RAG actually work in production.</p>
              <div className="cta"><Link to="/learn" className="link-arrow">Start course <span className="arrow">→</span></Link></div>
            </div>
            <div className="course-card fade-up">
              <div className="level">Founders</div>
              <h3>Operator's guide to AI ROI</h3>
              <div className="meta-row"><span>5 lessons</span><span>·</span><span>45 min</span></div>
              <p>How to scope an AI project, hire for it, and know whether it's working.</p>
              <div className="cta"><Link to="/learn" className="link-arrow">Start course <span className="arrow">→</span></Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-quiz">
        <div className="wrap fade-up">
          <span className="tag">Newsletter</span>
          <h2>One email a week. Zero filler.</h2>
          <p>Practical AI plays for operators and founders, written by our team. ~3,000 subscribers. Unsubscribe in one click.</p>
          <form style={{ display: 'flex', gap: '8px', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }} onSubmit={handleSubscribe}>
            <input type="email" placeholder="you@company.com" required style={{ flex: 1, minWidth: '200px', padding: '14px 18px', borderRadius: '8px', border: 'none', fontFamily: 'inherit', fontSize: '15px', color: 'var(--text)' }} />
            <button className="btn btn-light" type="submit" disabled={subscribed}>{subscribed ? 'Subscribed ✓' : 'Subscribe'}</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Learn;
