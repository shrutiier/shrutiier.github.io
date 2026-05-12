"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const getNavItemClass = (href: string) => {
    const base = "px-1.5 py-1 rounded-lg transition";
    const isActive = pathname === href;
    return isActive ? `${base} bg-muted text-foreground` : `${base} hover:text-foreground`;
  };
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 font-normal text-sm text-muted-foreground"
      style={{ background: "linear-gradient(to bottom, #0A0A0A, transparent)" }}
    >
      {/* Left side (Logo + Links) */}
      <div className="flex items-center justify-between gap-[4px] space-x-2">
        {/*
        <Link href="/">
          <Image src={getImagePath("/header-logo.png")} alt="My logo" width={18} height={18} />
        </Link>
        */}

        <Link href="/" className={getNavItemClass("/")}>
          Work
        </Link>
      </div>
    </nav>
  );
}
