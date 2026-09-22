"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { FALLBACK_TRACK, LASTFM_API_KEY, LASTFM_USER } from "@/utils/siteConfig";

type Track = {
  title: string;
  artist: string;
  url: string;
};

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const REFRESH_MS = 60_000;

/** Whether Last.fm can be queried at all; without both values there is nothing to call. */
const configured = Boolean(LASTFM_USER && LASTFM_API_KEY);

/** The shape we actually read out of Last.fm's response, which is loosely typed JSON. */
type LastfmTrack = {
  name?: string;
  url?: string;
  artist?: { "#text"?: string };
};

function parseTrack(payload: unknown): Track | null {
  const recent = (payload as { recenttracks?: { track?: LastfmTrack | LastfmTrack[] } })
    ?.recenttracks?.track;
  // Last.fm returns an array for most accounts but a bare object for some; accept either.
  // The first entry is the track in progress when there is one, so it reads as
  // "last played" either way and needs no separate now-playing state.
  const raw = Array.isArray(recent) ? recent[0] : recent;
  if (!raw?.name || !raw?.url) return null;

  return {
    title: raw.name,
    artist: raw.artist?.["#text"] ?? "",
    url: raw.url,
  };
}

/**
 * The last track scrobbled to Last.fm, linking out to it.
 *
 * Last.fm's read API is CORS-enabled, so this works straight from the browser and
 * needs no server — which matters, because the site is a static export. A failed
 * request leaves whatever was already showing rather than blanking the line.
 */
export default function LastPlayed() {
  // Start empty when Last.fm can answer, so the real track is the first thing shown
  // rather than the fallback flashing on every load. With no key there is nothing to
  // wait for, so the fallback goes up immediately.
  const [track, setTrack] = useState<Track | null>(
    !configured && FALLBACK_TRACK.title ? FALLBACK_TRACK : null
  );

  useEffect(() => {
    if (!configured) return;

    const controller = new AbortController();
    const url =
      `${ENDPOINT}?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USER)}` +
      `&api_key=${encodeURIComponent(LASTFM_API_KEY)}&format=json&limit=1`;

    // If Last.fm never answers there is nothing to show, so drop back to the
    // configured track rather than leaving an empty gap in the footer. Only ever
    // applied when nothing real has arrived — a later failed poll must not
    // replace a track we already have.
    const showFallback = () => {
      if (!FALLBACK_TRACK.title) return;
      setTrack((current) => current ?? FALLBACK_TRACK);
    };

    const load = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          showFallback();
          return;
        }
        const live = parseTrack(await response.json());
        if (live) setTrack(live);
        else showFallback();
      } catch {
        // Offline, blocked, or aborted on unmount. An abort means the component is
        // going away, so there is nothing worth showing; anything else falls back.
        if (!controller.signal.aborted) showFallback();
      }
    };

    load();
    // Poll slowly so the line follows along while someone is reading the page.
    const timer = setInterval(load, REFRESH_MS);

    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  if (!track) return null;

  const full = track.artist ? `${track.title} — ${track.artist}` : track.title;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noreferrer"
      title={full}
      aria-label={`last played: ${full}`}
      className="group inline-flex items-center gap-2 font-mono text-[12px] text-[#6B894A] hover:text-accent transition-colors max-w-full"
    >
      {/* Pinned to the resting tint so the note holds steady while the text
          lifts to the accent on hover. */}
      <Music className="w-3.5 h-3.5 shrink-0 text-[#6B894A]" aria-hidden="true" />
      <span className="truncate">last played · {track.title}</span>
    </a>
  );
}
