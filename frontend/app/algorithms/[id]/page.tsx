import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlgorithm, getAlgorithms } from "@/lib/algorithms/registry";
import Playground from "@/components/algorithm/Playground";

export function generateStaticParams() {
  return getAlgorithms().map((a) => ({ id: a.id }));
}

export default async function AlgorithmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const algo = getAlgorithm(id);
  if (!algo) notFound();

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-10">
      <nav className="font-mono text-[10px] tracking-[0.18em] text-[#555b64]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white">HOME</Link> /{" "}
        <Link href="/algorithms" className="hover:text-white">ALGORITHMS</Link> /{" "}
        <span className="text-white">{algo.title}</span>
      </nav>

      <header className="mt-6 border-b border-[#22262c] pb-8">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">{algo.title}</h1>
        <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[#2f5bff]">{algo.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] tracking-[0.12em] text-[#8a8f98]">
          <span>CATEGORY // <b className="text-white">{algo.category}</b></span>
          <span>TIME // <b className="text-white">{algo.time}</b></span>
          <span>SPACE // <b className="text-white">{algo.space}</b></span>
          <span>STATES // <b className="text-white">{algo.states.length}</b></span>
        </div>
      </header>

      <section className="grid gap-10 border-b border-[#22262c] py-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="t-label">The idea</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{algo.idea}</h2>
        </div>
        <ol className="md:col-span-5">
          {algo.steps.map((s, i) => (
            <li key={i} className="flex gap-4 border-t border-[#22262c] py-3 last:border-b">
              <span className="font-mono text-[11px] text-[#2f5bff]">0{i + 1}</span>
              <span className="text-sm text-[#edebe6]">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="t-label">Interactive playground // time-travel enabled</p>
          <p className="hidden font-mono text-[10px] text-[#555b64] md:block">← → STEP · SPACE PLAY · R RESET</p>
        </div>
        <Playground algo={algo} />
      </section>
    </main>
  );
}
