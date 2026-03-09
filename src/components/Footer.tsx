const Footer = () => (
  <footer className="bg-foreground border-t border-primary-foreground/[0.06] py-8 px-10 max-sm:py-7 max-sm:px-6">
    <div className="max-w-[1120px] mx-auto flex items-center justify-between gap-5 flex-wrap max-sm:flex-col max-sm:text-center">
      <span className="text-[13px] text-primary-foreground/30">
        YAHSHUA-ABBA × CyTech International
      </span>
      <ul className="flex gap-6 list-none">
        {["Privacy Policy", "Terms", "Contact", "YAHSHUA-ABBA"].map((link) => (
          <li key={link}>
            <a href="#" className="text-[12px] text-primary-foreground/20 no-underline hover:text-primary-foreground/50 transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
