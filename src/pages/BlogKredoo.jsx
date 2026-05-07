import { Link } from 'react-router-dom';

const BlogKredoo = () => {
  return (
    <>
      <style>{`
        .blog-hero { padding: 80px 0 60px; border-bottom: 1px solid var(--border); }
        .blog-hero .meta { font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); font-weight: 600; margin-bottom: 18px; }
        .blog-hero h1 { font-family: var(--display); font-size: clamp(36px, 5vw, 68px); font-weight: 600; color: var(--text); letter-spacing: -0.025em; line-height: 1.05; max-width: 900px; margin-bottom: 24px; }
        .blog-hero .lede { font-size: 21px; line-height: 1.55; color: var(--body); max-width: 720px; }
        .blog-cover { width: 100%; aspect-ratio: 21/9; object-fit: cover; border-radius: 16px; margin: 48px 0; }
        .blog-body { display: grid; grid-template-columns: 1fr 280px; gap: 80px; align-items: start; }
        .blog-content { max-width: 720px; }
        .blog-content h2 { font-family: var(--display); font-size: 32px; font-weight: 600; color: var(--text); letter-spacing: -0.02em; margin: 56px 0 16px; }
        .blog-content h3 { font-family: var(--display); font-size: 24px; font-weight: 500; color: var(--text); margin: 36px 0 12px; }
        .blog-content p { font-size: 17px; line-height: 1.75; color: var(--body); margin-bottom: 22px; }
        .blog-content ul, .blog-content ol { padding-left: 24px; margin-bottom: 22px; }
        .blog-content li { font-size: 17px; line-height: 1.7; color: var(--body); margin-bottom: 8px; }
        .blog-content blockquote { border-left: 3px solid var(--accent); padding: 12px 0 12px 24px; margin: 32px 0; }
        .blog-content blockquote p { font-family: var(--display); font-size: 22px; font-style: italic; color: var(--text); margin: 0; }
        .callout { background: var(--card); border-radius: 12px; padding: 28px 32px; margin: 32px 0; }
        .callout strong { display: block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 10px; }
        .callout p { font-size: 16px; margin: 0; }
        .feature-pill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0; }
        .feature-pill { background: var(--card); border-radius: 10px; padding: 20px 22px; }
        .feature-pill .icon { font-size: 22px; margin-bottom: 10px; }
        .feature-pill h4 { font-family: var(--display); font-size: 18px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
        .feature-pill p { font-size: 14px; line-height: 1.55; margin: 0; }
        .blog-sidebar { position: sticky; top: 100px; }
        .sidebar-card { background: var(--card); border-radius: 12px; padding: 28px 24px; margin-bottom: 20px; }
        .sidebar-card h4 { font-family: var(--display); font-size: 18px; font-weight: 500; margin-bottom: 12px; color: var(--text); }
        .sidebar-card p { font-size: 14px; line-height: 1.55; margin-bottom: 16px; }
        .toc-list { list-style: none; }
        .toc-list li { border-bottom: 1px solid var(--border); padding: 10px 0; }
        .toc-list li:last-child { border-bottom: none; }
        .toc-list a { font-size: 14px; color: var(--body); text-decoration: none; transition: color 0.15s; }
        .toc-list a:hover { color: var(--accent); }
        .kredoo-inline-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
        .kredoo-inline-badge::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 960px) { .blog-body { grid-template-columns: 1fr; } .blog-sidebar { position: static; } .feature-pill-grid { grid-template-columns: 1fr; } }
      `}</style>
      
      <section className="blog-hero">
        <div className="wrap">
          <div className="meta fade-up">Product · 7 min read · ElevAIte Labs · March 2025</div>
          <h1 className="fade-up">Introducing Kredoo: The Lead CRM Built for Indian Sales Teams</h1>
          <p className="lede fade-up">We spent six months watching Indian sales teams struggle with CRMs built for Western markets. So we built one that actually fits how Indian B2B works. Here's what it does and why it exists.</p>
        </div>
      </section>

      <div className="wrap">
        <div className="kredoo-blog-iframe-card fade-up">
          <div className="kredoo-blog-iframe-bar">
            <div className="kredoo-blog-iframe-dot"></div>
            <div className="kredoo-blog-iframe-dot"></div>
            <div className="kredoo-blog-iframe-dot"></div>
            <span className="kredoo-blog-iframe-url">kredoo.in — Live Product</span>
          </div>
          <div className="kredoo-blog-iframe-wrap">
            <iframe
              src="https://kredoo.in"
              className="kredoo-blog-iframe"
              scrolling="no"
              frameBorder="0"
              title="Kredoo CRM"
              loading="lazy"
            ></iframe>
            <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="kredoo-blog-iframe-link">
              <span className="kredoo-blog-visit-btn">Try Kredoo Free →</span>
            </a>
          </div>
        </div>

        <div className="blog-body">
          <article className="blog-content fade-up">
            <div className="kredoo-inline-badge">Live at kredoo.in</div>

            <p>We build a lot of custom systems for clients. Lead pipelines, WhatsApp automations, booking flows, CRM integrations. Over the past year and a half, we noticed something: we were rebuilding the same core infrastructure over and over again, slightly differently each time, for clients who had the same fundamental problem.</p>
            <p>The problem: their CRM doesn't work for them.</p>
            <p>Not because CRMs are bad software. HubSpot is excellent. Salesforce is technically impressive. Zoho has every feature you could want. The problem is that all of them were built by Western companies, for Western markets, with Western assumptions about how B2B sales works. And Indian B2B sales doesn't work that way.</p>

            <h2>What Indian Sales Actually Looks Like</h2>
            <p>Let me describe a typical sales flow for a mid-size Indian business — say, a real estate developer, a B2B services firm, or a healthcare chain:</p>
            <p>Leads come in from everywhere simultaneously. Meta ads. Indiamart. WhatsApp messages to the founder's personal number. Website forms. Referrals that arrive as a forward in a group chat. There's no single, clean source of truth.</p>
            <p>Most of the initial qualification happens over WhatsApp, not email. "Bhai, what's the budget?" is a WhatsApp message, not a CRM note. The lead's contact details — name, phone number, what they said they needed — live in someone's phone, not in a system.</p>
            <p>Follow-ups are often informal and irregular. There's no structured cadence, no automated sequence, no reminder system. There's a salesperson trying to remember who they talked to three days ago and whether they followed up.</p>
            <p>Meetings get booked through WhatsApp back-and-forth, not Calendly. "Are you free Tuesday?" "No, Wednesday afternoon?" "What about Thursday at 3?" This exchange, repeated dozens of times a week.</p>
            <p>A Western CRM sits in the middle of all this and asks: please manually enter every lead, log every interaction, update the stage after every call. Most salespeople do this for a week and then stop.</p>

            <h2>What We Built</h2>
            <p>Kredoo is a lead CRM built around how Indian sales teams actually operate. Four things make it different:</p>

            <div className="feature-pill-grid">
              <div className="feature-pill">
                <div className="icon">📋</div>
                <h4>Visual Pipeline</h4>
                <p>A drag-and-drop Kanban board where every lead lives at a stage. See your entire pipeline in real time, move leads between stages by dragging, know where every deal stands at a glance.</p>
              </div>
              <div className="feature-pill">
                <div className="icon">🤖</div>
                <h4>n8n-Powered AI Automations</h4>
                <p>Native n8n integration that routes leads, runs qualification flows, sends follow-up messages, and updates stages automatically — without any manual work from your team.</p>
              </div>
              <div className="feature-pill">
                <div className="icon">📅</div>
                <h4>Built-In Booking Links</h4>
                <p>Calendly-style scheduling that lives inside your CRM. No third-party tool, no sync problems. A lead books a meeting; it appears directly in the pipeline, already linked to their record.</p>
              </div>
              <div className="feature-pill">
                <div className="icon">💬</div>
                <h4>WhatsApp Native</h4>
                <p>Meta Ads leads flow directly into your pipeline. Follow-ups go out on WhatsApp. The channel your leads are already using is connected to the system your team works in.</p>
              </div>
            </div>

            <h3>The Pipeline: What Actually Changes</h3>
            <p>The pipeline view is the heart of Kredoo. Every lead is a card. Every card lives in a stage. You define the stages (New, Contacted, Qualified, Meeting Set, Proposal, Closed Won, Closed Lost) and you can rename or reorder them to match your actual sales process.</p>
            <p>Here's what's different from a standard Kanban tool: stages are connected to automations. Moving a lead to "Contacted" can automatically trigger a WhatsApp follow-up in 48 hours. Moving to "Qualified" can automatically create a booking link and send it to the lead. Moving to "Meeting Set" can block the calendar slot. The pipeline doesn't just track state; it drives action.</p>
            <blockquote><p>"We had 40 leads a day coming in. The pipeline made it visible. The automations made it manageable. We closed more deals in the first month than the previous quarter."<br/>— Kredoo customer, Hyderabad</p></blockquote>

            <h3>The n8n Integration: Why This Matters</h3>
            <p>Most CRMs have native automation features that are either too simple (basic email sequences) or too complex (enterprise workflow builders that require certification to use). Kredoo takes a different approach: we expose a clean API and native n8n nodes, so you can build exactly the automation you need using a tool that's already mature and powerful.</p>
            <p>n8n is an open-source workflow automation platform with a visual builder. If you've heard of Zapier or Make, n8n is more powerful and more affordable. Kredoo ships with pre-built n8n workflow templates that handle the most common automations out of the box:</p>
            <ul>
              <li>New lead from Meta Ads → auto-create in Kredoo → WhatsApp welcome message → schedule qualification call</li>
              <li>Lead moves to "Contacted" → send follow-up in 48 hours if no response → escalate to salesperson if still silent after 5 days</li>
              <li>Meeting booked → send calendar invite → reminder 1 hour before → post-meeting stage update prompt</li>
              <li>Deal closed won → trigger invoice generation → notify finance team → start onboarding workflow</li>
            </ul>
            <p>You can use these templates as-is, modify them, or build your own from scratch. The templates are starting points, not walls.</p>

            <h3>WhatsApp: The Channel Your Leads Are On</h3>
            <p>This was non-negotiable. Any CRM for Indian sales that doesn't have a real WhatsApp integration is missing the point.</p>
            <p>Kredoo's WhatsApp integration works two ways. Inbound: Meta Ads Click-to-WhatsApp leads are automatically captured in Kredoo, with the lead's name, phone number, and the message they sent, mapped to the right pipeline stage. You don't have to manually create the record; it's already there when you open your dashboard.</p>
            <p>Outbound: follow-up messages go out on WhatsApp through the n8n workflows. Not a generic template — a personalized message that references the lead's name, their specific interest, and the relevant next step. Sent at the right moment, not when someone remembers to do it.</p>

            <h3>Booking Links: Scheduling That Lives in the CRM</h3>
            <p>Every sales professional uses a scheduling tool. The problem is that scheduling tools and CRMs don't talk to each other properly. You have a Calendly booking; now you have to manually find the corresponding CRM record, update the stage, add a note. Or you don't, and your CRM record is out of date.</p>
            <p>Kredoo's booking links are built in. You create a link, set your availability, and share it. When a lead books, Kredoo automatically updates their pipeline stage, logs the meeting, and blocks the slot on your calendar. There's no separate tool and no manual sync. One system, one source of truth.</p>

            <h2>Who It's Built For</h2>
            <p>Kredoo is built for Indian SMBs and their sales teams — businesses with 3 to 50 people who are managing leads from multiple sources, following up over WhatsApp, and currently running their pipeline in a spreadsheet or a CRM they don't actually use.</p>
            <p>It's particularly good for businesses in:</p>
            <ul>
              <li><strong>Real estate</strong> — high-volume inbound from portals and Meta ads, WhatsApp-heavy qualification, scheduled site visits</li>
              <li><strong>Professional services</strong> — consultants, agencies, advisors who work on retainer and need a clean pipeline</li>
              <li><strong>Healthcare</strong> — clinic chains and specialist practices managing appointment-based sales flows</li>
              <li><strong>B2B services and SaaS</strong> — longer sales cycles with multiple touchpoints that need to be tracked</li>
              <li><strong>Digital marketing agencies</strong> — managing client leads alongside their own</li>
            </ul>

            <h2>What It Costs</h2>
            <p>Kredoo starts free. The free tier includes full pipeline functionality, up to 500 leads, one user, and one booking link — enough to understand whether it works for your business before spending anything.</p>
            <p>Paid plans start at ₹999/month and include multiple users, unlimited leads, n8n automation integration, WhatsApp connection, and priority support. We're still in early access, which means the price will go up — but early customers are locked in at the founding price.</p>

            <div className="callout">
              <strong>Start free at kredoo.in</strong>
              <p>No credit card required. Full pipeline access from day one. Takes about 10 minutes to set up your first stage and import your existing leads from a spreadsheet.</p>
            </div>

            <h2>What's Coming</h2>
            <p>Kredoo is live and being used by real sales teams right now. Here's what's on the near-term roadmap:</p>
            <ul>
              <li><strong>Razorpay integration</strong> for self-serve payments and automatic account provisioning</li>
              <li><strong>Self-service onboarding</strong> with a guided setup wizard for new accounts</li>
              <li><strong>White-label / agency tier</strong> so agencies can use Kredoo across all their clients under one account</li>
              <li><strong>Native n8n node</strong> — so Kredoo appears as a first-class node in your n8n workflow builder</li>
              <li><strong>Public API documentation</strong> for technical buyers and developers who want to build on top of the platform</li>
            </ul>
            <p>We're building Kredoo the way we build everything at ElevAIte Labs: incrementally, based on what real customers need, without shipping features nobody asked for.</p>

            <h2>Why We Built This Instead of Just Integrating with HubSpot</h2>
            <p>A reasonable question. Here's the honest answer: we tried. For the first six months of client work, our default was "set up HubSpot and build the automations on top." HubSpot is genuinely good software.</p>
            <p>But we kept running into the same friction points. The learning curve was too high for sales teams that had never used a CRM. The pricing — free tier was limited, paid was expensive for small teams. The WhatsApp integration required third-party middleware that was flaky. The pipeline view was buried under dashboards that nobody looked at. And the automation builder was powerful but not intuitive for the non-technical founders who needed it.</p>
            <p>Every time we built a workaround for one of these problems, we were essentially rebuilding a piece of Kredoo. Eventually it made more sense to build it properly than to keep patching the wrong tool.</p>
            <p>That's not a criticism of HubSpot. It's the right tool for the market it was built for. Kredoo is built for a different market.</p>
            <p>If you're running sales at an Indian business and your pipeline is currently in a spreadsheet — or in a CRM nobody actually uses — give Kredoo a try. The free tier costs nothing and takes ten minutes to set up. If it doesn't work for you, you've lost ten minutes.</p>

          </article>

          <aside className="blog-sidebar">
            <div className="sidebar-card">
              <h4>Table of Contents</h4>
              <ul className="toc-list">
                <li><a href="#">What Indian Sales Looks Like</a></li>
                <li><a href="#">What We Built</a></li>
                <li><a href="#">The Pipeline</a></li>
                <li><a href="#">n8n Integration</a></li>
                <li><a href="#">WhatsApp Native</a></li>
                <li><a href="#">Booking Links</a></li>
                <li><a href="#">Who It's For</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">What's Coming</a></li>
              </ul>
            </div>
            <div className="sidebar-card" style={{ background: 'linear-gradient(135deg, #0B1E5B, #1E88E5)', color: '#fff' }}>
              <h4 style={{ color: '#fff' }}>Try Kredoo Free</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Full pipeline access. No credit card. Takes 10 minutes to set up.</p>
              <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="btn-white" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px', background: '#fff', color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Start Free at kredoo.in →</a>
            </div>
            <div className="sidebar-card">
              <h4>Related Reading</h4>
              <ul className="toc-list">
                <li><Link to="/blog-automation">30 Hours a Week Lost →</Link></li>
                <li><Link to="/blog-whatsapp">WhatsApp Playbook →</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <section className="cta-quiz" style={{ marginTop: '80px' }}>
        <div className="wrap fade-up">
          <span className="tag">Try It Yourself</span>
          <h2>See Kredoo in action.</h2>
          <p>Free tier available now at kredoo.in. Or talk to our team and we'll set it up alongside your existing WhatsApp and Meta Ads flows.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://kredoo.in" target="_blank" rel="noopener noreferrer" className="btn btn-light">Start Free at kredoo.in →</a>
            <Link to="/contact" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>Talk to the team</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogKredoo;
