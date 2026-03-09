const CtaSection = () => (
  <section className="bg-foreground py-[140px] px-10 text-center max-sm:py-20 max-sm:px-6">
    <h2 className="text-[clamp(28px,3vw,40px)] font-light tracking-tight leading-[1.1] text-primary-foreground/90 mb-3.5">
      Ready when you are.
    </h2>
    <p className="text-base text-primary-foreground/45 max-w-[380px] mx-auto mb-11 leading-[1.75]">
      Join Philippine business leaders securing their platforms.
    </p>
    <div className="flex gap-3 justify-center flex-wrap">
      <a
        href="#register"
        className="px-7 py-[13px] bg-card border-none rounded-md text-[13px] font-medium tracking-[0.04em] text-foreground no-underline hover:opacity-90 transition-opacity"
      >
        Reserve a webinar seat
      </a>
      <a
        href="#register"
        className="px-7 py-[13px] bg-transparent border border-primary-foreground/20 rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground/60 no-underline hover:border-primary-foreground/50 hover:text-primary-foreground/90 transition-all"
      >
        Request a free assessment
      </a>
    </div>
  </section>
);

export default CtaSection;
