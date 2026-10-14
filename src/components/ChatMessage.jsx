/**
 * Renders one of Arkin's replies.
 *
 * The model writes light markdown - numbered and bulleted lists, bold for
 * the thing being named, the occasional link. Rendered as plain text those
 * arrive as literal asterisks, which looks broken; rendered with
 * dangerouslySetInnerHTML they would be model output injected into the page.
 *
 * So this builds React elements instead. Nothing the model writes can become
 * markup, because no HTML is ever parsed - the worst a hostile reply can do
 * is render its own characters as text. That matters more than usual here:
 * the model reads visitor input, and a visitor can ask it to repeat anything.
 *
 * Deliberately a small subset. Anything it does not recognise falls through
 * as plain text rather than being dropped.
 */

/** **bold**, [text](url), and bare URLs. Everything else stays literal. */
const inline = (text, keyPrefix) => {
  const nodes = [];
  // One pass, so a URL inside bold does not get matched twice.
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s<>)]+)/g;
  let last = 0;
  let m;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));

    if (m[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${i++}`}>{m[1]}</strong>);
    } else {
      const [label, href] = m[2] !== undefined ? [m[2], m[3]] : [m[4], m[4]];
      // Links Arkin writes point at our own pages, but it can repeat a URL a
      // visitor gave it, so they open detached and unendorsed.
      nodes.push(
        <a key={`${keyPrefix}-a${i++}`} href={href} target="_blank" rel="noopener noreferrer nofollow">
          {label}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : text;
};

const ChatMessage = ({ text }) => {
  const lines = String(text ?? '').split('\n');
  const blocks = [];
  let list = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? 'ol' : 'ul';
    blocks.push(
      <Tag key={`l${blocks.length}`} className="arkin-list">
        {list.items.map((item, n) => <li key={n}>{inline(item, `${blocks.length}-${n}`)}</li>)}
      </Tag>,
    );
    list = null;
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (line === '') { flush(); return; }

    const ordered = line.match(/^(\d+)[.)]\s+(.*)$/);
    const bullet = line.match(/^[-*•]\s+(.*)$/);

    if (ordered || bullet) {
      const isOrdered = Boolean(ordered);
      // A bulleted list directly after a numbered one is a new list, not a
      // continuation, so the numbering does not restart mid-sequence.
      if (list && list.ordered !== isOrdered) flush();
      if (!list) list = { ordered: isOrdered, items: [] };
      list.items.push((ordered ? ordered[2] : bullet[1]).trim());
      return;
    }

    flush();
    blocks.push(<p key={`p${blocks.length}`}>{inline(line, blocks.length)}</p>);
  });

  flush();
  return <>{blocks}</>;
};

export default ChatMessage;
