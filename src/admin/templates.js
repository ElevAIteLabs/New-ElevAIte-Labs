/**
 * Starter layouts a writer picks before typing.
 *
 * These exist because a blank editor is the hardest thing to hand a
 * non-technical person, and because the shape of an article is most of what
 * decides whether it ranks. Each one lays out the H2s Google expects to find
 * for that kind of query, with a one-line prompt under each so the writer
 * knows what belongs there.
 *
 * The guidance text is written to be deleted - it is placeholder prose, not
 * instructions to leave in. The SEO panel's word count catches anything left
 * behind, because the placeholders alone never reach the threshold.
 */

const p = (text) => `<p><em>${text}</em></p>`;

export const TEMPLATES = [
  {
    id: 'how-to',
    name: 'How-To / Tutorial',
    blurb: 'A reader wants to accomplish one specific thing. Ranks for "how to ..." queries.',
    body: [
      p('Open with the outcome: what the reader will have working by the end, and roughly how long it takes.'),
      '<h2>What you need before you start</h2>',
      p('Accounts, access, or tools. Be specific about anything that costs money.'),
      '<h2>Step 1: …</h2>',
      p('One action per step. Say what to click and what should happen.'),
      '<h2>Step 2: …</h2>',
      p(''),
      '<h2>Step 3: …</h2>',
      p(''),
      '<h2>What to do when it does not work</h2>',
      p('The two or three failures people actually hit, and the fix for each.'),
      '<h2>Where to take it next</h2>',
      p('The obvious follow-on, and a link to the service page if this is work we do.'),
    ].join('\n'),
  },
  {
    id: 'listicle',
    name: 'Listicle (Top N)',
    blurb: 'Comparison-shopping intent. Ranks for "best ...", "top ... tools".',
    body: [
      p('State what the list covers and how the items were chosen. Readers distrust lists with no criteria.'),
      '<h2>How we chose these</h2>',
      p('Your actual criteria. This is the section that separates a useful list from filler.'),
      '<h2>1. …</h2>',
      p('What it is, who it suits, what it costs, and where it falls short. Include the weakness - it is what makes the rest believable.'),
      '<h2>2. …</h2>',
      p(''),
      '<h2>3. …</h2>',
      p(''),
      '<h2>Which one to pick</h2>',
      p('A direct recommendation by situation, not a shrug.'),
    ].join('\n'),
  },
  {
    id: 'comparison',
    name: 'Comparison (X vs Y)',
    blurb: 'High commercial intent. Ranks for "X vs Y" and "X alternative".',
    body: [
      p('Name both options and give the one-sentence answer up front. Readers who bounce still got what they came for.'),
      '<h2>The short answer</h2>',
      p('Two or three sentences. Who should pick which.'),
      '<h2>Where X is stronger</h2>',
      p(''),
      '<h2>Where Y is stronger</h2>',
      p(''),
      '<h2>Pricing, honestly</h2>',
      p('Real numbers where you can. This is the section people scroll to find.'),
      '<h2>What we use, and why</h2>',
      p('First-hand experience is the part no competitor can copy.'),
    ].join('\n'),
  },
  {
    id: 'review',
    name: 'Product / Service Review',
    blurb: 'For a single tool or service you have actually used.',
    body: [
      p('What it is, who it is for, and your verdict in one line.'),
      '<h2>What it does well</h2>',
      p(''),
      '<h2>What it does badly</h2>',
      p('Never skip this. A review with no criticism reads as an advert and gets treated as one.'),
      '<h2>What it costs</h2>',
      p(''),
      '<h2>Who should use it - and who should not</h2>',
      p(''),
      '<h2>Verdict</h2>',
      p(''),
    ].join('\n'),
  },
  {
    id: 'news',
    name: 'News / Update',
    blurb: 'A change in the field, or an announcement from us.',
    body: [
      p('What changed, when, and who it affects. Lead with the fact, not the build-up.'),
      '<h2>What changed</h2>',
      p(''),
      '<h2>Why it matters</h2>',
      p(''),
      '<h2>What you should do about it</h2>',
      p('The practical part. Without this the post is an announcement, not a resource.'),
    ].join('\n'),
  },
  {
    id: 'guide',
    name: 'Explainer / Guide',
    blurb: 'Answers "what is ..." and "should we ..." questions. The default.',
    body: [
      p('Answer the title question in the first two sentences, then earn the rest of the read.'),
      '<h2>What it actually means</h2>',
      p('Plain language. Assume the reader is smart and busy, not that they know the jargon.'),
      '<h2>When it is worth doing</h2>',
      p(''),
      '<h2>When it is not</h2>',
      p('The section that builds trust. Say who should not bother.'),
      '<h2>What it costs</h2>',
      p(''),
      '<h2>How to get started</h2>',
      p(''),
    ].join('\n'),
  },
  {
    id: 'blank',
    name: 'Blank',
    blurb: 'Start from nothing.',
    body: '',
  },
];

export const templateById = (id) => TEMPLATES.find((t) => t.id === id) || null;
