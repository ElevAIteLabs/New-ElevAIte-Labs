import { useEffect, useRef, useState, useCallback } from 'react';

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
  // 'closed' | 'docked' | 'full'
  const [view, setView] = useState('closed');
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);

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

  const send = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setDraft('');
    setThinking(true);

    // Placeholder until api/chat.php exists.
    window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, {
        role: 'assistant',
        text: "This is the design preview, so I'm not connected to anything yet. Once the server side is wired up I'll answer from everything on this site - the services, the case studies and all sixteen articles.",
      }]);
    }, 1100);
  }, [thinking]);

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
            placeholder="Ask about services, pricing or a project…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Your message"
          />
          <button type="submit" className="arkin-send" disabled={!draft.trim() || thinking} aria-label="Send">
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
