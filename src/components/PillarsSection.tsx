const pillars = [
{
  num: "01",
  title: "AI-Powered Monitoring",
  desc: "Continuous threat detection that automates response — enterprise-grade protection without the overhead."
},
{
  num: "02",
  title: "Seamless Integration",
  desc: "Works inside your existing Payroll, HRIS, and Books setup. One upgrade, fully covered."
},
{
  num: "03",
  title: "Philippine Compliance",
  desc: "Aligned with the Data Privacy Act and BIR requirements. Compliance becomes an advantage, not a burden."
}];


const PillarsSection = () =>
<section id="why" className="section-padding border-t border-border">
    <div className="section-inner">
      <div className="mb-16">
        <span className="block text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
          Why this partnership
        </span>
        <h2 className="text-[clamp(28px,3vw,40px)] font-light tracking-tight leading-[1.1] text-foreground mb-4">
          Security built into<br /><strong className="font-semibold">what you already use.</strong>
        </h2>
        <p className="text-base leading-[1.75] text-muted-foreground max-w-[480px]">
          CyTech's protection layers directly onto our existing YAHSHUA-ABBA solutions.
        </p>
      </div>

      <div className="grid grid-cols-3 max-[720px]:grid-cols-1 gap-px bg-border border border-border rounded-lg overflow-hidden">
        {pillars.map((p) =>
      <div key={p.num} className="bg-secondary p-10 max-md:p-8 transition-colors hover:bg-card">
            <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-5 opacity-50">
              {p.num}
            </div>
            <h3 className="text-[17px] font-semibold tracking-tight text-foreground mb-2.5">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-[1.75]">{p.desc}</p>
          </div>
      )}
      </div>
    </div>
  </section>;


export default PillarsSection;
