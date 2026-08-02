import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MediaOrTile from '../components/MediaOrTile';

const apiUrl = (r) => import.meta.env.DEV ? `http://localhost:5000/${r}` : `${import.meta.env.VITE_API_URL}/${r}.php`;

const Work = () => {
  const [filter, setFilter] = useState('mobile-app');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(apiUrl('work'));
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

  const matchesFilter = (p) =>
    (p.category || '').trim().toLowerCase() === (filter || '').trim().toLowerCase();

  const filteredProjects = projects.filter(matchesFilter);

  // Every project is rendered and the filter only controls visibility.
  // Rendering just the matching subset meant the prerendered HTML contained
  // one category, so most case studies were never visible to search engines.
  let visibleIndex = 0;
  const allProjects = projects.map((project) => {
    const visible = matchesFilter(project);
    const even = visible && visibleIndex++ % 2 === 1;
    return { project, visible, even };
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
        /* Equal tracks: the order swap moves the media into the other column
           on alternating rows, so unequal tracks gave every second row a
           differently-sized image box. */
        .case-row { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; padding: 56px 0; border-bottom: 1px solid var(--border); align-items: center; }
        .case-row.even > .case-img { order: -1; }
        .case-img { aspect-ratio: 16/9; }
        .case-row .industry-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); font-weight: 600; margin-bottom: 14px; }
        .case-row h2 { font-family: var(--display); font-size: clamp(32px, 4vw, 48px); font-weight: 600; color: var(--text); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 18px; }
        .case-row p { font-size: 17px; line-height: 1.6; margin-bottom: 24px; max-width: 540px; }
        .case-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 24px; }
        .case-results .num { font-family: var(--display); font-size: 32px; font-weight: 500; color: var(--accent); letter-spacing: -0.02em; }
        .case-results .lbl { font-size: 12px; color: var(--body); margin-top: 4px; }
        .case-shot { border-radius: var(--radius-card-lg); overflow: hidden; border: 1px solid var(--border); box-shadow: 0 20px 48px rgba(0,0,0,0.10); background: var(--card); }
        .case-shot img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        /* Logos and other odd-shaped sources: show whole, don't crop to a slab */
        .case-shot img.is-contained { object-fit: contain; padding: 7%; background: var(--white); }
        .case-tile { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, var(--text) 0%, #2b2b2b 100%); color: #fff; }
        .case-tile span { font-family: var(--display); font-size: 64px; font-weight: 700; line-height: 1; }
        .case-tile em { font-style: normal; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.6; }
        .loading-state { padding: 100px 0; text-align: center; color: var(--body); font-size: 18px; }
        .no-projects { padding: 60px 0; text-align: center; color: var(--body); border: 1px dashed var(--border); border-radius: 12px; margin-top: 40px; }
        @media (max-width: 960px) {
          .case-row { grid-template-columns: 1fr; gap: 28px; padding: 40px 0; }
          .case-row:nth-child(even) > .case-img { order: 0; }
        }
      `}</style>
      <section className="page-hero">
        <div className="wrap">
          <span className="tag fade-up">Our Work</span>
          <h1 className="fade-up">Our Projects. Our Results.</h1>
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
            allProjects.map(({ project, visible, even }, idx) => (
              <div
                className={`case-row ${even ? 'even' : ''}`}
                key={project.id || idx}
                data-category={project.category}
                style={visible ? undefined : { display: 'none' }}
              >
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
                {/* Prefer the actual project screenshot - the mascot is only a last resort */}
                <div className="case-img case-shot">
                  <MediaOrTile
                    src={project.image}
                    alt={project.title}
                    label={project.industry || 'ElevAIte Labs'}
                    tileClassName="case-tile"
                  />
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
