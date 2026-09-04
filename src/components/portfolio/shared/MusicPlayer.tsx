"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import type { Track } from "@/types/portfolio";

/**
 * Corner player, bottom-left, in three stages.
 *
 *   hidden -> hint -> player
 *
 * It only ever reaches `hint` if the first track's audio actually loads, so a checkout
 * without the (licensed, uncommitted) files in public/audio/ renders nothing at all
 * rather than a dead pill. The hint is the invitation - "click anywhere for sound" - and
 * the first click on the document is both the cue to start and the user gesture every
 * browser requires before it will let audio play. Autoplaying on load would simply be
 * refused, so the gesture is not a nicety here, it is the only way in.
 *
 * Built against `motion` and the palette variables rather than installed from a registry:
 * the shipped component brings its own visual language and would have to be overridden
 * line by line to sit next to the rest of this site.
 */

const HINT_DELAY = 1600;
const DISMISS_KEY = "additti:player-dismissed";

/** Bars for the equaliser; each keeps its own timing so they never pulse in lockstep. */
const EQ = [
  { peak: 15, duration: 0.62 },
  { peak: 9, duration: 0.9 },
  { peak: 17, duration: 0.74 },
  { peak: 11, duration: 1.02 },
];

type Stage = "hidden" | "hint" | "player";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Deterministic tile standing in for cover art. Real artwork is licensed, so each track
 * gets a gradient derived from its own id instead - stable across renders, and no
 * `Math.random()` to desync the server and client trees.
 */
function artHue(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

function ArtTile({ track, className }: { track: Track; className?: string }) {
  if (track.artwork) {
    // eslint-disable-next-line @next/next/no-img-element -- fixed-size decorative tile
    return <img src={track.artwork} alt="" className={cn("object-cover", className)} />;
  }
  const hue = artHue(track.id);
  return (
    <span
      aria-hidden="true"
      className={cn("block", className)}
      style={{
        background: `radial-gradient(120% 120% at 30% 20%, hsl(${hue} 88% 72%), var(--additti-ink) 55%, var(--additti-blue) 130%)`,
      }}
    />
  );
}

function Equaliser({ playing }: { playing: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <span aria-hidden="true" className="flex h-[18px] items-end gap-[2px]">
      {EQ.map((bar, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-[1px] bg-ink"
          initial={{ height: 4 }}
          animate={
            playing && !prefersReducedMotion
              ? { height: [4, bar.peak, 6, bar.peak - 3, 4] }
              : { height: 4 }
          }
          transition={
            playing && !prefersReducedMotion
              ? { duration: bar.duration * 2.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  );
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" aria-hidden="true">
      <path d="M4 2.5v11l9.5-5.5z" fill="currentColor" />
    </svg>
  );
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const playable = tracks.filter((t) => t.url);

  const audioRef = useRef<HTMLAudioElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [stage, setStage] = useState<Stage>("hidden");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(playable[0]?.duration ?? 0);
  const [volume, setVolume] = useState(0.7);
  const [expanded, setExpanded] = useState(false);

  const track = playable[index];

  // Reveal the hint only once the browser confirms it can actually decode the first
  // track. `loadedmetadata` is the cheapest honest signal - `preload="metadata"` pulls a
  // few KB rather than the whole file - and its absence is what keeps a fresh clone,
  // where public/audio is empty, from showing a player that could never play anything.
  const [available, setAvailable] = useState(false);

  // `onLoadedMetadata` alone is not enough. A local file this small often reaches
  // HAVE_METADATA before React has finished attaching its listeners, so the event fires
  // into nothing and the hint never arrives - the player was invisible for exactly this
  // reason. Poll the element's own readyState once on mount and treat that as the same
  // signal; the handler still covers the slow path.
  const syncFromElement = useCallback(
    (audio: HTMLAudioElement, fallback: number) => {
      setAvailable(true);
      const real = audio.duration;
      setDuration(Number.isFinite(real) && real > 0 ? real : fallback);
    },
    [],
  );

  // Runs per track, not once: switching the src reloads metadata, and on a cached file
  // that can again complete before the new listener sees it.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audio.readyState >= 1) syncFromElement(audio, track?.duration ?? 0);
  }, [index, syncFromElement, track?.duration]);

  useEffect(() => {
    if (!available || stage !== "hidden") return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // Private mode or blocked storage: showing the hint is the harmless branch.
    }
    const t = window.setTimeout(() => setStage("hint"), HINT_DELAY);
    return () => window.clearTimeout(t);
  }, [available, stage]);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    void audio.play().then(
      () => {
        setPlaying(true);
        setStage("player");
      },
      () => {
        // Refused despite the gesture (some mobile power-saving modes). Surface the
        // player anyway so there is a control to try again with.
        setStage("player");
      },
    );
  }, [volume]);

  // The whole document is the trigger, once. Capture phase so a click that a link
  // handler stops from bubbling still counts, and `once` so this never fires twice.
  useEffect(() => {
    if (stage !== "hint") return;
    const onFirstClick = (event: MouseEvent) => {
      // Capture runs before the target's own handler, so `stopPropagation` inside the
      // dismiss button cannot stop this - "no thanks" would start the music. The opt-out
      // has to be checked here instead. Not `once`, for the same reason: a dismissed
      // click must not consume the one shot.
      const target = event.target as Element | null;
      if (target?.closest?.("[data-player-optout]")) return;
      document.removeEventListener("click", onFirstClick, { capture: true });
      start();
    };
    document.addEventListener("click", onFirstClick, { capture: true });
    return () => document.removeEventListener("click", onFirstClick, { capture: true });
  }, [stage, start]);

  const dismiss = useCallback(() => {
    setStage("hidden");
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Nothing to do; the hint simply returns on the next page load.
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true), () => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const skip = useCallback(
    (delta: number) => {
      if (!playable.length) return;
      setIndex((i) => (i + delta + playable.length) % playable.length);
      setTime(0);
    },
    [playable.length],
  );

  const seek = useCallback((next: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = next;
    setTime(next);
  }, []);

  // Volume lives in React state so the slider is controlled; push it at the element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Changing track swaps the src, so playback has to be restarted explicitly - but only
  // if something was already playing, or a skip would start audio the user never asked for.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    void audio.play().catch(() => setPlaying(false));
  }, [index, playing]);

  if (!track) return null;

  const progress = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={track.url}
        preload="metadata"
        onLoadedMetadata={(e) => syncFromElement(e.currentTarget, track.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => skip(1)}
        onError={() => setAvailable(false)}
      />

      <AnimatePresence>
        {stage === "hint" ? (
          <motion.div
            key="hint"
            className="fixed bottom-4 left-4 z-[55] max-[809px]:bottom-3 max-[809px]:left-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-[10px] rounded-full border border-ink/35 bg-paper/90 py-[7px] pr-[8px] pl-[13px] shadow-[0_10px_30px_-14px_color-mix(in_srgb,var(--additti-blue)_60%,transparent)] backdrop-blur-[6px]">
              <motion.span
                aria-hidden="true"
                className="text-[13px] text-ink"
                animate={prefersReducedMotion ? undefined : { rotate: [0, -12, 10, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                ♪
              </motion.span>
              <span className="font-[family-name:var(--font-body)] text-[12.5px] whitespace-nowrap text-blue">
                click anywhere for sound
              </span>
              <button
                type="button"
                data-player-optout=""
                onClick={dismiss}
                aria-label="Dismiss the sound prompt"
                className="grid h-[18px] w-[18px] place-items-center rounded-full text-[11px] text-blue/60 transition-colors hover:bg-ink/10 hover:text-ink"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ) : null}

        {stage === "player" ? (
          <motion.div
            key="player"
            className="fixed bottom-4 left-4 z-[55] max-[809px]:bottom-3 max-[809px]:left-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={(e) => {
              // Scoped to the player, never the document: a global Space handler would
              // take the spacebar away from page scrolling everywhere else on the site.
              if (e.key === " ") {
                e.preventDefault();
                toggle();
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                seek(Math.min(duration, time + 10));
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                seek(Math.max(0, time - 10));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setVolume((v) => Math.min(1, v + 0.1));
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setVolume((v) => Math.max(0, v - 0.1));
              }
            }}
          >
            <div
              className={cn(
                "overflow-hidden rounded-[18px] border border-ink/35 bg-paper/92 shadow-[0_16px_44px_-18px_color-mix(in_srgb,var(--additti-blue)_65%,transparent)] backdrop-blur-[8px]",
                "transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expanded ? "w-[272px]" : "w-[214px]",
              )}
            >
              <div className="flex items-center gap-[9px] p-[8px]">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-label={expanded ? "Collapse the player" : "Expand the player"}
                  className="shrink-0"
                >
                  <ArtTile
                    track={track}
                    className="h-[34px] w-[34px] rounded-[9px] border border-ink/30"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate font-[family-name:var(--font-body)] text-[12.5px] leading-tight font-bold text-blue">
                    {track.title}
                  </span>
                  <span className="block truncate font-[family-name:var(--font-body)] text-[11px] leading-tight text-blue/65">
                    {track.artist}
                  </span>
                </button>

                <Equaliser playing={playing} />

                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform hover:scale-110"
                >
                  <PlayIcon playing={playing} />
                </button>
              </div>

              {/* Always-visible scrubber, so the collapsed pill still shows progress. */}
              <div className="px-[8px] pb-[8px]">
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-ink/18">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-ink/15 px-[10px] pt-[9px] pb-[10px]">
                      <input
                        type="range"
                        min={0}
                        max={Math.max(1, duration)}
                        step={0.5}
                        value={time}
                        onChange={(e) => seek(Number(e.target.value))}
                        aria-label="Seek"
                        className="additti-range w-full"
                      />
                      <div className="flex justify-between font-[family-name:var(--font-body)] text-[10.5px] text-blue/60">
                        <span>{formatTime(time)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>

                      <div className="mt-[8px] flex items-center gap-[10px]">
                        <button
                          type="button"
                          onClick={() => skip(-1)}
                          aria-label="Previous track"
                          className="text-[13px] text-blue transition-colors hover:text-ink"
                        >
                          ⏮
                        </button>
                        <button
                          type="button"
                          onClick={() => skip(1)}
                          aria-label="Next track"
                          className="text-[13px] text-blue transition-colors hover:text-ink"
                        >
                          ⏭
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.02}
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          aria-label="Volume"
                          className="additti-range ml-auto w-[86px]"
                        />
                      </div>

                      {playable.length > 1 ? (
                        <ul className="mt-[10px] flex flex-col gap-[2px]">
                          {playable.map((t, i) => (
                            <li key={t.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setIndex(i);
                                  setTime(0);
                                }}
                                className={cn(
                                  "flex w-full items-center gap-[7px] rounded-[7px] px-[6px] py-[4px] text-left font-[family-name:var(--font-body)] text-[11.5px] transition-colors",
                                  i === index
                                    ? "bg-ink/12 text-ink"
                                    : "text-blue/75 hover:bg-ink/8 hover:text-ink",
                                )}
                              >
                                <span className="w-[10px] shrink-0 text-[9px] opacity-60">
                                  {i + 1}
                                </span>
                                <span className="truncate">{t.title}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
