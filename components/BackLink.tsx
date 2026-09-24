import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link
      href="/"
      className="mb-6 -ml-1 inline-flex w-fit items-center gap-0.5 text-sm text-muted-foreground transition hover:text-foreground"
    >
      <ChevronLeft size={16} aria-hidden="true" />
      Back
    </Link>
  );
}
