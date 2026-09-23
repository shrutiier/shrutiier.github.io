"use client";

import { useEffect, useState } from "react";
import { VISITS_KEY, VISITS_NAMESPACE } from "@/utils/siteConfig";

const BASE = "https://abacus.jasoncameron.dev";

/**
 * Whether this page load has already been counted.
 *
 * It lives at module level, so it resets on every full page load (a fresh visit, a
 * reload, a restored tab) but survives client-side navigation between pages, which
 * remounts the footer without being a new arrival. It also absorbs React's
 * development double-render, which fires effects twice.
 */
let countedThisLoad = false;

/**
 * A running tally of visits, kept by Abacus (a keyless public counter service).
 *
 * The site is a static export with nowhere to store a number, so the count lives
 * with Abacus and is incremented once per page load; navigating within the site only
 * reads it. If the service is unreachable the component renders nothing rather than a zero.
 */
export default function VisitorCount() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    // `hit` increments and returns the new total; `get` only reads.
    const path = countedThisLoad ? "get" : "hit";
    countedThisLoad = true;

    fetch(`${BASE}/${path}/${VISITS_NAMESPACE}/${VISITS_KEY}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (typeof data?.value === "number") setVisits(data.value);
      })
      .catch(() => {
        // Service down or request blocked — the counter just stays hidden.
      });

    return () => controller.abort();
  }, []);

  if (visits === null) return null;

  return (
    <p className="mt-2 font-mono text-[12px] text-muted-foreground">
      visitor {visits.toLocaleString("en-US")}
    </p>
  );
}
