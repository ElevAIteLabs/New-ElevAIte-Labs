import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://elevaitelabs.in/api';

const Work = () => {
  const [filter, setFilter] = useState('mobile-app');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/work.php`);
      const data = await res.json();
      console.log('Fetched projects:', data);
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (e) {
      console.error('Failed to fetch projects:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (cat) => {
    setFilter(cat);
  };

  const filteredProjects = projects.filter(p => {
    const pCat = (p.category || '').trim().toLowerCase();
    const fCat = (filter || '').trim().toLowerCase();
    return pCat === fCat;
  });

  console.log('Active filter:', filter);
  console.log('Filtered projects:', filteredProjects);

  return (
    <>
      <style>{`
        .filter-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
        .filter-chip { padding: 8px 16px; border: 1px solid var(--border); border-radius: 999px; background: transparent; color: var(--body); font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .filter-chip.active { background: var(--text); color: #fff; border-color: var(--text); }
        .filter-chip:hover:not(.active) { border-color: var(--text); color: var(--text); }
        .case-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: 64px; padding: 80px 0; border-bottom: 1px solid var(--border); align-items: center; }
        .case-row.even > .case-img { order: -1; }
        .case-img { aspect-ratio: 4/3; }
        .case-row .industry-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); font-weight: 600; margin-bottom: 14px; }
        .case-row h2 { font-family: var(--display); font-size: clamp(32px, 4vw, 48px); font-weight: 600; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 18px; }
        .case-row p { font-size: 17px; line-height: 1.6; margin-bottom: 24px; max-width: 540px; }
        .case-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 24px; }
        .case-results .num { font-family: var(--display); font-size: 32px; font-weight: 500; color: var(--accent); letter-spacing: -0.02em; }
        .case-results .lbl { font-size: 12px; color: var(--body); margin-top: 4px; }
        .arkin-case-wrap { background: transparent; position: relative; display: flex; align-items: center; justify-content: center; }
        .arkin-case-img { height: 90%; max-height: 500px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.25)); }
        .loading-state { padding: 100px 0; text-align: center; color: var(--body); font-size: 18px; }
        .no-projects { padding: 60px 0; text-align: center; color: var(--body); border: 1px dashed var(--border); border-radius: 12px; margin-top: 40px; }
        @media (max-width: 960px) {
          .case-row { grid-template-columns: 1fr; gap: 32px; padding: 56px 0; }
          .case-row:nth-child(even) > .case-img { order: 0; }
          .arkin-case-img { max-height: 600px; }
        }
      `}</style>
      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Our Work</span>
          <h1 className="fade-up">Real Projects. Real Results.</h1>
          <p className="fade-up">A selection of recent work across real estate, healthcare, fintech, D2C, media, and logistics. Most are shipped and live; a few we can only describe under NDA.</p>
          
          <div className="filter-row fade-up">
            <button className={`filter-chip ${filter === 'mobile-app' ? 'active' : ''}`} onClick={() => handleFilter('mobile-app')}>Mobile App</button>
            <button className={`filter-chip ${filter === 'web-app' ? 'active' : ''}`} onClick={() => handleFilter('web-app')}>Web App</button>
            <button className={`filter-chip ${filter === 'ai-automation' ? 'active' : ''}`} onClick={() => handleFilter('ai-automation')}>AI Automation</button>
            <button className={`filter-chip ${filter === 'ai-agent' ? 'active' : ''}`} onClick={() => handleFilter('ai-agent')}>AI Agent</button>
            <button className={`filter-chip ${filter === 'content-creation' ? 'active' : ''}`} onClick={() => handleFilter('content-creation')}>Content Creation</button>
          </div>
        </div>
      </section>

      <section style={{ padding: '0' }}>
        <div className="wrap">
          {loading ? (
            <div className="loading-state">Loading projects...</div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => (
              <div className={`case-row ${idx % 2 === 1 ? 'even' : ''}`} key={project.id || idx}>
                <div>
                  <div className="industry-tag">{project.industry || 'ElevAIte Labs Project'}</div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-arrow" style={{ color: 'var(--accent)' }}>Visit Live Project <span className="arrow">↗</span></a>
                    )}
                  </div>
                </div>
                <div className="case-img arkin-char-wrap arkin-case-wrap">
                  <img src={`/pictures/${project.arkin_image || 'arkin.png'}`} alt="Arkin" className="arkin-char arkin-case-img" />
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects">
              <h3>No projects found in this category.</h3>
              <p>Check back soon or contact us to see more work.</p>
            </div>
          )}
        </div>
      </section>

      <section className="cta-quiz">
        <div className="wrap fade-up">
          <span className="tag">Have a project in mind?</span>
          <h2>Let's build the next one together.</h2>
          <p>Tell us where you want AI to bite. We'll come back with a scope, a timeline, and a price within 48 hours.</p>
          <Link to="/contact" className="btn btn-light">Start a Conversation →</Link>
        </div>
      </section>
    </>
  );
};

export default Work;
