"use client";

import { useEffect, useState, type ComponentProps } from "react";

type Source = { src: string; poster?: string };

type Props = Omit<ComponentProps<"video">, "src" | "poster"> & {
  dark: Source;
  /** Shown in light mode. Leave out to use the dark video in both themes. */
  light?: Source;
};

const isLight = () => document.documentElement.classList.contains("light");

/**
 * A video with a version for each site theme. It reads the theme from the class on <html>
 * (set before paint by the theme script) rather than from ThemeContext, which starts out
 * "dark" until it catches up — so a light-mode visitor never starts downloading the dark
 * video first. Nothing loads until the theme is known, and only the matching file is
 * fetched. The width and height keep the space reserved meanwhile.
 */
export default function ThemedVideo({ dark, light, ...video }: Props) {
  const [lightMode, setLightMode] = useState<boolean | null>(null);
  // If the light file is missing or won't play, fall back to the dark one rather than a blank box.
  const [lightFailed, setLightFailed] = useState(false);

  useEffect(() => {
    const pick = () => setLightMode(isLight());
    pick();
    const watch = new MutationObserver(pick);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => watch.disconnect();
  }, []);

  const useLight = lightMode && light && !lightFailed;
  const source = lightMode === null ? null : useLight ? light : dark;
  return (
    <video
      {...video}
      src={source?.src}
      poster={source?.poster}
      onError={(e) => {
        if (useLight) setLightFailed(true);
        video.onError?.(e);
      }}
    />
  );
}
