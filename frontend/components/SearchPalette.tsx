"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAlgorithms } from "@/lib/algorithms/registry";

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const algos = useMemo(() => getAlgorithms(), []);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return algos;
    return algos.filter((a) =>
      `${a.title} ${a.category} ${a.id}`.toLowerCase().includes(s),
    );
  }, [q, algos]);

  useEffect(() => {
    if (open) setQ("");
  }, [open ]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh]" onClick={onClose} role="dialog" aria-label="Search algorithms">
      <div className="w-full max-w-xl border border-[#22262c] bg-[#0f1114]" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-[#22262c] p-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="SEARCH TUTES — try 'binary search'…"
            className="w-full bg-transparent font-mono text-sm text-white placeholder:text-[#555b64] focus:outline-none"
            aria-label="Search algorithms"
          />
        </div>
        <div className="max-h-80 overflow-auto">
          {results.map((a) => (
            <Link
              key={a.id}
              href={`/algorithms/${a.id}`}
              onClick={onClose}
              className="flex items-center justify-between border-b border-[#1a1e23] px-4 py-3 hover:bg-[#2f5bff]/10"
            >
              <div>
                <div className="text-sm font-semibold tracking-wide">{a.title}</div>
                <div className="font-mono text-[10px] tracking-[0.15em] text-[#8a8f98]">
                  {a.category} · {a.time}
                </div>
              </div>
              <div className="font-mono text-[10px] text-[#555b64]">{a.num}</div>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="px-4 py-8 text-center font-mono text-xs text-[#555b64]">
              NO MATCH — TRY &quot;SORT&quot; OR &quot;GRAPH&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
