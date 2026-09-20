import Link from "next/link";
import LastPlayed from "./LastPlayed";
import VisitorCount from "./VisitorCount";

/**
 * @param showStatus Renders the last-played track and visit tally above the
 *   copyright row. Off by default so it stays a homepage flourish rather than
 *   following the reader into every project page.
 */
export default function Footer({ showStatus = false }: { showStatus?: boolean }) {
  return (
    <footer className="w-full py-10 text-xs text-muted-foreground">
      {/* Last track scrobbled to Last.fm, then a running visit tally underneath it —
          stacked and left-aligned, the same arrangement as the reference site. */}
      {showStatus && (
        <div className="mb-10">
          <LastPlayed />
          <VisitorCount />
        </div>
      )}

      <div className="flex flex-col items-center justify-between md:flex-row">
        {/* Left side: copyright */}
        <div className="order-2 mt-4 text-center md:order-1 md:mt-0 md:text-left">
          <p>© 2026</p>
        </div>

        {/* Right side: social links */}
        <div className="order-1 flex space-x-3 font-mono text-[12px] uppercase md:order-2">
          <Link
            href="https://www.linkedin.com/in/shrutiiyer17/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-1.5 py-1 transition hover:text-accent"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:shrutiiyer17@gmail.com"
            className="rounded-lg px-1.5 py-1 transition hover:text-accent"
          >
            Mail
          </Link>
          <Link
            href="https://www.behance.net/shrutiiyer17"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-1.5 py-1 transition hover:text-accent"
          >
            Behance
          </Link>
        </div>
      </div>
    </footer>
  );
}
