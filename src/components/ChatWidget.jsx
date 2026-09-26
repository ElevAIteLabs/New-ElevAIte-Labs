import { useEffect, useRef, useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * The conversation id, kept for this tab only.
 *
 * sessionStorage rather than localStorage: a returning visitor should get a
 * fresh conversation rather than resume one from last week, and the server
 * caps turns per conversation anyway. Wrapped because storage throws in
 * private windows and when site data is blocked.
 */
const TOKEN_KEY = 'elevaite.arkin.token';
const AVAILABLE_KEY = 'elevaite.arkin.available';
const readToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY) || null; } catch { return null; }
};
const writeToken = (t) => {
  try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* not essential */ }
};

/**
 * Arkin, the site assistant.
 *
 * Three states, one component: a launcher, a docked panel, and a full-page
 * view. They are the same DOM in different CSS states rather than separate
 * components, so expanding never unmounts the thread - a remount would drop
 * the conversation and re-trigger entry animations mid-read.
 *
 * Replies are stubbed for now. The API call belongs server-side in
 * api/chat.php: any key reachable from this file would be inlined into the
 * public bundle at build time.
 */

const GREETING = {
  role: 'assistant',
  text: "Hi, I'm Arkin. I can tell you what ElevAIte Labs builds, what a project usually costs, and whether we are a fit for what you need. What are you working on?",
};

// Shown until the visitor types. They set expectations about what Arkin is
// for, which is most of what stops a chat widget being ignored.
const PROMPTS = [
  'What do you actually build?',
  'What would an automation cost?',
  'Do you work with US companies?',
  'Show me similar projects',
];

const ChatWidget = () => {
  // Arkin renders nothing until the server confirms he can actually answer.
  // The site can then be deployed before the key and the migration are in
  // place without putting a launcher in front of visitors that opens onto
  // an error - and if the monthly cap is reached, he disappears rather
  // than failing in front of someone.
  // Read from the cache during initialisation, not from the effect -
  // setting state synchronously inside an effect costs an extra render pass.
  const [available, setAvailable] = useState(() => {
    try {
      const c = sessionStorage.getItem(AVAILABLE_KEY);
      return c === null ? null : c === '1';
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (available !== null) return undefined;
    let cancelled = false;

    fetch(`${API_URL}/chat.php?status=1`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const ok = d?.enabled === true;
        setAvailable(ok);
        try { sessionStorage.setItem(AVAILABLE_KEY, ok ? '1' : '0'); } catch { /* fine */ }
      })
      .catch(() => !cancelled && setAvailable(false));

    return () => { cancelled = true; };
  }, [available]);

  // 'closed' | 'docked' | 'full'
  const [view, setView] = useState('closed');
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  // Set when the server says this conversation is finished - a turn cap, or
  // Arkin switched off. The composer closes rather than failing repeatedly.
  const [ended, setEnded] = useState(false);

  const threadRef = useRef(null);
  const inputRef = useRef(null);
  const isOpen = view !== 'closed';

  // Keep the newest message in view as the thread grows - but not on the
  // first render. There is nothing above the greeting to scroll past, and
  // scrolling to the bottom of a short thread pushed it out of sight.
  const settled = useRef(false);
  useEffect(() => {
    if (!settled.current) { settled.current = true; return; }
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  // Focus follows the open action, but not on touch - a keyboard springing up
  // over a panel the visitor has not chosen to type in is hostile.
  useEffect(() => {
    if (!isOpen) return;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Escape steps back one level rather than closing outright, so an expanded
  // conversation is never lost to a stray keypress.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setView((v) => (v === 'full' ? 'docked' : 'closed'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // The full-page view covers the document; letting the page scroll behind it
  // is the classic mobile overlay bug.
  useEffect(() => {
    if (view !== 'full') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [view]);

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || thinking || ended) return;

    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setDraft('');
    setThinking(true);

    try {
      const res = await fetch(`${API_URL}/chat.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          token: readToken(),
          path: window.location.pathname,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // The server writes these for a visitor to read - a cap reached, a
        // message too long - so show them rather than a generic failure.
        setMessages((m) => [...m, {
          role: 'assistant',
          text: data.error || 'Something went wrong on my end. The contact form always works.',
        }]);
        if (data.disabled || data.ended) setEnded(true);
        return;
      }

      if (data.token) writeToken(data.token);
      setMessages((m) => [...m, { role: 'assistant', text: data.reply }]);
      if (data.turns_left === 0) setEnded(true);
    } catch {
      setMessages((m) => [...m, {
        role: 'assistant',
        text: "I could not reach the server just then. Try again, or use the contact form and the team will reply.",
      }]);
    } finally {
      setThinking(false);
    }
  }, [thinking, ended]);

  const onSubmit = (e) => {
    e.preventDefault();
    send(draft);
  };

  // Enter sends, Shift+Enter breaks the line - what people expect from chat.
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  // null while the check is in flight - render nothing rather than flash a
  // launcher that may be about to disappear.
  if (!available) return null;

  return (
    <>
      <button
        type="button"
        className={`arkin-launcher${isOpen ? ' is-hidden' : ''}`}
        onClick={() => setView('docked')}
        aria-label="Chat with Arkin"
        aria-expanded={isOpen}
      >
        <span className="arkin-launcher-face">
          <img src="/pictures/arkin-avatar.webp" alt="" width="44" height="44" />
          <span className="arkin-pulse" aria-hidden="true" />
        </span>
        <span className="arkin-launcher-label">
          <strong>Ask Arkin</strong>
          <em>Usually replies instantly</em>
        </span>
      </button>

      {/* Only present in the full view, and only to dim the page behind it. */}
      <div
        className={`arkin-scrim${view === 'full' ? ' is-on' : ''}`}
        onClick={() => setView('docked')}
        aria-hidden="true"
      />

      <section
        className={`arkin-panel is-${view}`}
        role="dialog"
        aria-label="Chat with Arkin"
        aria-modal={view === 'full'}
        {...(isOpen ? {} : { inert: '' })}
      >
        <header className="arkin-head">
          <span className="arkin-head-who">
            <img className="arkin-head-face" src="/pictures/arkin-avatar.webp" alt="" width="36" height="36" />
            <span>
              <strong>Arkin</strong>
              <em>ElevAIte Labs assistant</em>
            </span>
          </span>

          <span className="arkin-head-actions">
            <button
              type="button"
              className="arkin-icon arkin-icon-expand"
              onClick={() => setView(view === 'full' ? 'docked' : 'full')}
              aria-label={view === 'full' ? 'Shrink to corner' : 'Expand to full screen'}
              title={view === 'full' ? 'Shrink' : 'Expand'}
            >
              {view === 'full' ? (
                <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8h4M12 8V4M12 8l5-5M8 12H4M8 12v4M8 12l-5 5" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3h5v5M17 3l-6 6M8 17H3v-5M3 17l6-6" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="arkin-icon"
              onClick={() => setView('closed')}
              aria-label="Close chat"
              title="Close"
            >
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </span>
        </header>

        <div className="arkin-thread" ref={threadRef}>
          <div className="arkin-thread-inner">
            {messages.map((m, i) => (
              <div key={i} className={`arkin-msg is-${m.role}`}>
                {m.role === 'assistant' && (
                  <img className="arkin-msg-face" src="/pictures/arkin-avatar.webp" alt="" width="28" height="28" />
                )}
                <p>{m.text}</p>
              </div>
            ))}

            {thinking && (
              <div className="arkin-msg is-assistant">
                <img className="arkin-msg-face" src="/pictures/arkin-avatar.webp" alt="" width="28" height="28" />
                <p className="arkin-typing" aria-label="Arkin is typing">
                  <i /><i /><i />
                </p>
              </div>
            )}

            {messages.length === 1 && !thinking && (
              <div className="arkin-prompts">
                {PROMPTS.map((p) => (
                  <button type="button" key={p} onClick={() => send(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <form className="arkin-compose" onSubmit={onSubmit}>
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            placeholder={ended ? 'This conversation has ended' : 'Ask about services, pricing or a project…'}
            disabled={ended}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Your message"
          />
          <button type="submit" className="arkin-send" disabled={!draft.trim() || thinking || ended} aria-label="Send">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10h12M10 4l6 6-6 6" />
            </svg>
          </button>
        </form>

        <p className="arkin-foot">
          Arkin is an AI assistant and can be wrong. For anything binding,{' '}
          <a href="/contact">talk to the team</a>.
        </p>
      </section>
    </>
  );
};

export default ChatWidget;
