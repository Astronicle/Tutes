import Link from "next/link";
import { getAlgorithms } from "@/lib/algorithms/registry";

export const metadata = { title: "Algorithm library — TUTES" };

export default function AlgorithmsPage() {
  const algos = getAlgorithms();
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
      <p className="t-label">Index // {String(algos.length).padStart(2, "0")} systems</p>
      <h1 className="mt-3 text-5xl font-bold tracking-tighter md:text-7xl">ALGORITHM<br />LIBRARY</h1>
      <p className="mt-4 max-w-lg text-[15px] leading-7 text-[#8a8f98]">
        Explore algorithms by watching them execute. Every entry is a time-travel
        debugger, not a blog post.
      </p>
      <div className="mt-10 border-t border-[#22262c]">
        {algos.map((a) => (
          <Link
            key={a.id}
            href={`/algorithms/${a.id}`}
            className="group grid grid-cols-12 items-center gap-3 border-b border-[#22262c] py-6 hover:bg-[#2f5bff]/5"
          >
            <span className="col-span-2 font-mono text-[11px] text-[#555b64] md:col-span-1">{a.num}</span>
            <span className="col-span-10 md:col-span-4">
              <span className="block text-xl font-bold tracking-tight md:text-3xl">{a.title}</span>
              <span className="mt-1 block font-mono text-[10px] tracking-[0.15em] text-[#555b64]">
                {a.difficulty} · {a.states.length} STATES
              </span>
            </span>
            <span className="col-span-4 font-mono text-[10px] tracking-[0.18em] text-[#8a8f98] md:col-span-2">
              {a.category}
            </span>
            <span className="col-span-3 font-mono text-[12px] text-[#8a8f98] md:col-span-2">{a.time}</span>
            <span className="col-span-3 hidden font-mono text-[11px] text-[#8a8f98] md:col-span-2 md:block">
              {a.space}
            </span>
            <span className="col-span-5 text-right font-mono text-[11px] tracking-[0.1em] text-[#2f5bff] opacity-0 group-hover:opacity-100 md:col-span-1">
              OPEN →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
