"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExecState } from "@/lib/algorithms/types";

const SPEEDS = [0.25, 0.5, 1, 2, 4] as const;

export function useExecution(states: ExecState[]) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(2); // 1x
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = states.length;
  const state = states[Math.min(step, total - 1)];

  const go = useCallback(
    (n: number) => setStep(Math.max(0, Math.min(total - 1, n))),
    [total],
  );
  const next = useCallback(() => {
    setStep((s) => {
      if (s >= total - 1) {
        setPlaying(false);
        return s;
      }
      return s + 1;
    });
  }, [total]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);
  const toggle = useCallback(() => {
    setStep((s) => {
      if (s >= total - 1) return 0;
      return s;
    });
    setPlaying((p) => !p);
  }, [total]);

  // playback loop — interval shortens with speed
  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    const ms = Math.max(120, 900 / SPEEDS[speedIdx]);
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= total - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, ms);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speedIdx, total]);

  // keyboard: ← → space R
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "r" || e.key === "R") reset();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev, toggle, reset]);

  return { step, total, state, playing, toggle, next, prev, reset, go, speedIdx, setSpeedIdx, speeds: SPEEDS };
}

export type Execution = ReturnType<typeof useExecution>;
