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
  // The fallback is only for the unconfigured case. Once Last.fm can answer, start
  // empty and wait for it — otherwise a song she never played flashes on every load.
  const [track, setTrack] = useState<Track | null>(
    !configured && FALLBACK_TRACK.title ? FALLBACK_TRACK : null
  );

  useEffect(() => {
    if (!configured) return;

    const controller = new AbortController();
    const url =
      `${ENDPOINT}?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USER)}` +
      `&api_key=${encodeURIComponent(LASTFM_API_KEY)}&format=json&limit=1`;

    const load = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) return;
        const live = parseTrack(await response.json());
        if (live) setTrack(live);
      } catch {
        // Offline, blocked, or aborted on unmount — leave whatever was showing.
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
      className="group inline-flex items-center gap-2 font-mono text-[12px] text-muted-foreground hover:text-accent transition-colors max-w-full"
    >
      <Music className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">last played · {track.title}</span>
    </a>
  );
}
