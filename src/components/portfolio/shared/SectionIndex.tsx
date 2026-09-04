"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { content } from "@/content/shreya";

/**
 * Right-edge section index with a scroll-spy active state.
 *
 * Adapted from React Bits' LineSidebar rather than dropped in: that one owns
 * `activeIndex` in its own state, and here scroll position has to be the source of
 * truth. The cursor-proximity effect is kept - one rAF loop eases every item's
 * `--effect` toward its target so colour, shift and marker length stay in step instead
 * of racing separate CSS transitions.
 */

const ITEMS = content.sectionIndex;
const PROXIMITY_RADIUS = 90;
const SMOOTHING_MS = 110;
/** Section counts as current once its top passes this fraction down the viewport. */
const SPY_LINE = 0.4;

export function SectionIndex() {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targets = useRef<number[]>(ITEMS.map(() => 0));
  const values = useRef<number[]>(ITEMS.map(() => 0));
  const activeRef = useRef(0);
  /** Set by the loop effect so the pointer handlers can wake it. */
  const wakeRef = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);

  // The rAF loop lives entirely inside an effect so it can reference itself without the
  // self-referential useCallback the original used.
  useEffect(() => {
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-dt / (SMOOTHING_MS / 1000));

      let moving = false;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = Math.max(targets.current[i] ?? 0, activeRef.current === i ? 1 : 0);
        const next = values.current[i] + (target - values.current[i]) * k;
        const settled = Math.abs(target - next) < 0.0015;
        values.current[i] = settled ? target : next;
        el.style.setProperty("--effect", values.current[i].toFixed(4));
        if (!settled) moving = true;
      });

      raf = moving ? requestAnimationFrame(frame) : 0;
    };

    wakeRef.current = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
    wakeRef.current();
  }, [active]);

  useEffect(() => {
    const ids = ITEMS.map((item) => item.href.slice(1));
    const onScroll = () => {
      const line = window.innerHeight * SPY_LINE;
      let current = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list) return;
    const y = event.clientY - list.getBoundingClientRect().top;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const centre = el.offsetTop + el.offsetHeight / 2;
      const p = Math.max(0, 1 - Math.abs(y - centre) / PROXIMITY_RADIUS);
      targets.current[i] = p * p * (3 - 2 * p);
    });
    wakeRef.current();
  }, []);

  const onPointerLeave = useCallback(() => {
    targets.current = targets.current.map(() => 0);
    wakeRef.current();
  }, []);

  return (
    <nav
      aria-label="Sections"
      /* The frosted backing is all but invisible against the paper ground, and is what
         keeps the labels readable where the full-bleed section fills the viewport
         behind them. */
      className="fixed top-1/2 right-4 z-[40] hidden -translate-y-1/2 rounded-2xl bg-[color-mix(in_srgb,var(--additti-paper)_62%,transparent)] py-4 pr-3 pl-4 backdrop-blur-[3px] min-[810px]:block"
    >
      <ul
        ref={listRef}
        className="section-index__list"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {ITEMS.map((item, i) => (
          <li
            key={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            <a
              href={item.href}
              aria-current={active === i ? "true" : undefined}
              className="section-index__link"
            >
              <span aria-hidden="true" className="section-index__marker" />
              <span className="section-index__index">{String(i + 1).padStart(2, "0")}</span>
              <span className="section-index__text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
