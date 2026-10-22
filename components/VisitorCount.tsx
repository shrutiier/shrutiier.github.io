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

const OWNER_KEY = "visits-owner";

/**
 * Whether this browser belongs to the site's owner, whose own visits shouldn't count.
 *
 * Open the site once with `?me` in the address to mark this browser (it's remembered in
 * local storage, and the `?me` is tidied out of the address bar); `?me=0` unmarks it. Local
 * development never counts either. The mark is per browser, so a new device, a private
 * window or cleared site data counts as a visitor until it's marked again.
 */
function isOwner() {
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("me")) {
      if (params.get("me") === "0") window.localStorage.removeItem(OWNER_KEY);
      else window.localStorage.setItem(OWNER_KEY, "1");
      params.delete("me");
      const query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : "") + window.location.hash);
    }
    return local || window.localStorage.getItem(OWNER_KEY) === "1";
  } catch {
    return local; // storage blocked: count the visit, as for anyone else
  }
}

/**
 * A running tally of visits, kept by Abacus (a keyless public counter service).
 *
 * The site is a static export with nowhere to store a number, so the count lives
 * with Abacus and is incremented once per page load; navigating within the site only
 * reads it, and so do the owner's own visits. If the service is unreachable the
 * component renders nothing rather than a zero.
 */
export default function VisitorCount() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    // `hit` increments and returns the new total; `get` only reads.
    const path = countedThisLoad || isOwner() ? "get" : "hit";
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
    <p className="mt-2 text-[14px] text-muted-foreground">
      visitor {visits.toLocaleString("en-US")}
    </p>
  );
}
