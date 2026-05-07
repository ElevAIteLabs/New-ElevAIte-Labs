import { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success
  const [email, setEmail] = useState('');

  const handleBudgetSelect = (budget) => {
    setSelectedBudget(budget);
  };

  const submitContact = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('from_name').trim();
    const emailVal = formData.get('from_email').trim();
    const phone = formData.get('phone').trim();
    const company = formData.get('company').trim();
    const role = formData.get('role');
    const service = formData.get('service');
    const message = formData.get('message').trim();
    const budget = selectedBudget || 'Not specified';

    if (!name || !emailVal || !role || !service || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    setStatus('sending');
    setEmail(emailVal);

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const KREDOO_WEBHOOK = 'https://kredoo.in/api/webhook/068d9345-b4ee-43ac-82fc-a500790a6990';

    /* 1. Post lead to Kredoo CRM */
    try {
      await fetch(KREDOO_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email: emailVal, phone, company, role,
          service, budget, message,
          source: 'Website Contact Form',
          submitted_at: timestamp,
        }),
      });
    } catch (err) {
      console.warn('Kredoo webhook error (non-blocking):', err);
    }

    /* 2. Send emails via EmailJS */
    const EMAIL_CONFIG = {
      publicKey: 'TV2W6oWSqMNM7ELMw',   // e.g. 'AbCdEf123456'
      serviceId: 'service_urz7rpv',            // e.g. 'service_xyz'
      clientTemplateId: 'template_lf58fut',    // confirmation to client
      teamTemplateId: 'template_xgfg4mb',       // notification to your team
      teamEmail: 'hello@elevaitelabs.com',
    };

    if (EMAIL_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });
      const sharedParams = {
        from_name: name,
        from_email: emailVal,
        phone: phone || 'Not provided',
        company: company || 'Not provided',
        role,
        service,
        budget,
        message,
        submitted_at: timestamp,
        team_email: EMAIL_CONFIG.teamEmail,
      };

      try {
        /* Client confirmation */
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.clientTemplateId, {
          ...sharedParams,
          to_name: name,
          to_email: emailVal,
        });
        /* Team notification */
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.teamTemplateId, {
          ...sharedParams,
          to_email: EMAIL_CONFIG.teamEmail,
        });
      } catch (err) {
        console.warn('EmailJS error (non-blocking):', err);
      }
    }

    /* 3. Show success state */
    setStatus('success');
  };

  return (
    <>
      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
        .contact-info h1 { font-family: var(--display); font-size: clamp(48px, 6vw, 80px); font-weight: 600; color: var(--text); letter-spacing: -0.025em; line-height: 1.05; margin: 18px 0 24px; }
        .contact-info h1 em { font-style: italic; color: var(--accent); font-weight: 500; }
        .contact-info .lede { font-size: 19px; line-height: 1.55; color: var(--body); margin-bottom: 36px; max-width: 480px; }
        .contact-channels { display: flex; flex-direction: column; gap: 16px; margin-bottom: 36px; }
        .channel { display: flex; gap: 16px; padding: 18px 20px; background: #fff; border: 1px solid var(--border); border-radius: 12px; align-items: center; transition: all 0.18s; cursor: pointer; text-decoration: none; }
        .channel:hover { border-color: var(--accent); transform: translateX(2px); }
        .channel-icon { width: 40px; height: 40px; border-radius: 8px; background: var(--card); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
        .channel-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--body); font-weight: 600; }
        .channel-value { font-size: 15px; color: var(--text); font-weight: 500; }
        .form-card { background: var(--card); border-radius: 24px; padding: 48px; border: 1px solid var(--border); box-shadow: 0 8px 40px rgba(0,0,0,0.06); }
        .form-card h2 { font-size: 36px; font-family: var(--display); font-weight: 500; color: var(--text); margin-bottom: 8px; letter-spacing: -0.02em; }
        .form-card p { font-size: 15px; margin-bottom: 28px; }
        .form-row { display: grid; gap: 18px; margin-bottom: 18px; }
        .form-row.cols-2 { grid-template-columns: 1fr 1fr; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--body); font-weight: 600; }
        .form-field input, .form-field select, .form-field textarea {
          padding: 14px 16px; background: #fff; border: 1px solid var(--border); border-radius: 12px;
          font-family: inherit; font-size: 15px; color: var(--text); width: 100%; transition: border-color 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .form-field input:focus, .form-field select:focus, .form-field textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(27,79,216,0.12); }
        .form-field textarea { resize: vertical; min-height: 110px; }
        .budget-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .budget-chip {
          padding: 12px 8px; background: #fff; border: 1px solid var(--border); border-radius: 8px;
          font-size: 13px; font-weight: 500; cursor: pointer; text-align: center; font-family: inherit; transition: all 0.15s;
        }
        .budget-chip:hover { border-color: var(--accent); }
        .budget-chip.selected { background: var(--accent); color: #fff; border-color: var(--accent); }
        .form-success { padding: 36px; background: #fff; border: 1px solid var(--accent); border-radius: 12px; text-align: center; }
        .form-success h3 { font-family: var(--display); font-size: 28px; font-weight: 500; color: var(--text); margin-bottom: 8px; }
        #cf-submit { border-radius: 12px; font-size: 16px; padding: 16px 24px; letter-spacing: -0.01em; width: 100%; justify-content: center; }
        .office-strip { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 24px; margin-top: 56px; padding-top: 48px; border-top: 1px solid var(--border); }
        .office-img { aspect-ratio: 16/9; }
        .office-info h4 { font-family: var(--display); font-size: 22px; font-weight: 500; color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em; }
        .office-info p { font-size: 14px; line-height: 1.55; }
        .arkin-office-wrap { aspect-ratio: 16/9; border-radius: 12px; background: var(--card); overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .arkin-office-img  { height: 100%; max-height: 380px; }
        @media (max-width: 960px) {
          .contact-grid, .office-strip { grid-template-columns: 1fr; gap: 40px; }
          .form-card { padding: 32px 24px; }
          .form-row.cols-2 { grid-template-columns: 1fr; }
          .budget-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <section style={{ paddingTop: '80px' }}>
        <div className="wrap">
          <div className="contact-grid fade-up">
            <div className="contact-info">
              <span className="tag">Get in Touch</span>
              <h1>Tell us where you want <em>AI to bite.</em></h1>
              <p className="lede">We respond within one business day. If your project is in scope, we'll send a 30-minute call invite. If it isn't, we'll tell you who would be a better fit.</p>

              <div className="contact-channels">
                <a href="mailto:hello@elevaitelabs.com" className="channel">
                  <div className="channel-icon">@</div>
                  <div>
                    <div className="channel-label">Email</div>
                    <div className="channel-value">hello@elevaitelabs.com</div>
                  </div>
                </a>
                <a href="#" className="channel">
                  <div className="channel-icon">W</div>
                  <div>
                    <div className="channel-label">WhatsApp</div>
                    <div className="channel-value">+91 98765 43210</div>
                  </div>
                </a>
                <a href="#" className="channel">
                  <div className="channel-icon">📍</div>
                  <div>
                    <div className="channel-label">Office</div>
                    <div className="channel-value">HITEC City, Hyderabad 500081</div>
                  </div>
                </a>
              </div>
              <button className="link-arrow" onClick={() => window.openQuiz && window.openQuiz()} style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: '16px' }}>Or take the AI readiness quiz first <span className="arrow">→</span></button>
            </div>

            <div className="form-card" id="contact-form-card">
              {status === 'success' ? (
                <div className="form-success">
                  <div style={{ fontSize: '48px', color: 'var(--accent)', marginBottom: '12px' }}>✓</div>
                  <h3>Got it. Talk soon.</h3>
                  <p style={{ marginBottom: '6px' }}>Your message landed safely — and a confirmation is on its way to <strong>{email}</strong>.</p>
                  <p style={{ fontSize: '14px', color: 'var(--body)' }}>We respond within one business day, usually faster.</p>
                  <a href="/" className="link-arrow" style={{ marginTop: '24px', display: 'inline-flex' }}>Back to homepage <span className="arrow">→</span></a>
                </div>
              ) : (
                <>
                  <h2>Start a project</h2>
                  <p>The more you share, the faster we can get to a useful first response.</p>
                  <form id="contact-form" onSubmit={submitContact} noValidate>
                    <div className="form-row cols-2">
                      <div className="form-field">
                        <label htmlFor="cf-name">Your name</label>
                        <input id="cf-name" name="from_name" type="text" required placeholder="Aarav Reddy" />
                      </div>
                      <div className="form-field">
                        <label htmlFor="cf-email">Work email</label>
                        <input id="cf-email" name="from_email" type="email" required placeholder="aarav@company.com" />
                      </div>
                    </div>
                    <div className="form-row cols-2">
                      <div className="form-field">
                        <label htmlFor="cf-phone">Phone / WhatsApp</label>
                        <input id="cf-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
                      </div>
                      <div className="form-field">
                        <label htmlFor="cf-company">Company</label>
                        <input id="cf-company" name="company" type="text" placeholder="Nivasa Homes" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="cf-role">What's your role?</label>
                        <select id="cf-role" name="role" required defaultValue="">
                          <option value="" disabled>Select one</option>
                          <option>Founder / CEO</option>
                          <option>Operations / COO</option>
                          <option>Marketing / Growth</option>
                          <option>Engineering / Product</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="cf-service">What are you looking to build?</label>
                        <select id="cf-service" name="service" required defaultValue="">
                          <option value="" disabled>Select one</option>
                          <option>AI Automation &amp; Workflows</option>
                          <option>Web or Mobile App</option>
                          <option>Custom AI Agents</option>
                          <option>Lead Generation System</option>
                          <option>AI Content Engine</option>
                          <option>Strategy Consulting</option>
                          <option>Not sure yet</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label>Budget range</label>
                        <div className="budget-row">
                          <button type="button" className={`budget-chip ${selectedBudget === 'Under ₹5L' ? 'selected' : ''}`} onClick={() => handleBudgetSelect('Under ₹5L')}>Under ₹5L</button>
                          <button type="button" className={`budget-chip ${selectedBudget === '₹5L – ₹15L' ? 'selected' : ''}`} onClick={() => handleBudgetSelect('₹5L – ₹15L')}>₹5L – ₹15L</button>
                          <button type="button" className={`budget-chip ${selectedBudget === '₹15L – ₹50L' ? 'selected' : ''}`} onClick={() => handleBudgetSelect('₹15L – ₹50L')}>₹15L – ₹50L</button>
                          <button type="button" className={`budget-chip ${selectedBudget === '₹50L+' ? 'selected' : ''}`} onClick={() => handleBudgetSelect('₹50L+')}>₹50L+</button>
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="cf-message">Tell us about the project</label>
                        <textarea id="cf-message" name="message" required placeholder="What's the problem? What have you tried? What does success look like?"></textarea>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" id="cf-submit" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : 'Send → We respond in 24h'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="office-strip fade-up">
            <div className="arkin-char-wrap arkin-office-wrap">
              <img src="/holding-hands.png" alt="Arkin — ElevAIte Labs" className="arkin-char arkin-office-img" />
            </div>
            <div className="office-info">
              <h4>Hyderabad HQ</h4>
              <p>5th Floor, Innov8 Tower<br />HITEC City, Hyderabad<br />Telangana 500081, India</p>
            </div>
            <div className="office-info">
              <h4>Hours</h4>
              <p>Mon–Fri · 10:00 – 19:00 IST<br />WhatsApp: 24/7 (it's a bot,<br />and a good one)</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
