import FormCard from "./FormCard";

const HeroSection = () => {
  return (
    <section className="py-[140px] px-10 max-[900px]:py-20 max-[900px]:px-6 max-w-[1120px] mx-auto grid grid-cols-[1fr_400px] gap-20 items-start max-[900px]:grid-cols-1 max-[900px]:gap-14">
      <div className="pt-4 max-[900px]:pt-0">
        <span
          className="inline-block text-[11px] font-medium tracking-[0.1em] uppercase text-accent mb-7 animate-fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          Strategic Partnership
        </span>
        <h1
          className="text-[clamp(38px,4.5vw,58px)] font-light leading-[1.08] tracking-tight text-foreground mb-6 animate-fade-up"
          style={{ animationDelay: "0.12s" }}
        >
          Innovative Cybersecurity:{" "}<br />
          <strong className="font-semibold">Empowering Philippine Businesses</strong>
        </h1>
        <p
          className="text-[17px] leading-[1.75] text-muted-foreground max-w-[420px] mb-14 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          YAHSHUA-ABBA has partnered with CyTech International to bring enterprise-grade, AI-powered security into the platform you already rely on. Working together so you'll have peace of mind.
        </p>
        <div
          className="flex gap-10 pt-10 border-t border-border animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-foreground leading-none mb-1">500+</div>
            <div className="text-[12px] text-muted-foreground tracking-[0.02em]">Companies</div>
          </div>
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-foreground leading-none mb-1">100K+</div>
            <div className="text-[12px] text-muted-foreground tracking-[0.02em]">Employees</div>
          </div>
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-foreground leading-none mb-1">17+</div>
            <div className="text-[12px] text-muted-foreground tracking-[0.02em]">Years in PH Market</div>
          </div>
          <div>
            <div className="text-[26px] font-semibold tracking-tight text-foreground leading-none mb-1">₱5M</div>
            <div className="text-[12px] text-muted-foreground tracking-[0.02em]">Max NPC Fine</div>
          </div>
        </div>
      </div>
      <FormCard />
    </section>
  );
};

export default HeroSection;
