import { useState, useEffect, FormEvent } from "react";

const FormCard = () => {
  const [activeTab, setActiveTab] = useState<"webinar" | "assessment">("webinar");

  useEffect(() => {
    const handler = () => setActiveTab("assessment");
    window.addEventListener("switch-to-assessment", handler);
    return () => window.removeEventListener("switch-to-assessment", handler);
  }, []);
  const [webinarSubmitted, setWebinarSubmitted] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const handleWebinar = (e: FormEvent) => {
    e.preventDefault();
    setWebinarSubmitted(true);
  };

  const handleAssessment = (e: FormEvent) => {
    e.preventDefault();
    setAssessmentSubmitted(true);
  };

  const inputClass =
    "w-full px-[13px] py-[10px] bg-secondary border border-border rounded-md text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-card focus:ring-[3px] focus:ring-accent/10 placeholder:text-muted-foreground/50";
  const selectClass =
    "w-full px-[13px] py-[10px] bg-secondary border border-border rounded-md text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-card focus:ring-[3px] focus:ring-accent/10 appearance-none cursor-pointer bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%276%27%3E%3Cpath%20d=%27M1%201l4%204%204-4%27%20stroke=%27%236E6E6E%27%20stroke-width=%271.5%27%20fill=%27none%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]";
  const labelClass = "block text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-1.5";

  return (
    <div
      id="register"
      className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] sticky top-[88px] max-[900px]:static max-[900px]:max-w-[480px] animate-fade-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="px-7 pt-7 max-[480px]:px-5">
        <h3 className="text-[17px] font-semibold tracking-tight text-foreground mb-1">Reserve your spot</h3>
        <p className="text-[13px] text-muted-foreground mb-5">Webinar or free assessment — you choose.</p>

        <div className="grid grid-cols-2 bg-secondary border border-border rounded-md p-[3px] gap-0.5">
          <button
            onClick={() => setActiveTab("webinar")}
            className={`py-[9px] px-3 rounded text-[12px] font-medium tracking-[0.03em] transition-all border-none cursor-pointer ${
              activeTab === "webinar"
                ? "bg-card text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Webinar
          </button>
          <button
            onClick={() => setActiveTab("assessment")}
            className={`py-[9px] px-3 rounded text-[12px] font-medium tracking-[0.03em] transition-all border-none cursor-pointer ${
              activeTab === "assessment"
                ? "bg-card text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Assessment
          </button>
        </div>
      </div>

      <div className="px-7 pt-5 pb-7 max-[480px]:px-5">
        {/* Webinar Panel */}
        {activeTab === "webinar" && (
          <div>
            {!webinarSubmitted ? (
              <form onSubmit={handleWebinar}>
                <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input className={inputClass} placeholder="Jane" required />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input className={inputClass} placeholder="Reyes" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Work Email *</label>
                  <input type="email" className={inputClass} placeholder="jane@company.com.ph" required />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Company *</label>
                  <input className={inputClass} placeholder="Company name" required />
                </div>
                <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
                  <div>
                    <label className={labelClass}>Role *</label>
                    <select className={selectClass} required>
                      <option value="">Select</option>
                      <option>CEO / Owner</option>
                      <option>HR Manager</option>
                      <option>CFO / Finance</option>
                      <option>CTO / IT Head</option>
                      <option>Operations</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Team Size *</label>
                    <select className={selectClass} required>
                      <option value="">Employees</option>
                      <option>1 – 50</option>
                      <option>51 – 200</option>
                      <option>201 – 500</option>
                      <option>501 – 2,000</option>
                      <option>2,000+</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-1 py-[13px] bg-foreground border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all"
                >
                  Reserve my seat
                </button>
              </form>
            ) : (
              <div className="text-center py-11 px-5">
                <div className="w-11 h-11 rounded-full border border-border-mid bg-secondary flex items-center justify-center mx-auto mb-4 text-lg animate-pop-in">
                  ✓
                </div>
                <p className="text-base font-semibold text-foreground mb-2">You're confirmed.</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Your Zoom link is on its way.<br />See you on April 7 · 1:00 PM PHT.
                </p>
              </div>
            )}
            <p className="mt-3.5 text-[11px] text-muted-foreground/50 text-center leading-relaxed">
              Free · April 7, 2026 · 1:00–2:00 PM PHT · Zoom
            </p>
          </div>
        )}

        {/* Assessment Panel */}
        {activeTab === "assessment" && (
          <div>
            {!assessmentSubmitted ? (
              <form onSubmit={handleAssessment}>
                <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1 mb-3">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input className={inputClass} placeholder="Jane" required />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input className={inputClass} placeholder="Reyes" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Work Email *</label>
                  <input type="email" className={inputClass} placeholder="jane@company.com.ph" required />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Company & Role *</label>
                  <input className={inputClass} placeholder="Company — Your Title" required />
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Team Size *</label>
                  <select className={selectClass} required>
                    <option value="">No. of employees</option>
                    <option>1 – 50</option>
                    <option>51 – 200</option>
                    <option>201 – 500</option>
                    <option>501 – 2,000</option>
                    <option>2,000+</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Current challenge (optional)</label>
                  <textarea
                    className={`${inputClass} resize-y min-h-[76px] leading-relaxed`}
                    placeholder="Brief description…"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-1 py-[13px] bg-foreground border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all"
                >
                  Request assessment
                </button>
              </form>
            ) : (
              <div className="text-center py-11 px-5">
                <div className="w-11 h-11 rounded-full border border-border-mid bg-secondary flex items-center justify-center mx-auto mb-4 text-lg animate-pop-in">
                  ✓
                </div>
                <p className="text-base font-semibold text-foreground mb-2">Request received.</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  We'll be in touch within 2 business days to schedule your complimentary assessment.
                </p>
              </div>
            )}
            <p className="mt-3.5 text-[11px] text-muted-foreground/50 text-center leading-relaxed">
              Complimentary · No obligation · CyTech specialists
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCard;
