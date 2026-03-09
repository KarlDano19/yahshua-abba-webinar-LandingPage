import { useEffect, useState } from "react";

const Navbar = () => {
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-[12px] border-b transition-colors duration-300 ${
        raised ? "border-border-mid" : "border-border"
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-10 max-md:px-6 h-16 flex items-center justify-between">
        <a href="#" className="no-underline flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground tracking-tight leading-none">
            YAHSHUA-ABBA × CyTech
          </span>
          <span className="text-[10px] font-normal tracking-[0.12em] uppercase text-muted-foreground">
            Strategic Partnership
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><a href="#why" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline">Why</a></li>
          <li><a href="#speakers" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline">Speakers</a></li>
          <li><a href="#webinar" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors no-underline">Webinar</a></li>
          <li>
            <a
              href="#register"
              className="px-[22px] py-[9px] bg-foreground rounded text-[12px] font-medium tracking-[0.04em] text-primary-foreground hover:opacity-80 transition-opacity no-underline"
            >
              Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
