import { useMemo, useState } from 'react';
import RichTextEditor from './RichTextEditor';
import KeywordLinks from './KeywordLinks';
import { TEMPLATES, templateById } from './templates';
import { runSeoChecks, summarise, toText } from './seoChecks';
import { parseKeywords } from '../seo/keywords';

/**
 * The whole publishing flow for one article: pick a template, write, add the
 * keyword links, read the checks, publish.
 *
 * Replaces the generic field-list form the rest of the admin panel uses.
 * Posts are the one thing non-technical staff edit regularly, and the
 * generic form asked them to type raw HTML into a textarea and to know what
 * a slug was.
 */

/** Stable identity, so an absent post does not invalidate the memos below. */
const EMPTY_POST = Object.freeze({});

const LEVEL_COLOUR = { pass: '#16a34a', warn: '#d97706', fail: '#dc2626' };
const LEVEL_MARK = { pass: '✓', warn: '!', fail: '×' };

const CounterHint = ({ value, min, max }) => {
  const n = (value || '').length;
  const colour = n === 0 ? '#94a3b8' : n < min || n > max ? '#d97706' : '#16a34a';
  return (
    <span style={{ fontSize: 12, fontWeight: 700, color: colour, marginLeft: 8 }}>
      {n}/{max}
    </span>
  );
};

const PostEditor = ({ value, onChange, onSubmit, onCancel, editing, saving, onUploadImage }) => {
  const post = value || EMPTY_POST;
  const [showChecks, setShowChecks] = useState(true);

  const set = (patch) => onChange({ ...post, ...patch });

  // The API returns keywords as a JSON string; the editor works with an
  // array. Normalised on the way in so both shapes are accepted.
  const keywordRows = useMemo(() => parseKeywords(post.keywords), [post.keywords]);
  const bodyText = useMemo(() => toText(post.content), [post.content]);
  const checks = useMemo(() => runSeoChecks({ ...post, keywords: keywordRows }), [post, keywordRows]);
  const score = summarise(checks);

  const applyTemplate = (id) => {
    const tpl = templateById(id);
    if (!tpl) return;
    // Only ever offered on an empty body, so there is nothing to lose.
    set({ template: id, content: tpl.body });
  };

  const bodyIsEmpty = toText(post.content).trim() === '';

  return (
    <form className="post-editor" onSubmit={onSubmit}>
      <div className="pe-main">
        {bodyIsEmpty && (
          <div className="pe-templates">
            <p className="pe-section-label">Start from a template</p>
            <div className="pe-template-grid">
              {TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`pe-template${post.template === t.id ? ' is-active' : ''}`}
                  onClick={() => applyTemplate(t.id)}
                >
                  <strong>{t.name}</strong>
                  <span>{t.blurb}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="pe-title">Title</label>
          <input
            id="pe-title"
            type="text"
            value={post.title || ''}
            required
            placeholder="What AI Automation Actually Costs in India"
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pe-excerpt">
            Excerpt
            <CounterHint value={post.excerpt} min={120} max={160} />
          </label>
          <textarea
            id="pe-excerpt"
            value={post.excerpt || ''}
            required
            placeholder="One or two sentences. This is the description Google shows under your title in search results, and the summary on the Learn page."
            onChange={(e) => set({ excerpt: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Article</label>
          <RichTextEditor
            value={post.content || ''}
            onChange={(html) => set({ content: html })}
            onUploadImage={onUploadImage}
          />
        </div>

        <div className="form-group">
          <label>Keyword links</label>
          <KeywordLinks
            rows={keywordRows}
            bodyText={bodyText}
            onChange={(rows) => set({ keywords: rows })}
          />
        </div>
      </div>

      <aside className="pe-side">
        <div className="pe-card">
          <button
            type="button"
            className="pe-card-head"
            onClick={() => setShowChecks((s) => !s)}
          >
            <span>SEO checks</span>
            <span className="pe-score">
              {score.fail > 0 && <em style={{ color: LEVEL_COLOUR.fail }}>{score.fail} to fix</em>}
              {score.fail === 0 && score.warn > 0 && <em style={{ color: LEVEL_COLOUR.warn }}>{score.warn} to review</em>}
              {score.fail === 0 && score.warn === 0 && <em style={{ color: LEVEL_COLOUR.pass }}>All clear</em>}
            </span>
          </button>

          {showChecks && (
            <ul className="pe-checks">
              {checks.map((c) => (
                <li key={c.id}>
                  <span className="pe-mark" style={{ background: LEVEL_COLOUR[c.level] }}>
                    {LEVEL_MARK[c.level]}
                  </span>
                  <span className="pe-check-body">
                    <strong>{c.label}</strong>
                    <span>{c.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="pe-note">
            Nothing here blocks publishing. They are the mistakes that quietly stop an article
            ranking.
          </p>
        </div>

        <div className="pe-card">
          <div className="pe-card-head static">Publishing</div>

          <div className="form-group">
            <label htmlFor="pe-status">Status</label>
            <select
              id="pe-status"
              value={post.status || 'draft'}
              onChange={(e) => set({ status: e.target.value })}
            >
              <option value="draft">Draft - only you can see it</option>
              <option value="published">Published - live on the site</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pe-date">Publish date</label>
            <input
              id="pe-date"
              type="date"
              value={(post.published_at || '').slice(0, 10)}
              onChange={(e) => set({ published_at: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pe-author">Author byline</label>
            <input
              id="pe-author"
              type="text"
              value={post.author || ''}
              placeholder="Shown on the article"
              onChange={(e) => set({ author: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pe-tag">Tag</label>
            <input
              id="pe-tag"
              type="text"
              value={post.tag || ''}
              placeholder="Automation"
              onChange={(e) => set({ tag: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pe-read">Read time</label>
            <input
              id="pe-read"
              type="text"
              value={post.read_time || ''}
              placeholder="6 min read"
              onChange={(e) => set({ read_time: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pe-cover">Cover image</label>
            <input
              id="pe-cover"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  set({ image: await onUploadImage(file, { raw: true }) });
                } catch (err) {
                  alert(`Upload failed: ${err.message}`);
                }
                e.target.value = '';
              }}
            />
            {post.image && <span className="pe-hint">Current: {post.image}</span>}
          </div>
        </div>

        <div className="pe-card">
          <div className="pe-card-head static">Search appearance</div>

          <div className="form-group">
            <label htmlFor="pe-meta-title">
              Meta title
              <CounterHint value={post.meta_title || post.title} min={30} max={60} />
            </label>
            <input
              id="pe-meta-title"
              type="text"
              value={post.meta_title || ''}
              placeholder="Leave blank to use the title"
              onChange={(e) => set({ meta_title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pe-slug">URL</label>
            <input
              id="pe-slug"
              type="text"
              value={post.slug || ''}
              placeholder="Generated from the title"
              onChange={(e) => set({ slug: e.target.value })}
            />
            <span className="pe-hint">elevaitelabs.in/learn/{post.slug || '…'}</span>
          </div>
        </div>

        <div className="pe-submit">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : post.status === 'published' ? 'Publish' : 'Save draft'}
          </button>
          {editing && (
            <button type="button" className="admin-btn-outline" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </aside>
    </form>
  );
};

export default PostEditor;
