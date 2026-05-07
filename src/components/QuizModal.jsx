import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

const QuizModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [mode, setMode] = useState("quiz");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
      setStep(0);
      setAnswers([]);
      setMode("quiz");
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[step] = val;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[step] === undefined) return;
    if (step === QUIZ_QUESTIONS.length - 1) {
      setMode("result");
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.className.includes('modal-backdrop') && onClose()}>
      {mode === 'result' ? (() => {
        const score = answers.reduce((a, b) => a + b, 0);
        const r = quizResult(score);
        return (
          <div className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
            <div className="quiz-result">
              <div className="quiz-result-score">{r.band} · Score {score}/15</div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <p style={{fontSize: '14px', color: 'var(--muted)'}}>This was a 2-minute self-assessment. The real diagnostic is a 30-minute conversation — free, no pitch.</p>
              <div className="quiz-result-cta">
                <Link to="/contact" className="btn btn-primary" onClick={onClose}>Book Your Free Strategy Call →</Link>
              </div>
            </div>
          </div>
        );
      })() : (() => {
        const q = QUIZ_QUESTIONS[step];
        const pct = (step / QUIZ_QUESTIONS.length) * 100;
        return (
          <div className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
            <div className="quiz-progress"><div className="quiz-progress-bar" style={{width: `${pct}%`}}></div></div>
            <div className="quiz-step-label">Question {step + 1} of {QUIZ_QUESTIONS.length}</div>
            <h3 className="quiz-question">{q.q}</h3>
            <div className="quiz-options">
              {q.options.map(([label, val]) => (
                <button 
                  key={label}
                  className={`quiz-option ${answers[step] === val ? "selected" : ""}`} 
                  onClick={() => handleSelect(val)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="quiz-actions">
              {step > 0 ? <button className="btn quiz-back" onClick={handleBack}>← Back</button> : <div></div>}
              <button 
                className="btn btn-primary quiz-next" 
                onClick={handleNext}
                disabled={answers[step] === undefined}
                style={answers[step] === undefined ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
              >
                {step === QUIZ_QUESTIONS.length - 1 ? "See Result →" : "Next →"}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default QuizModal;
