const WebinarSection = () => (
  <section id="webinar" className="section-padding border-t border-border">
    <div className="section-inner">
      <div className="max-w-[680px]">
        <span className="block text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
          Webinar · April 7, 2026
        </span>
        <h2 className="text-[clamp(28px,3vw,40px)] font-light tracking-tight leading-[1.1] text-foreground mb-5">
          One conversation that could change<br />
          <strong className="font-semibold">how you protect everything.</strong>
        </h2>
        <p className="text-[17px] leading-[1.75] text-muted-foreground mb-8">
          Both CEOs. Live demos. Your questions answered in real time — and a complimentary security assessment just for attending.
        </p>
        <div className="flex gap-2 flex-wrap mb-9">
          {["Free to attend", "1 hour · Zoom", "Limited seats"].map((c) => (
            <span key={c} className="px-3.5 py-1.5 bg-card border border-border rounded-full text-[12px] text-muted-foreground tracking-[0.02em]">
              {c}
            </span>
          ))}
        </div>
        <a
          href="#register"
          className="inline-block px-7 py-[13px] bg-foreground rounded-md text-[13px] font-medium tracking-[0.04em] text-primary-foreground no-underline hover:opacity-80 transition-opacity"
        >
          Reserve my seat
        </a>
      </div>
    </div>
  </section>
);

export default WebinarSection;
