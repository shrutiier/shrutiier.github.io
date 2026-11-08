import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<"video">, "src" | "children"> & {
  /** Path without extension: `${base}.mov` (HEVC with alpha) and `${base}.webm` (VP9 with alpha). */
  base: string;
};

// Bump when the files change, so browsers don't keep showing a cached copy.
const VERSION = "?v=2";

/**
 * A looping video with a transparent background, so it sits on the page in either theme.
 * Safari only plays transparency from HEVC with alpha; Chrome and Firefox from VP9 WebM. The
 * QuickTime source comes first: Safari takes it, and the other browsers don't claim QuickTime,
 * so they skip on to the WebM rather than playing the HEVC without its alpha.
 */
export default function AlphaVideo({ base, ...video }: Props) {
  return (
    <video autoPlay loop muted playsInline {...video}>
      <source src={`${base}.mov${VERSION}`} type='video/quicktime; codecs="hvc1"' />
      <source src={`${base}.webm${VERSION}`} type="video/webm" />
    </video>
  );
}
