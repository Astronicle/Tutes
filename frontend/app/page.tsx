import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import HeroDemo from "@/components/HeroDemo";
import { getAlgorithms } from "@/lib/algorithms/registry";

export default function Home() {
  const algos = getAlgorithms().slice(0, 4);
  return (
    <main>
      {/* HERO */}
      <section className="t-grid-bg border-b border-[#22262c]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-12 md:px-10 md:py-20">
          <div className="md:col-span-6">
            <p className="t-label">Interactive algorithm lab</p>
            <h1 className="mt-4 text-[13vw] font-bold leading-[0.9] tracking-tighter sm:text-7xl lg:text-[92px]">
              SEE
              <br />
              CODE
              <br />
              <span className="text-[#2f5bff]">THINK.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-[#8a8f98]">
              Tutes turns algorithms into interactive systems. Read the code, execute it
              step by step, move backward through time, and watch the state change in
              real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/algorithms"
                className="flex items-center gap-2 bg-[#edebe6] px-6 py-3 font-mono text-[12px] tracking-[0.1em] text-black hover:bg-white"
              >
                EXPLORE ALGORITHMS <ArrowRight size={14} />
              </Link>
              <Link
                href="/algorithms/backtracking"
                className="flex items-center gap-2 border border-[#2a2f36] px-6 py-3 font-mono text-[12px] tracking-[0.1em] text-white hover:border-[#2f5bff]"
              >
                SEE HOW IT WORKS
              </Link>
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-[0.18em] text-[#555b64]">
              CODE → STATE → VISUAL → UNDERSTANDING
            </p>
          </div>
          <div className="md:col-span-6">
            <HeroDemo />
            <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.15em] text-[#555b64]">
              <span>FIG.01 — EXECUTION POINTER</span>
              <span>← → SPACE TO CONTROL</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-b border-[#22262c]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <p className="t-label">The problem</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            READING CODE IS NOT THE SAME AS UNDERSTANDING IT.
          </h2>
          <div className="mt-10 grid gap-px border border-[#22262c] bg-[#22262c] md:grid-cols-3">
            {[
              ["STATIC", "Blog posts show final answers. The 31 steps in between stay invisible."],
              ["PASSIVE", "Copy-pasting code teaches syntax. It never teaches state."],
              ["FRAGILE", "Memorized solutions collapse the moment inputs change."],
            ].map(([t, d]) => (
              <div key={t} className="bg-[#0a0b0d] p-6">
                <div className="font-mono text-[11px] tracking-[0.2em] text-[#2f5bff]">{t}</div>
                <p className="mt-3 text-sm leading-6 text-[#8a8f98]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEA */}
      <section className="border-b border-[#22262c] bg-[#0f1114]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <p className="t-label">The idea</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            CODE SHOULD BE SOMETHING YOU CAN <span className="text-[#2f5bff]">SEE.</span>
          </h2>
          <div className="mt-10 flex flex-col items-stretch gap-2 font-mono text-[12px] tracking-[0.15em] md:flex-row md:items-center">
            {["CODE", "STATE", "VISUAL", "UNDERSTANDING"].map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className="flex-1 border border-[#2a2f36] bg-[#0a0b0d] px-4 py-4 text-center text-white">
                  {s}
                </div>
                {i < 3 && <span className="text-[#2f5bff]">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="border-b border-[#22262c]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="t-label">Explore</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">ALGORITHM LIBRARY</h2>
            </div>
            <Link href="/algorithms" className="hidden font-mono text-[11px] tracking-[0.15em] text-[#8a8f98] hover:text-white md:flex md:items-center md:gap-1">
              VIEW ALL <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="mt-8 border-t border-[#22262c]">
            {algos.map((a) => (
              <Link
                key={a.id}
                href={`/algorithms/${a.id}`}
                className="group grid grid-cols-12 items-center gap-2 border-b border-[#22262c] py-5 hover:bg-[#2f5bff]/5"
              >
                <span className="col-span-1 font-mono text-[11px] text-[#555b64]">{a.num}</span>
                <span className="col-span-11 text-xl font-bold tracking-tight md:col-span-5 md:text-2xl">
                  {a.title}
                </span>
                <span className="col-span-4 font-mono text-[10px] tracking-[0.18em] text-[#8a8f98] md:col-span-2">
                  {a.category}
                </span>
                <span className="col-span-4 font-mono text-[11px] text-[#8a8f98] md:col-span-2">{a.time}</span>
                <span className="col-span-4 text-right font-mono text-[11px] text-[#2f5bff] opacity-0 group-hover:opacity-100 md:col-span-2">
                  OPEN →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-b border-[#22262c] bg-[#0f1114]">
        <div className="mx-auto grid max-w-[1400px] gap-px px-5 py-16 md:px-10 md:py-24">
          <p className="t-label">How it works</p>
          <div className="mt-8 grid gap-px border border-[#22262c] bg-[#22262c] md:grid-cols-3">
            {[
              ["01 / READ", "Inspect real code with line-level highlighting. Every line maps to a state."],
              ["02 / EXECUTE", "Step forward, step back, play, scrub the timeline. Time-travel the program."],
              ["03 / UNDERSTAND", "Variables, call stack and WHY-panel stay in sync with the visual."],
            ].map(([t, d]) => (
              <div key={t} className="bg-[#0a0b0d] p-8">
                <div className="font-mono text-[12px] tracking-[0.2em] text-white">{t}</div>
                <p className="mt-4 text-sm leading-6 text-[#8a8f98]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-20 text-center md:px-10 md:py-28">
          <h2 className="text-5xl font-bold leading-[0.95] tracking-tighter md:text-8xl">
            STOP MEMORIZING.
            <br />
            <span className="text-[#2f5bff]">START SEEING.</span>
          </h2>
          <Link
            href="/algorithms"
            className="mt-10 inline-flex items-center gap-2 bg-[#2f5bff] px-8 py-4 font-mono text-[12px] tracking-[0.12em] text-white hover:bg-[#2448cc]"
          >
            EXPLORE TUTES <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
