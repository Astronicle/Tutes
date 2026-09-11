import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#22262c]">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="text-xl font-bold tracking-tight">TUTES</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#8a8f98]">
            An interactive laboratory for algorithms. Code → State → Visual. Don&apos;t just read. Execute.
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-[#555b64]">
            CODE → STATE → VISUAL → UNDERSTANDING
          </p>
        </div>
        <div className="md:col-span-3">
          <div className="t-label mb-4">Index</div>
          <div className="flex flex-col gap-2 text-sm text-[#8a8f98]">
            <Link href="/algorithms" className="hover:text-white">Algorithm library</Link>
            <Link href="/algorithms/backtracking" className="hover:text-white">Backtracking lab</Link>
            <Link href="/algorithms/binary-search" className="hover:text-white">Binary search lab</Link>
            <Link href="/#how" className="hover:text-white">How it works</Link>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="t-label mb-4">System</div>
          <div className="border border-[#22262c] bg-[#0f1114] p-4 font-mono text-[11px] leading-5 text-[#8a8f98]">
            <div>EXECUTION ENGINE // READY</div>
            <div>RENDERER // REACT + SVG</div>
            <div>STATE // IMMUTABLE SNAPSHOTS</div>
            <div className="text-[#22c55e]">● ALL SYSTEMS NOMINAL</div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1a1e23]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 font-mono text-[10px] tracking-[0.15em] text-[#555b64] md:px-10">
          <span>TUTES © 2026 — LEARN HOW IT RUNS</span>
          <span>SWISS × DIGITAL × PLAY</span>
        </div>
      </div>
    </footer>
  );
}
