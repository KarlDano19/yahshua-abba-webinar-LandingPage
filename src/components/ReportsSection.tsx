const reports = [
  {
    source: "World Economic Forum",
    title: "Global Risks Report 2026",
    desc: "Cybersecurity failure ranks among the top global risks for 2026. 87% of leaders flagged AI-driven vulnerabilities as the fastest-growing threat to business operations.",
    link: "https://www.weforum.org/publications/global-risks-report-2026/",
  },
  {
    source: "Palo Alto Networks · Unit 42",
    title: "Incident Response Report 2025",
    desc: "Attacks now unfold 4× faster than three years ago — with data exfiltration occurring in under an hour. Identity-based breaches now drive 65% of all initial access incidents.",
    link: "https://www.paloaltonetworks.com/resources/research/unit-42-incident-response-report",
  },
  {
    source: "IBM Security",
    title: "Cost of a Data Breach Report 2024",
    desc: "The average cost of a data breach in ASEAN reached an all-time high of US$3.33 million in 2024 — a 7% increase year over year. For Philippine businesses operating at scale, the financial exposure is no longer hypothetical.",
    link: "https://www.ibm.com/reports/data-breach",
    full: true,
  },
];

const handleRequestAssessment = () => {
  window.dispatchEvent(new CustomEvent("switch-to-assessment"));
  setTimeout(() => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

const ReportsSection = () => (
  <section id="reports" className="section-padding border-t border-border bg-card">
    <div className="section-inner">
      <div className="mb-16">
        <span className="block text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
          Intelligence behind the investment
        </span>
        <h2 className="text-[clamp(28px,3vw,40px)] font-light tracking-tight leading-[1.1] text-foreground mb-4">
          We read the research.{" "}<strong className="font-semibold">Then we acted.</strong>
        </h2>
        <p className="text-base leading-[1.75] text-muted-foreground max-w-[480px]">
          These are the reports that shaped this partnership — and what they mean for your business.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-2 max-[720px]:grid-cols-1 gap-4 mb-4">
        {reports.map((r) => (
          <div
            key={r.title}
            className={`bg-card border border-border rounded-lg p-9 transition-all hover:border-border-mid hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] ${
              r.full ? "col-span-2 max-[720px]:col-span-1" : ""
            }`}
          >
            <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2.5">
              {r.source}
            </div>
            <div className="text-[17px] font-semibold tracking-tight text-foreground mb-2.5">
              {r.title}
            </div>
            <p className="text-sm text-muted-foreground leading-[1.75] mb-5">
              {r.desc}
            </p>
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-accent no-underline hover:opacity-60 transition-opacity"
            >
              Read the full report →
            </a>
          </div>
        ))}
      </div>

      {/* NPC Teaser Block */}
      <div className="bg-[hsl(0_0%_11%)] rounded-lg p-10 max-[720px]:p-7">
        <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-[rgba(255,255,255,0.35)] mb-3.5">
          National Privacy Commission · Philippines
        </div>
        <div className="text-[20px] font-semibold text-[rgba(255,255,255,0.9)] mb-3">
          NPC Circular 2022-01 — What most Philippine businesses haven't read
        </div>
        <p className="text-sm text-[rgba(255,255,255,0.45)] leading-[1.75] max-w-[640px] mb-3.5">
          The Philippine government can now impose administrative fines of up to ₱5 million — calculated directly from your annual gross income — for data privacy violations under the Data Privacy Act. This circular has been in effect since August 2022. Most businesses still don't know the fine structure.
        </p>
        <p className="text-sm font-medium text-[rgba(255,255,255,0.75)] mb-5">
          Fine range: 0.5% to 3% of annual gross income for grave infractions. Maximum: ₱5,000,000.
        </p>
        <p className="text-[13px] text-accent-sand mb-5">
          Request the free assessment to receive the full NPC guidelines document.
        </p>
        <button
          onClick={handleRequestAssessment}
          className="px-7 py-[13px] bg-card border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-foreground cursor-pointer hover:opacity-90 transition-opacity"
        >
          Request Free Assessment →
        </button>
      </div>
    </div>
  </section>
);

export default ReportsSection;
