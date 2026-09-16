"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KemetLogo } from "@/components/brand/KemetLogo";
import { FireParticles } from "@/components/brand/FireParticles";

const SESSION_KEY = "kemet-intro-seen-v1";

type Phase = "static" | "separate" | "rise" | "spin" | "extinguish" | "settle" | "done";

/**
 * Cinematic homepage entrance: the winged emblem separates from the
 * wordmark, rises toward the viewer in 3D, performs a controlled spin,
 * ignites with flame particles, extinguishes, and settles back into the
 * normal static logo. Runs once per browser session, respects
 * prefers-reduced-motion, and never blocks page interaction (nav, scroll,
 * and buttons remain usable throughout).
 */
export function LogoIntro() {
  const [mounted, setMounted] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(true); // default to safe/static until we confirm otherwise
  const [phase, setPhase] = useState<Phase>("static");
  const [transform, setTransform] = useState("");
  const [wordmarkOpacity, setWordmarkOpacity] = useState(1);
  const [emblemScale, setEmblemScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const emblemBoxRef = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const [fireBox, setFireBox] = useState({ width: 0, height: 0 });

  const quality = useMemo(() => {
    if (typeof window === "undefined") return "high" as const;
    const lowPower =
      (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 480;
    return lowPower ? ("low" as const) : ("high" as const);
  }, []);

  const totalDuration = quality === "low" ? 3400 : 5000;
  const maxParticles = quality === "low" ? 26 : 70;

  useEffect(() => {
    setMounted(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    if (reducedMotion || alreadySeen) {
      setSkipAnimation(true);
      setPhase("done");
    } else {
      setSkipAnimation(false);
    }
  }, []);

  useEffect(() => {
    if (!emblemBoxRef.current) return;
    const rect = emblemBoxRef.current.getBoundingClientRect();
    setFireBox({ width: rect.width, height: rect.height });
  }, [mounted]);

  function finish() {
    cancelAnimationFrame(rafRef.current);
    intensityRef.current = 0;
    setPhase("done");
    setTransform("");
    setWordmarkOpacity(1);
    setEmblemScale(1);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* sessionStorage unavailable (private browsing) — animation will replay, which is an acceptable fallback */
    }
  }

  useEffect(() => {
    if (skipAnimation || phase === "done") return;

    const timeline = {
      staticEnd: quality === "low" ? 250 : 400,
      separateEnd: quality === "low" ? 650 : 1000,
      riseEnd: quality === "low" ? 1550 : 2400,
      spinEnd: quality === "low" ? 2450 : 3600,
      extinguishEnd: quality === "low" ? 3000 : 4400,
      settleEnd: totalDuration,
    };

    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3); // easeOutCubic
    }
    function easeInOut(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function frame(now: number) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;

      if (elapsed <= timeline.staticEnd) {
        setPhase("static");
      } else if (elapsed <= timeline.separateEnd) {
        setPhase("separate");
        const t = (elapsed - timeline.staticEnd) / (timeline.separateEnd - timeline.staticEnd);
        setWordmarkOpacity(1 - ease(t));
        setEmblemScale(1 + ease(t) * 0.15);
        setTransform("");
      } else if (elapsed <= timeline.riseEnd) {
        setPhase("rise");
        const t = (elapsed - timeline.separateEnd) / (timeline.riseEnd - timeline.separateEnd);
        const e = ease(t);
        setTransform(
          `translateZ(${e * 220}px) rotateY(${e * 25}deg) rotateX(${-e * 10}deg) scale(${1.15 + e * 0.1})`
        );
      } else if (elapsed <= timeline.spinEnd) {
        setPhase("spin");
        const t = (elapsed - timeline.riseEnd) / (timeline.spinEnd - timeline.riseEnd);
        const e = easeInOut(t);
        setTransform(
          `translateZ(${220 - e * 20}px) rotateY(${25 + e * 360}deg) rotateX(${-10 + e * 10}deg) scale(1.25)`
        );
        intensityRef.current = Math.min(1, t * 2.2);
      } else if (elapsed <= timeline.extinguishEnd) {
        setPhase("extinguish");
        const t = (elapsed - timeline.spinEnd) / (timeline.extinguishEnd - timeline.spinEnd);
        const e = ease(t);
        setTransform(`translateZ(${200 - e * 200}px) rotateY(${385 - e * 385}deg) scale(${1.25 - e * 0.1})`);
        intensityRef.current = Math.max(0, 1 - t * 1.4);
      } else if (elapsed <= timeline.settleEnd) {
        setPhase("settle");
        const t = (elapsed - timeline.extinguishEnd) / (timeline.settleEnd - timeline.extinguishEnd);
        const e = ease(t);
        setTransform("");
        setEmblemScale(1.15 - e * 0.15);
        setWordmarkOpacity(e);
        intensityRef.current = 0;
      } else {
        finish();
        return;
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipAnimation, quality]);

  if (!mounted) {
    // Server-rendered / pre-hydration fallback: plain static logo, no layout shift.
    return (
      <div className="mx-auto flex w-full max-w-md justify-center">
        <KemetLogo className="h-auto w-full" />
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto flex w-full max-w-md justify-center">
        <KemetLogo className="h-auto w-full" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center" style={{ perspective: "1200px" }}>
      <button
        type="button"
        onClick={finish}
        className="absolute -top-10 right-0 z-10 rounded-sm border border-kemet-gold/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-kemet-gold hover:bg-kemet-gold/10 focus-visible:outline-2 focus-visible:outline-kemet-gold sm:right-0"
      >
        Skip Intro
      </button>

      <div
        ref={containerRef}
        className="relative flex w-full flex-col items-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={emblemBoxRef}
          className="relative w-full"
          style={{
            transform: `${transform} scale(${phase === "separate" || phase === "settle" ? emblemScale : 1})`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <KemetLogo emblemOnly className="h-auto w-full" />
          {fireBox.width > 0 && (phase === "spin" || phase === "extinguish") && (
            <FireParticles
              width={fireBox.width}
              height={fireBox.height}
              intensityRef={intensityRef}
              maxParticles={maxParticles}
            />
          )}
        </div>
        <div style={{ opacity: wordmarkOpacity, marginTop: "-15%" }} className="w-full">
          <KemetLogo wordmarkOnly className="h-auto w-full" />
        </div>
      </div>
      <span className="sr-only" role="status">
        Playing Kemet Foundation Inc introduction animation
      </span>
    </div>
  );
}
