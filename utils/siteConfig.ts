/**
 * Config for the small live bits in the footer (last played, visitor count).
 *
 * Everything here ends up in the browser bundle, so it holds only public,
 * read-only values. The Last.fm key is a read key that can do nothing but look
 * up public scrobbles; there is no secret to protect on a statically exported site.
 *
 * The two Last.fm values come from the build environment so they can live in
 * `.env.local` locally and in repository secrets on CI.
 */

export const LASTFM_USER = process.env.NEXT_PUBLIC_LASTFM_USER ?? "";
export const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY ?? "";

/**
 * Shown until Last.fm answers — and permanently, if no API key is configured.
 *
 * With the API key configured this is only reached when Last.fm cannot be
 * reached at all — the service down, a blocked network, an ad-blocker — so it
 * should be a track worth sitting there indefinitely rather than anything
 * topical. Set `title` to an empty string to hide the line in that case instead.
 */
export const FALLBACK_TRACK = {
  title: "annie.",
  artist: "wave to earth",
  // The trailing dot is part of the track name, so it belongs in the URL too.
  url: "https://www.last.fm/music/wave+to+earth/_/annie.",
};

/**
 * Abacus (abacus.jasoncameron.dev) is a keyed counter with no account and no key.
 * The namespace is what keeps this site's tally separate from everyone else's, so
 * it needs to stay both unique and unchanged — changing it starts the count over.
 */
export const VISITS_NAMESPACE = "shrutiiyer-portfolio";
export const VISITS_KEY = "visits";
