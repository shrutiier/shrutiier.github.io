import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 w-full flex flex-col md:flex-row items-center justify-between text-muted-foreground text-xs">
      {/* Left side: copyright */}
      <div className="order-2 md:order-1 mt-4 md:mt-0 text-center md:text-left">
        <p>© 2026</p>
      </div>

      {/* Right side: social links */}
      <div className="order-1 md:order-2 flex space-x-3 text-[12px] font-mono uppercase">
        <Link
          href="https://www.linkedin.com/in/shrutiiyer17/"
          target="_blank"
          rel="noreferrer"
          className="px-1.5 py-1 rounded-lg hover:text-foreground transition"
        >
          LinkedIn
        </Link>
        <Link
          href="mailto:shrutiiyer17@gmail.com"
          className="px-1.5 py-1 rounded-lg hover:text-foreground transition"
        >
          Mail
        </Link>
        <Link
          href="https://www.behance.net/shrutiiyer17"
          target="_blank"
          rel="noreferrer"
          className="px-1.5 py-1 rounded-lg hover:text-foreground transition"
        >
          Behance
        </Link>
      </div>
    </footer>
  );
}
