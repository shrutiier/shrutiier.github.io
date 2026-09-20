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
 * Without this the footer line simply wouldn't exist until the Last.fm setup is
 * done, which is confusing. CHANGE THIS to a song you'd actually want a visitor
 * to see, because until the API key is set this is what the site tells everyone
 * you last listened to. Set `title` to an empty string to hide the line instead.
 */
export const FALLBACK_TRACK = {
  title: "Cinnamon Girl",
  artist: "Lana Del Rey",
  url: "https://www.last.fm/music/Lana+Del+Rey/_/Cinnamon+Girl",
};

/**
 * Abacus (abacus.jasoncameron.dev) is a keyed counter with no account and no key.
 * The namespace is what keeps this site's tally separate from everyone else's, so
 * it needs to stay both unique and unchanged — changing it starts the count over.
 */
export const VISITS_NAMESPACE = "shrutiiyer-portfolio";
export const VISITS_KEY = "visits";
