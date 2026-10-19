"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Eased, weighted page scrolling for mouse wheels and trackpads.
 *
 * Renders nothing; it only attaches Lenis to the window. Touch scrolling is left
 * native (`syncTouch: false`) because phones already have their own momentum, and
 * faking it there feels laggy. Visitors who ask for reduced motion keep the
 * browser's plain scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const update = () => {
      if (query.matches) {
        lenis?.destroy();
        lenis = null;
      } else if (!lenis) {
        lenis = new Lenis({
          // How much of the remaining distance is covered each frame; lower is floatier.
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
          // In-page # links glide too, rather than jumping.
          anchors: true,
          // Let scrollable panels inside the page scroll themselves.
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          autoRaf: true,
        });
      }
    };

    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);

  return null;
}
