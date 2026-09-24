/**
 * The keyword -> link table.
 *
 * Every row turns a phrase in the article into a link. Internal links are
 * the point: an exact-match anchor from each article to a landing page is
 * what took /ai-automation-company-hyderabad to the first result page, and
 * doing it by hand across sixteen articles is how it stops happening.
 *
 * External links default to nofollow deliberately. A dofollow link exists to
 * pass ranking signal to the destination, and a blog whose outbound links
 * are all dofollow to unrelated sites is the shape Google's link-spam
 * policies describe. The option is there when a link genuinely is a citation
 * we want to endorse; it is just not the default.
 */

const SUGGESTED = [
  { keyword: 'AI automation company in Hyderabad', url: '/ai-automation-company-hyderabad' },
  { keyword: 'web development company in Hyderabad', url: '/web-development-company-hyderabad' },
  { keyword: 'mobile app development company in Hyderabad', url: '/mobile-app-development-company-hyderabad' },
  { keyword: 'AI automation services', url: '/services' },
  { keyword: 'case studies', url: '/work' },
  { keyword: 'Kredoo', url: '/products' },
];

const blank = () => ({ keyword: '', url: '', rel: 'nofollow', all: false });

const KeywordLinks = ({ rows, onChange, bodyText }) => {
  const list = Array.isArray(rows) ? rows : [];
  const update = (i, patch) => onChange(list.map((r, n) => (n === i ? { ...r, ...patch } : r)));
  const remove = (i) => onChange(list.filter((_, n) => n !== i));
  const add = (row) => onChange([...list, { ...blank(), ...row }]);

  const haystack = (bodyText || '').toLowerCase();
  const unused = SUGGESTED.filter(
    (s) => !list.some((r) => r.keyword.toLowerCase() === s.keyword.toLowerCase()),
  );

  return (
    <div className="kw-panel">
      {list.length === 0 && (
        <p className="kw-empty">
          No keyword links yet. Each one turns a phrase in the article into a link, the first
          time it appears.
        </p>
      )}

      {list.map((row, i) => {
        const isExternal = /^https?:\/\//i.test(row.url);
        // A phrase that never appears in the body produces no link at all,
        // silently. Saying so here is cheaper than wondering later.
        const missing = row.keyword && !haystack.includes(row.keyword.toLowerCase());

        return (
          <div className="kw-row" key={i}>
            <div className="kw-fields">
              <label>
                <span>Phrase in the article</span>
                <input
                  type="text"
                  value={row.keyword}
                  placeholder="AI automation company in Hyderabad"
                  onChange={(e) => update(i, { keyword: e.target.value })}
                />
              </label>
              <label>
                <span>Links to</span>
                <input
                  type="text"
                  value={row.url}
                  placeholder="/services or https://example.com"
                  onChange={(e) => update(i, { url: e.target.value })}
                />
              </label>
            </div>

            <div className="kw-opts">
              <label className="kw-inline">
                <input
                  type="checkbox"
                  checked={row.all === true}
                  onChange={(e) => update(i, { all: e.target.checked })}
                />
                <span>Link every mention</span>
              </label>

              {isExternal && (
                <label className="kw-inline">
                  <span>rel</span>
                  <select value={row.rel} onChange={(e) => update(i, { rel: e.target.value })}>
                    <option value="nofollow">nofollow (recommended)</option>
                    <option value="sponsored">sponsored (paid or affiliate)</option>
                    <option value="dofollow">dofollow (passes ranking signal)</option>
                  </select>
                </label>
              )}

              <button type="button" className="admin-btn-danger" onClick={() => remove(i)}>Remove</button>
            </div>

            {missing && (
              <p className="kw-warn">
                This phrase is not in the article yet, so no link will appear. Write it into the
                body, or change the phrase to match what you wrote.
              </p>
            )}
            {isExternal && row.rel === 'dofollow' && (
              <p className="kw-warn">
                A dofollow link passes ranking signal to another site. Use it only when you would
                genuinely vouch for the page.
              </p>
            )}
          </div>
        );
      })}

      <div className="kw-actions">
        <button type="button" className="admin-btn-outline" onClick={() => add({})}>
          Add a keyword link
        </button>
      </div>

      {unused.length > 0 && (
        <div className="kw-suggest">
          <p className="kw-suggest-label">Our own pages - click to add</p>
          <div className="kw-chips">
            {unused.map((s) => (
              <button
                key={s.url + s.keyword}
                type="button"
                className="kw-chip"
                onClick={() => add({ keyword: s.keyword, url: s.url, rel: 'dofollow' })}
              >
                {s.keyword}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordLinks;
