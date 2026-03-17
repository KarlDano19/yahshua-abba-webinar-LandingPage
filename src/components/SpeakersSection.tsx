import ptrRon from "@/assets/ptr-ron.jpg";
import chenHeffer from "@/assets/chen-heffer.jpg";

const speakers = [
  {
    image: ptrRon,
    name: "Pastor Ron Bayron",
    role: "CEO, YAHSHUA-ABBA",
    bio: "17+ years building the Philippines' most trusted integrated payroll, HR, and accounting platform — serving 500+ companies and 100,000+ employees nationwide.",
  },
  {
    image: chenHeffer,
    name: "Chen Heffer",
    role: "CEO, CyTech International",
    bio: "Leading a U.S.-backed cybersecurity firm specialising in AI-driven protection, enterprise data continuity, and seamless security integration.",
  },
];

const SpeakersSection = () => (
  <section id="speakers" className="section-padding border-t border-border bg-card">
    <div className="section-inner">
      <div className="mb-16">
        <span className="block text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
          Featured speakers
        </span>
        <h2 className="text-[clamp(28px,3vw,40px)] font-light tracking-tight leading-[1.1] text-foreground mb-4">
          Two CEOs.<br /><strong className="font-semibold">One mission.</strong>
        </h2>
        <p className="text-base leading-[1.75] text-muted-foreground max-w-[480px]">
          A direct conversation built for Philippine business decision-makers.
        </p>
      </div>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
        {speakers.map((s) => (
          <div
            key={s.name}
            className="bg-card border border-border rounded-lg p-9 transition-all hover:border-border-mid hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          >
            <img
              src={s.image}
              alt={s.name}
              className="w-16 h-16 rounded-md object-cover mb-5"
            />
            <div className="text-[17px] font-semibold tracking-tight text-foreground mb-0.5">{s.name}</div>
            <div className="text-[12px] text-muted-foreground mb-4">{s.role}</div>
            <p className="text-sm text-muted-foreground leading-[1.75]">{s.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SpeakersSection;
