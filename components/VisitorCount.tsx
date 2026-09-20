"use client";

import { useEffect, useState } from "react";
import { VISITS_KEY, VISITS_NAMESPACE } from "@/utils/siteConfig";

const BASE = "https://abacus.jasoncameron.dev";
const SESSION_FLAG = "visit-counted";

/**
 * Whether this tab has already been counted.
 *
 * sessionStorage is the real record, so a reload in the same tab doesn't inflate the
 * number. The module-level flag is a second guard for React's development double-render,
 * which fires effects twice before sessionStorage has been written.
 */
let countedThisLoad = false;

function alreadyCounted() {
  if (countedThisLoad) return true;
  try {
    return sessionStorage.getItem(SESSION_FLAG) === "1";
  } catch {
    // Private mode or blocked storage: fall back to counting once per page load.
    return false;
  }
}

function markCounted() {
  countedThisLoad = true;
  try {
    sessionStorage.setItem(SESSION_FLAG, "1");
  } catch {
    // Nothing to do — the in-memory flag still covers this page load.
  }
}

/**
 * A running tally of visits, kept by Abacus (a keyless public counter service).
 *
 * The site is a static export with nowhere to store a number, so the count lives
 * with Abacus and is incremented once per browser session; later renders only read
 * it. If the service is unreachable the component renders nothing rather than a zero.
 */
export default function VisitorCount() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    // `hit` increments and returns the new total; `get` only reads.
    const isFirstVisit = !alreadyCounted();
    const path = isFirstVisit ? "hit" : "get";
    if (isFirstVisit) markCounted();

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
