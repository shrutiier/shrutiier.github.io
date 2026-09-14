"use client";

import { useEffect } from "react";

/**
 * Reveals any element marked with `data-reveal` as it scrolls into view.
 *
 * Elements are hidden by the `.reveal` class in globals.css and unhidden by adding
 * `.is-visible`. Because a stuck element would stay invisible, there are three ways out:
 * reduced-motion shows everything immediately, IntersectionObserver handles the normal
 * case, and a scroll-position fallback takes over if the observer never reports back.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const pending = new Set<Element>(targets);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let poll: ReturnType<typeof setInterval> | null = null;
    let observer: IntersectionObserver | null = null;
    let observerReported = false;

    const cleanup = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", revealWhatIsOnScreen);
      window.removeEventListener("resize", revealWhatIsOnScreen);
      timers.forEach(clearTimeout);
      if (poll) clearInterval(poll);
    };

    const reveal = (el: Element) => {
      el.classList.add("is-visible");
      pending.delete(el);
      if (pending.size === 0) cleanup();
    };

    function revealWhatIsOnScreen() {
      const limit = window.innerHeight * 0.92;
      pending.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < limit && rect.bottom > 0) reveal(el);
      });
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          observerReported = true;
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        },
        // Trigger a little before the element is fully on screen.
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      targets.forEach((el) => observer!.observe(el));
    }

    // Some environments expose IntersectionObserver but never deliver a callback.
    // If nothing has been reported shortly after mount, drive it from scroll position instead.
    timers.push(
      setTimeout(() => {
        if (observerReported) return;
        observer?.disconnect();
        observer = null;
        window.addEventListener("scroll", revealWhatIsOnScreen, { passive: true });
        window.addEventListener("resize", revealWhatIsOnScreen);
        // A few environments don't emit scroll events either, so also poll the position.
        // This still only reveals what is actually on screen — never anything ahead of it.
        poll = setInterval(revealWhatIsOnScreen, 400);
        revealWhatIsOnScreen();
      }, 600)
    );

    return cleanup;
  }, []);

  return null;
}
