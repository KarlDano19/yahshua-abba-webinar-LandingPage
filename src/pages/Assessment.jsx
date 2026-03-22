import { useState } from "react";

// ── Questions data ──────────────────────────────────────────────
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

// ── Result tiers ────────────────────────────────────────────────
const RESULTS = {
  resilient: {
    icon: "✅",
    label: "Resilient",
    color: "#1A6B3C",
    bg: "#F0FAF4",
    border: "#86EFAC",
    headline: "Strong security foundation identified.",
    description:
      "Your business demonstrates solid cybersecurity practices across all three critical areas. Your complimentary CyTech assessment will identify the fine-tuning that separates good from enterprise-grade — and confirm your posture against the 2026 Philippine risk benchmarks.",
    cta: "Your full assessment report is on its way to your inbox.",
  },
  moderate: {
    icon: "⚠️",
    label: "Moderate Risk",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FCD34D",
    headline: "A few gaps identified in your setup.",
    description:
      "Your business has manageable vulnerabilities worth addressing before they become exploitable. Left unresolved, these gaps represent exposure to business interruption costs of ₱250K–₱1.5M per day. Your CyTech specialist will prioritize exactly where to focus first.",
    cta: "Your personalized gap report is on its way to your inbox.",
  },
  elevated: {
    icon: "🟠",
    label: "Elevated Risk",
    color: "#C2410C",
    bg: "#FFF7ED",
    border: "#FDBA74",
    headline: "Multiple critical gaps identified.",
    description:
      "Your business has significant vulnerabilities across foundational security areas. These represent real exposure to data loss, operational downtime, and NPC regulatory penalties of up to ₱5M under Circular 2022-01. Your CyTech assessment will map your remediation path.",
    cta: "Your detailed risk report is on its way to your inbox.",
  },
  critical: {
    icon: "❌",
    label: "Critical Risk",
    color: "#991B1B",
    bg: "#FFF0F0",
    border: "#FCA5A5",
    headline: "Immediate attention required.",
    description:
      "Your business has critical gaps across multiple foundational security areas — including ransomware recovery, identity management, and forensic accountability. The average ASEAN breach costs ₱3.6B+ in total impact. A CyTech specialist will contact you within 24 hours to prioritize your remediation plan.",
    cta: "Your critical risk report is on its way. Expect a call within 24 hours.",
  },
};

// ── Determine result from checked count ─────────────────────────
function getResult(checked) {
  if (checked === 6) return "resilient";
  if (checked >= 4) return "moderate";
  if (checked >= 2) return "elevated";
  return "critical";
}

// ── Styles matching existing FormCard ───────────────────────────
const inputClass =
  "w-full px-[13px] py-[10px] bg-secondary border border-border rounded-md text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-card focus:ring-[3px] focus:ring-accent/10 placeholder:text-muted-foreground/50";
const labelClass =
  "block text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-1.5";
const selectClass =
  "w-full px-[13px] py-[10px] bg-secondary border border-border rounded-md text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-card focus:ring-[3px] focus:ring-accent/10 appearance-none cursor-pointer";

// ── Main component ───────────────────────────────────────────────
const Assessment = () => {
  const [step, setStep] = useState("intro"); // intro | form | result
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

  const toggleCheck = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleContact = (e) =>
    setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!contact.firstName || !contact.email || !contact.company) {
      setError("Please fill in all required fields.");
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
      console.error("Assessment submission error:", err);
    }

    setResult(RESULTS[tier]);
    setStep("result");
    setSubmitting(false);
  };

  // ── INTRO SCREEN ─────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-6">
              YAHSHUA-ABBA × CyTech International
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              🛡️ 2026 Philippine Business<br />Cyber Resilience Assessment
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
              3 categories. 6 statements. Under 5 minutes. Walk away knowing exactly where your business stands against 2026 Philippine cybersecurity benchmarks.
            </p>
          </div>

          {/* Risk benchmarks */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-4">
              2026 Philippine Risk Benchmarks
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["₱250K–₱1.5M", "Per day — Business Interruption", "WEF 2026"],
                ["₱500,000+", "Per incident — Forensic Recovery", "Unit 42 2026"],
                ["₱3.6B+", "ASEAN Average — Total Breach Cost", "IBM 2025"],
                ["Up to ₱5M", "Per act — NPC Regulatory Fine", "NPC 2022-01"],
              ].map(([stat, label, source]) => (
                <div key={stat} className="bg-secondary rounded-md p-4">
                  <p className="text-[18px] font-bold text-foreground mb-0.5">{stat}</p>
                  <p className="text-[12px] text-muted-foreground leading-tight mb-1">{label}</p>
                  <p className="text-[10px] text-muted-foreground/50 font-medium tracking-wide">{source}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-secondary border border-border rounded-lg px-6 py-4 mb-8 text-[13px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How it works:</strong> Check the box for every "Yes." Any box you leave empty is a gap in your current digital setup — and every gap is a risk. Your result and a personalized report will be sent to your inbox immediately after submission.
          </div>

          <button
            onClick={() => setStep("form")}
            className="w-full py-[14px] bg-foreground border-none rounded-md text-[14px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all"
          >
            Start the Assessment →
          </button>

          <p className="mt-4 text-[11px] text-muted-foreground/50 text-center">
            Free · No obligation · Results delivered to your inbox · CyTech specialists
          </p>
        </div>
      </div>
    );
  }

  // ── FORM SCREEN ──────────────────────────────────────────────
  if (step === "form") {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep("intro")}
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all"
                  style={{ width: `${(totalChecked / 6) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">{totalChecked}/6 confirmed</span>
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
            Part 1 — Operational Stress Test
          </h2>
          <p className="text-[13px] text-muted-foreground mb-8">
            Check every statement that is true for your business today.
          </p>

          {/* Questions */}
          <div className="space-y-6 mb-10">
            {QUESTIONS.map((q, qi) => (
              <div key={q.id} className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Category header */}
                <div className="px-5 py-4 border-b border-border bg-secondary">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{q.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">
                        {qi + 1}. {q.category}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{q.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Statements */}
                <div className="divide-y divide-border">
                  {q.statements.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={checked[s.id]}
                          onChange={() => toggleCheck(s.id)}
                          className="sr-only"
                        />
                        <div
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: checked[s.id] ? "#0D2137" : "#D1D5DB",
                            backgroundColor: checked[s.id] ? "#0D2137" : "transparent",
                          }}
                        >
                          {checked[s.id] && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground block mb-1">
                          {s.label}
                        </span>
                        <span className="text-[13px] text-foreground leading-relaxed">
                          {s.text}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Gap indicator */}
          <div
            className="rounded-lg px-5 py-4 mb-8 text-[13px] leading-relaxed border"
            style={{
              backgroundColor: totalChecked === 6 ? "#F0FAF4" : totalChecked >= 4 ? "#FFFBEB" : "#FFF0F0",
              borderColor: totalChecked === 6 ? "#86EFAC" : totalChecked >= 4 ? "#FCD34D" : "#FCA5A5",
              color: totalChecked === 6 ? "#1A6B3C" : totalChecked >= 4 ? "#B45309" : "#991B1B",
            }}
          >
            <strong>
              {6 - totalChecked === 0
                ? "✅ No gaps identified — strong foundation."
                : `${6 - totalChecked} gap${6 - totalChecked > 1 ? "s" : ""} identified — ${6 - totalChecked <= 2 ? "manageable but worth addressing." : "requires attention."}`}
            </strong>
          </div>

          {/* Contact fields */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <p className="text-[13px] font-semibold text-foreground mb-1">
              Where should we send your report?
            </p>
            <p className="text-[12px] text-muted-foreground mb-5">
              Your personalized assessment results will be delivered to your inbox immediately.
            </p>

            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="firstName" value={contact.firstName} onChange={handleContact}
                  className={inputClass} placeholder="Juan" required />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input name="lastName" value={contact.lastName} onChange={handleContact}
                  className={inputClass} placeholder="dela Cruz" />
              </div>
            </div>
            <div className="mb-3">
              <label className={labelClass}>Work Email *</label>
              <input name="email" type="email" value={contact.email} onChange={handleContact}
                className={inputClass} placeholder="juan@company.com.ph" required />
            </div>
            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
              <div>
                <label className={labelClass}>Company *</label>
                <input name="company" value={contact.company} onChange={handleContact}
                  className={inputClass} placeholder="Company name" required />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input name="industry" value={contact.industry} onChange={handleContact}
                  className={inputClass} placeholder="e.g. Manufacturing" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Your Role</label>
              <select name="role" value={contact.role} onChange={handleContact} className={selectClass}>
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

          {error && (
            <p className="text-[12px] text-red-500 mb-4 text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-[14px] bg-foreground border-none rounded-md text-[14px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Get My Assessment Results →"}
          </button>

          <p className="mt-4 text-[11px] text-muted-foreground/50 text-center leading-relaxed">
            Free · No obligation · Results sent instantly · CyTech specialists review every submission
          </p>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ────────────────────────────────────────────
  if (step === "result" && result) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Result card */}
          <div
            className="rounded-lg border p-8 mb-8 text-center"
            style={{ backgroundColor: result.bg, borderColor: result.border }}
          >
            <div className="text-4xl mb-4">{result.icon}</div>
            <div
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase mb-4 border"
              style={{ color: result.color, borderColor: result.border, backgroundColor: "white" }}
            >
              {result.label}
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">{result.headline}</h2>
            <p className="text-[14px] leading-relaxed" style={{ color: result.color }}>
              {result.description}
            </p>
          </div>

          {/* Score summary */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-4">
              Your Assessment Summary
            </p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center bg-secondary rounded-md py-4 px-3">
                <p className="text-2xl font-bold text-foreground">{totalChecked}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Confirmed</p>
              </div>
              <div className="text-center bg-secondary rounded-md py-4 px-3">
                <p className="text-2xl font-bold text-foreground">{6 - totalChecked}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Gaps Found</p>
              </div>
              <div className="text-center bg-secondary rounded-md py-4 px-3">
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-[11px] text-muted-foreground mt-1">Areas Tested</p>
              </div>
            </div>

            {/* Per category breakdown */}
            <div className="space-y-3">
              {QUESTIONS.map((q) => {
                const a = checked[q.statements[0].id];
                const b = checked[q.statements[1].id];
                const both = a && b;
                const one = (a || b) && !(a && b);
                const none = !a && !b;
                return (
                  <div key={q.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-[13px] text-foreground">
                      {q.icon} {q.category}
                    </span>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: both ? "#F0FAF4" : one ? "#FFFBEB" : "#FFF0F0",
                        color: both ? "#1A6B3C" : one ? "#B45309" : "#991B1B",
                      }}
                    >
                      {both ? "✅ Optimized" : one ? "⚠️ Vulnerable" : "❌ Critical"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email confirmation */}
          <div className="bg-secondary border border-border rounded-lg px-6 py-4 mb-8 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">📧</span>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{result.cta}</strong>{" "}
              A CyTech specialist will follow up with personalized recommendations based on your specific gaps.
            </p>
          </div>

          {/* CTA back to landing */}
          <a
            href="/"
            className="block w-full py-[14px] bg-foreground border-none rounded-md text-[14px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all text-center no-underline"
          >
            ← Back to the April 7 Briefing
          </a>

          <p className="mt-4 text-[11px] text-muted-foreground/50 text-center leading-relaxed">
            YAHSHUA-ABBA × CyTech International · ISO 27001:2018 Certified · GDPR Compliant · NPC Registered
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default Assessment;
