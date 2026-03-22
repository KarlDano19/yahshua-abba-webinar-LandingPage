import { useState, useRef, useCallback } from "react";

const QUESTIONS = [
  {
    id: "q1",
    category: "Continuity & Recovery",
    subtitle: "The Uptime Test",
    icon: "🔄",
    statements: [
      {
        id: "q1a",
        label: "Capability",
        text: "If our primary systems were encrypted by ransomware today, we are 100% certain we could be back to full operations within 60 minutes.",
      },
      {
        id: "q1b",
        label: "Infrastructure",
        text: 'We utilize Immutable (WORM) Storage that is "air-gapped" from our main network, ensuring backups cannot be modified or deleted by an attacker.',
      },
    ],
  },
  {
    id: "q2",
    category: "Access & Identity",
    subtitle: "The Lifecycle Test",
    icon: "🔐",
    statements: [
      {
        id: "q2a",
        label: "Capability",
        text: "When an employee resigns or is terminated, we can instantly revoke their access to all company emails, files, and core applications with a single, centralized action.",
      },
      {
        id: "q2b",
        label: "Infrastructure",
        text: "We utilize a Centralized Identity Provider (IdP) with phishing-resistant MFA (FIDO2), rather than managing individual passwords across separate silos.",
      },
    ],
  },
  {
    id: "q3",
    category: "Forensic Accountability",
    subtitle: "The Investigation Test",
    icon: "🔍",
    statements: [
      {
        id: "q3a",
        label: "Capability",
        text: 'In the event of a suspected data leak, we can produce a digital log of "who accessed what and when" for the last 90 days in under 10 minutes.',
      },
      {
        id: "q3b",
        label: "Infrastructure",
        text: 'Our systems automatically stream all user activities into a secure "Black Box" Vault that is physically separate from our production servers.',
      },
    ],
  },
];

const RESULTS = {
  resilient: {
    icon: "✅",
    label: "Resilient",
    color: "#1A6B3C",
    bg: "#F0FAF4",
    border: "#86EFAC",
    headline: "Strong security foundation identified.",
    description: "Your business demonstrates solid cybersecurity practices across all three critical areas. Your complimentary CyTech assessment will identify the fine-tuning that separates good from enterprise-grade.",
    cta: "Your full assessment report is on its way to your inbox.",
  },
  moderate: {
    icon: "⚠️",
    label: "Moderate Risk",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FCD34D",
    headline: "A few gaps identified in your setup.",
    description: "Your business has manageable vulnerabilities worth addressing before they become exploitable. Left unresolved, these gaps represent exposure to business interruption costs of ₱250K–₱1.5M per day.",
    cta: "Your personalized gap report is on its way to your inbox.",
  },
  elevated: {
    icon: "🟠",
    label: "Elevated Risk",
    color: "#C2410C",
    bg: "#FFF7ED",
    border: "#FDBA74",
    headline: "Multiple critical gaps identified.",
    description: "Your business has significant vulnerabilities across foundational security areas. These represent real exposure to data loss, downtime, and NPC regulatory penalties of up to ₱5M under Circular 2022-01.",
    cta: "Your detailed risk report is on its way to your inbox.",
  },
  critical: {
    icon: "❌",
    label: "Critical Risk",
    color: "#991B1B",
    bg: "#FFF0F0",
    border: "#FCA5A5",
    headline: "Immediate attention required.",
    description: "Your business has critical gaps across multiple foundational security areas. A CyTech specialist will contact you within 24 hours to prioritize your remediation plan.",
    cta: "Your critical risk report is on its way. Expect a call within 24 hours.",
  },
};

function getResult(checked) {
  if (checked === 6) return "resilient";
  if (checked >= 4) return "moderate";
  if (checked >= 2) return "elevated";
  return "critical";
}

const inputClass =
  "w-full px-[13px] py-[10px] bg-secondary border border-border rounded-md text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-card focus:ring-[3px] focus:ring-accent/10 placeholder:text-muted-foreground/50";
const labelClass =
  "block text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-1.5";
const selectClass =
  "w-full px-[13px] py-[10px] bg-secondary border border-border rounded-md text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-card focus:ring-[3px] focus:ring-accent/10 appearance-none cursor-pointer bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%276%27%3E%3Cpath%20d=%27M1%201l4%204%204-4%27%20stroke=%27%236E6E6E%27%20stroke-width=%271.5%27%20fill=%27none%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]";

const Assessment = () => {
  const [step, setStep] = useState("intro");
  const [checked, setChecked] = useState({
    q1a: false, q1b: false,
    q2a: false, q2b: false,
    q3a: false, q3b: false,
  });
  const [contact, setContact] = useState({
    firstName: "", lastName: "", email: "",
    company: "", industry: "", role: "",
  });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalChecked = Object.values(checked).filter(Boolean).length;
  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleContact = useCallback((e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!contact.firstName || !contact.email || !contact.company) {
      setError("Please fill in your name, email, and company.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const tier = getResult(totalChecked);
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "assessment_scored",
          ...contact,
          checkedCount: totalChecked,
          tier,
          checks: checked,
        }),
      });
    } catch (err) {
      console.error("Assessment error:", err);
    }
    setResult(RESULTS[tier]);
    setStep("result");
    setSubmitting(false);
  };

  // Stable scroll container — prevents scroll-to-top on state updates
  const scrollRef = useRef(null);
  const Card = useCallback(({ children }) => (
    <div ref={scrollRef} className="min-h-screen bg-background flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-[480px]">
        {children}
      </div>
    </div>
  ), []);

  // ── INTRO ────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <Card>
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="px-7 pt-7 pb-2 max-[480px]:px-5">
            <div className="text-2xl mb-2">🛡️</div>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground mb-1">
              2026 PH Cyber Resilience Assessment
            </h2>
            <p className="text-[13px] text-muted-foreground mb-5">
              3 categories. 6 statements. Under 5 minutes. Know exactly where your business stands.
            </p>
          </div>

          {/* Benchmarks */}
          <div className="px-7 pb-5 max-[480px]:px-5">
            <p className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-3">
              2026 Philippine Risk Benchmarks
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                ["₱250K–₱1.5M", "/ day — Interruption", "WEF 2026"],
                ["₱500,000+", "/ incident — Recovery", "Unit 42"],
                ["₱3.6B+", "ASEAN Breach Cost", "IBM 2025"],
                ["Up to ₱5M", "NPC Regulatory Fine", "NPC 2022-01"],
              ].map(([stat, label, source]) => (
                <div key={stat} className="bg-secondary rounded-md p-3">
                  <p className="text-[15px] font-bold text-foreground leading-tight">{stat}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{label}</p>
                  <p className="text-[9px] text-muted-foreground/50 font-medium tracking-wide mt-1">{source}</p>
                </div>
              ))}
            </div>

            <div className="bg-secondary rounded-md px-4 py-3 mb-5 text-[12px] text-muted-foreground leading-relaxed">
              Check every statement that is true for your business. Empty boxes = gaps. Your personalized report is sent to your inbox instantly.
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full py-[13px] bg-foreground border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all"
            >
              Start the Assessment →
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground/50 text-center">
              Free · No obligation · Results sent instantly
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <Card>
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]">

          {/* Header */}
          <div className="px-7 pt-6 pb-4 border-b border-border max-[480px]:px-5">
            <div className="flex items-center justify-between mb-1">
              <button
                onClick={() => setStep("intro")}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer p-0"
              >
                ← Back
              </button>
              <span className="text-[11px] text-muted-foreground">{totalChecked}/6 confirmed</span>
            </div>
            {/* Progress bar */}
            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-300"
                style={{ width: `${(totalChecked / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="px-7 pt-5 max-[480px]:px-5">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-4">
              Part 1 — Operational Stress Test
            </p>
          </div>

          {/* Questions */}
          <div className="px-7 pb-5 max-[480px]:px-5 space-y-4">
            {QUESTIONS.map((q, qi) => (
              <div key={q.id} className="border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-secondary border-b border-border">
                  <p className="text-[12px] font-semibold text-foreground">
                    {q.icon} {qi + 1}. {q.category}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{q.subtitle}</p>
                </div>
                {q.statements.map((s, si) => (
                  <label
                    key={s.id}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/40 transition-colors ${si === 0 ? "" : "border-t border-border"}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: checked[s.id] ? "#0D2137" : "#D1D5DB",
                          backgroundColor: checked[s.id] ? "#0D2137" : "transparent",
                        }}
                      >
                        {checked[s.id] && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" checked={checked[s.id]} onChange={() => toggleCheck(s.id)} className="sr-only" />
                    </div>
                    <div>
                      <span className="text-[9px] font-medium tracking-[0.06em] uppercase text-muted-foreground block mb-0.5">{s.label}</span>
                      <span className="text-[12px] text-foreground leading-relaxed">{s.text}</span>
                    </div>
                  </label>
                ))}
              </div>
            ))}
          </div>

          {/* Gap pill */}
          <div className="px-7 pb-5 max-[480px]:px-5">
            <div
              className="rounded-md px-4 py-2.5 text-[12px] font-medium border"
              style={{
                backgroundColor: totalChecked === 6 ? "#F0FAF4" : totalChecked >= 4 ? "#FFFBEB" : "#FFF0F0",
                borderColor: totalChecked === 6 ? "#86EFAC" : totalChecked >= 4 ? "#FCD34D" : "#FCA5A5",
                color: totalChecked === 6 ? "#1A6B3C" : totalChecked >= 4 ? "#B45309" : "#991B1B",
              }}
            >
              {6 - totalChecked === 0
                ? "✅ No gaps — strong foundation"
                : `${6 - totalChecked} gap${6 - totalChecked > 1 ? "s" : ""} identified`}
            </div>
          </div>

          {/* Contact fields */}
          <div className="px-7 pb-2 max-[480px]:px-5">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-3">
              Where should we send your report?
            </p>
            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="firstName" onChange={handleContact}
                  className={inputClass} placeholder="Juan" />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input name="lastName" onChange={handleContact}
                  className={inputClass} placeholder="dela Cruz" />
              </div>
            </div>
            <div className="mb-3">
              <label className={labelClass}>Work Email *</label>
              <input name="email" type="email" onChange={handleContact}
                className={inputClass} placeholder="juan@company.com.ph" />
            </div>
            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
              <div>
                <label className={labelClass}>Company *</label>
                <input name="company" onChange={handleContact}
                  className={inputClass} placeholder="Company name" />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input name="industry" onChange={handleContact}
                  className={inputClass} placeholder="e.g. Manufacturing" />
              </div>
            </div>
            <div className="mb-5">
              <label className={labelClass}>Your Role</label>
              <select name="role" onChange={handleContact} className={selectClass}>
                <option value="">Select role</option>
                <option>CEO / Owner</option>
                <option>HR Manager</option>
                <option>CFO / Finance</option>
                <option>CTO / IT Head</option>
                <option>Operations</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="px-7 pb-7 max-[480px]:px-5">
            {error && <p className="text-[12px] text-red-500 mb-3 text-center">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-[13px] bg-foreground border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Get My Assessment Results →"}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground/50 text-center leading-relaxed">
              Free · No obligation · Results sent instantly · CyTech specialists
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────
  if (step === "result" && result) {
    return (
      <Card>
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]">

          {/* Result header */}
          <div
            className="px-7 py-6 text-center border-b border-border max-[480px]:px-5"
            style={{ backgroundColor: result.bg }}
          >
            <div className="text-3xl mb-2">{result.icon}</div>
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.08em] uppercase mb-3 border"
              style={{ color: result.color, borderColor: result.border, backgroundColor: "white" }}
            >
              {result.label}
            </span>
            <p className="text-[15px] font-semibold text-foreground mb-2">{result.headline}</p>
            <p className="text-[12px] leading-relaxed" style={{ color: result.color }}>
              {result.description}
            </p>
          </div>

          {/* Score summary */}
          <div className="px-7 py-5 border-b border-border max-[480px]:px-5">
            <p className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-3">
              Your Summary
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                [totalChecked, "Confirmed"],
                [6 - totalChecked, "Gaps Found"],
                [3, "Areas Tested"],
              ].map(([val, label]) => (
                <div key={label} className="text-center bg-secondary rounded-md py-3">
                  <p className="text-[20px] font-bold text-foreground">{val}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Per category */}
            <div className="space-y-2">
              {QUESTIONS.map((q) => {
                const a = checked[q.statements[0].id];
                const b = checked[q.statements[1].id];
                const both = a && b;
                const none = !a && !b;
                return (
                  <div key={q.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-[12px] text-foreground">{q.icon} {q.category}</span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: both ? "#F0FAF4" : none ? "#FFF0F0" : "#FFFBEB",
                        color: both ? "#1A6B3C" : none ? "#991B1B" : "#B45309",
                      }}
                    >
                      {both ? "✅ Optimized" : none ? "❌ Critical" : "⚠️ Vulnerable"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email note */}
          <div className="px-7 py-4 border-b border-border max-[480px]:px-5">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              📧 <strong className="text-foreground">{result.cta}</strong> A CyTech specialist will follow up with personalized recommendations.
            </p>
          </div>

          {/* Back CTA */}
          <div className="px-7 py-5 max-[480px]:px-5">
            <a
              href="/"
              className="block w-full py-[13px] bg-foreground border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all text-center no-underline"
            >
              ← Back to the April 7 Briefing
            </a>
            <p className="mt-3 text-[11px] text-muted-foreground/50 text-center">
              YAHSHUA-ABBA × CyTech · ISO 27001 · GDPR · NPC Registered
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return null;
};

export default Assessment;
