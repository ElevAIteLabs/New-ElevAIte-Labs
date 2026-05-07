/* ============================================================
   ElevAIte Labs — shared site JS
   nav · footer · sidebar · scroll · counters · parallax · cursor · modal · tweaks
   ============================================================ */

// ---------- Nav HTML ----------
function navHTML(active = "") {
  const items = [
    ["Home",     "index.html",    "home"],
    ["About",    "about.html",    "about"],
    ["Services", "services.html", "services"],
    ["Work",     "work.html",     "work"],
    ["Products", "products.html", "products"],
    ["Learn",    "learn.html",    "learn"],
    ["Contact",  "contact.html",  "contact"],
  ];
  return `
    <div class="scroll-progress"><div class="scroll-progress-bar" id="scroll-bar"></div></div>
    <nav class="nav" id="main-nav">
      <div class="nav-inner">
        <a href="index.html" class="logo">Elev<span class="ai">AI</span>te Labs</a>
        <div class="nav-links">
          ${items.map(([l, h, k]) => `<a href="${h}" class="${active === k ? "active" : ""}">${l}</a>`).join("")}
        </div>
        <a href="contact.html" class="btn btn-primary nav-cta">Book a Call</a>
        <button class="mobile-toggle" aria-label="Open menu" aria-expanded="false" id="mobile-toggle" onclick="openSidebar()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- Sidebar overlay -->
    <div class="nav-sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>

    <!-- Sidebar panel -->
    <div class="nav-sidebar" id="nav-sidebar" role="dialog" aria-modal="true" aria-label="Navigation">
      <div class="nav-sidebar-head">
        <a href="index.html" class="logo">Elev<span class="ai">AI</span>te Labs</a>
        <button class="nav-sidebar-close" onclick="closeSidebar()" aria-label="Close menu">✕</button>
      </div>
      <nav class="nav-sidebar-links">
        ${items.map(([l, h, k]) => `
          <a href="${h}" class="${active === k ? "active" : ""}">
            ${l}
            <span class="sidebar-arrow">→</span>
          </a>`).join("")}
      </nav>
      <div class="nav-sidebar-footer">
        <a href="contact.html" class="btn btn-primary" style="width:100%;justify-content:center;">Book a Call</a>
      </div>
    </div>
  `;
}

function footerHTML() {
  return `
    <footer>
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="logo">Elev<span class="ai">AI</span>te Labs</a>
            <p class="footer-tag">Building the AI-first future, from Hyderabad.</p>
          </div>
          <div class="footer-col">
            <h4>Pages</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="work.html">Work</a></li>
              <li><a href="learn.html">Learn</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="services.html">AI Automation</a></li>
              <li><a href="services.html">App Development</a></li>
              <li><a href="services.html">AI Agents</a></li>
              <li><a href="services.html">Lead Generation</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="products.html">LeadFlow AI</a></li>
              <li><a href="products.html">ChatDesk</a></li>
              <li><a href="products.html">ContentForge</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="contact.html">Book a Call</a></li>
              <li><a href="mailto:hello@elevaitelabs.com">hello@elevaitelabs.com</a></li>
              <li><a href="#">Hyderabad, India</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="copy">© 2026 ElevAIte Labs. All rights reserved.</div>
          <div class="footer-social">
            <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.339 18.338v-7.16H5.964v7.16h2.375zm-1.18-8.156c.764 0 1.236-.506 1.236-1.14-.014-.648-.472-1.14-1.222-1.14s-1.236.492-1.236 1.14c0 .634.472 1.14 1.207 1.14h.014zm9.665 8.156v-4.107c0-2.19-1.169-3.211-2.728-3.211-1.255 0-1.821.694-2.135 1.181v-1.014H9.586c.029.671 0 7.16 0 7.16h2.375v-3.998c0-.215.014-.43.078-.583.171-.43.563-.875 1.222-.875.86 0 1.207.658 1.207 1.625v3.83h2.375z"/></svg></a>
            <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            <a href="#" aria-label="YouTube"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            <a href="#" aria-label="WhatsApp"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.683 5.535l-.999 3.648 3.805-.882zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ---------- Inject nav & footer ----------
function injectChrome(activeKey) {
  const navHost = document.getElementById("site-nav");
  const footerHost = document.getElementById("site-footer");
  if (navHost) navHost.outerHTML = navHTML(activeKey);
  if (footerHost) footerHost.outerHTML = footerHTML();
}

// ---------- Sidebar open / close ----------
function openSidebar() {
  const sidebar  = document.getElementById("nav-sidebar");
  const overlay  = document.getElementById("sidebar-overlay");
  const toggle   = document.getElementById("mobile-toggle");
  if (!sidebar) return;
  sidebar.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  if (toggle) toggle.setAttribute("aria-expanded", "true");

  // trap focus inside sidebar
  sidebar.querySelectorAll("a, button")[0]?.focus();
}

function closeSidebar() {
  const sidebar  = document.getElementById("nav-sidebar");
  const overlay  = document.getElementById("sidebar-overlay");
  const toggle   = document.getElementById("mobile-toggle");
  if (!sidebar) return;
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}

// Close sidebar on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

window.openSidebar  = openSidebar;
window.closeSidebar = closeSidebar;

// ---------- Scroll progress bar ----------
function initScrollProgress() {
  const bar = document.getElementById("scroll-bar");
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) { bar.style.width = "100%"; return; }
    bar.style.width = (window.scrollY / max * 100) + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// ---------- Nav compact on scroll ----------
function initNavScroll() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---------- Scroll fade-in (with process-line trigger) ----------
function initScrollFade() {
  const fadeEls = document.querySelectorAll(".fade-up, .fade-left, .fade-right");
  const processGrids = document.querySelectorAll(".process-grid");
  const statEls = document.querySelectorAll("[data-count]");

  if (!("IntersectionObserver" in window)) {
    fadeEls.forEach((e) => e.classList.add("in"));
    processGrids.forEach((g) => g.classList.add("line-in"));
    statEls.forEach((e) => animateCounter(e));
    return;
  }

  // Fade observer
  const fadeIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          fadeIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  fadeEls.forEach((e) => fadeIO.observe(e));

  // Process line observer
  const lineIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("line-in");
          lineIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  processGrids.forEach((g) => lineIO.observe(g));

  // Counter observer
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((e) => counterIO.observe(e));
}

// ---------- Animated number counter ----------
function animateCounter(el) {
  const target  = parseFloat(el.dataset.count);
  const suffix  = el.dataset.suffix || "";
  const dur     = 1400;
  const start   = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatNum(v) {
    if (!Number.isInteger(target)) return v.toFixed(1);
    const rounded = Math.round(v);
    return rounded >= 1000 ? rounded.toLocaleString() : String(rounded);
  }

  function frame(now) {
    const progress = Math.min((now - start) / dur, 1);
    const value = target * easeOut(progress);
    el.textContent = formatNum(value) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = formatNum(target) + suffix;
  }

  requestAnimationFrame(frame);
}

// ---------- Hero collage parallax ----------
function initParallax() {
  const collage = document.querySelector(".collage");
  if (!collage) return;

  const cells = collage.querySelectorAll(".ph");
  const speeds = [0.04, -0.06, 0.05, -0.04, 0.06, -0.03, 0.05];

  function update() {
    const rect   = collage.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    cells.forEach((cell, i) => {
      const py = center * (speeds[i] || 0.04);
      cell.style.setProperty("--py", py + "px");
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// ---------- Cursor follower (desktop only) ----------
function initCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const dot  = document.createElement("div");
  const ring = document.createElement("div");
  dot.className  = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + "px";
    dot.style.top   = my + "px";
  });

  // Ring lags slightly behind dot
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateRing() {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand cursor on interactive elements
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .svc-row, .work-card, .reel-card, .product-card")) {
      document.body.classList.add("cursor-hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, .svc-row, .work-card, .reel-card, .product-card")) {
      document.body.classList.remove("cursor-hover");
    }
  });

  // Hide when leaving window
  document.addEventListener("mouseleave", () => document.body.classList.add("cursor-hidden"));
  document.addEventListener("mouseenter", () => document.body.classList.remove("cursor-hidden"));
}

// ---------- Quiz Modal ----------
const QUIZ_QUESTIONS = [
  {
    q: "How much of your team's time is spent on repetitive manual tasks each week?",
    options: [
      ["Less than 5 hours", 0],
      ["5–15 hours", 1],
      ["15–30 hours", 2],
      ["More than 30 hours", 3],
    ],
  },
  {
    q: "How do you currently handle inbound leads and customer follow-ups?",
    options: [
      ["Fully automated workflows", 0],
      ["Mix of tools and manual work", 1],
      ["Mostly manual, spreadsheets & email", 2],
      ["No formal process yet", 3],
    ],
  },
  {
    q: "Have you used any AI tools (ChatGPT, Claude, custom GPTs) in your business operations?",
    options: [
      ["Yes, deeply integrated into workflows", 0],
      ["Yes, but only ad hoc / personal use", 1],
      ["Tried once or twice, no real adoption", 2],
      ["Not yet", 3],
    ],
  },
  {
    q: "Do you have a centralized place where your business data lives?",
    options: [
      ["Yes — a clean CRM or warehouse", 0],
      ["Multiple tools, semi-organized", 1],
      ["Mostly spreadsheets", 2],
      ["It's everywhere — emails, notes, heads", 3],
    ],
  },
  {
    q: "What's your biggest constraint to growing right now?",
    options: [
      ["Strategy & positioning", 0],
      ["Hiring fast enough", 1],
      ["Not enough qualified leads", 2],
      ["My team is buried in operations", 3],
    ],
  },
];

function quizResult(score) {
  if (score <= 4) return {
    band: "AI-Native",
    title: "You're already operating like an AI-first business.",
    body: "Your foundations are strong. We can help you push further — building bespoke agents, multi-step workflows, and proprietary AI systems that become a moat.",
  };
  if (score <= 8) return {
    band: "AI-Curious",
    title: "You've started — there's a lot of upside left.",
    body: "You've experimented with AI but haven't made it the operating system of your business. We typically find 15–30 hours of weekly time savings hiding in your current workflows.",
  };
  if (score <= 12) return {
    band: "AI-Ready",
    title: "You're sitting on a goldmine of automation opportunities.",
    body: "Lead follow-up, content, customer service, internal ops — most of these can be 70–90% automated. A 4-week sprint with us usually pays for itself within the first quarter.",
  };
  return {
    band: "Pre-AI",
    title: "The good news: your biggest leverage is ahead of you.",
    body: "Businesses in your position usually see the largest gains. We start by mapping your operation, finding the 3–5 highest-ROI automations, and shipping them in 30 days.",
  };
}

function openQuiz() {
  let step = 0;
  const answers = [];
  let mode = "quiz";

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop open";
  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";

  function close() {
    backdrop.remove();
    document.body.style.overflow = "";
  }

  function render() {
    if (mode === "result") {
      const score = answers.reduce((a, b) => a + b, 0);
      const r = quizResult(score);
      backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal-close" aria-label="Close">×</button>
          <div class="quiz-result">
            <div class="quiz-result-score">${r.band} · Score ${score}/15</div>
            <h3>${r.title}</h3>
            <p>${r.body}</p>
            <p style="font-size:14px;color:var(--muted);">This was a 2-minute self-assessment. The real diagnostic is a 30-minute conversation — free, no pitch.</p>
            <div class="quiz-result-cta">
              <a href="contact.html" class="btn btn-primary">Book Your Free Strategy Call →</a>
            </div>
          </div>
        </div>
      `;
    } else {
      const q   = QUIZ_QUESTIONS[step];
      const pct = (step / QUIZ_QUESTIONS.length) * 100;
      backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal-close" aria-label="Close">×</button>
          <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${pct}%"></div></div>
          <div class="quiz-step-label">Question ${step + 1} of ${QUIZ_QUESTIONS.length}</div>
          <h3 class="quiz-question">${q.q}</h3>
          <div class="quiz-options">
            ${q.options.map(([label, val], i) =>
              `<button class="quiz-option ${answers[step] === val ? "selected" : ""}" data-val="${val}">${label}</button>`
            ).join("")}
          </div>
          <div class="quiz-actions">
            ${step > 0 ? `<button class="btn quiz-back">← Back</button>` : `<div></div>`}
            <button class="btn btn-primary quiz-next" ${answers[step] === undefined ? "disabled style='opacity:0.5;cursor:not-allowed'" : ""}>
              ${step === QUIZ_QUESTIONS.length - 1 ? "See Result →" : "Next →"}
            </button>
          </div>
        </div>
      `;
    }

    backdrop.querySelector(".modal-close").onclick = close;
    backdrop.onclick = (e) => { if (e.target === backdrop) close(); };

    backdrop.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.onclick = () => {
        answers[step] = parseInt(btn.dataset.val, 10);
        render();
      };
    });

    const nextBtn = backdrop.querySelector(".quiz-next");
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (answers[step] === undefined) return;
        if (step === QUIZ_QUESTIONS.length - 1) { mode = "result"; render(); return; }
        step++;
        render();
      };
    }
    const backBtn = backdrop.querySelector(".quiz-back");
    if (backBtn) backBtn.onclick = () => { step--; render(); };
  }

  render();

  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });
}

window.openQuiz = openQuiz;

// ---------- Tweaks panel ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1B4FD8",
  "displayFont": "Fraunces",
  "heroLayout": "split",
  "imageryStyle": "stripes",
  "servicesLayout": "list"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement;
  const body = document.body;
  if (t.accent) {
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-deep", t.accent);
  }
  if (t.displayFont) {
    const map = {
      "Fraunces":          '"Fraunces", Georgia, serif',
      "Playfair Display":  '"Playfair Display", Georgia, serif',
      "DM Serif Display":  '"DM Serif Display", Georgia, serif',
      "Instrument Serif":  '"Instrument Serif", Georgia, serif',
    };
    root.style.setProperty("--display", map[t.displayFont] || map["Fraunces"]);
  }
  body.dataset.hero     = t.heroLayout     || "split";
  body.dataset.imagery  = t.imageryStyle   || "stripes";
  body.dataset.services = t.servicesLayout || "list";
}

// ---------- Typewriter hero ----------
function initTypewriter() {
  const target = document.getElementById("tw-target");
  if (!target) return;
  const words = ["AI Systems", "Automations", "AI Agents", "Workflows"];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = words[wordIdx % words.length];
    if (!deleting) {
      target.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 100);
    } else {
      target.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx++;
      }
      setTimeout(tick, 55);
    }
  }
  setTimeout(tick, 800);
}

// ---------- 3-D card tilt ----------
function initTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cards = document.querySelectorAll(".work-card, .product-card, .testimonial-card, .value-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

// ---------- Magnetic CTA buttons ----------
function initMagnetic() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".btn-primary, .btn-ghost").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r  = btn.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px) translateY(-2px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

// ---------- Clip-path reveal for images ----------
function initClipReveal() {
  const els = document.querySelectorAll(".clip-reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }

  // Hero collage cells are above-fold — IntersectionObserver can miss them
  // Force reveal immediately with stagger so the right side always shows
  document.querySelectorAll(".collage .clip-reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), 80 + i * 110);
  });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  // Skip collage cells (already handled above)
  els.forEach((e) => {
    if (!e.closest(".collage")) io.observe(e);
  });
}

// ---------- Counter animation for hero stats ----------
function initCounters() {
  const els = document.querySelectorAll(".hero-stat-num[data-count]");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  els.forEach((el) => io.observe(el));
}

// ---------- Arkin entrance animation ----------
function initArkin() {
  const img = document.querySelector(".arkin-hero-img");
  if (!img) return;
  img.style.opacity = "0";
  img.style.transform = "translateY(40px)";
  img.style.transition = "opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)";
  setTimeout(() => {
    img.style.opacity = "1";
    img.style.transform = "translateY(0)";
    // Hand off to CSS float animation after entrance
    setTimeout(() => {
      img.style.transition = "";
      img.style.transform = "";
    }, 950);
  }, 300);
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  applyTweaks(TWEAK_DEFAULTS);
  initScrollFade();
  initScrollProgress();
  initNavScroll();
  initParallax();
  initCursor();
  initTypewriter();
  initTilt();
  initMagnetic();
  initClipReveal();
  initCounters();
  initArkin();
});
