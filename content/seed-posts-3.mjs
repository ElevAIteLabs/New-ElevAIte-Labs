/**
 * Third batch. Topics chosen from the gaps that survived the first two:
 *
 *  - Monday.com automation. The Indian results are all certified partners
 *    selling consulting (Enreap, TransFunnel, Empyra). Nobody covers the
 *    specific email-into-board workflow, which we have actually built.
 *  - Certificate issuance. Searching it returns LMS vendors listing generic
 *    "automated workflows"; none address certificate generation directly,
 *    and we have a project that does exactly that.
 *  - Where to start with AI. Fills the last service line with no coverage,
 *    and competitor pages confirm "AI consulting company in India" is the
 *    phrasing that ranks rather than "AI strategy consulting".
 *
 * Every project referenced appears on /work. No client metrics invented.
 *
 * Usage:  node content/seed-posts-3.mjs        # prints SQL to stdout
 */

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "''");

export const POSTS = [
  {
    slug: 'monday-com-workflow-automation',
    title: 'Automating Email into Monday.com: The Workflow That Stops Things Getting Lost',
    tag: 'Monday.com',
    read_time: '8 min read',
    author: 'ElevAIte Labs',
    excerpt:
      'Monday.com only reflects reality if someone keeps putting reality into it. Here is how we automate the email-to-board step so nothing depends on a person remembering to file it.',
    content: `
<p>Monday.com is a good board. It is not a good inbox. The gap between those two things is where most teams quietly lose work.</p>
<p>The pattern is always the same. Requests arrive by email. Someone reads them, decides what each one is, and creates an item on the right board with the right fields. That person is the integration, and they are the single point of failure. When they are busy, on leave, or simply distracted, the board stops reflecting reality and everyone loses trust in it.</p>

<h2>What we built</h2>
<p>Our <strong>Email-to-Email Workflow via Monday.com</strong> removes that manual step. Incoming email is parsed, categorised, and routed onto the correct Monday.com board as a structured item. No one has to remember to file anything, and the board stays current whether or not a particular person is at their desk.</p>
<p>The important part is not the connection. Monday.com has an email integration, and Zapier and Make both have connectors. The part that takes work is everything around the connection.</p>

<h2>The four decisions that actually matter</h2>

<h3>1. What counts as an item</h3>
<p>Not every email deserves a board item. Newsletters, automated receipts, replies within an existing thread, and internal chatter should not each spawn a card. Get this wrong in the permissive direction and the board becomes noise people stop reading, which is worse than the manual process you replaced.</p>
<p>We usually start deliberately narrow, catching only what is unambiguously a request, and widen once the team trusts what appears.</p>

<h3>2. Which board, and which group</h3>
<p>Routing is where the judgement lives. A support request, a new enquiry, and an invoice are three different destinations, and the email itself rarely says which it is in a machine-readable way. A subject line is a hint, not a category.</p>
<p>This is the point where a language model earns its place. A rules engine needs a growing list of patterns and breaks on anything unanticipated. A model reads the message and decides, which is what a person was doing anyway.</p>

<h3>3. Which fields to fill</h3>
<p>An item with a title and nothing else is barely better than the email. The useful version extracts the sender, the company, what they are asking for, any dates mentioned, and anything that looks like a budget or quantity, and writes them into columns you can filter and group by.</p>
<p>That extraction is the difference between a board you can run a process on and a list of subject lines.</p>

<h3>4. What happens to the thread</h3>
<p>The item needs to link back to the original email, and ideally replies should attach to the same item rather than creating new ones. Otherwise you have solved intake and created a new problem: a board full of duplicates from a single conversation.</p>

<h2>Where these workflows break</h2>
<p>Three failure modes account for most of the trouble, and all three are avoidable if you plan for them at the start.</p>
<ul>
  <li><strong>Silent failure.</strong> The workflow stops and nobody notices, because the absence of new items looks exactly like a quiet week. Every automation we build reports its own failures somewhere a human will see them.</li>
  <li><strong>Duplicates.</strong> Retries, forwarded copies, and reply-all chains all produce the same item twice. De-duplication on message id rather than subject line handles this.</li>
  <li><strong>Attachments.</strong> Quotes and specifications arrive as files. If the workflow captures the text and drops the attachment, someone still has to go back to the inbox, and you have not removed the manual step at all.</li>
</ul>

<h2>Why we build these on n8n</h2>
<p>Monday.com's built-in automations are genuinely good for board-to-board logic: when status changes, notify someone, move the item. They are not designed for parsing unstructured input and deciding where it belongs.</p>
<p>We put that logic in n8n instead, for the same reasons we use it elsewhere. It can be self-hosted, so email content, which is often commercially sensitive, stays in infrastructure you control. Its pricing does not scale with task volume, so a busy month does not produce a surprising bill. And when a step needs logic the visual editor cannot express, there is a code node rather than a dead end.</p>

<h2>The same shape, other tools</h2>
<p>Nothing here is specific to Monday.com. The pattern is: unstructured thing arrives, something decides what it is, structured record appears in the system your team actually works in.</p>
<p>We have built the same shape into HubSpot for lead engagement, and into a CRM for WhatsApp conversations. If you are on Asana, ClickUp, Trello or Jira, the destination changes and the interesting work stays identical.</p>

<h2>Worth automating?</h2>
<p>A quick test: if someone on your team opens the same inbox every morning and retypes what they find into a board, that is a workflow. If they open it twice a week and mostly delete things, it probably is not worth building yet.</p>
<p>We are in Hyderabad and work with teams across India. If you can describe your intake process end to end, that is enough for us to tell you whether it is worth automating and roughly what it would take.</p>
`,
  },

  {
    slug: 'automate-certificate-generation',
    title: 'Automating Certificate Issuance for Courses and Training Programmes',
    tag: 'Education',
    read_time: '7 min read',
    author: 'ElevAIte Labs',
    excerpt:
      'Issuing certificates by hand is one of the clearest automation wins in education, and one of the least written about. Here is what the workflow looks like and where it usually goes wrong.',
    content: `
<p>Every institution that certifies anything ends up with the same bottleneck. A cohort finishes. Someone opens a template, changes the name, exports a PDF, attaches it to an email, and repeats that until the list is done. Then a name is misspelled, or someone is missed, and the corrections start.</p>
<p>It is tedious, it is entirely mechanical, and it scales badly at exactly the moment you want to grow. It is also, unusually, a problem with a clean solution.</p>

<h2>What we built</h2>
<p>Our <strong>Certification Issuance Automation</strong> generates and distributes certificates automatically, triggered by course completion or a milestone being reached. The workflow assembles the document and sends it without anyone opening a template.</p>
<p>The trigger matters as much as the generation. If a person still has to decide when to run it, you have automated the typing and kept the bottleneck.</p>

<h2>What the workflow does</h2>

<h3>1. Watches for the completion event</h3>
<p>Course completion, assessment passed, attendance threshold met, milestone reached. The source is whatever system already holds that fact, which for institutions is usually the LMS. Our <strong>GenZ IQ Learning</strong> platform is a smart LMS providing courses, assignments, mock tests and classes while letting colleges track and analyse student performance, and that performance data is exactly the signal certificate issuance should key off.</p>

<h3>2. Assembles the document</h3>
<p>Name, programme, dates, grade where relevant, an identifier, and the signatures or seal. The design is fixed; only the data varies. This is the part everyone imagines is the whole job, and it is the easiest step.</p>

<h3>3. Records what was issued</h3>
<p>Each certificate gets a unique reference stored against the recipient. This is the step most manual processes skip, and it is the one that matters six months later when someone asks you to confirm a certificate is genuine.</p>

<h3>4. Delivers it</h3>
<p>Email with the file attached, or a link into a portal where the recipient can download it themselves. The portal version is better when certificates are reissued often, because it removes the follow-up requests entirely.</p>

<h2>Where it goes wrong</h2>

<p><strong>Names.</strong> Indian names break naive templates constantly. Long names overflow the field, initials and expansions are inconsistent between systems, and diacritics render as boxes if the font does not carry the glyphs. Test with your actual roll list, not with sample data.</p>

<p><strong>The source of truth.</strong> If the completion data lives in a spreadsheet someone maintains by hand, automating issuance just makes wrong certificates arrive faster. Fix the data source first, or accept that a person still has to approve the batch.</p>

<p><strong>Corrections.</strong> Someone will need a certificate reissued with a fixed spelling. If the workflow cannot reissue against the same reference, you end up with two valid-looking certificates for one person and no way to tell which is current.</p>

<p><strong>Verification.</strong> A PDF is trivially editable. If your certificates carry weight, a public verification page keyed on the reference is worth the small extra effort. Employers increasingly check.</p>

<h2>Adjacent problems worth solving at the same time</h2>
<p>Institutions that automate issuance usually have neighbouring paperwork worth looking at.</p>
<p>Our <strong>SmartDoc OCR</strong> work handles the reverse direction: pulling structured content out of PDFs rather than generating them, which covers admission documents, transcripts and forms arriving as scans. And <strong>Knowva</strong>, a full-stack platform we built with an admin dashboard, is the kind of surface that lets non-technical staff manage all of this without a developer.</p>
<p>That last point is the one institutions most often underestimate. Any system holding your templates and records needs somewhere for a registrar to change a date or fix a name. Skip it and every correction becomes a support ticket.</p>

<h2>Is it worth it?</h2>
<p>The honest test is volume times frequency. A hundred certificates once a year is an afternoon; automating it may not pay back. A hundred a month, or continuous issuance as learners finish at their own pace, is a different question, and self-paced programmes make manual issuance untenable almost immediately.</p>
<p>If you run courses, training programmes or certifications and issuance is currently somebody's recurring afternoon, that is a conversation worth having. We are in Hyderabad and work with institutions across India.</p>
`,
  },

  {
    slug: 'where-to-start-with-ai-business',
    title: 'Where to Start With AI: An Honest Assessment Before You Spend Anything',
    tag: 'Strategy',
    read_time: '8 min read',
    author: 'ElevAIte Labs',
    excerpt:
      'Most AI projects fail on selection, not on technology. This is the assessment we run before quoting, including the cases where our answer is that you should not build anything yet.',
    content: `
<p>The most expensive AI mistake is not a failed build. It is a successful build of the wrong thing: a system that works exactly as specified and that nobody uses, because the problem it solves was not the problem worth solving.</p>
<p>This is the assessment we run before quoting anything. It is deliberately not technical, because the failure mode is almost never technical.</p>

<h2>Start from the work, not the technology</h2>
<p>The question that produces useful answers is not "where could we use AI". It is: <em>what does someone on this team do repeatedly that they would be glad to stop doing?</em></p>
<p>Ask that and the list writes itself. Someone retypes invoice contents into accounting software. Someone checks an inbox and forwards things to whoever handles them. Someone chases people who did not reply. Someone assembles the same report every Monday.</p>
<p>Ask "where could we use AI" instead, and you get answers shaped by whatever was in the news that week.</p>

<h2>Score each candidate on four things</h2>

<h3>Frequency</h3>
<p>Daily beats weekly, weekly beats monthly. An automation that runs twice a month takes about as long to build as one that runs fifty times a day and returns a fraction as much. Frequency is the single strongest predictor of payback.</p>

<h3>Who does it now</h3>
<p>If the task is done by your most senior or most expensive person, it is worth more to automate. This is often counterintuitive, because those are the tasks people assume require judgement. Frequently they require context that can be encoded, not judgement.</p>

<h3>How structured the input is</h3>
<p>This decides what you are actually building, and the distinction is the one most proposals blur.</p>
<p>If a competent new hire could do the task from written instructions, you want a <strong>workflow automation</strong>: cheaper, faster, and far more predictable. If they would need to read something and exercise judgement, you want an <strong>agent</strong>.</p>
<p>Most businesses need considerably more of the first than the second. The commonest mistake we see is reaching for an agent when a deterministic automation would have been more reliable and a fraction of the cost.</p>

<h3>What breaking costs</h3>
<p>Automating a task where an error is embarrassing is different from automating one where an error is expensive or unsafe. Both are doable; the second needs review steps, and that changes the design and the price. Decide this at the start, not after the first incident.</p>

<h2>The four candidates that usually win</h2>
<p>Across the businesses we assess, the same shortlist keeps appearing:</p>
<ul>
  <li><strong>Lead response.</strong> Instant acknowledgement and qualification. It is the automation most directly tied to revenue, because first-response speed decides who the buyer engages with.</li>
  <li><strong>Intake and routing.</strong> Something arrives, gets classified, and lands in the right place with the right fields. Our Monday.com email routing work is exactly this shape.</li>
  <li><strong>Document extraction.</strong> Anywhere a person is retyping a PDF. Our SmartDoc OCR work covers this.</li>
  <li><strong>Follow-up.</strong> Sequences that stop the moment someone replies. Dull, and it recovers pipeline that was already paid for.</li>
</ul>

<h2>When we say do not build yet</h2>
<p>Three situations where the honest answer is to wait.</p>
<p><strong>The process is not stable.</strong> If how you do something changed twice this quarter, automating it now means rebuilding it next quarter. Let it settle.</p>
<p><strong>The data source is unreliable.</strong> Automating on top of a spreadsheet someone maintains by hand produces wrong outputs faster. Fix the source first.</p>
<p><strong>Nobody owns the outcome.</strong> If no single person is accountable for the process working, there will be nobody to notice when it silently stops, and nobody to feed corrections back in. That project fails regardless of build quality.</p>

<h2>How to sequence what survives</h2>
<p>Start with the boring, high-frequency task done by your most expensive person. It pays back quickly and, more importantly, it teaches your team what to trust. Trust is the constraint on everything after the first project, and it is earned by something unglamorous working reliably for a month.</p>
<p>Lead response is usually second, because it moves revenue directly.</p>
<p>Resist doing five things at once. Five half-working automations produce a team that routes around all of them.</p>

<h2>What an assessment costs</h2>
<p>Ours is free and takes about twenty minutes, because it is mostly us asking what your team does by hand. You get a straight answer on whether your problem is an automation, an agent, or neither, including when the answer is that you do not need us. We would rather say that early than be the reason someone has a bad first experience with this.</p>
<p>We are based in HITEC City, Hyderabad, and work with businesses across India.</p>
`,
  },
];

// Idempotent: re-running updates the same rows rather than duplicating them.
const sql = POSTS.map((p) => `INSERT INTO posts
  (slug, title, excerpt, content, author, read_time, tag, status, published_at)
VALUES (
  '${esc(p.slug)}',
  '${esc(p.title)}',
  '${esc(p.excerpt)}',
  '${esc(p.content.trim())}',
  '${esc(p.author)}',
  '${esc(p.read_time)}',
  '${esc(p.tag)}',
  'published',
  CURDATE()
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content),
  author = VALUES(author), read_time = VALUES(read_time), tag = VALUES(tag),
  status = VALUES(status);`).join('\n\n');

console.log(sql);
