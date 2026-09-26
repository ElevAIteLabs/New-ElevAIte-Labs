import { useEffect, useState } from 'react';

/**
 * Chat transcripts in the admin panel.
 *
 * Kept because what visitors ask in their own words is the best content and
 * keyword research available, and it is free. A question that comes up
 * three times is an article; a question Arkin answers badly is a gap in the
 * knowledge base.
 *
 * The month's spend sits at the top, because the cap that protects the
 * account is only useful if somebody can see it approaching.
 */

const IS_DEV = import.meta.env.DEV;
const API_URL = import.meta.env.VITE_API_URL;

const fmt = (s) => {
  if (!s) return '';
  const d = new Date(String(s).replace(' ', 'T'));
  return Number.isNaN(d.getTime())
    ? String(s)
    : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const ChatPanel = ({ cap }) => {
  const [data, setData] = useState({ conversations: [], usage: [] });
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url = IS_DEV ? 'http://localhost:5000/chat-log' : `${API_URL}/chat-log.php`;

    fetch(url, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d?.error) setError(d.error);
        else setData({ conversations: d.conversations || [], usage: d.usage || [] });
      })
      .catch(() => !cancelled && setError('Could not load transcripts.'))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, []);

  const openOne = async (id) => {
    setOpen({ id, loading: true });
    try {
      const url = IS_DEV ? `http://localhost:5000/chat-log/${id}` : `${API_URL}/chat-log.php?id=${id}`;
      const res = await fetch(url, { credentials: 'include' });
      setOpen({ id, ...(await res.json()) });
    } catch {
      setOpen({ id, error: 'Could not load that conversation.' });
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading conversations…</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <p style={{ fontSize: 17, fontWeight: 600, color: '#475569' }}>{error}</p>
        <p style={{ marginTop: 8 }}>If Arkin has not been set up yet, run migration 005 and fill in the chat block in config.php.</p>
      </div>
    );
  }

  const month = data.usage[0];
  const spent = month ? Number(month.usd) : 0;
  const pct = cap > 0 ? Math.min(100, (spent / cap) * 100) : 0;

  return (
    <>
      {month && (
        <div className="cl-usage">
          <div>
            <span className="cl-usage-label">This month</span>
            <strong>${spent.toFixed(2)}</strong>
            <em>of ${Number(cap).toFixed(2)} cap · {month.requests} replies</em>
          </div>
          <div className="cl-bar" role="img" aria-label={`${pct.toFixed(0)} percent of the monthly cap used`}>
            <span style={{ width: `${pct}%`, background: pct > 85 ? '#dc2626' : pct > 60 ? '#d97706' : '#16a34a' }} />
          </div>
        </div>
      )}

      {!data.conversations.length ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#475569' }}>No conversations yet.</p>
          <p style={{ marginTop: 8 }}>Once visitors start talking to Arkin, what they ask will appear here.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Opening question</th>
              <th>From page</th>
              <th>Turns</th>
              <th>Lead</th>
              <th>When</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.conversations.map((c) => (
              <tr key={c.id}>
                <td style={{ maxWidth: 420 }}>{c.opening || <em style={{ color: '#94a3b8' }}>opened, never asked</em>}</td>
                <td><code style={{ fontSize: 13, color: '#64748b' }}>{c.entry_path}</code></td>
                <td>{c.turns}</td>
                <td>
                  {c.lead_id
                    ? <span className="cl-lead">{c.lead_name || c.lead_email}</span>
                    : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>{fmt(c.created_at)}</td>
                <td><button className="admin-btn-edit" onClick={() => openOne(c.id)}>Read</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {open && (
        <div className="cl-modal" onClick={() => setOpen(null)}>
          <div className="cl-sheet" onClick={(e) => e.stopPropagation()}>
            <header>
              <strong>Conversation #{open.id}</strong>
              <button className="admin-btn-outline" onClick={() => setOpen(null)}>Close</button>
            </header>
            <div className="cl-transcript">
              {open.loading && <p style={{ color: '#64748b' }}>Loading…</p>}
              {open.error && <p style={{ color: '#dc2626' }}>{open.error}</p>}
              {(open.messages || []).map((m, i) => (
                <div key={i} className={`cl-msg is-${m.role}`}>
                  <span className="cl-who">{m.role === 'user' ? 'Visitor' : 'Arkin'}</span>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPanel;
